/**
 * Camera Class
 * @class Camera
 * @description Manages the viewport and camera transformations
 */
export class Camera {
    /**
     * Creates a new Camera
     * @param {number} x - Camera X position
     * @param {number} y - Camera Y position
     * @param {number} width - Viewport width
     * @param {number} height - Viewport height
     */
    constructor(x = 0, y = 0, width = 800, height = 600) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zoom = 1;
        this.rotation = 0;
        
        // Camera bounds (null = no bounds)
        this.bounds = null;
        
        // Follow target
        this.target = null;
        this.followSpeed = 1;
        this.followOffset = { x: 0, y: 0 };
        
        // Shake effect
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeDecay = 0;
    }

    /**
     * Sets camera bounds
     * @param {number} x - Bounds X
     * @param {number} y - Bounds Y
     * @param {number} width - Bounds width
     * @param {number} height - Bounds height
     */
    setBounds(x, y, width, height) {
        this.bounds = { x, y, width, height };
    }

    /**
     * Sets target to follow
     * @param {GameObject} target - Target game object
     * @param {number} speed - Follow speed (0-1, where 1 is instant)
     */
    follow(target, speed = 0.1) {
        this.target = target;
        this.followSpeed = speed;
    }

    /**
     * Starts camera shake effect
     * @param {number} intensity - Shake intensity
     * @param {number} duration - Duration in seconds
     */
    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeDecay = intensity / duration;
    }

    /**
     * Updates camera (follow, shake, etc.)
     * @param {number} dt - Delta time
     */
    update(dt) {
        // Follow target
        if (this.target) {
            const targetX = this.target.x + this.followOffset.x - this.width / (2 * this.zoom);
            const targetY = this.target.y + this.followOffset.y - this.height / (2 * this.zoom);
            
            this.x += (targetX - this.x) * this.followSpeed;
            this.y += (targetY - this.y) * this.followSpeed;
        }

        // Apply bounds
        if (this.bounds) {
            const halfWidth = this.width / (2 * this.zoom);
            const halfHeight = this.height / (2 * this.zoom);
            
            this.x = Math.max(this.bounds.x - halfWidth, 
                Math.min(this.x, this.bounds.x + this.bounds.width - halfWidth));
            this.y = Math.max(this.bounds.y - halfHeight,
                Math.min(this.y, this.bounds.y + this.bounds.height - halfHeight));
        }

        // Update shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt;
            this.shakeIntensity -= this.shakeDecay * dt;
            if (this.shakeDuration <= 0) {
                this.shakeDuration = 0;
                this.shakeIntensity = 0;
            }
        }
    }

    /**
     * Applies camera transform to canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    apply(ctx) {
        // Center the camera
        ctx.translate(this.width / 2, this.height / 2);
        
        // Apply zoom
        ctx.scale(this.zoom, this.zoom);
        
        // Apply rotation
        ctx.rotate(this.rotation);
        
        // Apply shake
        let shakeX = 0, shakeY = 0;
        if (this.shakeIntensity > 0) {
            shakeX = (Math.random() - 0.5) * this.shakeIntensity;
            shakeY = (Math.random() - 0.5) * this.shakeIntensity;
        }
        
        // Apply camera position
        ctx.translate(-this.x + shakeX, -this.y + shakeY);
    }

    /**
     * Converts screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {{x: number, y: number}}
     */
    screenToWorld(screenX, screenY) {
        const x = (screenX - this.width / 2) / this.zoom + this.x;
        const y = (screenY - this.height / 2) / this.zoom + this.y;
        return { x, y };
    }

    /**
     * Converts world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {{x: number, y: number}}
     */
    worldToScreen(worldX, worldY) {
        const x = (worldX - this.x) * this.zoom + this.width / 2;
        const y = (worldY - this.y) * this.zoom + this.height / 2;
        return { x, y };
    }
}
