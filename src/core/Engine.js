/**
 * Bounce Engine (be) - Main Engine Class
 * @class Engine
 * @description Core game engine that manages the game loop, scenes, and all subsystems
 */
export class Engine {
    /**
     * Creates a new Engine instance
     * @param {Object} config - Engine configuration
     * @param {number} config.width - Canvas width
     * @param {number} config.height - Canvas height
     * @param {HTMLElement} config.parent - Parent element for canvas (default: document.body)
     * @param {string} config.backgroundColor - Background color (default: '#000000')
     * @param {boolean} config.antialias - Enable antialiasing (default: true)
     * @param {number} config.targetFPS - Target frames per second (default: 60)
     */
    constructor(config = {}) {
        this.config = {
            width: config.width || 800,
            height: config.height || 600,
            parent: config.parent || document.body,
            backgroundColor: config.backgroundColor || '#000000',
            antialias: config.antialias !== false,
            targetFPS: config.targetFPS || 60
        };

        // Core state
        this.isRunning = false;
        this.isPaused = false;
        this.currentScene = null;
        this.scenes = new Map();
        
        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fixedDeltaTime = 1 / 60; // 60 FPS for physics
        this.accumulator = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.ctx = this.canvas.getContext('2d', {
            alpha: false,
            antialias: this.config.antialias
        });
        this.config.parent.appendChild(this.canvas);
        
        // Animation frame ID
        this.animationFrameId = null;
    }

    /**
     * Adds a scene to the engine
     * @param {string} name - Scene name
     * @param {Scene} scene - Scene instance
     */
    addScene(name, scene) {
        scene.engine = this;
        this.scenes.set(name, scene);
    }

    /**
     * Switches to a different scene
     * @param {string} name - Scene name
     */
    setScene(name) {
        const scene = this.scenes.get(name);
        if (!scene) {
            console.error(`Scene "${name}" not found`);
            return;
        }

        if (this.currentScene) {
            this.currentScene.onExit();
        }

        this.currentScene = scene;
        this.currentScene.onEnter();
    }

    /**
     * Starts the game engine
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    /**
     * Stops the game engine
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Pauses the game engine
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resumes the game engine
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Main game loop
     * @private
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));

        // Calculate delta time (in seconds)
        this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        // Calculate FPS
        this.frameCount++;
        this.fpsTime += this.deltaTime;
        if (this.fpsTime >= 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = 0;
        }

        if (!this.isPaused && this.currentScene) {
            // Fixed timestep for physics
            this.accumulator += this.deltaTime;
            while (this.accumulator >= this.fixedDeltaTime) {
                this.currentScene.fixedUpdate(this.fixedDeltaTime);
                this.accumulator -= this.fixedDeltaTime;
            }

            // Variable timestep for game logic and rendering
            this.currentScene.update(this.deltaTime);
        }

        // Render
        this.render();
    }

    /**
     * Renders the current scene
     * @private
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentScene) {
            this.currentScene.render(this.ctx);
        }
    }

    /**
     * Resizes the canvas
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.config.width = width;
        this.config.height = height;
    }

    /**
     * Destroys the engine and cleans up resources
     */
    destroy() {
        this.stop();
        
        if (this.currentScene) {
            this.currentScene.onExit();
        }
        
        this.scenes.clear();
        this.canvas.remove();
    }
}
