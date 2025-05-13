class DrawingTool {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.color = '#000000';
        this.size = 5;
    }

    setColor(color) {
        this.color = color;
    }

    setSize(size) {
        this.size = size;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = Utils.getMousePos(this.canvas, e);
        this.startX = pos.x;
        this.startY = pos.y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }
}

class BrushTool extends DrawingTool {
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = Utils.getMousePos(this.canvas, e);
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        this.startX = pos.x;
        this.startY = pos.y;
    }
}

class RectangleTool extends DrawingTool {
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = Utils.getMousePos(this.canvas, e);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.savedImageData, 0, 0);
        
        this.ctx.beginPath();
        this.ctx.rect(
            this.startX,
            this.startY,
            pos.x - this.startX,
            pos.y - this.startY
        );
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.stroke();
    }

    startDrawing(e) {
        super.startDrawing(e);
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
}

class CircleTool extends DrawingTool {
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = Utils.getMousePos(this.canvas, e);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.savedImageData, 0, 0);
        
        const radius = Utils.distance(this.startX, this.startY, pos.x, pos.y);
        
        this.ctx.beginPath();
        this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.stroke();
    }

    startDrawing(e) {
        super.startDrawing(e);
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
}

class LineTool extends DrawingTool {
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = Utils.getMousePos(this.canvas, e);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.savedImageData, 0, 0);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.stroke();
    }

    startDrawing(e) {
        super.startDrawing(e);
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
}

class TextTool extends DrawingTool {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.fontSize = 16;
    }

    setFontSize(size) {
        this.fontSize = size;
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = Utils.getMousePos(this.canvas, e);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.savedImageData, 0, 0);
        
        this.ctx.font = `${this.fontSize}px Arial`;
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(this.text, pos.x, pos.y);
    }

    startDrawing(e) {
        super.startDrawing(e);
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.text = prompt('Enter text:');
        if (!this.text) {
            this.isDrawing = false;
        }
    }
} 