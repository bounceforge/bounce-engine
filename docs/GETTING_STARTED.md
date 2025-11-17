# Getting Started with Bounce Engine

This guide will help you create your first game with Bounce Engine!

## Prerequisites

- Basic knowledge of JavaScript
- A modern web browser
- A text editor or IDE
- A local web server (or use the built-in one)

## Step 1: Setup

Create a new HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Game</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a2e;
        }
    </style>
</head>
<body>
    <script type="module" src="game.js"></script>
</body>
</html>
```

## Step 2: Create Your First Scene

Create `game.js`:

```javascript
import { Engine, Scene, GameObject, SpriteRenderer } from './bounce-engine/src/index.js';

// Create the engine
const engine = new Engine({
    width: 800,
    height: 600,
    backgroundColor: '#2d3561'
});

// Create a scene
const scene = new Scene('main');

// Create a player
const player = new GameObject(400, 300);
player.addComponent(new SpriteRenderer({
    width: 50,
    height: 50,
    color: '#ff6b6b'
}));

scene.add(player);

// Start the game
engine.addScene('main', scene);
engine.setScene('main');
engine.start();
```

## Step 3: Add Movement

Let's make the player move with keyboard input:

```javascript
import { Engine, Scene, GameObject, SpriteRenderer, Input } from './bounce-engine/src/index.js';

const engine = new Engine({ width: 800, height: 600 });
const scene = new Scene('main');

// Add input system
scene.input = new Input(engine.canvas);

// Create player
const player = new GameObject(400, 300);
player.addComponent(new SpriteRenderer({
    width: 50,
    height: 50,
    color: '#ff6b6b'
}));

// Add custom update for player movement
player.update = function(dt) {
    const speed = 200; // pixels per second
    
    if (scene.input.isKeyDown('KeyA') || scene.input.isKeyDown('ArrowLeft')) {
        this.x -= speed * dt;
    }
    if (scene.input.isKeyDown('KeyD') || scene.input.isKeyDown('ArrowRight')) {
        this.x += speed * dt;
    }
    if (scene.input.isKeyDown('KeyW') || scene.input.isKeyDown('ArrowUp')) {
        this.y -= speed * dt;
    }
    if (scene.input.isKeyDown('KeyS') || scene.input.isKeyDown('ArrowDown')) {
        this.y += speed * dt;
    }
};

scene.add(player);

// Update input each frame
const originalUpdate = scene.update.bind(scene);
scene.update = function(dt) {
    scene.input.update();
    originalUpdate(dt);
};

engine.addScene('main', scene);
engine.setScene('main');
engine.start();
```

## Step 4: Add Physics

Let's add physics for more realistic movement:

```javascript
import { 
    Engine, Scene, GameObject, 
    SpriteRenderer, BoxCollider, RigidBody,
    Physics, Input 
} from './bounce-engine/src/index.js';

const engine = new Engine({ width: 800, height: 600 });
const scene = new Scene('main');

// Add systems
scene.physics = new Physics(scene);
scene.input = new Input(engine.canvas);

// Create player with physics
const player = new GameObject(400, 100);
player.addComponent(new SpriteRenderer({
    width: 50,
    height: 50,
    color: '#ff6b6b'
}));

const playerCollider = player.addComponent(new BoxCollider(50, 50));
const playerRb = player.addComponent(new RigidBody({
    mass: 1,
    gravityScale: 1
}));

scene.add(player);
scene.physics.addCollider(playerCollider);

// Create ground
const ground = new GameObject(400, 550);
ground.addComponent(new SpriteRenderer({
    width: 800,
    height: 100,
    color: '#4CAF50'
}));

const groundCollider = ground.addComponent(new BoxCollider(800, 100));
scene.add(ground);
scene.physics.addCollider(groundCollider);

// Update with physics
const originalUpdate = scene.update.bind(scene);
scene.update = function(dt) {
    scene.input.update();
    
    // Reset grounded state
    playerRb.isGrounded = false;
    
    // Detect collisions
    scene.physics.detectCollisions();
    
    // Simple movement
    const speed = 200;
    if (scene.input.isKeyDown('KeyA')) playerRb.velocityX = -speed;
    else if (scene.input.isKeyDown('KeyD')) playerRb.velocityX = speed;
    else playerRb.velocityX = 0;
    
    // Jump
    if (scene.input.isKeyPressed('Space') && playerRb.isGrounded) {
        playerRb.velocityY = -400;
    }
    
    originalUpdate(dt);
};

