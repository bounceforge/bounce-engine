import { GameObject } from '../core/GameObject.js';
import { TextRenderer } from '../rendering/TextRenderer.js';
import { BoxCollider } from '../physics/Collider.js';

/**
 * UI Element Base Class
 * @class UIElement
 * @extends GameObject
 * @description Base class for UI elements
 */
export class UIElement extends GameObject {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.isUI = true;
        this.interactive = false;
        this.hovered = false;
        this.pressed = false;
    }

    /**
     * Checks if point is inside element
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean}
     */
    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
}

/**
 * Button UI Element
 * @class Button
 * @extends UIElement
 */
export class Button extends UIElement {
    /**
     * Creates a new Button
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} text - Button text
     * @param {Object} style - Button style
     */
    constructor(x, y, width, height, text, style = {}) {
        super(x, y, width, height);
        this.interactive = true;
        this.text = text;
        
        this.style = {
            backgroundColor: style.backgroundColor || '#4CAF50',
            hoverColor: style.hoverColor || '#45a049',
            pressedColor: style.pressedColor || '#3d8b40',
            textColor: style.textColor || '#ffffff',
            fontSize: style.fontSize || 16,
            borderRadius: style.borderRadius || 5,
            borderWidth: style.borderWidth || 0,
            borderColor: style.borderColor || '#000000'
        };
        
        this.onClick = null;
        this.onHover = null;
    }

    /**
     * Handles input
     * @param {Input} input - Input manager
     */
    handleInput(input) {
        const mouseX = input.mouse.x;
        const mouseY = input.mouse.y;
        
        const wasHovered = this.hovered;
        this.hovered = this.contains(mouseX, mouseY);
        
        if (this.hovered && !wasHovered && this.onHover) {
            this.onHover();
        }
        
        if (this.hovered && input.isMouseButtonPressed(0)) {
            this.pressed = true;
        }
        
        if (this.pressed && input.isMouseButtonReleased(0)) {
            if (this.hovered && this.onClick) {
                this.onClick();
            }
            this.pressed = false;
        }
    }

    /**
     * Renders the button
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        // Determine color based on state
        let bgColor = this.style.backgroundColor;
        if (this.pressed) {
            bgColor = this.style.pressedColor;
        } else if (this.hovered) {
            bgColor = this.style.hoverColor;
        }
        
        // Draw background
        ctx.fillStyle = bgColor;
        if (this.style.borderRadius > 0) {
            this.roundRect(ctx, this.x, this.y, this.width, this.height, this.style.borderRadius);
            ctx.fill();
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw border
        if (this.style.borderWidth > 0) {
            ctx.strokeStyle = this.style.borderColor;
            ctx.lineWidth = this.style.borderWidth;
            if (this.style.borderRadius > 0) {
                this.roundRect(ctx, this.x, this.y, this.width, this.height, this.style.borderRadius);
                ctx.stroke();
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
        
        // Draw text
        ctx.fillStyle = this.style.textColor;
        ctx.font = `${this.style.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        
        ctx.restore();
    }

    /**
     * Draws a rounded rectangle
     * @private
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

/**
 * Panel UI Element
 * @class Panel
 * @extends UIElement
 */
export class Panel extends UIElement {
    /**
     * Creates a new Panel
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {Object} style - Panel style
     */
    constructor(x, y, width, height, style = {}) {
        super(x, y, width, height);
        
        this.style = {
            backgroundColor: style.backgroundColor || 'rgba(0, 0, 0, 0.7)',
            borderWidth: style.borderWidth || 2,
            borderColor: style.borderColor || '#ffffff',
            borderRadius: style.borderRadius || 0,
            padding: style.padding || 10
        };
        
        this.children = [];
    }

    /**
     * Adds a child element
     * @param {UIElement} element - UI element
     */
    addChild(element) {
        this.children.push(element);
    }

    /**
     * Renders the panel
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        // Draw background
        ctx.fillStyle = this.style.backgroundColor;
        if (this.style.borderRadius > 0) {
            this.roundRect(ctx, this.x, this.y, this.width, this.height, this.style.borderRadius);
            ctx.fill();
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw border
        if (this.style.borderWidth > 0) {
            ctx.strokeStyle = this.style.borderColor;
            ctx.lineWidth = this.style.borderWidth;
            if (this.style.borderRadius > 0) {
                this.roundRect(ctx, this.x, this.y, this.width, this.height, this.style.borderRadius);
                ctx.stroke();
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
        
        ctx.restore();
        
        // Render children
        super.render(ctx);
    }

    /**
     * Draws a rounded rectangle
     * @private
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

/**
 * UI Manager
 * @class UIManager
 * @description Manages UI elements and their interactions
 */
export class UIManager {
    constructor(input) {
        this.input = input;
        this.elements = [];
    }

    /**
     * Adds a UI element
     * @param {UIElement} element - UI element
     */
    add(element) {
        this.elements.push(element);
    }

    /**
     * Removes a UI element
     * @param {UIElement} element - UI element
     */
    remove(element) {
        const index = this.elements.indexOf(element);
        if (index !== -1) {
            this.elements.splice(index, 1);
        }
    }

    /**
     * Updates UI elements
     * @param {number} dt - Delta time
     */
    update(dt) {
        for (const element of this.elements) {
            if (element.interactive) {
                element.handleInput(this.input);
            }
            if (element.update) {
                element.update(dt);
            }
        }
    }

    /**
     * Renders UI elements
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        for (const element of this.elements) {
            if (element.visible) {
                element.render(ctx);
            }
        }
    }

    /**
     * Clears all UI elements
     */
    clear() {
        this.elements = [];
    }
}
