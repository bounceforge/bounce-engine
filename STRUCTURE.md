# Bounce Engine - Project Structure

## Directory Layout

```
bounce-engine/
├── src/                          # Source code
│   ├── index.js                  # Main entry point
│   ├── core/                     # Core engine components
│   │   ├── Engine.js             # Game engine & loop
│   │   ├── Scene.js              # Scene management
│   │   ├── GameObject.js         # Base game object
│   │   └── Component.js          # Component base class
│   ├── rendering/                # Rendering system
│   │   ├── Camera.js             # Camera & viewport
│   │   ├── SpriteRenderer.js     # Sprite rendering
│   │   └── TextRenderer.js       # Text rendering
│   ├── physics/                  # Physics engine
│   │   ├── Physics.js            # Physics system
│   │   ├── RigidBody.js          # Rigid body dynamics
│   │   └── Collider.js           # Collision detection
│   ├── input/                    # Input system
│   │   └── Input.js              # Keyboard, mouse, touch, gamepad
│   ├── audio/                    # Audio system
│   │   └── Audio.js              # Sound & music manager
│   ├── animation/                # Animation system
│   │   ├── Animator.js           # Sprite animations
│   │   └── Tween.js              # Tweening & easing
│   ├── particles/                # Particle system
│   │   └── ParticleEmitter.js    # Particle effects
│   ├── tilemap/                  # Tilemap system
│   │   └── Tilemap.js            # Tile-based maps
│   ├── ui/                       # UI system
│   │   └── UI.js                 # Buttons, panels, UI manager
│   ├── assets/                   # Asset management
│   │   └── AssetLoader.js        # Asset loading & caching
│   ├── utils/                    # Utilities
│   │   ├── Math.js               # Math utilities & Vector2
│   │   ├── Timer.js              # Timer system
│   │   ├── EventEmitter.js       # Event system
│   │   ├── StateMachine.js       # State machine
│   │   └── Debug.js              # Debug tools
│   └── prefabs/                  # Pre-built components
│       ├── PlatformerController.js  # Platformer movement
│       └── TopDownController.js     # Top-down movement
├── examples/                     # Example games
│   ├── index.html                # Examples homepage
│   ├── platformer.html           # Platformer demo
│   ├── topdown.html              # Top-down demo
│   └── particles.html            # Particle effects demo
├── docs/                         # Documentation
│   ├── API.md                    # API reference
│   └── GETTING_STARTED.md        # Tutorial
├── test.html                     # Quick test file
├── package.json                  # Package metadata
├── README.md                     # Main documentation
└── LICENSE                       # MIT License
```

## Core Systems

### 1. **Core** (`src/core/`)
- **Engine**: Main game loop, scene management, FPS control
- **Scene**: Container for game objects, lifecycle management
- **GameObject**: Base entity class, transform, hierarchy
- **Component**: Base class for all components

### 2. **Rendering** (`src/rendering/`)
- **Camera**: Viewport control, following, shake effects, coordinate conversion
- **SpriteRenderer**: Renders sprites and colored rectangles, sprite sheets
- **TextRenderer**: Text rendering with fonts and styles

### 3. **Physics** (`src/physics/`)
- **Physics**: Collision detection, raycast, gravity simulation
- **RigidBody**: Velocity, forces, mass, drag
- **Collider**: BoxCollider, CircleCollider, trigger support

### 4. **Input** (`src/input/`)
- **Input**: Keyboard, mouse, touch, gamepad support
- Action mapping for easier control configuration

### 5. **Audio** (`src/audio/`)
- **Audio**: Sound effects, music, volume control
- Web Audio API integration
- Spatial audio support

### 6. **Animation** (`src/animation/`)
- **Animator**: Frame-based sprite animations
- **Tween**: Property tweening with easing functions
- **TweenManager**: Managing multiple tweens

### 7. **Particles** (`src/particles/`)
- **ParticleEmitter**: Configurable particle systems
- Fire, smoke, explosions, and custom effects

### 8. **Tilemap** (`src/tilemap/`)
- **Tilemap**: Tile-based map rendering and collision
- Perfect for top-down and platformer games

### 9. **UI** (`src/ui/`)
- **UIManager**: UI system management
- **Button**: Interactive buttons
- **Panel**: Container panels
- **UIElement**: Base UI class

### 10. **Assets** (`src/assets/`)
- **AssetLoader**: Load images, audio, JSON, text
- Progress tracking, async loading

### 11. **Utils** (`src/utils/`)
- **Vector2**: 2D vector math
- **MathUtils**: Math helpers (lerp, clamp, random, etc.)
- **Timer**: Timed events and callbacks
- **EventEmitter**: Custom event system
- **StateMachine**: Finite state machine
- **Debug**: Debug rendering and logging

### 12. **Prefabs** (`src/prefabs/`)
- **PlatformerController**: Complete platformer movement
  - Jump, double jump, wall jump
  - Coyote time, jump buffering
  - Air control
- **TopDownController**: Complete top-down movement
  - 8-directional or 4-directional
  - Dash ability
  - Rotation options

## Key Features

### Component System
```javascript
// Add components to game objects
const player = new GameObject(x, y);
player.addComponent(new SpriteRenderer({...}));
player.addComponent(new BoxCollider(32, 32));
player.addComponent(new RigidBody());
player.addComponent(new PlatformerController());
```

### Scene Management
```javascript
// Create multiple scenes
const menuScene = new Scene('menu');
const gameScene = new Scene('game');

engine.addScene('menu', menuScene);
engine.addScene('game', gameScene);
engine.setScene('game');
```

### Physics Simulation
```javascript
// Automatic physics with collisions
scene.physics = new Physics(scene);
scene.physics.detectCollisions();

// Apply forces
rigidbody.addForce(100, 0);
rigidbody.addImpulse(0, -500);
```

### Input Handling
```javascript
scene.input = new Input(canvas);

// Check input
if (input.isKeyPressed('Space')) jump();
if (input.isMouseButtonDown(0)) shoot();

// Map actions
input.mapAction('jump', {
    keys: ['Space', 'KeyW'],
    gamepadButtons: [0]
});
```

## Example Usage

### Minimal Setup
```javascript
import be from './bounce-engine/src/index.js';

const engine = be.create({ width: 800, height: 600 });
const scene = be.scene('main');
const player = be.gameObject(400, 300);

scene.add(player);
engine.addScene('main', scene);
engine.setScene('main');
engine.start();
```

### Full Game Setup
See `examples/platformer.html` for a complete working example!

## Performance

- **60 FPS** target with delta time
- **Fixed timestep** for physics (60Hz)
- **Variable timestep** for rendering
- **Efficient collision detection** with spatial awareness
- **Object pooling** recommended for particles

## Browser Support

- Modern browsers with ES6 module support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires Canvas API and Web Audio API

## Development

### Running Examples
```bash
# Start local server
npm run serve
# or
python3 -m http.server 8000

# Open browser to http://localhost:8000/examples/
```

### Testing
Open `test.html` for a quick functionality test.

## Next Steps

1. Check out the [Getting Started Guide](docs/GETTING_STARTED.md)
2. Explore the [API Documentation](docs/API.md)
3. Run the [Examples](examples/)
4. Build your own game!

## Architecture Highlights

- **ECS-like pattern**: Entities (GameObjects) + Components
- **Scene graph**: Parent-child hierarchies
- **Event-driven**: Custom events via EventEmitter
- **Modular**: Use only what you need
- **Extensible**: Easy to create custom components

---

**Created with ❤️ for game developers**

Version 1.0.0 - MIT License
