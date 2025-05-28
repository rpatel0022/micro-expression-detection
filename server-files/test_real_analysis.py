#!/usr/bin/env python3
"""
Test script for real CS179G unified analysis
Upload this to your server and run it to test your real models
"""

import sys
import os

# Add CS179G project path
project_path = '/home/cs179g'
sys.path.insert(0, project_path)

from unified_analysis_real import RealCS179GAnalyzer, test_real_models, analyze_image_real

def test_with_sample_image():
    """Test analysis with a sample image"""
    print("\n🧪 Testing Real CS179G Analysis...")
    
    # Initialize analyzer
    analyzer = RealCS179GAnalyzer()
    
    # Look for any image files in the project directory
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
    sample_images = []
    
    for file in os.listdir(project_path):
        if any(file.lower().endswith(ext) for ext in image_extensions):
            sample_images.append(os.path.join(project_path, file))
    
    if not sample_images:
        print("❌ No sample images found in project directory")
        print("   Please add a test image to /home/cs179g/ and try again")
        return
    
    # Test with first available image
    test_image = sample_images[0]
    print(f"📸 Testing with image: {test_image}")
    
    try:
        # Test with a few methods
        test_methods = ['dlib_rf', 'hog_dt', 'resnet_lr']
        results = analyzer.analyze_single_image_real(test_image, test_methods)
        
        print(f"\n✅ Analysis completed! {len(results)} results:")
        for result in results:
            print(f"   🔍 {result['model_combination']}: {result['prediction']} ({result['confidence']:.2%})")
            print(f"      ⏱️  Processing time: {result['processing_time']:.2f}s")
            print(f"      📊 Features extracted: {result['features_extracted']}")
        
        # Test database retrieval
        print(f"\n📊 Database Statistics:")
        stats = analyzer.get_statistics()
        print(f"   Total analyses: {stats['total_analyses']}")
        
        if len(stats['accuracy_by_model']) > 0:
            print("   Model performance:")
            for _, row in stats['accuracy_by_model'].iterrows():
                print(f"     - {row['model_combination']}: {row['avg_confidence']:.2%} avg confidence")
        
        return True
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_individual_components():
    """Test individual components"""
    print("\n🔧 Testing Individual Components...")
    
    analyzer = RealCS179GAnalyzer()
    
    # Create a simple test image if none exists
    test_image_path = os.path.join(project_path, 'test_image.jpg')
    if not os.path.exists(test_image_path):
        try:
            import cv2
            import numpy as np
            # Create a simple test image
            test_img = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
            cv2.imwrite(test_image_path, test_img)
            print(f"📸 Created test image: {test_image_path}")
        except Exception as e:
            print(f"❌ Could not create test image: {e}")
            return False
    
    # Test feature extraction methods
    print("\n🔍 Testing Feature Extraction:")
    
    # Test HOG
    try:
        hog_features = analyzer.extract_real_hog_features(test_image_path)
        if hog_features is not None:
            print(f"   ✅ HOG: {len(hog_features)} features extracted")
        else:
            print("   ❌ HOG: Failed to extract features")
    except Exception as e:
        print(f"   ❌ HOG: Error - {e}")
    
    # Test dlib
    try:
        dlib_features = analyzer.extract_real_dlib_features(test_image_path)
        if dlib_features is not None:
            print(f"   ✅ dlib: {len(dlib_features)} features extracted")
        else:
            print("   ❌ dlib: Failed to extract features")
    except Exception as e:
        print(f"   ❌ dlib: Error - {e}")
    
    # Test ResNet
    try:
        resnet_features = analyzer.extract_real_resnet_features(test_image_path)
        if resnet_features is not None:
            print(f"   ✅ ResNet: {len(resnet_features)} features extracted")
        else:
            print("   ❌ ResNet: Failed to extract features")
    except Exception as e:
        print(f"   ❌ ResNet: Error - {e}")
    
    return True

def main():
    """Main test function"""
    print("🚀 CS179G Real Analysis Testing")
    print("=" * 50)
    
    # Test 1: Model loading
    print("\n1️⃣ Testing Model Loading:")
    test_real_models()
    
    # Test 2: Individual components
    print("\n2️⃣ Testing Components:")
    test_individual_components()
    
    # Test 3: Full analysis
    print("\n3️⃣ Testing Full Analysis:")
    success = test_with_sample_image()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests completed! Your real CS179G models are working!")
        print("📋 Next steps:")
        print("   1. Update your web interface to use the real server")
        print("   2. Test image upload from the web interface")
        print("   3. Verify database integration")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
        print("💡 Common issues:")
        print("   - Missing dependencies (dlib, torch, opencv)")
        print("   - Model files not found")
        print("   - Import errors with CS179G modules")

if __name__ == "__main__":
    main()
