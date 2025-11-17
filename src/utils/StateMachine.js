/**
 * State Machine
 * @class StateMachine
 * @description Manages state transitions
 */
export class StateMachine {
    /**
     * Creates a new StateMachine
     * @param {Object} initialState - Initial state
     */
    constructor(initialState = null) {
        this.states = new Map();
        this.currentState = null;
        this.previousState = null;
        
        if (initialState) {
            this.addState('initial', initialState);
            this.setState('initial');
        }
    }

    /**
     * Adds a state
     * @param {string} name - State name
     * @param {Object} state - State object with enter, update, exit methods
     */
    addState(name, state) {
        this.states.set(name, state);
    }

    /**
     * Sets the current state
     * @param {string} name - State name
     * @param {...any} args - Arguments to pass to enter method
     */
    setState(name, ...args) {
        const newState = this.states.get(name);
        if (!newState) {
            console.error(`State "${name}" not found`);
            return;
        }

        // Exit current state
        if (this.currentState && this.currentState.exit) {
            this.currentState.exit();
        }

        this.previousState = this.currentState;
        this.currentState = newState;
        this.currentStateName = name;

        // Enter new state
        if (this.currentState.enter) {
            this.currentState.enter(...args);
        }
    }

    /**
     * Updates the current state
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(dt);
        }
    }

    /**
     * Gets the current state name
     * @returns {string}
     */
    getCurrentStateName() {
        return this.currentStateName;
    }

    /**
     * Checks if in a specific state
     * @param {string} name - State name
     * @returns {boolean}
     */
    isInState(name) {
        return this.currentStateName === name;
    }
}
