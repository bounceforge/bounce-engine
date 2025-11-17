# Bounce Engine API Documentation

## Table of Contents

1. [Core Classes](#core-classes)
2. [Rendering](#rendering)
3. [Physics](#physics)
4. [Input](#input)
5. [Audio](#audio)
6. [Animation](#animation)
7. [Particles](#particles)
8. [UI](#ui)
9. [Utilities](#utilities)

---

## Core Classes

### Engine

Main game engine class that manages the game loop and scenes.

#### Constructor
```javascript
new Engine(config)
```

**Parameters:**
- `config.width` (number): Canvas width (default: 800)
- `config.height` (number): Canvas height (default: 600)
- `config.parent` (HTMLElement): Parent element (default: document.body)
- `config.backgroundColor` (string): Background color (default: '#000000')
- `config.antialias` (boolean): Enable antialiasing (default: true)
- `config.targetFPS` (number): Target FPS (default: 60)

#### Properties
- `canvas` (HTMLCanvasElement): The game canvas
- `ctx` (CanvasRenderingContext2D): Canvas context
- `isRunning` (boolean): Whether engine is running
- `isPaused` (boolean): Whether engine is paused
- `deltaTime` (number): Time since last frame (seconds)
- `fps` (number): Current frames per second

#### Methods

**`start()`**
Starts the game loop.

**`stop()`**
Stops the game loop.

**`pause()`**
Pauses the game.

**`resume()`**
Resumes the game.

**`addScene(name, scene)`**
Adds a scene to the engine.
- `name` (string): Scene identifier
- `scene` (Scene): Scene instance

**`setScene(name)`**
Switches to a different scene.
- `name` (string): Scene name

**`resize(width, height)`**
Resizes the canvas.
- `width` (number): New width
- `height` (number): New height

**`destroy()`**
Destroys the engine and cleans up resources.

---

### Scene

Container for game objects and game state.

#### Constructor
```javascript
new Scene(name)
```

**Parameters:**
- `name` (string): Scene name

#### Properties
- `name` (string): Scene identifier
- `gameObjects` (Array): List of game objects
- `camera` (Camera): Scene camera
- `physics` (Physics): Physics system
- `input` (Input): Input system

#### Methods

**`add(gameObject)`**
Adds a game object to the scene.

**`remove(gameObject)`**
Removes a game object from the scene.

**`findByName(name)`**
Finds a game object by name.
- Returns: GameObject or null

**`findByTag(tag)`**
Finds all game objects with a tag.
- Returns: Array of GameObjects

**`clear()`**
Removes all game objects.

**`onEnter()`**
Called when scene becomes active. Override in subclass.

**`onExit()`**
Called when scene becomes inactive. Override in subclass.

---

### GameObject

Base class for all game entities.

#### Constructor
```javascript
new GameObject(x, y)
```

**Parameters:**
- `x` (number): X position (default: 0)
- `y` (number): Y position (default: 0)

#### Properties
- `x, y` (number): Position
- `rotation` (number): Rotation in radians
- `scaleX, scaleY` (number): Scale factors
- `name` (string): Object name
- `tag` (string): Object tag
- `active` (boolean): Whether object is active
- `visible` (boolean): Whether object is visible
- `zIndex` (number): Render order
- `parent` (GameObject): Parent object
- `children` (Array): Child objects

#### Methods

**`addComponent(component)`**
Adds a component to the game object.
- Returns: The added component

**`getComponent(ComponentClass)`**
Gets a component by type.
- Returns: Component or null

**`getComponents(ComponentClass)`**
Gets all components of a type.
- Returns: Array of components

**`removeComponent(component)`**
Removes a component.

**`addChild(child)`**
Adds a child object.

**`removeChild(child)`**
Removes a child object.

**`getWorldPosition()`**
Gets world position accounting for parent transforms.
- Returns: {x, y}

**`destroy()`**
Destroys this game object.

---

### Component

Base class for all components.

#### Constructor
```javascript
new Component()
```

#### Properties
- `gameObject` (GameObject): The game object this component is attached to
- `active` (boolean): Whether component is active

#### Methods

**`onStart()`**
Called when component is added to a game object. Override in subclass.

**`fixedUpdate(dt)`**
Fixed update for physics. Override in subclass.

**`update(dt)`**
Update game logic. Override in subclass.

**`render(ctx)`**
Render the component. Override in subclass.

**`onDestroy()`**
Called when component is destroyed. Override in subclass.

---

## Rendering

### Camera

Manages viewport and camera transformations.

#### Constructor
```javascript
new Camera(x, y, width, height)
```

#### Methods

**`follow(target, speed)`**
Makes camera follow a game object.
- `target` (GameObject): Target to follow
- `speed` (number): Follow speed (0-1)

**`setBounds(x, y, width, height)`**
Sets camera movement bounds.

**`shake(intensity, duration)`**
Creates camera shake effect.

**`update(dt)`**
Updates camera (follow, shake, etc.)

**`screenToWorld(screenX, screenY)`**
Converts screen coordinates to world coordinates.
- Returns: {x, y}

**`worldToScreen(worldX, worldY)`**
Converts world coordinates to screen coordinates.
- Returns: {x, y}

---

### SpriteRenderer

Renders sprites or colored rectangles.

#### Constructor
```javascript
new SpriteRenderer(config)
```

**Parameters:**
- `config.image` (Image): Image to render
- `config.width` (number): Width
- `config.height` (number): Height
- `config.color` (string): Fill color (if no image)
- `config.alpha` (number): Opacity (0-1)
- `config.flipX` (boolean): Flip horizontally
- `config.flipY` (boolean): Flip vertically

#### Methods

**`setSprite(x, y, width, height)`**
Sets sprite from sprite sheet.

---

### TextRenderer

Renders text.

#### Constructor
```javascript
new TextRenderer(text, config)
```

**Parameters:**
- `text` (string): Text to render
- `config.font` (string): Font (e.g., '16px Arial')
- `config.color` (string): Text color
- `config.align` (string): Alignment ('left', 'center', 'right')
- `config.stroke` (boolean): Enable stroke
- `config.strokeColor` (string): Stroke color
- `config.strokeWidth` (number): Stroke width

---

## Physics

### RigidBody

Adds physics properties to a game object.

#### Constructor
```javascript
new RigidBody(config)
```

**Parameters:**
- `config.mass` (number): Mass (default: 1)
- `config.drag` (number): Drag coefficient (default: 0.01)
- `config.gravityScale` (number): Gravity multiplier (default: 1)
- `config.useGravity` (boolean): Enable gravity (default: true)
- `config.isKinematic` (boolean): Kinematic body (default: false)

#### Properties
- `velocityX, velocityY` (number): Current velocity
- `isGrounded` (boolean): Whether on ground
- `isTouchingWall` (boolean): Whether touching wall

#### Methods

**`addForce(x, y)`**
Applies a continuous force.

**`addImpulse(x, y)`**
Applies an instant impulse.

**`setVelocity(x, y)`**
Sets velocity directly.

---

### BoxCollider

Axis-aligned box collider.

#### Constructor
```javascript
new BoxCollider(width, height, offset)
```

**Parameters:**
- `width` (number): Width
- `height` (number): Height
- `offset` (Object): Offset {x, y}

#### Properties
- `isTrigger` (boolean): Is this a trigger collider?

#### Methods

**`onCollisionEnter(other)`**
Called when collision starts. Override.

**`onCollisionStay(other)`**
Called while colliding. Override.

**`onCollisionExit(other)`**
Called when collision ends. Override.

---

### CircleCollider

Circle collider.

#### Constructor
```javascript
new CircleCollider(radius, offset)
```

---

### Physics

Physics system managing simulation and collision detection.

#### Constructor
```javascript
new Physics(scene)
```

#### Properties
- `gravity` (number): Gravity acceleration (default: 980)

#### Methods

**`addCollider(collider)`**
Registers a collider.

**`removeCollider(collider)`**
Unregisters a collider.

**`detectCollisions()`**
Performs collision detection. Call each frame.

**`raycast(x, y, dirX, dirY, distance)`**
Performs a raycast.
- Returns: Hit result or null

---

## Input

### Input

Manages keyboard, mouse, touch, and gamepad input.

#### Constructor
```javascript
new Input(canvas)
```

#### Methods

**`update(camera)`**
Updates input state. Call once per frame.

**`isKeyDown(keyCode)`**
Checks if key is currently pressed.

**`isKeyPressed(keyCode)`**
Checks if key was just pressed this frame.

**`isKeyReleased(keyCode)`**
Checks if key was just released this frame.

**`isMouseButtonDown(button)`**
Checks if mouse button is pressed.
- `button`: 0=left, 1=middle, 2=right

**`isMouseButtonPressed(button)`**
Checks if mouse button was just pressed.

**`isMouseButtonReleased(button)`**
Checks if mouse button was just released.

**`getGamepad(index)`**
Gets gamepad by index.

**`isGamepadButtonDown(button, gamepadIndex)`**
Checks if gamepad button is pressed.

**`getGamepadAxis(axis, gamepadIndex)`**
Gets gamepad axis value.

**`mapAction(actionName, mapping)`**
Maps an action to inputs.

**`isActionDown(actionName)`**
Checks if action is active.

**`isActionPressed(actionName)`**
Checks if action was just pressed.

**`getAxis(actionName)`**
Gets axis value for action.

---

## Audio

### Audio

Manages audio playback.

#### Methods

**`init()`**
Initializes audio context. Must be called after user interaction.

**`loadSound(name, url)`**
Loads a sound.
- Returns: Promise

**`playSound(name, options)`**
Plays a sound effect.
- `options.volume` (number): Volume (0-1)
- `options.pitch` (number): Pitch multiplier
- `options.loop` (boolean): Loop sound

**`playMusic(name, options)`**
Plays background music.

**`stopMusic()`**
Stops music.

**`setMasterVolume(volume)`**
Sets master volume (0-1).

**`setMusicVolume(volume)`**
Sets music volume (0-1).

**`setSfxVolume(volume)`**
Sets sound effects volume (0-1).

---

## Animation

### Animator

Manages sprite animations.

#### Constructor
```javascript
new Animator(spriteRenderer)
```

#### Methods

**`addAnimation(name, animation)`**
Adds an animation.
- `animation.frames`: Array of {x, y, width, height}
- `animation.frameRate`: Frames per second
- `animation.loop`: Whether to loop

**`play(name, restart)`**
Plays an animation.

**`stop()`**
Stops animation.

---

### Tween

Animates object properties over time.

#### Constructor
```javascript
new Tween(target, to, duration, options)
```

**Parameters:**
- `target` (Object): Object to animate
- `to` (Object): Target properties
- `duration` (number): Duration in seconds
- `options.easing` (Function): Easing function
- `options.loop` (boolean): Loop animation
- `options.yoyo` (boolean): Reverse animation
- `options.onComplete` (Function): Completion callback

#### Static Properties

**`Tween.Easing`**
Built-in easing functions:
- Linear, QuadIn, QuadOut, QuadInOut
- CubicIn, CubicOut, CubicInOut
- SineIn, SineOut, SineInOut
- ElasticIn, ElasticOut
- BounceOut

---

## Full engine reference available at https://bounceforge.github.io/bounce-engine
