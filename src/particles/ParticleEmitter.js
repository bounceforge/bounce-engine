import { Component } from '../core/Component.js';

/**
 * ParticleEmitter Component
 * @class ParticleEmitter
 * @extends Component
 * @description Emits and manages particles
 */
export class ParticleEmitter extends Component {
    /**
     * Creates a new ParticleEmitter
     * @param {Object} config - Configuration
     */
    constructor(config = {}) {
        super();
        
        // Emission
        this.emissionRate = config.emissionRate || 10; // particles per second
        this.maxParticles = config.maxParticles || 100;
        this.autoEmit = config.autoEmit !== false;
        this.emissionTimer = 0;
        
        // Particle properties
        this.particleLifetime = config.particleLifetime || 1;
        this.particleLifetimeVariance = config.particleLifetimeVariance || 0;
        
        // Velocity
        this.startVelocity = config.startVelocity || { x: 0, y: -100 };
        this.velocityVariance = config.velocityVariance || { x: 50, y: 50 };
        
        // Acceleration
        this.acceleration = config.acceleration || { x: 0, y: 100 };
        
        // Size
        this.startSize = config.startSize || 4;
        this.endSize = config.endSize || 0;
        this.sizeVariance = config.sizeVariance || 0;
        
        // Color
        this.startColor = config.startColor || '#ffffff';
        this.endColor = config.endColor || '#ffffff';
        
        // Alpha
        this.startAlpha = config.startAlpha !== undefined ? config.startAlpha : 1;
        this.endAlpha = config.endAlpha !== undefined ? config.endAlpha : 0;
        
        // Rotation
        this.startRotation = config.startRotation || 0;
        this.rotationSpeed = config.rotationSpeed || 0;
        this.rotationVariance = config.rotationVariance || 0;
        
        // Particles array
        this.particles = [];
        
        // Shape
        this.emissionShape = config.emissionShape || 'point'; // point, circle, box
        this.emissionRadius = config.emissionRadius || 0;
        this.emissionBox = config.emissionBox || { width: 0, height: 0 };
    }

    /**
     * Emits particles
     * @param {number} count - Number of particles to emit
     */
    emit(count = 1) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;

            const particle = this.createParticle();
            this.particles.push(particle);
        }
    }

    /**
     * Creates a new particle
     * @private
     * @returns {Object}
     */
    createParticle() {
        let x = this.gameObject.x;
        let y = this.gameObject.y;

        // Apply emission shape
        if (this.emissionShape === 'circle') {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * this.emissionRadius;
            x += Math.cos(angle) * radius;
            y += Math.sin(angle) * radius;
        } else if (this.emissionShape === 'box') {
            x += (Math.random() - 0.5) * this.emissionBox.width;
            y += (Math.random() - 0.5) * this.emissionBox.height;
        }

        return {
            x,
            y,
            vx: this.startVelocity.x + (Math.random() - 0.5) * this.velocityVariance.x,
            vy: this.startVelocity.y + (Math.random() - 0.5) * this.velocityVariance.y,
            lifetime: this.particleLifetime + (Math.random() - 0.5) * this.particleLifetimeVariance,
            age: 0,
            size: this.startSize + (Math.random() - 0.5) * this.sizeVariance,
            rotation: this.startRotation + (Math.random() - 0.5) * this.rotationVariance,
            rotationSpeed: this.rotationSpeed
        };
    }

    /**
     * Updates particles
     * @param {number} dt - Delta time
     */
    update(dt) {
        // Auto emit
        if (this.autoEmit) {
            this.emissionTimer += dt;
            const emissionInterval = 1 / this.emissionRate;
            
            while (this.emissionTimer >= emissionInterval) {
                this.emit(1);
                this.emissionTimer -= emissionInterval;
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.age += dt;
            
            // Remove dead particles
            if (p.age >= p.lifetime) {
                this.particles.splice(i, 1);
                continue;
            }

            // Update velocity
            p.vx += this.acceleration.x * dt;
            p.vy += this.acceleration.y * dt;

            // Update position
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Update rotation
            p.rotation += p.rotationSpeed * dt;
        }
    }

    /**
     * Renders particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        for (const p of this.particles) {
            const t = p.age / p.lifetime;

            // Interpolate size
            const size = this.startSize + (this.endSize - this.startSize) * t;

            // Interpolate alpha
            const alpha = this.startAlpha + (this.endAlpha - this.startAlpha) * t;

            // Interpolate color (simple version)
            const color = this.interpolateColor(this.startColor, this.endColor, t);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = color;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.restore();
        }
    }

    /**
     * Interpolates between two hex colors
     * @private
     */
    interpolateColor(color1, color2, t) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Converts hex color to RGB
     * @private
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    /**
     * Clears all particles
     */
    clear() {
        this.particles = [];
    }
}
