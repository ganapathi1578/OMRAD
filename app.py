from flask import Flask, request, render_template
from PIL import Image
import random

app = Flask(__name__)

# Diagnosis dummy functions
def check_xray(img):
    return "X-Ray Quality: " + random.choice(["Good", "Blurry", "Needs Retake"])

def check_tuberculosis(img):
    return "Tuberculosis: " + random.choice(["Positive", "Negative"])

def check_pneumonia(img):
    return "Pneumonia: " + random.choice(["Suspected", "Not Detected"])

def check_covid(img):
    return "COVID-19: " + random.choice(["Likely", "Unlikely"])

def diagnosis(img):
    report = []
    report.append(check_xray(img))
    report.append(check_tuberculosis(img))
    report.append(check_pneumonia(img))
    report.append(check_covid(img))
    return report

@app.route("/", methods=["GET", "POST"])
def index():
    report = None
    if request.method == "POST":
        file = request.files.get("image")
        if file and file.filename != "":
            img = Image.open(file.stream)
            report = diagnosis(img)
    return render_template("index.html", report=report)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
