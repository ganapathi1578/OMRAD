import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
from monai.networks.nets import DenseNet121
import matplotlib.pyplot as plt

# ----------------------
# 1. Load Pretrained Model
# ----------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# DenseNet121 backbone (ImageNet pretrained)
model = DenseNet121(
    spatial_dims=2,
    in_channels=3,
    out_channels=2  # fracture / no fracture
).to(device)

# Load pretrained weights (replace path if you have specific weights)
# Example: model.load_state_dict(torch.load("bonenet.pth", map_location=device))
# For demo: random weights (not accurate!)
model.eval()

# ----------------------
# 2. Image Preprocessing
# ----------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def predict_fracture(img_path, output_path="prediction_output.png"):
    # Load image
    img = Image.open(img_path).convert("RGB")
    input_tensor = transform(img).unsqueeze(0).to(device)

    # Forward pass
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = nn.Softmax(dim=1)(outputs)
        pred_class = torch.argmax(probs, dim=1).item()
        confidence = probs[0, pred_class].item()

    # Labels
    labels = ["No Fracture", "Fracture Detected"]
    pred_label = f"{labels[pred_class]} ({confidence*100:.1f}%)"
    print(pred_label)

    # ----------------------
    # 3. Overlay Prediction on Image
    # ----------------------
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    draw.text((5, 5), pred_label, fill="white", font=font)

    # Save + Show
    img.save(output_path)
    plt.imshow(img)
    plt.axis("off")
    plt.show()

# ----------------------
# Run on Sample X-ray
# ----------------------
predict_fracture("image.png")
