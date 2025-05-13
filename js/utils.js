const Utils = {
    // Convert degrees to radians
    toRadians: (degrees) => degrees * (Math.PI / 180),

    // Calculate distance between two points
    distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),

    // Get mouse position relative to canvas
    getMousePos: (canvas, evt) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    },

    // Convert canvas to base64
    canvasToBase64: (canvas) => canvas.toDataURL('image/png'),

    // Download canvas as image
    downloadCanvas: (canvas, filename = 'annotated-image.png') => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    },

    // Create a deep copy of an object
    deepCopy: (obj) => JSON.parse(JSON.stringify(obj)),

    // Generate a unique ID
    generateId: () => Math.random().toString(36).substr(2, 9)
}; 