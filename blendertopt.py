bl_info = {
    "name": "PolyTrack Blender Coordinate Converter",
    "author": "Orangy",
    "version": (1, 3),
    "blender": (2, 80, 0),
    "description": "Convert between Blender and PolyTrack coordinates and auto-generate highlight cubes",
    "category": "Object",
}

import bpy
import json
import bmesh
import mathutils
from collections import deque
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from math import floor

# Conversion functions
def polytrack_to_blender(px, py, pz):
    bx = 5 * px + 2.5
    by = -5 * pz - 2.5
    bz =  5 * py + 2.5
    return (bx, by, bz)

def blender_to_polytrack(bx, by, bz):
    px = (bx - 2.5) / 5
    pz = -(by + 2.5) / 5
    py = (bz - 2.5) / 5
    return (px, py, pz)

def order_pair(a, b):
    return [
        [round(min(a[0], b[0]), 3), round(min(a[1], b[1]), 3), round(min(a[2], b[2]), 3)],
        [round(max(a[0], b[0]), 3), round(max(a[1], b[1]), 3), round(max(a[2], b[2]), 3)]
    ]

# Export selected pairs
class OBJECT_OT_export_polytrack_pairs(bpy.types.Operator):
    bl_idname = "object.export_polytrack_pairs"
    bl_label = "Export PolyTrack Coordinate Pairs"

    def execute(self, context):
        selected = context.selected_objects
        if len(selected) % 2 != 0:
            self.report({'ERROR'}, "Select an even number of objects (pairs).")
            return {'CANCELLED'}

        pairs = []
        for i in range(0, len(selected), 2):
            obj_a = selected[i]
            obj_b = selected[i + 1]
            coord_a = blender_to_polytrack(*obj_a.location)
            coord_b = blender_to_polytrack(*obj_b.location)
            pairs.append([list(coord_a), list(coord_b)])

        data = []
        for obj1, obj2 in pairs:
            p1 = blender_to_polytrack(*obj1)
            p2 = blender_to_polytrack(*obj2)
            ordered = order_pair(p1, p2)
            data.append(ordered)

        print("Converted pairs:")
        print(data)

        self.report({'INFO'}, f"Exported {len(pairs)} pairs to console")
        return {'FINISHED'}

# Import from user input
class OBJECT_OT_import_polytrack_input(bpy.types.Operator):
    bl_idname = "object.import_polytrack_from_input"
    bl_label = "Import PolyTrack Pairs from Input"

    user_input: bpy.props.StringProperty(
        name="PolyTrack Coordinate Pairs",
        description="Enter a list like [[[px,py,pz],[px,py,pz]],...]",
        default='[[[-2,0,0],[1,0,1]], [[-2,1,-2],[1,1,0]]]'
    )

    def execute(self, context):
        try:
            pairs = json.loads(self.user_input)
        except Exception as e:
            self.report({'ERROR'}, f"Invalid JSON: {e}")
            return {'CANCELLED'}

        for i, pair in enumerate(pairs):
            for j, pt_coords in enumerate(pair):
                bx, by, bz = polytrack_to_blender(*pt_coords)
                bpy.ops.mesh.primitive_cube_add(location=(bx, by, bz), scale=(2.5, 2.5, 2.5))
                cube = bpy.context.active_object
                cube.name = f"ImportedCube_{i}_{j}"

        self.report({'INFO'}, f"Imported {len(pairs)} pairs from input")
        return {'FINISHED'}

    def invoke(self, context, event):
        return context.window_manager.invoke_props_dialog(self)

GRID_SIZE = 2.5
GRID_SPACING = 5.0

def get_bounding_box(obj):
    mat = obj.matrix_world
    corners = [mat @ Vector(corner) for corner in obj.bound_box]
    min_corner = Vector((min(v[i] for v in corners) for i in range(3)))
    max_corner = Vector((max(v[i] for v in corners) for i in range(3)))
    return min_corner, max_corner

def cube_intersects_object(center, size, obj_bvh):
    if not isinstance(center, Vector):
        center = Vector(center)
    
    half_size = size / 2.0
    
    # Define the 8 corners of the cube
    corners = [
        center + Vector(( half_size,  half_size,  half_size)),
        center + Vector(( half_size,  half_size, -half_size)),
        center + Vector(( half_size, -half_size,  half_size)),
        center + Vector(( half_size, -half_size, -half_size)),
        center + Vector((-half_size,  half_size,  half_size)),
        center + Vector((-half_size,  half_size, -half_size)),
        center + Vector((-half_size, -half_size,  half_size)),
        center + Vector((-half_size, -half_size, -half_size))
    ]
    
    # Check if any of the cube's corners are inside the object
    for corner in corners:
        # Raycast from the corner in an arbitrary direction to check if it's inside
        # (odd number of hits means the point is inside the mesh)
        direction = Vector((1.0, 0.0, 0.0))  # Arbitrary direction
        location, normal, index, distance = obj_bvh.ray_cast(corner, direction)
        if location is not None:
            # Ray hit something; now cast in the opposite direction
            opposite_location, _, _, _ = obj_bvh.ray_cast(corner, -direction)
            if opposite_location is not None:
                # If both rays hit, the point is inside the mesh
                return True
    
    # Check if any of the cube's edges intersect the object
    edges = [
        (0, 1), (0, 2), (0, 4),
        (1, 3), (1, 5),
        (2, 3), (2, 6),
        (3, 7),
        (4, 5), (4, 6),
        (5, 7),
        (6, 7)
    ]
    
    for i, j in edges:
        start = corners[i]
        end = corners[j]
        location, normal, index, distance = obj_bvh.ray_cast(start, (end - start).normalized(), size)
        if location is not None and (location - start).length < size:
            return True
    
    # Check if any of the cube's faces intersect the object
    # (Approximate by checking the face centers and some points on the faces)
    face_centers = [
        center + Vector(( half_size,  0.0,  0.0)),  # +X face
        center + Vector((-half_size,  0.0,  0.0)),  # -X face
        center + Vector(( 0.0,  half_size,  0.0)),  # +Y face
        center + Vector(( 0.0, -half_size,  0.0)),  # -Y face
        center + Vector(( 0.0,  0.0,  half_size)),  # +Z face
        center + Vector(( 0.0,  0.0, -half_size))   # -Z face
    ]
    
    face_normals = [
        Vector(( 1.0,  0.0,  0.0)),  # +X face
        Vector((-1.0,  0.0,  0.0)),  # -X face
        Vector(( 0.0,  1.0,  0.0)),  # +Y face
        Vector(( 0.0, -1.0,  0.0)),  # -Y face
        Vector(( 0.0,  0.0,  1.0)),  # +Z face
        Vector(( 0.0,  0.0, -1.0))   # -Z face
    ]
    
    for center_pt, normal in zip(face_centers, face_normals):
        # Cast a ray from the face center outward to check for intersections
        location, _, _, _ = obj_bvh.ray_cast(center_pt, normal, size)
        if location is not None:
            return True
    
    return False

