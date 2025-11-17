import { Component } from '../core/Component.js';
import { RigidBody } from '../physics/RigidBody.js';
import { SpriteRenderer } from '../rendering/SpriteRenderer.js';

/**
 * TopDownController Component
 * @class TopDownController
 * @extends Component
 * @description Provides top-down movement controls (e.g., for RPGs, twin-stick shooters)
 */
export class TopDownController extends Component {
    /**
     * Creates a new TopDownController
     * @param {Object} config - Configuration
     */
    constructor(config = {}) {
        super();
        
        this.moveSpeed = config.moveSpeed || 200;
        this.acceleration = config.acceleration || 1500;
        this.friction = config.friction || 800;
        this.rotateToMovement = config.rotateToMovement || false;
        this.fourDirectional = config.fourDirectional || false;
        this.useRigidbody = config.useRigidbody !== false;
        
        // Dash
        this.canDash = config.canDash || false;
        this.dashSpeed = config.dashSpeed || 500;
        this.dashDuration = config.dashDuration || 0.2;
        this.dashCooldown = config.dashCooldown || 1;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        
        // References
        this.rigidbody = null;
        this.input = null;
    }

    /**
     * Called when component starts
     */
    onStart() {
        if (this.useRigidbody) {
            this.rigidbody = this.gameObject.getComponent(RigidBody);
            if (this.rigidbody) {
                this.rigidbody.useGravity = false;
            }
        }
        
        this.input = this.engine?.currentScene?.input;
        if (!this.input) {
            console.error('TopDownController requires Input system');
        }
    }

    /**
     * Updates controller
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (!this.input) return;

        // Get input direction
        let inputX = 0;
        let inputY = 0;
        
        if (this.input.isKeyDown('KeyW') || this.input.isKeyDown('ArrowUp')) inputY -= 1;
        if (this.input.isKeyDown('KeyS') || this.input.isKeyDown('ArrowDown')) inputY += 1;
        if (this.input.isKeyDown('KeyA') || this.input.isKeyDown('ArrowLeft')) inputX -= 1;
        if (this.input.isKeyDown('KeyD') || this.input.isKeyDown('ArrowRight')) inputX += 1;

        // Gamepad support
        const gamepadX = this.input.getGamepadAxis(0);
        const gamepadY = this.input.getGamepadAxis(1);
        if (Math.abs(gamepadX) > 0.1) inputX = gamepadX;
        if (Math.abs(gamepadY) > 0.1) inputY = gamepadY;

        // Four-directional movement
        if (this.fourDirectional) {
            if (Math.abs(inputX) > Math.abs(inputY)) {
                inputY = 0;
            } else {
                inputX = 0;
            }
        }

        // Normalize diagonal movement
        const inputMagnitude = Math.sqrt(inputX * inputX + inputY * inputY);
        if (inputMagnitude > 1) {
            inputX /= inputMagnitude;
            inputY /= inputMagnitude;
        }

        // Dash
        if (this.canDash) {
            this.dashCooldownTimer -= dt;
            
            if (this.input.isKeyPressed('ShiftLeft') && this.dashCooldownTimer <= 0 && !this.isDashing && inputMagnitude > 0) {
                this.isDashing = true;
                this.dashTimer = this.dashDuration;
                this.dashCooldownTimer = this.dashCooldown;
                this.dashDirection = { x: inputX, y: inputY };
            }

            if (this.isDashing) {
                this.dashTimer -= dt;
                if (this.dashTimer <= 0) {
                    this.isDashing = false;
                }
                inputX = this.dashDirection.x;
                inputY = this.dashDirection.y;
            }
        }

        // Apply movement
        const speed = this.isDashing ? this.dashSpeed : this.moveSpeed;
        
        if (this.useRigidbody && this.rigidbody) {
            // Physics-based movement
            const targetVelX = inputX * speed;
            const targetVelY = inputY * speed;
            
            const velDiffX = targetVelX - this.rigidbody.velocityX;
            const velDiffY = targetVelY - this.rigidbody.velocityY;
            
            const accelX = velDiffX * this.acceleration * dt;
            const accelY = velDiffY * this.acceleration * dt;
            
            this.rigidbody.velocityX += accelX;
            this.rigidbody.velocityY += accelY;
            
            // Apply friction
            if (inputMagnitude === 0) {
                const frictionX = this.friction * dt;
                const frictionY = this.friction * dt;
                
                if (Math.abs(this.rigidbody.velocityX) > frictionX) {
                    this.rigidbody.velocityX -= Math.sign(this.rigidbody.velocityX) * frictionX;
                } else {
                    this.rigidbody.velocityX = 0;
                }
                
                if (Math.abs(this.rigidbody.velocityY) > frictionY) {
                    this.rigidbody.velocityY -= Math.sign(this.rigidbody.velocityY) * frictionY;
                } else {
                    this.rigidbody.velocityY = 0;
                }
            }
        } else {
            // Direct movement
            this.gameObject.x += inputX * speed * dt;
            this.gameObject.y += inputY * speed * dt;
        }

        // Rotate to movement direction
        if (this.rotateToMovement && inputMagnitude > 0.1) {
            this.gameObject.rotation = Math.atan2(inputY, inputX);
        }

        // Flip sprite based on direction
        const spriteRenderer = this.gameObject.getComponent(SpriteRenderer);
        if (spriteRenderer && !this.rotateToMovement && inputX !== 0) {
            spriteRenderer.flipX = inputX < 0;
        }
    }
}
