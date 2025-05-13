document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const canvasManager = new CanvasManager(canvas);

    // Tool selection
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            canvasManager.setTool(button.id);
        });
    });

    // Color picker
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('change', (e) => {
        canvasManager.setColor(e.target.value);
    });

    // Brush size
    const brushSize = document.getElementById('brushSize');
    brushSize.addEventListener('input', (e) => {
        canvasManager.setBrushSize(e.target.value);
    });

    // Font size
    const fontSize = document.getElementById('fontSize');
    fontSize.addEventListener('change', (e) => {
        canvasManager.setFontSize(e.target.value);
    });

    // Undo button
    const undoButton = document.getElementById('undo');
    undoButton.addEventListener('click', () => {
        canvasManager.undo();
    });

    // Download button
    const downloadButton = document.getElementById('download');
    downloadButton.addEventListener('click', () => {
        canvasManager.download();
    });

    // Set default tool
    canvasManager.setTool('brush');

    // File input handling
    const imageInput = document.getElementById('imageInput');
    const loadImageButton = document.getElementById('loadImage');

    loadImageButton.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Calculate dimensions to maintain aspect ratio
                    const maxWidth = canvas.width;
                    const maxHeight = canvas.height;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth * height) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (maxHeight * width) / height;
                        height = maxHeight;
                    }

                    // Clear canvas and draw image
                    canvasManager.ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvasManager.ctx.drawImage(img, 0, 0, width, height);
                    canvasManager.saveState();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}); 