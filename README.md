# PDF Rectangle Annotator

A web application that allows users to interact with PDF documents by drawing rectangular annotations and extracting precise coordinate information.

## Features

### Core Functionality
- **PDF File Upload**: Select and load PDF files from your device
- **Multi-Page Navigation**: Navigate through PDF pages with previous/next controls
- **Rectangle Drawing**: Click and drag to draw rectangular annotations on any page
- **Rectangle Manipulation**: 
  - Drag existing rectangles to move them around
  - Resize rectangles using the resize handle in the bottom-right corner
- **Coordinate Logging**: Tap rectangles to log detailed coordinate information
- **Cross-Platform**: Works on both desktop and mobile devices with touch support

### Coordinate Information
When you tap on a rectangle, the application logs:
- **Page Number**: Which page the rectangle is on
- **Page Dimensions**: Width and height in points
- **Rectangle Coordinates**: X, Y position and width, height in points
- **Rectangle Bounds**: Left, right, top, bottom coordinates in points
- **Position Ratios**: Decimal values (0-1) showing relative position on the page

### Example Output
```
Page Number: 1
Page Size: Width=612.0, Height=792.0 (points)
Rectangle Coordinates: X=100.0, Y=250.0, Width=50.0, Height=75.0 (points)
Rectangle Bounds: Left=100.0, Right=150.0, Top=250.0, Bottom=325.0 (points)
Position Ratios: Left=0.163, Right=0.245, Top=0.316, Bottom=0.410 of page
```

## Technical Implementation

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PDF Rendering**: PDF.js library (v3.11.174)
- **No Backend Required**: Runs entirely in the browser
- **No Dependencies**: Self-contained application

### Key Components
- **PDFAnnotator Class**: Main application controller
- **Rectangle Management**: Persistent storage of rectangles per page
- **Coordinate System**: Precise point-based measurements
- **Event Handling**: Mouse and touch event support
- **State Management**: Drawing, dragging, and resizing states

### File Structure
```
├── index.html          # Main HTML file with UI structure
├── app.js              # JavaScript application logic
├── README.md           # This documentation
└── test.html           # Testing utility (optional)
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for file serving)

### Installation

#### Local Development
1. Clone or download the project files
2. Place all files in a directory
3. Start a local web server:
   ```bash
   python3 -m http.server 1234
   ```
4. Open your browser and navigate to `http://localhost:1234`

#### GitHub Pages Deployment
This project is automatically deployed to GitHub Pages when changes are pushed to the master branch.

**Live Demo**: [https://tejuamirthi.github.io/pdf-box-annotator/](https://tejuamirthi.github.io/pdf-box-annotator/)

To deploy your own version:
1. Fork this repository
2. Go to your repository Settings → Pages
3. Select "GitHub Actions" as the source
4. The site will automatically deploy when you push changes

### Usage

1. **Upload PDF**: Click "Choose File" and select a PDF document
2. **Navigate Pages**: Use Previous/Next buttons to move between pages
3. **Draw Rectangles**: 
   - Click and drag on the PDF to create rectangles
   - Rectangles are created from start point to end point on mouse release
4. **Move Rectangles**: Click and drag existing rectangles to reposition them
5. **Resize Rectangles**: Drag the blue resize handle in the bottom-right corner
6. **Log Coordinates**: Click on any rectangle to log its coordinate information
7. **Clear Functions**: Use "Clear All Rectangles" or "Clear Logs" as needed

### Controls
- **Previous Page**: Navigate to the previous PDF page
- **Next Page**: Navigate to the next PDF page
- **Clear All Rectangles**: Remove all rectangles from all pages
- **Clear Logs**: Clear the coordinate log output

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers with touch support

## Features in Detail

### Rectangle Drawing
- **Preview Mode**: See rectangle outline while drawing
- **Minimum Size**: Rectangles smaller than 5x5 pixels are automatically removed
- **Persistent Storage**: Rectangles are saved per page and restored when navigating

### Coordinate System
- **Units**: All coordinates are in points (1/72 inch)
- **Origin**: Top-left corner of each page (0,0)
- **Precision**: Coordinates are precise to 0.1 points
- **Ratios**: Position ratios are calculated to 3 decimal places

### Touch Support
- **Mobile Friendly**: Full touch event support for mobile devices
- **Responsive Design**: Adapts to different screen sizes
- **Touch Drawing**: Draw rectangles with finger gestures

## Error Handling

The application includes comprehensive error handling for:
- Invalid PDF files
- File loading failures
- Browser compatibility issues
- Touch event conflicts

## Performance

- **Efficient Rendering**: Uses PDF.js for optimized PDF rendering
- **Memory Management**: Cleans up DOM elements when switching pages
- **Smooth Interactions**: Optimized event handling for responsive UI
- **Scalable**: Handles large PDF files and multiple rectangles

## Development

### Local Development
1. Make changes to `index.html` or `app.js`
2. Refresh the browser to see updates
3. Use browser developer tools for debugging

### Testing
A test utility is provided in `test.html` for isolated rectangle drawing testing.

## Troubleshooting

### Common Issues
- **PDF not loading**: Ensure the file is a valid PDF and your browser supports PDF.js
- **Rectangles not appearing**: Check that you're clicking and dragging (not just clicking)
- **Coordinate logging not working**: Make sure you're clicking on existing rectangles
- **Touch not working**: Ensure you're using a modern mobile browser

### Browser Console
Check the browser console for any JavaScript errors or warnings.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **PDF.js**: Mozilla's PDF rendering library
- **Claude Code**: Development assistance
- **Contributors**: All developers who helped improve this project

## Version History

- **v1.0**: Initial release with basic rectangle drawing and coordinate logging
- **v1.1**: Added drag and resize functionality
- **v1.2**: Enhanced coordinate display with position ratios
- **v1.3**: Fixed rectangle creation behavior and improved touch support

---

For questions or support, please open an issue in the project repository.