/**
 * Scene Class
 * @class Scene
 * @description Represents a game scene containing game objects and managing their lifecycle
 */
export class Scene {
    constructor(name) {
        this.name = name;
        this.engine = null;
        this.gameObjects = [];
        this.camera = null;
        this._objectsToAdd = [];
        this._objectsToRemove = [];
    }

    /**
     * Called when scene becomes active
     */
    onEnter() {
        // Override in subclass
    }

    /**
     * Called when scene becomes inactive
     */
    onExit() {
        // Override in subclass
    }

    /**
     * Fixed update for physics (called at fixed intervals)
     * @param {number} dt - Fixed delta time
     */
    fixedUpdate(dt) {
        this._processPendingObjects();
        
        for (const obj of this.gameObjects) {
            if (obj.active) {
                obj.fixedUpdate(dt);
            }
        }
    }

    /**
     * Update game logic
     * @param {number} dt - Delta time
     */
    update(dt) {
        for (const obj of this.gameObjects) {
            if (obj.active) {
                obj.update(dt);
            }
        }
    }

    /**
     * Render the scene
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        // Apply camera transform if available
        if (this.camera) {
            this.camera.apply(ctx);
        }

        // Sort objects by z-index
        const sortedObjects = [...this.gameObjects].sort((a, b) => 
            (a.zIndex || 0) - (b.zIndex || 0)
        );

        for (const obj of sortedObjects) {
            if (obj.active && obj.visible) {
                obj.render(ctx);
            }
        }

        ctx.restore();
    }

    /**
     * Adds a game object to the scene
     * @param {GameObject} gameObject - Game object to add
     */
    add(gameObject) {
        this._objectsToAdd.push(gameObject);
        gameObject.scene = this;
    }

    /**
     * Removes a game object from the scene
     * @param {GameObject} gameObject - Game object to remove
     */
    remove(gameObject) {
        this._objectsToRemove.push(gameObject);
    }

    /**
     * Finds a game object by name
     * @param {string} name - Object name
     * @returns {GameObject|null}
     */
    findByName(name) {
        return this.gameObjects.find(obj => obj.name === name) || null;
    }

    /**
     * Finds all game objects with a specific tag
     * @param {string} tag - Tag to search for
     * @returns {GameObject[]}
     */
    findByTag(tag) {
        return this.gameObjects.filter(obj => obj.tag === tag);
    }

    /**
     * Process pending add/remove operations
     * @private
     */
    _processPendingObjects() {
        // Remove objects
        for (const obj of this._objectsToRemove) {
            const index = this.gameObjects.indexOf(obj);
            if (index !== -1) {
                this.gameObjects.splice(index, 1);
                obj.onDestroy();
            }
        }
        this._objectsToRemove = [];

        // Add objects
        for (const obj of this._objectsToAdd) {
            this.gameObjects.push(obj);
            obj.onStart();
        }
        this._objectsToAdd = [];
    }

    /**
     * Clears all game objects from the scene
     */
    clear() {
        for (const obj of this.gameObjects) {
            obj.onDestroy();
        }
        this.gameObjects = [];
        this._objectsToAdd = [];
        this._objectsToRemove = [];
    }
}
