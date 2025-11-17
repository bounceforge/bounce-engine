/**
 * Tween Class
 * @class Tween
 * @description Animates object properties over time
 */
export class Tween {
    /**
     * Creates a new Tween
     * @param {Object} target - Object to animate
     * @param {Object} to - Target properties
     * @param {number} duration - Duration in seconds
     * @param {Object} options - Tween options
     */
    constructor(target, to, duration, options = {}) {
        this.target = target;
        this.to = to;
        this.duration = duration;
        this.elapsed = 0;
        
        this.from = {};
        for (const key in to) {
            this.from[key] = target[key];
        }
        
        this.easing = options.easing || Tween.Easing.Linear;
        this.delay = options.delay || 0;
        this.loop = options.loop || false;
        this.yoyo = options.yoyo || false;
        this.onUpdate = options.onUpdate || null;
        this.onComplete = options.onComplete || null;
        
        this.isComplete = false;
        this.isActive = false;
        this.direction = 1; // 1 = forward, -1 = reverse
    }

    /**
     * Starts the tween
     */
    start() {
        this.isActive = true;
        return this;
    }

    /**
     * Stops the tween
     */
    stop() {
        this.isActive = false;
        return this;
    }

    /**
     * Updates the tween
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (!this.isActive) return;

        if (this.delay > 0) {
            this.delay -= dt;
            return;
        }

        this.elapsed += dt * this.direction;

        if (this.elapsed >= this.duration) {
            this.elapsed = this.duration;
        } else if (this.elapsed <= 0) {
            this.elapsed = 0;
        }

        const t = this.easing(this.elapsed / this.duration);

        for (const key in this.to) {
            this.target[key] = this.from[key] + (this.to[key] - this.from[key]) * t;
        }

        if (this.onUpdate) {
            this.onUpdate(this.target);
        }

        if (this.elapsed >= this.duration) {
            if (this.yoyo) {
                this.direction = -1;
                this.elapsed = this.duration;
            } else if (this.loop) {
                this.elapsed = 0;
            } else {
                this.isComplete = true;
                this.isActive = false;
                if (this.onComplete) {
                    this.onComplete(this.target);
                }
            }
        } else if (this.elapsed <= 0 && this.yoyo) {
            this.direction = 1;
            this.elapsed = 0;
            
            if (!this.loop) {
                this.isComplete = true;
                this.isActive = false;
                if (this.onComplete) {
                    this.onComplete(this.target);
                }
            }
        }
    }
}

/**
 * Easing functions
 */
Tween.Easing = {
    Linear: (t) => t,
    
    QuadIn: (t) => t * t,
    QuadOut: (t) => t * (2 - t),
    QuadInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    CubicIn: (t) => t * t * t,
    CubicOut: (t) => (--t) * t * t + 1,
    CubicInOut: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    
    QuartIn: (t) => t * t * t * t,
    QuartOut: (t) => 1 - (--t) * t * t * t,
    QuartInOut: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    
    SineIn: (t) => 1 - Math.cos(t * Math.PI / 2),
    SineOut: (t) => Math.sin(t * Math.PI / 2),
    SineInOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    
    ElasticIn: (t) => {
        if (t === 0 || t === 1) return t;
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    ElasticOut: (t) => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    
    BounceOut: (t) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
};

/**
 * Tween Manager
 * @class TweenManager
 * @description Manages multiple tweens
 */
export class TweenManager {
    constructor() {
        this.tweens = [];
    }

    /**
     * Creates and adds a tween
     * @param {Object} target - Target object
     * @param {Object} to - Target properties
     * @param {number} duration - Duration
     * @param {Object} options - Options
     * @returns {Tween}
     */
    to(target, to, duration, options = {}) {
        const tween = new Tween(target, to, duration, options);
        this.tweens.push(tween);
        tween.start();
        return tween;
    }

    /**
     * Updates all tweens
     * @param {number} dt - Delta time
     */
    update(dt) {
        for (let i = this.tweens.length - 1; i >= 0; i--) {
            const tween = this.tweens[i];
            tween.update(dt);
            
            if (tween.isComplete) {
                this.tweens.splice(i, 1);
            }
        }
    }

    /**
     * Removes all tweens
     */
    clear() {
        this.tweens = [];
    }
}