engine.addScene('main', scene);
engine.setScene('main');
engine.start();
```

## Step 5: Use Pre-built Controllers

For easier development, use the built-in controllers:

### Platformer:
```javascript
import { 
    Engine, Scene, GameObject,
    SpriteRenderer, BoxCollider, RigidBody,
    PlatformerController, Physics, Input, Camera
} from './bounce-engine/src/index.js';

const engine = new Engine({ width: 800, height: 600 });
const scene = new Scene('platformer');
scene.physics = new Physics(scene);
scene.input = new Input(engine.canvas);

// Camera
const camera = new Camera(0, 0, 800, 600);
scene.camera = camera;

// Player
const player = new GameObject(100, 100);
player.addComponent(new SpriteRenderer({
    width: 32,
    height: 48,
    color: '#ff6b6b'
}));
player.addComponent(new BoxCollider(32, 48));
player.addComponent(new RigidBody());
player.addComponent(new PlatformerController({
    moveSpeed: 200,
    jumpForce: 400,
    canDoubleJump: true
}));

const playerCollider = player.getComponent(BoxCollider);
scene.add(player);
scene.physics.addCollider(playerCollider);

camera.follow(player, 0.1);

// Rest of setup...
```

### Top-Down:
```javascript
import { 
    Engine, Scene, GameObject,
    SpriteRenderer, BoxCollider, RigidBody,
    TopDownController, Physics, Input
} from './bounce-engine/src/index.js';

const engine = new Engine({ width: 800, height: 600 });
const scene = new Scene('topdown');
scene.physics = new Physics(scene);
scene.input = new Input(engine.canvas);

// Player
const player = new GameObject(400, 300);
player.addComponent(new SpriteRenderer({
    width: 32,
    height: 32,
    color: '#4ecdc4'
}));
player.addComponent(new BoxCollider(32, 32));
player.addComponent(new RigidBody({ useGravity: false }));
player.addComponent(new TopDownController({
    moveSpeed: 200,
    canDash: true
}));

scene.add(player);
// Rest of setup...
```

## Step 6: Running Your Game

Start a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Or use the package.json script
npm run serve
```

Then open `http://localhost:8000` in your browser!

## Next Steps

- Check out the [examples/](../examples/) folder for complete game demos
- Read the [API Documentation](API.md) for detailed reference
- Experiment with particles, animations, and audio
- Build your own game!

## Tips

1. **Always use a local server** - Browsers block ES6 modules when opening files directly
2. **Update systems in order** - Input → Physics → Game Logic → Render
3. **Use deltaTime** - Multiply speeds by `dt` for frame-rate independent movement
4. **Register colliders** - Don't forget to add colliders to the physics system
5. **Clean up** - Call `destroy()` on objects you no longer need

## Common Patterns

### Creating a Component
```javascript
import { Component } from './bounce-engine/src/index.js';

class MyComponent extends Component {
    onStart() {
        // Called when added to game object
    }
    
    update(dt) {
        // Called every frame
        this.gameObject.rotation += dt;
    }
    
    render(ctx) {
        // Custom rendering
    }
}
```

### Scene Management
```javascript
// Create multiple scenes
const menuScene = new Scene('menu');
const gameScene = new Scene('game');
const gameOverScene = new Scene('gameOver');

engine.addScene('menu', menuScene);
engine.addScene('game', gameScene);
engine.addScene('gameOver', gameOverScene);

// Switch scenes
engine.setScene('menu');

// Later...
engine.setScene('game');
```

### Loading Assets
```javascript
import { AssetLoader } from './bounce-engine/src/index.js';

const loader = new AssetLoader();

loader.addImage('player', './images/player.png');
loader.addImage('enemy', './images/enemy.png');
loader.addAudio('jump', './sounds/jump.mp3');

loader.onProgress = (progress) => {
    console.log(`Loading: ${Math.floor(progress * 100)}%`);
};

await loader.load();

// Use loaded assets
const playerImg = loader.get('player');
const sprite = new SpriteRenderer({
    image: playerImg,
    width: 64,
    height: 64
});
```

Happy game development! 🎮
