import { Component } from '../core/Component.js';
import { RigidBody } from '../physics/RigidBody.js';

/**
 * PlatformerController Component
 * @class PlatformerController
 * @extends Component
 * @description Provides platformer-style movement controls
 */
export class PlatformerController extends Component {
    /**
     * Creates a new PlatformerController
     * @param {Object} config - Configuration
     */
    constructor(config = {}) {
        super();
        
        this.moveSpeed = config.moveSpeed || 200;
        this.jumpForce = config.jumpForce || 400;
        this.airControl = config.airControl !== undefined ? config.airControl : 0.5;
        this.maxFallSpeed = config.maxFallSpeed || 800;
        this.coyoteTime = config.coyoteTime || 0.1; // Grace period after leaving platform
        this.jumpBufferTime = config.jumpBufferTime || 0.1; // Pre-jump buffer
        
        // Wall jump
        this.canWallJump = config.canWallJump || false;
        this.wallJumpForce = config.wallJumpForce || { x: 300, y: 350 };
        this.wallSlideSpeed = config.wallSlideSpeed || 100;
        
        // Double jump
        this.canDoubleJump = config.canDoubleJump || false;
        this.hasDoubleJumped = false;
        
        // State
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.isOnWall = false;
        this.wallDirection = 0;
        
        // References
        this.rigidbody = null;
        this.input = null;
    }

    /**
     * Called when component starts
     */
    onStart() {
        this.rigidbody = this.gameObject.getComponent(RigidBody);
        if (!this.rigidbody) {
            console.error('PlatformerController requires a RigidBody component');
        }
        
        this.input = this.engine?.currentScene?.input;
        if (!this.input) {
            console.error('PlatformerController requires Input system');
        }
    }

    /**
     * Updates controller
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (!this.rigidbody || !this.input) return;

        // Get input
        const moveX = this.getHorizontalInput();
        const jumpPressed = this.input.isKeyPressed('Space') || this.input.isKeyPressed('KeyW');
        const jumpHeld = this.input.isKeyDown('Space') || this.input.isKeyDown('KeyW');

        // Update timers
        if (this.rigidbody.isGrounded) {
            this.coyoteTimer = this.coyoteTime;
            this.hasDoubleJumped = false;
        } else {
            this.coyoteTimer -= dt;
        }

        if (jumpPressed) {
            this.jumpBufferTimer = this.jumpBufferTime;
        } else {
            this.jumpBufferTimer -= dt;
        }

        // Check wall contact
        this.isOnWall = this.rigidbody.isTouchingWall && !this.rigidbody.isGrounded;
        if (this.isOnWall) {
            this.wallDirection = Math.sign(moveX);
        }

        // Horizontal movement
        const acceleration = this.rigidbody.isGrounded ? this.moveSpeed : this.moveSpeed * this.airControl;
        this.rigidbody.velocityX = moveX * this.moveSpeed;

        // Wall slide
        if (this.canWallJump && this.isOnWall && this.rigidbody.velocityY > 0) {
            this.rigidbody.velocityY = Math.min(this.rigidbody.velocityY, this.wallSlideSpeed);
        }

        // Jump logic
        if (this.jumpBufferTimer > 0) {
            if (this.coyoteTimer > 0) {
                // Normal jump
                this.performJump();
            } else if (this.canWallJump && this.isOnWall) {
                // Wall jump
                this.performWallJump();
            } else if (this.canDoubleJump && !this.hasDoubleJumped && !this.rigidbody.isGrounded) {
                // Double jump
                this.performDoubleJump();
            }
        }

        // Limit fall speed
        if (this.rigidbody.velocityY > this.maxFallSpeed) {
            this.rigidbody.velocityY = this.maxFallSpeed;
        }

        // Flip sprite based on direction
        const spriteRenderer = this.gameObject.getComponent(SpriteRenderer);
        if (spriteRenderer && moveX !== 0) {
            spriteRenderer.flipX = moveX < 0;
        }
    }

    /**
     * Gets horizontal input
     * @returns {number}
     */
    getHorizontalInput() {
        let input = 0;
        if (this.input.isKeyDown('KeyA') || this.input.isKeyDown('ArrowLeft')) input -= 1;
        if (this.input.isKeyDown('KeyD') || this.input.isKeyDown('ArrowRight')) input += 1;
        
        // Gamepad support
        const gamepadAxis = this.input.getGamepadAxis(0);
        if (Math.abs(gamepadAxis) > 0.1) {
            input = gamepadAxis;
        }
        
        return input;
    }

    /**
     * Performs a jump
     */
    performJump() {
        this.rigidbody.velocityY = -this.jumpForce;
        this.jumpBufferTimer = 0;
        this.coyoteTimer = 0;
    }

    /**
     * Performs a wall jump
     */
    performWallJump() {
        this.rigidbody.velocityX = -this.wallDirection * this.wallJumpForce.x;
        this.rigidbody.velocityY = -this.wallJumpForce.y;
        this.jumpBufferTimer = 0;
        this.isOnWall = false;
    }

    /**
     * Performs a double jump
     */
    performDoubleJump() {
        this.rigidbody.velocityY = -this.jumpForce * 0.8; // Slightly weaker
        this.hasDoubleJumped = true;
        this.jumpBufferTimer = 0;
    }
}

// Import SpriteRenderer for type checking
import { SpriteRenderer } from '../rendering/SpriteRenderer.js';
