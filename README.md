# Bounce Engine (be) 🎮

A lightweight, powerful, pure JavaScript 2D game engine for building platformers, top-down games, and more!

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

## 🚀 Features

- **Pure JavaScript** - No dependencies, just vanilla JS
- **Component-Based Architecture** - Flexible and modular design
- **Physics Engine** - Built-in collision detection and rigid body physics
- **Rich Rendering** - Sprites, text, particles, and tilemaps
- **Input System** - Keyboard, mouse, touch, and gamepad support
- **Audio Manager** - Music and sound effects with spatial audio
- **Animation System** - Sprite animations and tweening
- **Particle System** - Customizable particle effects
- **Tilemap Support** - Perfect for top-down and platformer games
- **UI System** - Buttons, panels, and custom UI elements
- **Platformer & Top-Down Controllers** - Pre-built player controllers
- **Debug Tools** - Built-in debugging utilities

## 📄 License

Bounce Engine is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

This means you can:
- ✅ Use the engine for personal and commercial projects
- ✅ Modify and distribute the source code
- ✅ Create games and applications with it

You must:
- 📋 Include the license and copyright notice
- 📋 State changes made to the source code
- 📋 Disclose source code when distributing
- 📋 License derivative works under GPL v3

For more information, visit: https://www.gnu.org/licenses/gpl-3.0.en.html

## 📦 Installation

### Option 1: Direct Download
Download the `src` folder and include it in your project:

```html
<script type="module" src="path/to/bounce-engine/src/index.js"></script>
```

### Option 2: ES6 Modules
```javascript
import be from './bounce-engine/src/index.js';
```

## 🎯 Quick Start

### Basic Setup

```javascript
import { Engine, Scene, GameObject, SpriteRenderer, BoxCollider, RigidBody } from './src/index.js';

// Create engine
const engine = new Engine({
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e'
});

// Create a scene
const gameScene = new Scene('game');

// Create a player
const player = new GameObject(400, 300);
player.addComponent(new SpriteRenderer({
    width: 32,
    height: 32,
    color: '#0f3460'
}));
player.addComponent(new BoxCollider(32, 32));
player.addComponent(new RigidBody());

gameScene.add(player);

// Add scene to engine and start
engine.addScene('game', gameScene);
engine.setScene('game');
engine.start();
```

## 🎮 Creating a Platformer

```javascript
import { 
    Engine, Scene, GameObject, Camera,
    SpriteRenderer, BoxCollider, RigidBody, 
    PlatformerController, Physics, Input 
} from './src/index.js';

// Setup engine
const engine = new Engine({ width: 800, height: 600 });
const scene = new Scene('platformer');

// Add physics and input
scene.physics = new Physics(scene);
scene.input = new Input(engine.canvas);

// Create camera
const camera = new Camera(0, 0, 800, 600);
camera.follow(player, 0.1);
scene.camera = camera;

// Create player
const player = new GameObject(100, 100);
player.addComponent(new SpriteRenderer({
    width: 32,
    height: 48,
    color: '#ff6b6b'
}));
player.addComponent(new BoxCollider(32, 48));
const rb = player.addComponent(new RigidBody({
    mass: 1,
    gravityScale: 1
}));
player.addComponent(new PlatformerController({
    moveSpeed: 200,
    jumpForce: 400,
    canDoubleJump: true,
    canWallJump: true
}));

scene.add(player);

// Create ground
const ground = new GameObject(400, 550);
ground.addComponent(new SpriteRenderer({
    width: 800,
    height: 100,
    color: '#2d4a2e'
}));
const groundCollider = ground.addComponent(new BoxCollider(800, 100));
scene.physics.addCollider(groundCollider);

scene.add(ground);

// Update physics
const originalUpdate = scene.update.bind(scene);
scene.update = function(dt) {
    scene.input.update(camera);
    scene.physics.detectCollisions();
    
    // Reset grounded state
    rb.isGrounded = false;
    rb.isTouchingWall = false;
    
    originalUpdate(dt);
};

engine.addScene('platformer', scene);
engine.setScene('platformer');
engine.start();
```

