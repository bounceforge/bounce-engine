/**
 * Component Base Class
 * @class Component
 * @description Base class for all components that can be attached to game objects
 */
export class Component {
    constructor() {
        this.gameObject = null;
        this.active = true;
    }

    /**
     * Called when component is added to a game object
     */
    onStart() {
        // Override in subclass
    }

    /**
     * Fixed update for physics
     * @param {number} dt - Fixed delta time
     */
    fixedUpdate(dt) {
        // Override in subclass
    }

    /**
     * Update game logic
     * @param {number} dt - Delta time
     */
    update(dt) {
        // Override in subclass
    }

    /**
     * Render the component
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        // Override in subclass
    }

    /**
     * Called when component is destroyed
     */
    onDestroy() {
        // Override in subclass
    }

    /**
     * Gets the scene
     * @returns {Scene|null}
     */
    get scene() {
        return this.gameObject ? this.gameObject.scene : null;
    }

    /**
     * Gets the engine
     * @returns {Engine|null}
     */
    get engine() {
        return this.scene ? this.scene.engine : null;
    }
}
