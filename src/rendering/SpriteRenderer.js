import { Component } from '../core/Component.js';

/**
 * SpriteRenderer Component
 * @class SpriteRenderer
 * @extends Component
 * @description Renders a sprite or colored rectangle
 */
export class SpriteRenderer extends Component {
    /**
     * Creates a new SpriteRenderer
     * @param {Object} config - Configuration
     * @param {HTMLImageElement} config.image - Image to render
     * @param {number} config.width - Width
     * @param {number} config.height - Height
     * @param {string} config.color - Fill color (used if no image)
     * @param {number} config.alpha - Opacity (0-1)
     * @param {Object} config.offset - Render offset {x, y}
     */
    constructor(config = {}) {
        super();
        this.image = config.image || null;
        this.width = config.width || 32;
        this.height = config.height || 32;
        this.color = config.color || '#ffffff';
        this.alpha = config.alpha !== undefined ? config.alpha : 1;
        this.offset = config.offset || { x: -this.width / 2, y: -this.height / 2 };
        
        // Sprite sheet support
        this.sourceX = 0;
        this.sourceY = 0;
        this.sourceWidth = 0;
        this.sourceHeight = 0;
        
        // Flip
        this.flipX = false;
        this.flipY = false;
    }

    /**
     * Sets sprite from sprite sheet
     * @param {number} x - Source X
     * @param {number} y - Source Y
     * @param {number} width - Source width
     * @param {number} height - Source height
     */
    setSprite(x, y, width, height) {
        this.sourceX = x;
        this.sourceY = y;
        this.sourceWidth = width;
        this.sourceHeight = height;
    }

    /**
     * Renders the sprite
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.alpha;
        
        // Apply flip
        if (this.flipX || this.flipY) {
            ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
        }
        
        if (this.image && this.image.complete) {
            // Render image
            if (this.sourceWidth > 0 && this.sourceHeight > 0) {
                // Render from sprite sheet
                ctx.drawImage(
                    this.image,
                    this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight,
                    this.offset.x * (this.flipX ? -1 : 1), 
                    this.offset.y * (this.flipY ? -1 : 1),
                    this.width, this.height
                );
            } else {
                // Render full image
                ctx.drawImage(
                    this.image,
                    this.offset.x * (this.flipX ? -1 : 1),
                    this.offset.y * (this.flipY ? -1 : 1),
                    this.width, this.height
                );
            }
        } else {
            // Render colored rectangle
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.offset.x * (this.flipX ? -1 : 1),
                this.offset.y * (this.flipY ? -1 : 1),
                this.width, this.height
            );
        }
        
        ctx.restore();
    }
}