## 🗺️ Creating a Top-Down Game

```javascript
import { 
    Engine, Scene, GameObject, Camera,
    SpriteRenderer, BoxCollider, RigidBody,
    TopDownController, Tilemap, Input, Physics
} from './src/index.js';

// Setup
const engine = new Engine({ width: 800, height: 600 });
const scene = new Scene('topdown');

scene.physics = new Physics(scene);
scene.input = new Input(engine.canvas);

// Create player
const player = new GameObject(400, 300);
player.addComponent(new SpriteRenderer({
    width: 32,
    height: 32,
    color: '#4ecdc4'
}));
player.addComponent(new BoxCollider(32, 32));
player.addComponent(new RigidBody({
    useGravity: false
}));
player.addComponent(new TopDownController({
    moveSpeed: 200,
    canDash: true
}));

scene.add(player);

// Create camera that follows player
const camera = new Camera(0, 0, 800, 600);
camera.follow(player, 0.1);
scene.camera = camera;

// Update
const originalUpdate = scene.update.bind(scene);
scene.update = function(dt) {
    scene.input.update(camera);
    camera.update(dt);
    originalUpdate(dt);
};

engine.addScene('topdown', scene);
engine.setScene('topdown');
engine.start();
```

## 📚 Core Concepts

### Engine
The main game engine that manages the game loop and scenes.

```javascript
const engine = new Engine({
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    antialias: true,
    targetFPS: 60
});
```

### Scene
A container for game objects. Games can have multiple scenes.

```javascript
const scene = new Scene('myScene');
scene.onEnter = () => console.log('Scene started!');
scene.onExit = () => console.log('Scene ended!');
```

### GameObject
Basic entity in the game world. Can have components attached.

```javascript
const obj = new GameObject(x, y);
obj.rotation = Math.PI / 4; // 45 degrees
obj.scaleX = 2;
obj.scaleY = 2;
```

### Components
Add functionality to game objects:

- **SpriteRenderer** - Renders sprites or colored rectangles
- **TextRenderer** - Renders text
- **RigidBody** - Adds physics properties
- **BoxCollider** / **CircleCollider** - Collision detection
- **Animator** - Sprite animations
- **ParticleEmitter** - Particle effects
- **Tilemap** - Tile-based maps
- **PlatformerController** - Platformer movement
- **TopDownController** - Top-down movement

## 🎨 Rendering

### Sprites
```javascript
const sprite = new SpriteRenderer({
    image: myImage,
    width: 64,
    height: 64,
    offset: { x: -32, y: -32 },
    flipX: false,
    flipY: false
});
```

### Text
```javascript
const text = new TextRenderer('Hello World!', {
    font: '24px Arial',
    color: '#ffffff',
    align: 'center',
    baseline: 'middle'
});
```

### Particles
```javascript
const emitter = new ParticleEmitter({
    emissionRate: 50,
    particleLifetime: 2,
    startVelocity: { x: 0, y: -100 },
    startColor: '#ff0000',
    endColor: '#ffff00',
    startSize: 8,
    endSize: 0
});
```

## 🔊 Audio

```javascript
import { Audio } from './src/index.js';

const audio = new Audio();
audio.init(); // Must be called after user interaction

// Load sounds
await audio.loadSound('jump', './sounds/jump.mp3');
await audio.loadSound('music', './music/theme.mp3');

// Play sound effect
audio.playSound('jump', { volume: 0.5, pitch: 1.2 });

// Play music
audio.playMusic('music', { volume: 0.3 });

// Control volumes
audio.setMasterVolume(0.8);
audio.setMusicVolume(0.5);
audio.setSfxVolume(1.0);
```

## 🎯 Input

