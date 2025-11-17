/**
 * Vector2 Class
 * @class Vector2
 * @description 2D vector math utilities
 */
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds another vector
     * @param {Vector2} v - Vector to add
     * @returns {Vector2}
     */
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    /**
     * Subtracts another vector
     * @param {Vector2} v - Vector to subtract
     * @returns {Vector2}
     */
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    /**
     * Multiplies by scalar
     * @param {number} scalar - Scalar value
     * @returns {Vector2}
     */
    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /**
     * Divides by scalar
     * @param {number} scalar - Scalar value
     * @returns {Vector2}
     */
    divide(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    /**
     * Gets the magnitude (length)
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Gets the normalized vector
     * @returns {Vector2}
     */
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return this.divide(mag);
    }

    /**
     * Gets the dot product
     * @param {Vector2} v - Other vector
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Gets the distance to another vector
     * @param {Vector2} v - Other vector
     * @returns {number}
     */
    distanceTo(v) {
        const dx = v.x - this.x;
        const dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Gets the angle in radians
     * @returns {number}
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Rotates the vector
     * @param {number} angle - Angle in radians
     * @returns {Vector2}
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Clones the vector
     * @returns {Vector2}
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    /**
     * Linear interpolation
     * @param {Vector2} v - Target vector
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Vector2}
     */
    lerp(v, t) {
        return new Vector2(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t
        );
    }

    /**
     * Creates a vector from angle
     * @param {number} angle - Angle in radians
     * @returns {Vector2}
     */
    static fromAngle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    /**
     * Zero vector
     * @returns {Vector2}
     */
    static zero() {
        return new Vector2(0, 0);
    }

    /**
     * One vector
     * @returns {Vector2}
     */
    static one() {
        return new Vector2(1, 1);
    }
}

/**
 * Math utilities
 * @namespace MathUtils
 */
export const MathUtils = {
    /**
     * Clamps a value between min and max
     */
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

    /**
     * Linear interpolation
     */
    lerp: (start, end, t) => start + (end - start) * t,

    /**
     * Maps a value from one range to another
     */
    map: (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Converts degrees to radians
     */
    degToRad: (degrees) => degrees * (Math.PI / 180),

    /**
     * Converts radians to degrees
     */
    radToDeg: (radians) => radians * (180 / Math.PI),

    /**
     * Random integer between min and max (inclusive)
     */
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    /**
     * Random float between min and max
     */
    randomFloat: (min, max) => Math.random() * (max - min) + min,

    /**
     * Random boolean
     */
    randomBool: () => Math.random() < 0.5,

    /**
     * Checks if value is approximately equal
     */
    approximately: (a, b, epsilon = 0.0001) => Math.abs(a - b) < epsilon,

    /**
     * Wraps value between 0 and max
     */
    wrap: (value, max) => ((value % max) + max) % max,

    /**
     * Smoothstep interpolation
     */
    smoothstep: (edge0, edge1, x) => {
        const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }
};
