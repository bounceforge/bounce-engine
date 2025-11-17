import { Component } from '../core/Component.js';

/**
 * RigidBody Component
 * @class RigidBody
 * @extends Component
 * @description Adds physics properties to a game object
 */
export class RigidBody extends Component {
    /**
     * Creates a new RigidBody
     * @param {Object} config - Configuration
     */
    constructor(config = {}) {
        super();
        
        // Velocity
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Acceleration
        this.accelerationX = 0;
        this.accelerationY = 0;
        
        // Forces
        this.forceX = 0;
        this.forceY = 0;
        
        // Physics properties
        this.mass = config.mass || 1;
        this.drag = config.drag !== undefined ? config.drag : 0.01;
        this.gravityScale = config.gravityScale !== undefined ? config.gravityScale : 1;
        this.useGravity = config.useGravity !== false;
        this.isKinematic = config.isKinematic || false;
        
        // Constraints
        this.maxVelocityX = config.maxVelocityX || Infinity;
        this.maxVelocityY = config.maxVelocityY || Infinity;
        
        // Collision
        this.isGrounded = false;
        this.isTouchingWall = false;
        
        // Platformer properties
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
    }

    /**
     * Applies a force
     * @param {number} x - Force X
     * @param {number} y - Force Y
     */
    addForce(x, y) {
        this.forceX += x;
        this.forceY += y;
    }

    /**
     * Applies an impulse (instant velocity change)
     * @param {number} x - Impulse X
     * @param {number} y - Impulse Y
     */
    addImpulse(x, y) {
        this.velocityX += x / this.mass;
        this.velocityY += y / this.mass;
    }

    /**
     * Sets velocity
     * @param {number} x - Velocity X
     * @param {number} y - Velocity Y
     */
    setVelocity(x, y) {
        this.velocityX = x;
        this.velocityY = y;
    }

    /**
     * Fixed update for physics
     * @param {number} dt - Fixed delta time
     */
    fixedUpdate(dt) {
        if (this.isKinematic) return;

        const physics = this.scene?.physics;
        
        // Apply gravity
        if (this.useGravity && physics) {
            this.accelerationY += physics.gravity * this.gravityScale;
        }
        
        // Apply forces
        this.accelerationX += this.forceX / this.mass;
        this.accelerationY += this.forceY / this.mass;
        
        // Update velocity
        this.velocityX += this.accelerationX * dt;
        this.velocityY += this.accelerationY * dt;
        
        // Apply drag
        this.velocityX *= (1 - this.drag);
        this.velocityY *= (1 - this.drag);
        
        // Clamp velocity
        this.velocityX = Math.max(-this.maxVelocityX, Math.min(this.maxVelocityX, this.velocityX));
        this.velocityY = Math.max(-this.maxVelocityY, Math.min(this.maxVelocityY, this.velocityY));
        
        // Update position
        this.gameObject.x += this.velocityX * dt;
        this.gameObject.y += this.velocityY * dt;
        
        // Reset forces and acceleration
        this.forceX = 0;
        this.forceY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
    }
}
