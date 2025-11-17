/**
 * Input Manager
 * @class Input
 * @description Manages keyboard, mouse, touch, and gamepad input
 */
export class Input {
    constructor(canvas) {
        this.canvas = canvas;
        
        // Keyboard
        this.keys = new Map();
        this.keysDown = new Set();
        this.keysUp = new Set();
        
        // Mouse
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            buttons: new Map(),
            buttonsDown: new Set(),
            buttonsUp: new Set(),
            wheel: 0
        };
        
        // Touch
        this.touches = [];
        this.touchStart = [];
        this.touchEnd = [];
        
        // Gamepad
        this.gamepads = [];
        
        // Input mapping
        this.actions = new Map();
        
        this._setupEventListeners();
    }

    /**
     * Sets up event listeners
     * @private
     */
    _setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            if (!this.keys.has(e.code)) {
                this.keysDown.add(e.code);
            }
            this.keys.set(e.code, true);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            this.keysUp.add(e.code);
        });

        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.mouse.buttons.has(e.button)) {
                this.mouse.buttonsDown.add(e.button);
            }
            this.mouse.buttons.set(e.button, true);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.buttons.set(e.button, false);
            this.mouse.buttonsUp.add(e.button);
        });

        this.canvas.addEventListener('wheel', (e) => {
            this.mouse.wheel = e.deltaY;
            e.preventDefault();
        });

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchStart = Array.from(e.touches).map(t => ({
                id: t.identifier,
                x: t.clientX - this.canvas.getBoundingClientRect().left,
                y: t.clientY - this.canvas.getBoundingClientRect().top
            }));
            this.updateTouches(e.touches);
            e.preventDefault();
        });

        this.canvas.addEventListener('touchmove', (e) => {
            this.updateTouches(e.touches);
            e.preventDefault();
        });

        this.canvas.addEventListener('touchend', (e) => {
            this.touchEnd = this.touches.filter(t => 
                !Array.from(e.touches).some(et => et.identifier === t.id)
            );
            this.updateTouches(e.touches);
            e.preventDefault();
        });

        // Gamepad events
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad.id);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected:', e.gamepad.id);
        });
    }

    /**
     * Updates touch list
     * @private
     */
    updateTouches(touches) {
        const rect = this.canvas.getBoundingClientRect();
        this.touches = Array.from(touches).map(t => ({
            id: t.identifier,
            x: t.clientX - rect.left,
            y: t.clientY - rect.top
        }));
    }

    /**
     * Updates input state (call once per frame)
     * @param {Camera} camera - Camera for world coordinates
     */
    update(camera = null) {
        // Clear frame-specific input
        this.keysDown.clear();
        this.keysUp.clear();
        this.mouse.buttonsDown.clear();
        this.mouse.buttonsUp.clear();
        this.mouse.wheel = 0;
        this.touchStart = [];
        this.touchEnd = [];

        // Update mouse world position
        if (camera) {
            const world = camera.screenToWorld(this.mouse.x, this.mouse.y);
            this.mouse.worldX = world.x;
            this.mouse.worldY = world.y;
        }

        // Update gamepads
        this.gamepads = Array.from(navigator.getGamepads()).filter(gp => gp !== null);
    }

    /**
     * Checks if a key is currently pressed
     * @param {string} keyCode - Key code (e.g., 'KeyW', 'Space')
     * @returns {boolean}
     */
    isKeyDown(keyCode) {
        return this.keys.get(keyCode) || false;
    }

    /**
     * Checks if a key was just pressed this frame
     * @param {string} keyCode - Key code
     * @returns {boolean}
     */
    isKeyPressed(keyCode) {
        return this.keysDown.has(keyCode);
    }

    /**
     * Checks if a key was just released this frame
     * @param {string} keyCode - Key code
     * @returns {boolean}
     */
    isKeyReleased(keyCode) {
        return this.keysUp.has(keyCode);
    }

    /**
     * Checks if a mouse button is currently pressed
     * @param {number} button - Button number (0=left, 1=middle, 2=right)
     * @returns {boolean}
     */
    isMouseButtonDown(button = 0) {
        return this.mouse.buttons.get(button) || false;
    }

    /**
     * Checks if a mouse button was just pressed this frame
     * @param {number} button - Button number
     * @returns {boolean}
     */
    isMouseButtonPressed(button = 0) {
        return this.mouse.buttonsDown.has(button);
    }

    /**
     * Checks if a mouse button was just released this frame
     * @param {number} button - Button number
     * @returns {boolean}
     */
    isMouseButtonReleased(button = 0) {
        return this.mouse.buttonsUp.has(button);
    }

    /**
     * Gets gamepad by index
     * @param {number} index - Gamepad index
     * @returns {Gamepad|null}
     */
    getGamepad(index = 0) {
        return this.gamepads[index] || null;
    }

    /**
     * Checks if gamepad button is pressed
     * @param {number} button - Button index
     * @param {number} gamepadIndex - Gamepad index
     * @returns {boolean}
     */
    isGamepadButtonDown(button, gamepadIndex = 0) {
        const gamepad = this.getGamepad(gamepadIndex);
        return gamepad ? gamepad.buttons[button]?.pressed || false : false;
    }

    /**
     * Gets gamepad axis value
     * @param {number} axis - Axis index
     * @param {number} gamepadIndex - Gamepad index
     * @returns {number}
     */
    getGamepadAxis(axis, gamepadIndex = 0) {
        const gamepad = this.getGamepad(gamepadIndex);
        return gamepad ? gamepad.axes[axis] || 0 : 0;
    }

    /**
     * Maps an action to input keys/buttons
     * @param {string} actionName - Action name
     * @param {Object} mapping - Input mapping
     */
    mapAction(actionName, mapping) {
        this.actions.set(actionName, mapping);
    }

    /**
     * Checks if an action is active
     * @param {string} actionName - Action name
     * @returns {boolean}
     */
    isActionDown(actionName) {
        const mapping = this.actions.get(actionName);
        if (!mapping) return false;

        if (mapping.keys) {
            for (const key of mapping.keys) {
                if (this.isKeyDown(key)) return true;
            }
        }

        if (mapping.mouseButtons) {
            for (const button of mapping.mouseButtons) {
                if (this.isMouseButtonDown(button)) return true;
            }
        }

        if (mapping.gamepadButtons !== undefined) {
            for (const button of mapping.gamepadButtons) {
                if (this.isGamepadButtonDown(button)) return true;
            }
        }

        return false;
    }

    /**
     * Checks if an action was just pressed
     * @param {string} actionName - Action name
     * @returns {boolean}
     */
    isActionPressed(actionName) {
        const mapping = this.actions.get(actionName);
        if (!mapping) return false;

        if (mapping.keys) {
            for (const key of mapping.keys) {
                if (this.isKeyPressed(key)) return true;
            }
        }

        if (mapping.mouseButtons) {
            for (const button of mapping.mouseButtons) {
                if (this.isMouseButtonPressed(button)) return true;
            }
        }

        return false;
    }

    /**
     * Gets axis value for an action
     * @param {string} actionName - Action name
     * @returns {number}
     */
    getAxis(actionName) {
        const mapping = this.actions.get(actionName);
        if (!mapping) return 0;

        let value = 0;

        if (mapping.positive) {
            for (const key of mapping.positive) {
                if (this.isKeyDown(key)) value += 1;
            }
        }

        if (mapping.negative) {
            for (const key of mapping.negative) {
                if (this.isKeyDown(key)) value -= 1;
            }
        }

        if (mapping.gamepadAxis !== undefined) {
            value += this.getGamepadAxis(mapping.gamepadAxis);
        }

        return Math.max(-1, Math.min(1, value));
    }
}