```javascript
import { Input } from './src/index.js';

const input = new Input(canvas);

// In your update loop:
input.update(camera);

// Keyboard
if (input.isKeyDown('Space')) console.log('Space held');
if (input.isKeyPressed('Space')) console.log('Space just pressed');
if (input.isKeyReleased('Space')) console.log('Space just released');

// Mouse
if (input.isMouseButtonPressed(0)) {
    console.log('Clicked at', input.mouse.x, input.mouse.y);
    console.log('World pos', input.mouse.worldX, input.mouse.worldY);
}

// Gamepad
if (input.isGamepadButtonDown(0)) console.log('Button A pressed');
const axisX = input.getGamepadAxis(0);

// Input mapping
input.mapAction('jump', {
    keys: ['Space', 'KeyW'],
    gamepadButtons: [0]
});

if (input.isActionPressed('jump')) console.log('Jump!');
```

## 🔧 Physics

```javascript
import { Physics, RigidBody, BoxCollider } from './src/index.js';

// Create physics system
const physics = new Physics(scene);
physics.gravity = 980; // pixels per second squared

// Add rigidbody
const rb = new RigidBody({
    mass: 1,
    drag: 0.01,
    gravityScale: 1,
    useGravity: true
});

// Add forces
rb.addForce(100, 0); // Add continuous force
rb.addImpulse(0, -500); // Add instant impulse (jump)
rb.setVelocity(200, 0); // Set velocity directly

// Collision detection
const collider = new BoxCollider(32, 32);
collider.onCollisionEnter = (other) => {
    console.log('Collision started with', other);
};

physics.addCollider(collider);
physics.detectCollisions(); // Call each frame
```

## 🎬 Animation

### Sprite Animation
```javascript
import { Animator } from './src/index.js';

const animator = new Animator(spriteRenderer);

// Add animation
animator.addAnimation('walk', {
    frames: [
        { x: 0, y: 0, width: 32, height: 32 },
        { x: 32, y: 0, width: 32, height: 32 },
        { x: 64, y: 0, width: 32, height: 32 },
    ],
    frameRate: 10,
    loop: true
});

animator.play('walk');
```

### Tweening
```javascript
import { TweenManager, Tween } from './src/index.js';

const tweens = new TweenManager();

// Tween object properties
tweens.to(player, { x: 500, y: 300 }, 2, {
    easing: Tween.Easing.QuadInOut,
    onComplete: () => console.log('Done!')
});

// In update loop
tweens.update(dt);
```

## 🗺️ Tilemaps

```javascript
import { Tilemap } from './src/index.js';

const tilemap = new Tilemap({
    tileWidth: 32,
    tileHeight: 32,
    tileset: tilesetImage,
    tilesetColumns: 10,
    layers: [
        [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ]
    ],
    collisionLayer: 0
});

// Check collision
const tilePos = tilemap.worldToTile(playerX, playerY);
if (tilemap.isTileSolid(tilePos.x, tilePos.y)) {
    console.log('Player is on solid tile');
}
```

## 🎨 UI System

```javascript
import { UIManager, Button, Panel } from './src/index.js';

const uiManager = new UIManager(input);

// Create button
const startButton = new Button(300, 250, 200, 50, 'Start Game', {
    backgroundColor: '#4CAF50',
    hoverColor: '#45a049',
    fontSize: 20
});

startButton.onClick = () => {
    console.log('Game started!');
};

uiManager.add(startButton);

// In update loop
uiManager.update(dt);

// In render (after scene render)
uiManager.render(ctx);
```

## 🛠️ Utilities

### Vector2
```javascript
import { Vector2 } from './src/index.js';

const v1 = new Vector2(10, 20);
const v2 = new Vector2(5, 10);

const sum = v1.add(v2);
const magnitude = v1.magnitude();
const normalized = v1.normalize();
const distance = v1.distanceTo(v2);
```

