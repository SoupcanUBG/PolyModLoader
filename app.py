from flask import Flask, send_file

app = Flask(__name__)

@app.route("/")
def home():
    return send_file('index.html')

@app.route("/<filename>")
def fileget(filename):
    return send_file(f"./{filename}")

@app.route("/lib/<filename>")
def libfileget(filename):
    return send_file(f"./lib/{filename}")

@app.route("/models/<filename>")
def fmodelileget(filename):
    return send_file(f"./models/{filename}")

@app.route("/audio/<filename>")
def filegetaudio(filename):
    return send_file(f"./audio/{filename}")

@app.route("/images/<filename>")
def filimageeget(filename):
    return send_file(f"./images/{filename}")

@app.route("/tracks/<filename>")
def filetrackget(filename):
    return send_file(f"./tracks/{filename}")