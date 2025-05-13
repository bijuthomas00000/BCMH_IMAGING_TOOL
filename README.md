# Image Annotation Tool

A web-based image annotation tool similar to MS Paint, built with HTML5 Canvas and JavaScript. This tool allows users to load images, draw on them using various tools, add text, and export the annotated images.

## Features

- Image Loading
  - Select an image using load image
  - Images are displayed in a responsive canvas
- Drawing Tools
  - Freehand Brush
  - Rectangle
  - Circle
  - Straight Line
  - Text Box
- Tool Options
  - Color picker for all tools
  - Adjustable brush size
  - Configurable text size
- Undo Feature
  - Revert the last action
- Export Options
  - Download as PNG
  - Get base64 representation

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Load image from the load image
4. Use the tools to annotate the image
5. Download the result using the download button

## Browser Support

The tool works best in modern browsers that support HTML5 Canvas:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Integration

To integrate this tool into your web application:

1. Include the required files:
   ```html
   <link rel="stylesheet" href="styles.css">
   <script src="js/utils.js"></script>
   <script src="js/tools.js"></script>
   <script src="js/canvas.js"></script>
   <script src="js/app.js"></script>
   ```

2. Add the required HTML structure:
   ```html
   <div class="container">
       <div class="toolbar">
           <!-- Tool buttons and options -->
       </div>
       <div class="canvas-container">
           <canvas id="canvas"></canvas>
       </div>
   </div>
   ```

3. Initialize the tool:
   ```javascript
   const canvas = document.getElementById('canvas');
   const canvasManager = new CanvasManager(canvas);
   ```

## Customization

- Adjust the canvas size by modifying the CSS in `styles.css`
- Add new tools by extending the `DrawingTool` class in `tools.js`

## License

MIT License - feel free to use this tool in your projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 