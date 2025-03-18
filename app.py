from flask import Flask, send_file, redirect, send_from_directory
import os

app = Flask(__name__)


# @app.route("/")
# def home():
#     return send_file('index.html')
# 
# @app.route("/favicon.ico")
# def favoriteicon():
#     return redirect("https://beta-polytrack.kodub.com/favicon.ico")
# 
# @app.route("/<filename>")
# def fileget(filename):
#     return send_file(f"./{filename}")
# 
# @app.route("/lib/<filename>")
# def libfileget(filename):
#     return send_file(f"./lib/{filename}")
# 
# @app.route("/models/<filename>")
# def fmodelileget(filename):
#     return send_file(f"./models/{filename}")
# 
# @app.route("/audio/<filename>")
# def filegetaudio(filename):
#     return send_file(f"./audio/{filename}")
# 
# @app.route("/images/<filename>")
# def filimageeget(filename):
#     return send_file(f"./images/{filename}")
# 
# 
# @app.route('/tracks/official/<path:filename>')
# def download_file(filename):
#     return send_from_directory("/tracks/official/",
#                                filename)