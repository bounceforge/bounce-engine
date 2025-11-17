import { Component } from '../core/Component.js';

/**
 * TextRenderer Component
 * @class TextRenderer
 * @extends Component
 * @description Renders text
 */
export class TextRenderer extends Component {
    /**
     * Creates a new TextRenderer
     * @param {string} text - Text to render
     * @param {Object} config - Configuration
     */
    constructor(text = '', config = {}) {
        super();
        this.text = text;
        this.font = config.font || '16px Arial';
        this.color = config.color || '#ffffff';
        this.align = config.align || 'center';
        this.baseline = config.baseline || 'middle';
        this.alpha = config.alpha !== undefined ? config.alpha : 1;
        this.stroke = config.stroke || false;
        this.strokeColor = config.strokeColor || '#000000';
        this.strokeWidth = config.strokeWidth || 2;
        this.offset = config.offset || { x: 0, y: 0 };
    }

    /**
     * Renders the text
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.alpha;
        ctx.font = this.font;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        
        if (this.stroke) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeText(this.text, this.offset.x, this.offset.y);
        }
        
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.offset.x, this.offset.y);
        
        ctx.restore();
    }
}
