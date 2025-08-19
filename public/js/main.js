import Phaser from 'phaser';
import './style.css';
import { GAME_CONFIG } from './utils/gameConfig.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import BattleScene from './scenes/BattleScene.js';
import VictoryScene from './scenes/VictoryScene.js';

class CosmicHeroes {
    constructor() {
        this.game = null;
        this.loadingProgress = 0;
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgressBar = document.getElementById('loading-progress');
        this.loadingStatus = document.getElementById('loading-status');
        
        this.init();
    }
    
    async init() {
        try {
            this.updateLoading(20, 'Loading cosmic engine...');
            
            // Configure game with all scenes
            const config = {
                ...GAME_CONFIG,
                scene: [MenuScene, GameScene, BattleScene, VictoryScene]
            };
            
            this.updateLoading(50, 'Initializing battle systems...');
            
            // Create Phaser game instance
            this.game = new Phaser.Game(config);
            
            // Set up global error handling
            this.setupErrorHandling();
            
            this.updateLoading(80, 'Connecting to the cosmos...');
            
            // Simulate loading time for better UX
            setTimeout(() => {
                this.updateLoading(100, 'Liberation begins now!');
                this.hideLoadingScreen();
            }, 1000);
            
        } catch (error) {
            console.error('Failed to initialize Cosmic Heroes:', error);
            this.showErrorScreen();
        }
    }
    
    updateLoading(progress, status) {
        this.loadingProgress = progress;
        this.loadingProgressBar.style.width = `${progress}%`;
        this.loadingStatus.textContent = status;
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
    
    showErrorScreen() {
        document.getElementById('error-screen').classList.remove('hidden');
        this.loadingScreen.classList.add('hidden');
    }
    
    setupErrorHandling() {
        // Global error handling
        window.addEventListener('error', (event) => {
            console.error('Game Error:', event.error);
            // Don't show error screen for minor issues
            if (event.error && event.error.message.includes('critical')) {
                this.showErrorScreen();
            }
        });
        
        // Phaser-specific error handling
        if (this.game) {
            this.game.events.on('boot', () => {
                console.log('🚀 Cosmic Heroes: Liberation initialized successfully!');
            });
        }
    }
    
    // Mobile-specific optimizations
    setupMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle device orientation changes
        window.addEventListener('orientationchange', () => {
            if (this.game && this.game.scale) {
                setTimeout(() => {
                    this.game.scale.refresh();
                }, 100);
            }
        });
    }
    
    // Public API for external integrations
    getGame() {
        return this.game;
    }
    
    destroy() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
    }
}

// Initialize the game
const cosmicHeroes = new CosmicHeroes();

// Setup mobile optimizations
cosmicHeroes.setupMobileOptimizations();

// Export for external access
window.CosmicHeroes = cosmicHeroes;

// Hot module replacement for development
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        cosmicHeroes.destroy();
        window.location.reload();
    });
}