/**
 * Audio Manager
 * @class Audio
 * @description Manages audio playback, music, and sound effects
 */
export class Audio {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        
        this.sounds = new Map();
        this.music = null;
        this.currentMusicSource = null;
        
        this.masterVolume = 1;
        this.musicVolume = 1;
        this.sfxVolume = 1;
        
        this.initialized = false;
    }

    /**
     * Initializes audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            
            this.musicGain = this.context.createGain();
            this.musicGain.connect(this.masterGain);
            
            this.sfxGain = this.context.createGain();
            this.sfxGain.connect(this.masterGain);
            
            this.initialized = true;
        } catch (e) {
            console.error('Failed to initialize audio:', e);
        }
    }

    /**
     * Loads a sound
     * @param {string} name - Sound name
     * @param {string} url - Sound URL
     * @returns {Promise}
     */
    async loadSound(name, url) {
        if (!this.initialized) this.init();

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
            return audioBuffer;
        } catch (e) {
            console.error(`Failed to load sound ${name}:`, e);
            return null;
        }
    }

    /**
     * Plays a sound effect
     * @param {string} name - Sound name
     * @param {Object} options - Playback options
     * @returns {AudioBufferSourceNode}
     */
    playSound(name, options = {}) {
        if (!this.initialized) this.init();

        const buffer = this.sounds.get(name);
        if (!buffer) {
            console.warn(`Sound ${name} not loaded`);
            return null;
        }

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = this.context.createGain();
        gainNode.gain.value = (options.volume !== undefined ? options.volume : 1) * this.sfxVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        source.playbackRate.value = options.pitch || 1;
        source.loop = options.loop || false;
        
        source.start(0);
        
        return source;
    }

    /**
     * Plays background music
     * @param {string} name - Music name
     * @param {Object} options - Playback options
     */
    playMusic(name, options = {}) {
        if (!this.initialized) this.init();

        const buffer = this.sounds.get(name);
        if (!buffer) {
            console.warn(`Music ${name} not loaded`);
            return;
        }

        // Stop current music
        if (this.currentMusicSource) {
            this.currentMusicSource.stop();
        }

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.context.createGain();
        gainNode.gain.value = (options.volume !== undefined ? options.volume : 1) * this.musicVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        source.start(0);
        
        this.currentMusicSource = source;
        this.music = name;
    }

    /**
     * Stops music
     */
    stopMusic() {
        if (this.currentMusicSource) {
            this.currentMusicSource.stop();
            this.currentMusicSource = null;
            this.music = null;
        }
    }

    /**
     * Sets master volume
     * @param {number} volume - Volume (0-1)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    /**
     * Sets music volume
     * @param {number} volume - Volume (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }

    /**
     * Sets sound effects volume
     * @param {number} volume - Volume (0-1)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }

    /**
     * Creates a spatial audio source
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} listenerX - Listener X position
     * @param {number} listenerY - Listener Y position
     * @param {number} maxDistance - Max hearing distance
     * @returns {number} Volume multiplier
     */
    calculateSpatialVolume(x, y, listenerX, listenerY, maxDistance = 1000) {
        const dx = x - listenerX;
        const dy = y - listenerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance >= maxDistance) return 0;
        
        return 1 - (distance / maxDistance);
    }
}
