# Demo Images Setup Instructions

## To add your demo images to the web interface:

1. **Save your Truth image as:**

   ```
   /public/images/truth_demo.png
   ```

2. **Save your Lie image as:**
   ```
   /public/images/lie_demo.png
   ```

## Steps:

1. Right-click on each image you provided
2. Save them to the `public/images/` folder in your project
3. Name them exactly as shown above
4. The web interface will automatically display them

## Current Status:

- ✅ Demo image display code is ready
- ✅ Toggle buttons work (Truth/Lie)
- ✅ Fallback placeholder if images don't load
- ⏳ Need to add actual image files

## File Structure:

```
micro-expression-detection/
├── public/
│   └── images/
│       ├── truth_demo.png  ← Add your Truth image here
│       └── lie_demo.png    ← Add your Lie image here
└── src/
    └── components/
        └── sections/
            └── AboutDataset.js  ← Updated to use your images
```
