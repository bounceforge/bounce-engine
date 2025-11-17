/**
 * Asset Loader
 * @class AssetLoader
 * @description Loads and manages game assets
 */
export class AssetLoader {
    constructor() {
        this.assets = new Map();
        this.loadQueue = [];
        this.isLoading = false;
        this.progress = 0;
        this.onProgress = null;
        this.onComplete = null;
    }

    /**
     * Adds an image to load queue
     * @param {string} name - Asset name
     * @param {string} url - Image URL
     */
    addImage(name, url) {
        this.loadQueue.push({ type: 'image', name, url });
    }

    /**
     * Adds an audio file to load queue
     * @param {string} name - Asset name
     * @param {string} url - Audio URL
     */
    addAudio(name, url) {
        this.loadQueue.push({ type: 'audio', name, url });
    }

    /**
     * Adds a JSON file to load queue
     * @param {string} name - Asset name
     * @param {string} url - JSON URL
     */
    addJSON(name, url) {
        this.loadQueue.push({ type: 'json', name, url });
    }

    /**
     * Adds a text file to load queue
     * @param {string} name - Asset name
     * @param {string} url - Text URL
     */
    addText(name, url) {
        this.loadQueue.push({ type: 'text', name, url });
    }

    /**
     * Loads all queued assets
     * @returns {Promise}
     */
    async load() {
        if (this.isLoading) {
            console.warn('Already loading assets');
            return;
        }

        this.isLoading = true;
        this.progress = 0;
        const total = this.loadQueue.length;
        let loaded = 0;

        const promises = this.loadQueue.map(async (item) => {
            try {
                let asset;
                
                switch (item.type) {
                    case 'image':
                        asset = await this.loadImage(item.url);
                        break;
                    case 'audio':
                        asset = await this.loadAudioFile(item.url);
                        break;
                    case 'json':
                        asset = await this.loadJSON(item.url);
                        break;
                    case 'text':
                        asset = await this.loadText(item.url);
                        break;
                    default:
                        throw new Error(`Unknown asset type: ${item.type}`);
                }
                
                this.assets.set(item.name, asset);
                loaded++;
                this.progress = loaded / total;
                
                if (this.onProgress) {
                    this.onProgress(this.progress, loaded, total);
                }
                
                return asset;
            } catch (error) {
                console.error(`Failed to load ${item.type} "${item.name}" from ${item.url}:`, error);
                return null;
            }
        });

        await Promise.all(promises);
        
        this.isLoading = false;
        this.loadQueue = [];
        
        if (this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * Loads an image
     * @private
     */
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Loads an audio file
     * @private
     */
    async loadAudioFile(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return arrayBuffer;
    }

    /**
     * Loads a JSON file
     * @private
     */
    async loadJSON(url) {
        const response = await fetch(url);
        return await response.json();
    }

    /**
     * Loads a text file
     * @private
     */
    async loadText(url) {
        const response = await fetch(url);
        return await response.text();
    }

    /**
     * Gets a loaded asset
     * @param {string} name - Asset name
     * @returns {any}
     */
    get(name) {
        return this.assets.get(name);
    }

    /**
     * Checks if an asset exists
     * @param {string} name - Asset name
     * @returns {boolean}
     */
    has(name) {
        return this.assets.has(name);
    }

    /**
     * Removes an asset
     * @param {string} name - Asset name
     */
    remove(name) {
        this.assets.delete(name);
    }

    /**
     * Clears all assets
     */
    clear() {
        this.assets.clear();
    }
}
