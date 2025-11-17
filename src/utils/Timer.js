/**
 * Timer Class
 * @class Timer
 * @description Manages timed events and callbacks
 */
export class Timer {
    /**
     * Creates a new Timer
     * @param {number} duration - Duration in seconds
     * @param {Function} callback - Callback function
     * @param {Object} options - Timer options
     */
    constructor(duration, callback, options = {}) {
        this.duration = duration;
        this.callback = callback;
        this.elapsed = 0;
        this.loop = options.loop || false;
        this.autoStart = options.autoStart !== false;
        this.isActive = this.autoStart;
        this.isComplete = false;
    }

    /**
     * Starts the timer
     */
    start() {
        this.isActive = true;
        this.elapsed = 0;
        this.isComplete = false;
    }

    /**
     * Stops the timer
     */
    stop() {
        this.isActive = false;
    }

    /**
     * Resets the timer
     */
    reset() {
        this.elapsed = 0;
        this.isComplete = false;
    }

    /**
     * Updates the timer
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (!this.isActive) return;

        this.elapsed += dt;

        if (this.elapsed >= this.duration) {
            if (this.callback) {
                this.callback();
            }

            if (this.loop) {
                this.elapsed -= this.duration;
            } else {
                this.isComplete = true;
                this.isActive = false;
            }
        }
    }

    /**
     * Gets remaining time
     * @returns {number}
     */
    getRemaining() {
        return Math.max(0, this.duration - this.elapsed);
    }

    /**
     * Gets progress (0-1)
     * @returns {number}
     */
    getProgress() {
        return Math.min(1, this.elapsed / this.duration);
    }
}

/**
 * Timer Manager
 * @class TimerManager
 * @description Manages multiple timers
 */
export class TimerManager {
    constructor() {
        this.timers = [];
    }

    /**
     * Creates and adds a timer
     * @param {number} duration - Duration in seconds
     * @param {Function} callback - Callback function
     * @param {Object} options - Timer options
     * @returns {Timer}
     */
    add(duration, callback, options = {}) {
        const timer = new Timer(duration, callback, options);
        this.timers.push(timer);
        return timer;
    }

    /**
     * Updates all timers
     * @param {number} dt - Delta time
     */
    update(dt) {
        for (let i = this.timers.length - 1; i >= 0; i--) {
            const timer = this.timers[i];
            timer.update(dt);

            if (timer.isComplete) {
                this.timers.splice(i, 1);
            }
        }
    }

    /**
     * Removes a timer
     * @param {Timer} timer - Timer to remove
     */
    remove(timer) {
        const index = this.timers.indexOf(timer);
        if (index !== -1) {
            this.timers.splice(index, 1);
        }
    }

    /**
     * Clears all timers
     */
    clear() {
        this.timers = [];
    }
}
