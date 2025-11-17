import { Component } from '../core/Component.js';

/**
 * Collider Component Base Class
 * @class Collider
 * @extends Component
 * @description Base class for all colliders
 */
export class Collider extends Component {
    constructor() {
        super();
        this.isTrigger = false;
        this.tag = '';
        this.offset = { x: 0, y: 0 };
    }

    /**
     * Gets the world position of the collider
     * @returns {{x: number, y: number}}
     */
    getWorldPosition() {
        return {
            x: this.gameObject.x + this.offset.x,
            y: this.gameObject.y + this.offset.y
        };
    }

    /**
     * Called when collision starts
     * @param {Collider} other - Other collider
     */
    onCollisionEnter(other) {
        // Override in subclass
    }

    /**
     * Called while collision is happening
     * @param {Collider} other - Other collider
     */
    onCollisionStay(other) {
        // Override in subclass
    }

    /**
     * Called when collision ends
     * @param {Collider} other - Other collider
     */
    onCollisionExit(other) {
        // Override in subclass
    }
}

/**
 * BoxCollider Component
 * @class BoxCollider
 * @extends Collider
 * @description Axis-aligned box collider
 */
export class BoxCollider extends Collider {
    /**
     * Creates a new BoxCollider
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {Object} offset - Offset from game object position
     */
    constructor(width, height, offset = { x: 0, y: 0 }) {
        super();
        this.width = width;
        this.height = height;
        this.offset = offset;
    }

    /**
     * Gets the bounding box
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getBounds() {
        const pos = this.getWorldPosition();
        return {
            x: pos.x - this.width / 2,
            y: pos.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Checks if this collider intersects with another box collider
     * @param {BoxCollider} other - Other box collider
     * @returns {boolean}
     */
    intersects(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
}

/**
 * CircleCollider Component
 * @class CircleCollider
 * @extends Collider
 * @description Circle collider
 */
export class CircleCollider extends Collider {
    /**
     * Creates a new CircleCollider
     * @param {number} radius - Radius
     * @param {Object} offset - Offset from game object position
     */
    constructor(radius, offset = { x: 0, y: 0 }) {
        super();
        this.radius = radius;
        this.offset = offset;
    }

    /**
     * Checks if this collider intersects with another circle collider
     * @param {CircleCollider} other - Other circle collider
     * @returns {boolean}
     */
    intersects(other) {
        const pos1 = this.getWorldPosition();
        const pos2 = other.getWorldPosition();
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < this.radius + other.radius;
    }

    /**
     * Checks if this circle intersects with a box collider
     * @param {BoxCollider} box - Box collider
     * @returns {boolean}
     */
    intersectsBox(box) {
        const circle = this.getWorldPosition();
        const rect = box.getBounds();
        
        // Find closest point on rectangle to circle center
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        
        // Calculate distance
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        
        return (dx * dx + dy * dy) < (this.radius * this.radius);
    }
}
