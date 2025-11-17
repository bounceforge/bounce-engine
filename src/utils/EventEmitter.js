/**
 * Event Emitter
 * @class EventEmitter
 * @description Simple event system for custom events
 */
export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribes to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        this.events.get(event).push(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribes to an event (fires once)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    /**
     * Unsubscribes from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        const callbacks = this.events.get(event);
        if (!callbacks) return;

        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Emits an event
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to callbacks
     */
    emit(event, ...args) {
        const callbacks = this.events.get(event);
        if (!callbacks) return;

        for (const callback of callbacks) {
            callback(...args);
        }
    }

    /**
     * Clears all event listeners
     */
    clear() {
        this.events.clear();
    }

    /**
     * Clears listeners for a specific event
     * @param {string} event - Event name
     */
    clearEvent(event) {
        this.events.delete(event);
    }
}