### Math Utilities
```javascript
import { MathUtils } from './src/index.js';

const clamped = MathUtils.clamp(value, 0, 100);
const lerped = MathUtils.lerp(0, 100, 0.5);
const random = MathUtils.randomInt(1, 10);
const radians = MathUtils.degToRad(90);
```

### Event System
```javascript
import { EventEmitter } from './src/index.js';

const events = new EventEmitter();

// Subscribe
events.on('playerDeath', (player) => {
    console.log('Player died!', player);
});

// Emit
events.emit('playerDeath', playerObject);
```

### State Machine
```javascript
import { StateMachine } from './src/index.js';

const fsm = new StateMachine();

fsm.addState('idle', {
    enter: () => console.log('Entering idle'),
    update: (dt) => { /* idle logic */ },
    exit: () => console.log('Exiting idle')
});

fsm.addState('running', {
    enter: () => console.log('Start running'),
    update: (dt) => { /* running logic */ }
});

fsm.setState('idle');
fsm.update(dt);
```

### Timer
```javascript
import { TimerManager } from './src/index.js';

const timers = new TimerManager();

// Create timer
timers.add(3, () => {
    console.log('3 seconds elapsed!');
}, { loop: false });

// In update loop
timers.update(dt);
```

## 🐛 Debugging

```javascript
import { Debug } from './src/index.js';

// Enable debug mode
Debug.enabled = true;

// Draw debug shapes
Debug.drawRect(ctx, x, y, width, height, '#00ff00');
Debug.drawCircle(ctx, x, y, radius, '#ff0000');
Debug.drawLine(ctx, x1, y1, x2, y2);
Debug.drawText(ctx, 'Debug Info', x, y);

// Draw collider bounds
Debug.drawCollider(ctx, collider);

// Performance timing
Debug.time('heavyOperation');
// ... code ...
Debug.timeEnd('heavyOperation');
```

## 📖 Asset Loading

```javascript
import { AssetLoader } from './src/index.js';

const loader = new AssetLoader();

// Queue assets
loader.addImage('player', './images/player.png');
loader.addImage('tileset', './images/tileset.png');
loader.addAudio('jump', './sounds/jump.mp3');
loader.addJSON('level1', './levels/level1.json');

// Progress callback
loader.onProgress = (progress, loaded, total) => {
    console.log(`Loading: ${Math.floor(progress * 100)}%`);
};

// Load all assets
await loader.load();

// Get assets
const playerImg = loader.get('player');
const levelData = loader.get('level1');
```

## 🎓 Examples

Check out the `examples/` folder for complete working examples:
- `platformer.html` - Full platformer game
- `topdown.html` - Top-down adventure game
- `particles.html` - Particle effects demo
- `physics.html` - Physics sandbox

## 📄 API Reference

### Engine Methods
- `start()` - Starts the game loop
- `stop()` - Stops the game loop
- `pause()` / `resume()` - Pauses/resumes the game
- `addScene(name, scene)` - Adds a scene
- `setScene(name)` - Switches to a scene
- `resize(width, height)` - Resizes the canvas

### Scene Methods
- `add(gameObject)` - Adds a game object
- `remove(gameObject)` - Removes a game object
- `findByName(name)` - Finds object by name
- `findByTag(tag)` - Finds objects by tag
- `clear()` - Removes all objects

### GameObject Methods
- `addComponent(component)` - Adds a component
- `getComponent(ComponentClass)` - Gets a component
- `removeComponent(component)` - Removes a component
- `addChild(child)` - Adds a child object
- `destroy()` - Destroys the object

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

When contributing, please ensure your code is licensed under GNU GPL v3 and follows the project's coding standards.

## 📜 License

Bounce Engine is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [LICENSE](LICENSE) file for more details.

## 🙏 Credits

Created with ❤️ for game developers who love pure JavaScript.

## 🔗 Links

- [Documentation](./docs/API.md)
- [Examples](./examples/)
- [GitHub Repository](https://github.com/bounceforge/bounce-engine)

---

Happy game development! 🎮✨
