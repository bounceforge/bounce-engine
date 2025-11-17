/**
 * GameObject Class
 * @class GameObject
 * @description Base class for all game objects in the scene
 */
export class GameObject {
    /**
     * Creates a new GameObject
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x = 0, y = 0) {
        this.name = '';
        this.tag = '';
        this.active = true;
        this.visible = true;
        this.zIndex = 0;
        this.scene = null;
        
        // Transform
        this.x = x;
        this.y = y;
        this.rotation = 0; // in radians
        this.scaleX = 1;
        this.scaleY = 1;
        
        // Components
        this.components = [];
        
        // Children
        this.children = [];
        this.parent = null;
    }

    /**
     * Called when object is added to scene
     */
    onStart() {
        for (const component of this.components) {
            if (component.onStart) {
                component.onStart();
            }
        }
    }

    /**
     * Fixed update for physics
     * @param {number} dt - Fixed delta time
     */
    fixedUpdate(dt) {
        for (const component of this.components) {
            if (component.active && component.fixedUpdate) {
                component.fixedUpdate(dt);
            }
        }
        
        for (const child of this.children) {
            if (child.active) {
                child.fixedUpdate(dt);
            }
        }
    }

    /**
     * Update game logic
     * @param {number} dt - Delta time
     */
    update(dt) {
        for (const component of this.components) {
            if (component.active && component.update) {
                component.update(dt);
            }
        }
        
        for (const child of this.children) {
            if (child.active) {
                child.update(dt);
            }
        }
    }

    /**
     * Render the game object
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        // Apply transform
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        
        // Render components
        for (const component of this.components) {
            if (component.active && component.render) {
                component.render(ctx);
            }
        }
        
        // Render children
        for (const child of this.children) {
            if (child.active && child.visible) {
                child.render(ctx);
            }
        }
        
        ctx.restore();
    }

    /**
     * Called when object is destroyed
     */
    onDestroy() {
        for (const component of this.components) {
            if (component.onDestroy) {
                component.onDestroy();
            }
        }
    }

    /**
     * Adds a component to the game object
     * @param {Component} component - Component to add
     * @returns {Component}
     */
    addComponent(component) {
        component.gameObject = this;
        this.components.push(component);
        if (this.scene && component.onStart) {
            component.onStart();
        }
        return component;
    }

    /**
     * Gets a component by type
     * @param {Function} ComponentClass - Component class
     * @returns {Component|null}
     */
    getComponent(ComponentClass) {
        return this.components.find(c => c instanceof ComponentClass) || null;
    }

    /**
     * Gets all components of a type
     * @param {Function} ComponentClass - Component class
     * @returns {Component[]}
     */
    getComponents(ComponentClass) {
        return this.components.filter(c => c instanceof ComponentClass);
    }

    /**
     * Removes a component
     * @param {Component} component - Component to remove
     */
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
            if (component.onDestroy) {
                component.onDestroy();
            }
        }
    }

    /**
     * Adds a child game object
     * @param {GameObject} child - Child object
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    /**
     * Removes a child game object
     * @param {GameObject} child - Child object
     */
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }

    /**
     * Gets world position (accounting for parent transforms)
     * @returns {{x: number, y: number}}
     */
    getWorldPosition() {
        if (!this.parent) {
            return { x: this.x, y: this.y };
        }
        
        const parentPos = this.parent.getWorldPosition();
        const cos = Math.cos(this.parent.rotation);
        const sin = Math.sin(this.parent.rotation);
        
        return {
            x: parentPos.x + this.x * cos - this.y * sin,
            y: parentPos.y + this.x * sin + this.y * cos
        };
    }

    /**
     * Destroys this game object
     */
    destroy() {
        if (this.scene) {
            this.scene.remove(this);
        }
    }
}
