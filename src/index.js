/**
 * Bounce Engine (be) - Main Entry Point
 * A lightweight, pure JavaScript game engine for 2D games
 * @version 1.0.0
 */

// Core
export { Engine } from './core/Engine.js';
export { Scene } from './core/Scene.js';
export { GameObject } from './core/GameObject.js';
export { Component } from './core/Component.js';

// Rendering
export { Camera } from './rendering/Camera.js';
export { SpriteRenderer } from './rendering/SpriteRenderer.js';
export { TextRenderer } from './rendering/TextRenderer.js';

// Physics
export { RigidBody } from './physics/RigidBody.js';
export { BoxCollider, CircleCollider, Collider } from './physics/Collider.js';
export { Physics } from './physics/Physics.js';

// Input
export { Input } from './input/Input.js';

// Audio
export { Audio } from './audio/Audio.js';

// Animation
export { Animator } from './animation/Animator.js';
export { Tween, TweenManager } from './animation/Tween.js';

// Particles
export { ParticleEmitter } from './particles/ParticleEmitter.js';

// Tilemap
export { Tilemap } from './tilemap/Tilemap.js';

// UI
export { UIElement, Button, Panel, UIManager } from './ui/UI.js';

// Assets
export { AssetLoader } from './assets/AssetLoader.js';

// Utils
export { Vector2, MathUtils } from './utils/Math.js';
export { Timer, TimerManager } from './utils/Timer.js';
export { EventEmitter } from './utils/EventEmitter.js';
export { StateMachine } from './utils/StateMachine.js';
export { Debug } from './utils/Debug.js';

// Prefabs
export { PlatformerController } from './prefabs/PlatformerController.js';
export { TopDownController } from './prefabs/TopDownController.js';

/**
 * Bounce Engine namespace
 */
const be = {
    // Version
    version: '1.0.0',
    
    // Quick start helper
    create: (config) => new Engine(config),
    
    // Factory methods
    scene: (name) => new Scene(name),
    gameObject: (x, y) => new GameObject(x, y),
};

export default be;
