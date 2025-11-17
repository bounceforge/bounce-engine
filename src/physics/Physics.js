/**
 * Physics System
 * @class Physics
 * @description Manages physics simulation and collision detection
 */
export class Physics {
    /**
     * Creates a new Physics system
     * @param {Scene} scene - Scene to manage physics for
     */
    constructor(scene) {
        this.scene = scene;
        this.gravity = 980; // pixels per second squared
        this.colliders = [];
        this.collisionMatrix = new Map();
    }

    /**
     * Registers a collider
     * @param {Collider} collider - Collider to register
     */
    addCollider(collider) {
        this.colliders.push(collider);
    }

    /**
     * Unregisters a collider
     * @param {Collider} collider - Collider to unregister
     */
    removeCollider(collider) {
        const index = this.colliders.indexOf(collider);
        if (index !== -1) {
            this.colliders.splice(index, 1);
        }
    }

    /**
     * Performs collision detection
     */
    detectCollisions() {
        const newCollisions = new Map();

        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const a = this.colliders[i];
                const b = this.colliders[j];

                if (!a.active || !b.active) continue;

                let isColliding = false;

                // Check collision based on collider types
                if (a.constructor.name === 'BoxCollider' && b.constructor.name === 'BoxCollider') {
                    isColliding = a.intersects(b);
                } else if (a.constructor.name === 'CircleCollider' && b.constructor.name === 'CircleCollider') {
                    isColliding = a.intersects(b);
                } else if (a.constructor.name === 'CircleCollider' && b.constructor.name === 'BoxCollider') {
                    isColliding = a.intersectsBox(b);
                } else if (a.constructor.name === 'BoxCollider' && b.constructor.name === 'CircleCollider') {
                    isColliding = b.intersectsBox(a);
                }

                const key = `${a.gameObject.name || i}-${b.gameObject.name || j}`;

                if (isColliding) {
                    newCollisions.set(key, { a, b });

                    if (this.collisionMatrix.has(key)) {
                        // Collision stay
                        if (a.onCollisionStay) a.onCollisionStay(b);
                        if (b.onCollisionStay) b.onCollisionStay(a);
                    } else {
                        // Collision enter
                        if (a.onCollisionEnter) a.onCollisionEnter(b);
                        if (b.onCollisionEnter) b.onCollisionEnter(a);
                    }

                    // Resolve collision if not trigger
                    if (!a.isTrigger && !b.isTrigger) {
                        this.resolveCollision(a, b);
                    }
                }
            }
        }

        // Check for collision exits
        for (const [key, { a, b }] of this.collisionMatrix) {
            if (!newCollisions.has(key)) {
                if (a.onCollisionExit) a.onCollisionExit(b);
                if (b.onCollisionExit) b.onCollisionExit(a);
            }
        }

        this.collisionMatrix = newCollisions;
    }

    /**
     * Resolves collision between two colliders
     * @param {Collider} a - First collider
     * @param {Collider} b - Second collider
     */
    resolveCollision(a, b) {
        const rbA = a.gameObject.getComponent(RigidBody);
        const rbB = b.gameObject.getComponent(RigidBody);

        // Skip if both are kinematic or neither has a rigidbody
        if ((!rbA && !rbB) || (rbA?.isKinematic && rbB?.isKinematic)) {
            return;
        }

        // Box-Box collision resolution
        if (a.constructor.name === 'BoxCollider' && b.constructor.name === 'BoxCollider') {
            const boundsA = a.getBounds();
            const boundsB = b.getBounds();

            // Calculate overlap
            const overlapX = Math.min(
                boundsA.x + boundsA.width - boundsB.x,
                boundsB.x + boundsB.width - boundsA.x
            );
            const overlapY = Math.min(
                boundsA.y + boundsA.height - boundsB.y,
                boundsB.y + boundsB.height - boundsA.y
            );

            // Resolve along smallest overlap
            if (overlapX < overlapY) {
                // Horizontal resolution
                const direction = boundsA.x < boundsB.x ? -1 : 1;
                if (rbA && !rbA.isKinematic) {
                    a.gameObject.x += direction * overlapX / (rbB && !rbB.isKinematic ? 2 : 1);
                    rbA.velocityX = 0;
                    rbA.isTouchingWall = true;
                }
                if (rbB && !rbB.isKinematic) {
                    b.gameObject.x -= direction * overlapX / (rbA && !rbA.isKinematic ? 2 : 1);
                    rbB.velocityX = 0;
                    rbB.isTouchingWall = true;
                }
            } else {
                // Vertical resolution
                const direction = boundsA.y < boundsB.y ? -1 : 1;
                if (rbA && !rbA.isKinematic) {
                    a.gameObject.y += direction * overlapY / (rbB && !rbB.isKinematic ? 2 : 1);
                    rbA.velocityY = 0;
                    if (direction < 0) rbA.isGrounded = true;
                }
                if (rbB && !rbB.isKinematic) {
                    b.gameObject.y -= direction * overlapY / (rbA && !rbA.isKinematic ? 2 : 1);
                    rbB.velocityY = 0;
                    if (direction > 0) rbB.isGrounded = true;
                }
            }
        }
    }

    /**
     * Performs a raycast
     * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {number} dirX - Direction X
     * @param {number} dirY - Direction Y
     * @param {number} distance - Max distance
     * @returns {Object|null} Hit result or null
     */
    raycast(x, y, dirX, dirY, distance) {
        let closestHit = null;
        let closestDistance = distance;

        for (const collider of this.colliders) {
            if (!collider.active) continue;

            if (collider.constructor.name === 'BoxCollider') {
                const bounds = collider.getBounds();
                const hit = this.raycastBox(x, y, dirX, dirY, distance, bounds);
                
                if (hit && hit.distance < closestDistance) {
                    closestDistance = hit.distance;
                    closestHit = { ...hit, collider };
                }
            }
        }

        return closestHit;
    }

    /**
     * Raycasts against a box
     * @private
     */
    raycastBox(x, y, dirX, dirY, maxDistance, box) {
        const tMin = (box.x - x) / dirX;
        const tMax = (box.x + box.width - x) / dirX;
        const tYMin = (box.y - y) / dirY;
        const tYMax = (box.y + box.height - y) / dirY;

        const t1 = Math.min(tMin, tMax);
        const t2 = Math.max(tMin, tMax);
        const t3 = Math.min(tYMin, tYMax);
        const t4 = Math.max(tYMin, tYMax);

        const tNear = Math.max(t1, t3);
        const tFar = Math.min(t2, t4);

        if (tNear > tFar || tFar < 0 || tNear > maxDistance) {
            return null;
        }

        return {
            distance: tNear,
            point: { x: x + dirX * tNear, y: y + dirY * tNear }
        };
    }
}

// Import RigidBody for collision resolution
import { RigidBody } from './RigidBody.js';