def bvh_for_cube(center, size):
    # Construct a temporary cube mesh BVH (can be cached)
    bpy.ops.mesh.primitive_cube_add(size=size, location=center)
    cube = bpy.context.active_object
    cube_bvh = mathutils.bvhtree.BVHTree.FromObject(cube, bpy.context.evaluated_depsgraph_get())
    bpy.data.objects.remove(cube, do_unlink=True)
    return cube_bvh

def flood_fill_voxels(start_coord, grid_size, obj_bvh, max_depth=2000):
    visited = set()
    queue = deque([start_coord])
    result = set()

    while queue and len(result) < max_depth:
        coord = queue.popleft()
        if coord in visited:
            continue
        visited.add(coord)

        center = Vector([c * grid_size for c in coord])
        if cube_intersects_object(center, grid_size, obj_bvh):
            result.add(coord)
            for d in [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]:
                neighbor = tuple(coord[i] + d[i] for i in range(3))
                if neighbor not in visited:
                    queue.append(neighbor)

    return result

def voxelize_by_floodfill(obj):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    obj_eval = obj.evaluated_get(depsgraph)
    obj_bvh = mathutils.bvhtree.BVHTree.FromObject(obj_eval, depsgraph)

    start_point = Vector((0, 0, 0))
    # Find first intersecting cube around origin or use bounding box center
    bbox_center = 0.125 * sum((Vector(b) for b in obj.bound_box), Vector())
    start_coord = tuple(floor(v / GRID_SIZE) for v in bbox_center)

    return flood_fill_voxels(start_coord, GRID_SIZE, obj_bvh)

def place_cube(grid_pos):
    center = Vector((grid_pos[0] * GRID_SPACING, grid_pos[1] * GRID_SPACING, grid_pos[2] * GRID_SPACING))
    bpy.ops.mesh.primitive_cube_add(scale=(GRID_SIZE,GRID_SIZE,GRID_SIZE), location=center)

class OBJECT_OT_generate_highlight_cubes(bpy.types.Operator):
    bl_idname = "object.generate_highlight_cubes"
    bl_label = "Generate Highlight Cubes"

    def execute(self, context):
        obj = context.active_object
        if not obj or obj.type != 'MESH':
            self.report({'ERROR'}, "Please select a mesh object")
            return {'CANCELLED'}

        raw_voxels = voxelize_by_floodfill(obj)

        for voxel in raw_voxels:
            place_cube(voxel)

        self.report({'INFO'}, f"Placed {len(raw_voxels)} cubes")
        return {'FINISHED'}

# Menus
def menu_func_export(self, context):
    self.layout.operator(OBJECT_OT_export_polytrack_pairs.bl_idname)

def menu_func_import_input(self, context):
    self.layout.operator(OBJECT_OT_import_polytrack_input.bl_idname)

def menu_func_generate_highlight(self, context):
    self.layout.operator(OBJECT_OT_generate_highlight_cubes.bl_idname)

# Register
def register():
    bpy.utils.register_class(OBJECT_OT_export_polytrack_pairs)
    bpy.utils.register_class(OBJECT_OT_import_polytrack_input)
    bpy.utils.register_class(OBJECT_OT_generate_highlight_cubes)
    bpy.types.VIEW3D_MT_object.append(menu_func_export)
    bpy.types.VIEW3D_MT_object.append(menu_func_import_input)
    bpy.types.VIEW3D_MT_object.append(menu_func_generate_highlight)

def unregister():
    bpy.utils.unregister_class(OBJECT_OT_export_polytrack_pairs)
    bpy.utils.unregister_class(OBJECT_OT_import_polytrack_input)
    bpy.utils.unregister_class(OBJECT_OT_generate_highlight_cubes)
    bpy.types.VIEW3D_MT_object.remove(menu_func_export)
    bpy.types.VIEW3D_MT_object.remove(menu_func_import_input)
    bpy.types.VIEW3D_MT_object.remove(menu_func_generate_highlight)

if __name__ == "__main__":
    register()