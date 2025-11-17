import { Component } from '../core/Component.js';

/**
 * Animator Component
 * @class Animator
 * @extends Component
 * @description Manages sprite animations
 */
export class Animator extends Component {
    /**
     * Creates a new Animator
     * @param {SpriteRenderer} spriteRenderer - Sprite renderer to animate
     */
    constructor(spriteRenderer) {
        super();
        this.spriteRenderer = spriteRenderer;
        this.animations = new Map();
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.isPlaying = false;
        this.loop = true;
    }

    /**
     * Adds an animation
     * @param {string} name - Animation name
     * @param {Object} animation - Animation data
     */
    addAnimation(name, animation) {
        this.animations.set(name, {
            frames: animation.frames, // Array of {x, y, width, height}
            frameRate: animation.frameRate || 10,
            loop: animation.loop !== false
        });
    }

    /**
     * Plays an animation
     * @param {string} name - Animation name
     * @param {boolean} restart - Restart if already playing
     */
    play(name, restart = false) {
        if (this.currentAnimation === name && this.isPlaying && !restart) {
            return;
        }

        const animation = this.animations.get(name);
        if (!animation) {
            console.warn(`Animation ${name} not found`);
            return;
        }

        this.currentAnimation = name;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.isPlaying = true;
        this.loop = animation.loop;

        this.updateFrame();
    }

    /**
     * Stops the current animation
     */
    stop() {
        this.isPlaying = false;
    }

    /**
     * Pauses the current animation
     */
    pause() {
        this.isPlaying = false;
    }

    /**
     * Resumes the current animation
     */
    resume() {
        this.isPlaying = true;
    }

    /**
     * Updates the animation
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (!this.isPlaying || !this.currentAnimation) return;

        const animation = this.animations.get(this.currentAnimation);
        if (!animation) return;

        this.frameTime += dt;
        const frameDuration = 1 / animation.frameRate;

        if (this.frameTime >= frameDuration) {
            this.frameTime -= frameDuration;
            this.currentFrame++;

            if (this.currentFrame >= animation.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = animation.frames.length - 1;
                    this.isPlaying = false;
                }
            }

            this.updateFrame();
        }
    }

    /**
     * Updates the sprite renderer with current frame
     * @private
     */
    updateFrame() {
        const animation = this.animations.get(this.currentAnimation);
        if (!animation) return;

        const frame = animation.frames[this.currentFrame];
        if (frame) {
            this.spriteRenderer.setSprite(frame.x, frame.y, frame.width, frame.height);
        }
    }
}
