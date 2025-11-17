import { Component } from '../core/Component.js';

/**
 * Tilemap Component
 * @class Tilemap
 * @extends Component
 * @description Renders and manages a tile-based map
 */
export class Tilemap extends Component {
    /**
     * Creates a new Tilemap
     * @param {Object} config - Configuration
     */
    constructor(config) {
        super();
        
        this.tileWidth = config.tileWidth || 32;
        this.tileHeight = config.tileHeight || 32;
        this.mapWidth = config.mapWidth || 10;
        this.mapHeight = config.mapHeight || 10;
        
        this.tileset = config.tileset || null; // Image
        this.tilesetColumns = config.tilesetColumns || 10;
        
        // Map data (2D array of tile indices)
        this.layers = config.layers || [[]];
        
        // Collision layer
        this.collisionLayer = config.collisionLayer || null;
        
        // Offset for rendering
        this.offsetX = config.offsetX || 0;
        this.offsetY = config.offsetY || 0;
    }

    /**
     * Sets tile at position
     * @param {number} layer - Layer index
     * @param {number} x - Tile X
     * @param {number} y - Tile Y
     * @param {number} tileIndex - Tile index
     */
    setTile(layer, x, y, tileIndex) {
        if (!this.layers[layer]) {
            this.layers[layer] = [];
        }
        if (!this.layers[layer][y]) {
            this.layers[layer][y] = [];
        }
        this.layers[layer][y][x] = tileIndex;
    }

    /**
     * Gets tile at position
     * @param {number} layer - Layer index
     * @param {number} x - Tile X
     * @param {number} y - Tile Y
     * @returns {number}
     */
    getTile(layer, x, y) {
        if (!this.layers[layer] || !this.layers[layer][y]) {
            return -1;
        }
        return this.layers[layer][y][x] || -1;
    }

    /**
     * Converts world position to tile position
     * @param {number} worldX - World X
     * @param {number} worldY - World Y
     * @returns {{x: number, y: number}}
     */
    worldToTile(worldX, worldY) {
        return {
            x: Math.floor((worldX - this.offsetX) / this.tileWidth),
            y: Math.floor((worldY - this.offsetY) / this.tileHeight)
        };
    }

    /**
     * Converts tile position to world position
     * @param {number} tileX - Tile X
     * @param {number} tileY - Tile Y
     * @returns {{x: number, y: number}}
     */
    tileToWorld(tileX, tileY) {
        return {
            x: tileX * this.tileWidth + this.offsetX,
            y: tileY * this.tileHeight + this.offsetY
        };
    }

    /**
     * Checks if tile is solid (for collision)
     * @param {number} x - Tile X
     * @param {number} y - Tile Y
     * @returns {boolean}
     */
    isTileSolid(x, y) {
        if (!this.collisionLayer) return false;
        
        const tile = this.getTile(this.collisionLayer, x, y);
        return tile > 0;
    }

    /**
     * Gets tiles in a rectangular area
     * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {number} width - Width
     * @param {number} height - Height
     * @returns {Array}
     */
    getTilesInArea(x, y, width, height) {
        const tiles = [];
        const startTile = this.worldToTile(x, y);
        const endTile = this.worldToTile(x + width, y + height);
        
        for (let ty = startTile.y; ty <= endTile.y; ty++) {
            for (let tx = startTile.x; tx <= endTile.x; tx++) {
                if (this.isTileSolid(tx, ty)) {
                    const worldPos = this.tileToWorld(tx, ty);
                    tiles.push({
                        x: tx,
                        y: ty,
                        worldX: worldPos.x,
                        worldY: worldPos.y,
                        width: this.tileWidth,
                        height: this.tileHeight
                    });
                }
            }
        }
        
        return tiles;
    }

    /**
     * Renders the tilemap
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        if (!this.tileset || !this.tileset.complete) return;

        for (let layer = 0; layer < this.layers.length; layer++) {
            const layerData = this.layers[layer];
            if (!layerData) continue;

            for (let y = 0; y < layerData.length; y++) {
                const row = layerData[y];
                if (!row) continue;

                for (let x = 0; x < row.length; x++) {
                    const tileIndex = row[x];
                    if (tileIndex < 0) continue;

                    // Calculate source position in tileset
                    const tilesetX = (tileIndex % this.tilesetColumns) * this.tileWidth;
                    const tilesetY = Math.floor(tileIndex / this.tilesetColumns) * this.tileHeight;

                    // Calculate destination position
                    const destX = x * this.tileWidth + this.offsetX;
                    const destY = y * this.tileHeight + this.offsetY;

                    ctx.drawImage(
                        this.tileset,
                        tilesetX, tilesetY, this.tileWidth, this.tileHeight,
                        destX, destY, this.tileWidth, this.tileHeight
                    );
                }
            }
        }
    }
}
