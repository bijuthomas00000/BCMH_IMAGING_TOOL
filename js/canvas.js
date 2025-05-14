class CanvasManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.history = [];
        this.currentTool = null;
        this.tools = {
            brush: new BrushTool(canvas, this.ctx),
            rectangle: new RectangleTool(canvas, this.ctx),
            circle: new CircleTool(canvas, this.ctx),
            line: new LineTool(canvas, this.ctx),
            text: new TextTool(canvas, this.ctx)
        };
        
        this.setupEventListeners();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.currentTool) {
                this.saveState();
                this.currentTool.startDrawing(e);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.currentTool && this.currentTool.isDrawing) {
                this.currentTool.draw(e);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.currentTool) {
                this.currentTool.stopDrawing();
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (this.currentTool) {
                this.currentTool.stopDrawing();
            }
        });
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setTool(toolName) {
        this.currentTool = this.tools[toolName] || null;
    }

    setColor(color) {
        Object.values(this.tools).forEach(tool => tool.setColor(color));
    }

    setBrushSize(size) {
        Object.values(this.tools).forEach(tool => tool.setSize(size));
    }

    setFontSize(size) {
        if (this.tools.text) {
            this.tools.text.setFontSize(size);
        }
    }

    saveState() {
        this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    undo() {
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            this.ctx.putImageData(previousState, 0, 0);
        }
    }

    loadImage(imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.saveState();
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = imageUrl;
    }

    getBase64() {
        return Utils.canvasToBase64(this.canvas);
    }

    download() {
        Utils.downloadCanvas(this.canvas);
    }
} 