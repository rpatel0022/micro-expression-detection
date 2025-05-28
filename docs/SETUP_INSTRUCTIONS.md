# 🚀 CS179G Live Prediction Setup Instructions

## 📋 **Step 1: Create Your Private Server Configuration**

1. **Copy the template:**
   ```bash
   cp server-config.template.json server-config.json
   ```

2. **Edit `server-config.json` with your actual server IP:**
   ```json
   {
     "host": "YOUR_ACTUAL_SERVER_IP_HERE",
     "port": 22,
     "username": "cs179g",
     "pythonPath": "/usr/bin/python3",
     "projectPath": "/home/cs179g",
     "apiPort": 5000,
     "apiEndpoint": "/predict",
     "modelFile": "balanced_model.pth",
     "landmarksFile": "shape_predictor_68_face_landmarks.dat",
     "connectionMethod": "ssh"
   }
   ```

3. **Replace `YOUR_ACTUAL_SERVER_IP_HERE`** with the IP address you got from `hostname -I`

## 🔒 **Security Notes:**
- ✅ `server-config.json` is already in `.gitignore` - it won't be committed to git
- ✅ Keep your IP address private
- ✅ This file stays on your local machine only

## 🧪 **Step 2: Test the Setup**

### **Start the Prediction Server:**
```bash
# Make sure you're in the micro-expression-detection directory
cd micro-expression-detection

# Start the server
node prediction-server.js
```

### **Test in Browser:**
1. Open: `file:///Users/rushipatel/Desktop/CS179G_WebInterface/micro-expression-detection/index.html`
2. Navigate to "Live Prediction" section
3. Click "🔗 Test Connection" button
4. Should show: ✅ "Successfully connected" or configuration status

## 🔧 **Step 3: Configure Server Access**

You'll need to set up SSH access to your server. Choose one option:

### **Option A: SSH Key Authentication (Recommended)**
```bash
# Generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096

# Copy your public key to the server
ssh-copy-id cs179g@YOUR_SERVER_IP
```

### **Option B: Password Authentication**
- You'll be prompted for password when making predictions
- Less secure but simpler for testing

### **Option C: University Network/VPN**
- If you're on the same network as the server
- May work without additional setup

## 🎯 **Step 4: Test Live Prediction**

1. **Upload a test image** in the Live Prediction interface
2. **Click "🔍 Predict"**
3. **Expected result:**
   - ✅ Prediction: Truth/Lie
   - ✅ Confidence score
   - ✅ Processing details

## 📊 **What Your Server Has:**

Based on your server listing, you have:
- ✅ **Model**: `balanced_model.pth` (PyTorch format)
- ✅ **Encoding**: `encoding.py` 
- ✅ **Classifiers**: `classifiers.py`
- ✅ **Face Detection**: `shape_predictor_68_face_landmarks.dat`
- ✅ **Image Processing**: `image_preprocess.py`
- ✅ **All Python files** needed for prediction

## 🐛 **Troubleshooting:**

### **Connection Issues:**
```bash
# Test basic connectivity
ping YOUR_SERVER_IP

# Test SSH access
ssh cs179g@YOUR_SERVER_IP
```

### **Python Issues on Server:**
```bash
# On your server, test if modules work:
python3 -c "from encoding import extract_features; print('✅ encoding.py works')"
python3 -c "import torch; print('✅ PyTorch available')"
```

### **Model Loading Issues:**
```bash
# On your server, test model loading:
python3 -c "import torch; model = torch.load('balanced_model.pth', map_location='cpu'); print('✅ Model loads')"
```

## 🔄 **Quick Start Commands:**

```bash
# 1. Create config file
cp server-config.template.json server-config.json
# Edit server-config.json with your IP

# 2. Start prediction server
node prediction-server.js

# 3. Open browser
open index.html

# 4. Test connection in Live Prediction section
```

## 📞 **Need Help?**

If you encounter issues:

1. **Check server logs** in the terminal running `node prediction-server.js`
2. **Check browser console** for JavaScript errors
3. **Test SSH connection** manually: `ssh cs179g@YOUR_SERVER_IP`
4. **Verify Python modules** work on your server

## 🎉 **Success Indicators:**

- ✅ Prediction server starts without errors
- ✅ "Test Connection" shows success
- ✅ Image upload works
- ✅ Predictions return with confidence scores
- ✅ Results show in the interface

---

**You're all set! Your CS179G live prediction system is ready to demo!** 🚀
