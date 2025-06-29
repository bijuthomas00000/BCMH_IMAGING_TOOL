document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const canvasManager = new CanvasManager(canvas);

    // Create a separate canvas for edits
    const editCanvas = document.createElement('canvas');
    editCanvas.width = canvas.width;
    editCanvas.height = canvas.height;
    const editCtx = editCanvas.getContext('2d');

    // Tool selection
    const toolButtons = document.querySelectorAll('.tool-btn');
    function selectTool(toolId) {
        toolButtons.forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(toolId);
        if (btn) btn.classList.add('active');
        canvasManager.setTool(toolId);
        // Set cursor style
        if (toolId === 'text') {
            canvas.style.cursor = 'text';
        } else if (toolId === 'pointer') {
            canvas.style.cursor = 'default';
        } else {
            canvas.style.cursor = 'crosshair';
        }
    }
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectTool(button.id);
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

    // Download Base64 button
    const downloadBase64Button = document.getElementById('downloadBase64');
    downloadBase64Button.addEventListener('click', () => {
        // Get base64 string
        const base64 = canvas.toDataURL('image/png');
        
        // Create dialog container
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        dialog.style.zIndex = '1000';
        dialog.style.maxWidth = '80%';
        dialog.style.maxHeight = '80vh';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        dialog.style.gap = '10px';

        // Create textarea for base64
        const textarea = document.createElement('textarea');
        textarea.value = base64;
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.style.padding = '10px';
        textarea.style.border = '1px solid #ccc';
        textarea.style.borderRadius = '4px';
        textarea.style.resize = 'vertical';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '12px';
        textarea.readOnly = true;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.padding = '8px 16px';
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy to Clipboard';
            }, 2000);
        };

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '8px 16px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            document.body.removeChild(dialog);
        };

        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Base64 Image Data';
        title.style.margin = '0 0 10px 0';
        title.style.color = '#333';

        // Add elements to dialog
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(closeButton);
        dialog.appendChild(title);
        dialog.appendChild(textarea);
        dialog.appendChild(buttonContainer);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999';
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };

        // Add to document
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    });

    // Set default tool to pointer
    selectTool('pointer');

    // File input handling
    const imageInput = document.getElementById('imageInput');
    const loadImageButton = document.getElementById('loadImage');

    loadImageButton.addEventListener('click', () => {
        imageInput.click();
    });

    // --- Store original image for zooming ---
    canvasManager.originalImage = null;
    // Update image loading to store the original image
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
                    editCtx.clearRect(0, 0, editCanvas.width, editCanvas.height);
                    canvasManager.ctx.drawImage(img, 0, 0, width, height);
                    canvasManager.saveState();
                    // Store the original image and its size
                    canvasManager.originalImage = img;
                    canvasManager.originalImageWidth = width;
                    canvasManager.originalImageHeight = height;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // MS Paint-like Text Tool
    let textInput = null;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isResizing = false;
    let resizeStartX = 0;
    let resizeStartWidth = 0;
    canvas.addEventListener('mousedown', (e) => {
        if (canvasManager.currentTool && canvasManager.currentTool.constructor.name === 'TextTool') {
            e.stopPropagation();
            e.preventDefault();
            if (textInput) {
                textInput.remove();
            }
            const containerRect = canvas.parentElement.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.style.position = 'absolute';
            textInput.style.left = `${containerRect.left + x}px`;
            textInput.style.top = `${containerRect.top + y}px`;
            textInput.style.fontSize = `${canvasManager.tools.text.fontSize || 16}px`;
            textInput.style.color = colorPicker.value;
            textInput.style.zIndex = 1000;
            textInput.style.background = 'rgba(255,255,255,0.8)';
            textInput.style.border = '1px solid #888';
            textInput.style.padding = '2px 4px';
            textInput.style.fontFamily = 'Arial, sans-serif';
            textInput.style.minWidth = '40px';
            textInput.style.width = '120px';
            textInput.style.boxSizing = 'border-box';
            textInput.style.resize = 'none';
            textInput.setAttribute('draggable', 'false');
            document.body.appendChild(textInput);
            textInput.focus();

            // Add resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.width = '12px';
            resizeHandle.style.height = '12px';
            resizeHandle.style.right = '-8px';
            resizeHandle.style.bottom = '-8px';
            resizeHandle.style.background = '#888';
            resizeHandle.style.cursor = 'ew-resize';
            resizeHandle.style.zIndex = 1001;
            resizeHandle.style.borderRadius = '2px';
            resizeHandle.style.border = '2px solid #fff';
            textInput.parentElement.appendChild(resizeHandle);
            function updateResizeHandle() {
                const rect = textInput.getBoundingClientRect();
                resizeHandle.style.left = `${rect.left + rect.width - 6}px`;
                resizeHandle.style.top = `${rect.top + rect.height - 6}px`;
            }
            updateResizeHandle();

            // Drag logic
            textInput.addEventListener('mousedown', (event) => {
                if (event.target === resizeHandle) return;
                isDragging = true;
                dragOffsetX = event.clientX - textInput.getBoundingClientRect().left;
                dragOffsetY = event.clientY - textInput.getBoundingClientRect().top;
                event.preventDefault();
            });
            document.addEventListener('mousemove', (event) => {
                if (isDragging) {
                    textInput.style.left = `${event.clientX - dragOffsetX}px`;
                    textInput.style.top = `${event.clientY - dragOffsetY}px`;
                    updateResizeHandle();
                }
                if (isResizing) {
                    const newWidth = Math.max(40, resizeStartWidth + (event.clientX - resizeStartX));
                    textInput.style.width = `${newWidth}px`;
                    updateResizeHandle();
                }
            });
            document.addEventListener('mouseup', () => {
                isDragging = false;
                isResizing = false;
            });

            // Resize logic
            resizeHandle.addEventListener('mousedown', (event) => {
                isResizing = true;
                resizeStartX = event.clientX;
                resizeStartWidth = parseInt(window.getComputedStyle(textInput).width, 10);
                event.preventDefault();
                event.stopPropagation();
            });

            function commitText() {
                const value = textInput.value;
                if (value) {
                    canvasManager.saveState();
                    const inputRect = textInput.getBoundingClientRect();
                    const canvasRect = canvas.getBoundingClientRect();
                    const x = inputRect.left - canvasRect.left;
                    const y = inputRect.top - canvasRect.top;
                    canvasManager.ctx.font = `${canvasManager.tools.text.fontSize || 16}px Arial`;
                    canvasManager.ctx.fillStyle = colorPicker.value;
                    canvasManager.ctx.fillText(value, x, y + (canvasManager.tools.text.fontSize || 16));
                }
                resizeHandle.remove();
                textInput.remove();
                textInput = null;
            }

            textInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    commitText();
                } else if (event.key === 'Escape') {
                    resizeHandle.remove();
                    textInput.remove();
                    textInput = null;
                }
            });
            textInput.addEventListener('blur', commitText);
        }
    }, true); // Use capture to ensure this runs before CanvasManager

    // --- Zoom Functionality ---
    let zoomLevel = 1;
    let zoomOffsetX = 0;
    let zoomOffsetY = 0;
    const ZOOM_STEP = 0.2;
    const MIN_ZOOM = 0.2;
    const MAX_ZOOM = 4;
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');

    function applyZoom() {
        // Clear main canvas
        canvasManager.ctx.setTransform(1, 0, 0, 1, 0, 0);
        canvasManager.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate offset to center the image
        zoomOffsetX = (canvas.width - (canvasManager.originalImageWidth || canvas.width) * zoomLevel) / 2;
        zoomOffsetY = (canvas.height - (canvasManager.originalImageHeight || canvas.height) * zoomLevel) / 2;
        
        // Apply zoom transformation
        canvasManager.ctx.setTransform(zoomLevel, 0, 0, zoomLevel, zoomOffsetX, zoomOffsetY);
        
        // Draw original image
        if (canvasManager.originalImage) {
            canvasManager.ctx.drawImage(
                canvasManager.originalImage,
                0, 0,
                canvasManager.originalImageWidth,
                canvasManager.originalImageHeight
            );
        }
        
        // Draw edits on top
        canvasManager.ctx.drawImage(editCanvas, 0, 0);
    }

    // Modify the tools to draw on editCanvas instead of main canvas
    Object.values(canvasManager.tools).forEach(tool => {
        const originalDraw = tool.draw;
        tool.draw = function(e) {
            if (!this.isDrawing) return;
            
            const pos = Utils.getMousePos(canvas, e);
            editCtx.clearRect(0, 0, editCanvas.width, editCanvas.height);
            if (this.savedImageData) {
                editCtx.putImageData(this.savedImageData, 0, 0);
            }
            
            // Call the original draw method but with editCtx
            const originalCtx = this.ctx;
            this.ctx = editCtx;
            originalDraw.call(this, e);
            this.ctx = originalCtx;
            
            // Update main canvas
            applyZoom();
        };
        
        const originalStartDrawing = tool.startDrawing;
        tool.startDrawing = function(e) {
            originalStartDrawing.call(this, e);
            this.savedImageData = editCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
        };
    });

    // Add mouse wheel zoom handler
    canvas.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
            const newZoomLevel = Math.min(Math.max(zoomLevel + delta, MIN_ZOOM), MAX_ZOOM);
            
            if (newZoomLevel !== zoomLevel) {
                zoomLevel = newZoomLevel;
                applyZoom();
            }
        }
    }, { passive: false });

    zoomInBtn.addEventListener('click', () => {
        if (zoomLevel < MAX_ZOOM) {
            zoomLevel += ZOOM_STEP;
            applyZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (zoomLevel > MIN_ZOOM) {
            zoomLevel -= ZOOM_STEP;
            applyZoom();
        }
    });

    // Adjust mouse coordinates for tools to account for zoom and offset
    function getZoomedMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left - zoomOffsetX) / zoomLevel,
            y: (evt.clientY - rect.top - zoomOffsetY) / zoomLevel
        };
    }
    // Patch Utils.getMousePos to use zoom and offset
    Utils.getMousePos = getZoomedMousePos;
}); 