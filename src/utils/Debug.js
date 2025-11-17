/**
 * Debug utilities
 * @namespace Debug
 */
export class Debug {
    static enabled = false;

    /**
     * Draws a rectangle outline
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color - Color
     */
    static drawRect(ctx, x, y, width, height, color = '#00ff00') {
        if (!Debug.enabled) return;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }

    /**
     * Draws a circle outline
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} radius - Radius
     * @param {string} color - Color
     */
    static drawCircle(ctx, x, y, radius, color = '#00ff00') {
        if (!Debug.enabled) return;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws a line
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {string} color - Color
     */
    static drawLine(ctx, x1, y1, x2, y2, color = '#00ff00') {
        if (!Debug.enabled) return;
        
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws text
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} text - Text to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Color
     */
    static drawText(ctx, text, x, y, color = '#00ff00') {
        if (!Debug.enabled) return;
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = '12px monospace';
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    /**
     * Draws collision bounds
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Collider} collider - Collider to draw
     */
    static drawCollider(ctx, collider) {
        if (!Debug.enabled) return;

        if (collider.constructor.name === 'BoxCollider') {
            const bounds = collider.getBounds();
            Debug.drawRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, '#ff0000');
        } else if (collider.constructor.name === 'CircleCollider') {
            const pos = collider.getWorldPosition();
            Debug.drawCircle(ctx, pos.x, pos.y, collider.radius, '#ff0000');
        }
    }

    /**
     * Logs to console with timestamp
     * @param {...any} args - Arguments to log
     */
    static log(...args) {
        if (!Debug.enabled) return;
        console.log(`[${new Date().toISOString()}]`, ...args);
    }

    /**
     * Logs warning
     * @param {...any} args - Arguments to log
     */
    static warn(...args) {
        if (!Debug.enabled) return;
        console.warn(`[${new Date().toISOString()}]`, ...args);
    }

    /**
     * Logs error
     * @param {...any} args - Arguments to log
     */
    static error(...args) {
        if (!Debug.enabled) return;
        console.error(`[${new Date().toISOString()}]`, ...args);
    }

    /**
     * Starts a performance timer
     * @param {string} label - Timer label
     */
    static time(label) {
        if (!Debug.enabled) return;
        console.time(label);
    }

    /**
     * Ends a performance timer
     * @param {string} label - Timer label
     */
    static timeEnd(label) {
        if (!Debug.enabled) return;
        console.timeEnd(label);
    }
}
