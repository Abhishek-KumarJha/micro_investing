import torch
import torch.nn as nn
import numpy as np

class RiskClassifier(nn.Module):
    def __init__(self, input_dim):
        super(RiskClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, 16)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(16, 3) # 3 categories: Conservative, Moderate, Aggressive
        
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

def predict_risk_profile(user_features: dict) -> str:
    """
    Predict risk profile based on user features.
    """
    # Dummy feature extraction
    # In a real scenario, convert user_features to tensor
    features = np.random.rand(1, 5).astype(np.float32) # Assume 5 input features
    tensor_features = torch.tensor(features)
    
    model = RiskClassifier(input_dim=5)
    # model.load_state_dict(torch.load("path_to_model.pth")) # Load trained weights
    model.eval()
    
    with torch.no_grad():
        output = model(tensor_features)
        prediction = torch.argmax(output, dim=1).item()
        
    categories = {0: "Conservative", 1: "Moderate", 2: "Aggressive"}
    return categories.get(prediction, "Moderate")
