import { GAME_CONSTANTS } from '../utils/gameConfig.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.walletConnected = false;
        this.playerData = null;
    }
    
    preload() {
        // Create simple colored rectangles as placeholder sprites
        this.createPlaceholderAssets();
        
        // Load UI sounds (optional)
        // this.load.audio('click', 'assets/audio/click.wav');
    }
    
    create() {
        // Background
        this.createBackground();
        
        // Title
        this.createTitle();
        
        // Main Menu UI
        this.createMainMenu();
        
        // Wallet status
        this.createWalletStatus();
        
        // Mobile touch setup
        this.setupMobileControls();
        
        // Start background music (optional)
        // this.sound.play('bgMusic', { loop: true, volume: 0.3 });
    }
    
    createPlaceholderAssets() {
        // Import and generate detailed placeholder assets
        import('../utils/assetGenerator.js').then(({ AssetGenerator }) => {
            AssetGenerator.generateAllAssets(this);
        }).catch(() => {
            // Fallback to simple colored rectangles
            this.add.graphics()
                .fillStyle(0x6B46C1)
                .fillRect(0, 0, 100, 100)
                .generateTexture('hero-sprite', 100, 100);
                
            this.add.graphics()
                .fillStyle(0xF59E0B)
                .fillRect(0, 0, 100, 100)
                .generateTexture('enemy-sprite', 100, 100);
                
            this.add.graphics()
                .fillStyle(0x1E1B4B)
                .fillRect(0, 0, 64, 64)
                .generateTexture('castle-tile', 64, 64);
        });
    }
    
    createBackground() {
        // Cosmic background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1E1B4B, 0x1E1B4B, 0x312E81, 0x312E81);
        bg.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Add stars effect
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                Phaser.Math.Between(1, 3),
                0xFFFFFF,
                Phaser.Math.FloatBetween(0.3, 1)
            );
            
            // Twinkling animation
            this.tweens.add({
                targets: star,
                alpha: 0.3,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    createTitle() {
        // Main title
        const title = this.add.text(this.scale.width / 2, 100, 'COSMIC HEROES', {
            fontSize: '32px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(this.scale.width / 2, 140, 'LIBERATION', {
            fontSize: '24px', 
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
        
        // Title animations
        this.tweens.add({
            targets: [title, subtitle],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Subtitle
        this.add.text(this.scale.width / 2, 180, 'Fight the Rugpuller Wizard & Free the NFTs', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace', 
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    createMainMenu() {
        const centerX = this.scale.width / 2;
        const startY = 250;
        const buttonSpacing = 70;
        
        // Play Button
        const playButton = this.createButton(centerX, startY, 'START MISSION', () => {
            this.startGame();
        });
        
        // Connect Wallet Button
        const walletButton = this.createButton(centerX, startY + buttonSpacing, 'CONNECT WALLET', () => {
            this.connectWallet();
        });
        
        // Demo Button
        const demoButton = this.createButton(centerX, startY + buttonSpacing * 2, 'PLAY DEMO', () => {
            this.startDemo();
        });
        
        // How to Play Button
        const helpButton = this.createButton(centerX, startY + buttonSpacing * 3, 'HOW TO PLAY', () => {
            this.showHelp();
        });
        
        this.menuButtons = [playButton, walletButton, demoButton, helpButton];
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        // Button background
        const bg = this.add.graphics();
        bg.lineStyle(2, 0xF59E0B);
        bg.fillStyle(0x6B46C1, 0.8);
        bg.fillRoundedRect(-120, -22, 240, 44, 8);
        bg.strokeRoundedRect(-120, -22, 240, 44, 8);
        
        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '14px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        button.add([bg, buttonText]);
        
        // Make interactive
        button.setSize(240, 44);
        button.setInteractive();
        
        // Hover effects
        button.on('pointerover', () => {
            bg.clear();
            bg.lineStyle(2, 0xFFFFFF);
            bg.fillStyle(0x6B46C1, 1);
            bg.fillRoundedRect(-120, -22, 240, 44, 8);
            bg.strokeRoundedRect(-120, -22, 240, 44, 8);
            buttonText.setColor('#FFFFFF');
            
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });
        
        button.on('pointerout', () => {
            bg.clear();
            bg.lineStyle(2, 0xF59E0B);
            bg.fillStyle(0x6B46C1, 0.8);
            bg.fillRoundedRect(-120, -22, 240, 44, 8);
            bg.strokeRoundedRect(-120, -22, 240, 44, 8);
            buttonText.setColor('#F59E0B');
            
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        // Click handler
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });
        
        return button;
    }
    
    createWalletStatus() {
        this.walletStatusText = this.add.text(20, this.scale.height - 30, 'Wallet: Not Connected', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#EF4444'
        });
        
        // Add wallet status indicator
        this.walletIndicator = this.add.circle(15, this.scale.height - 25, 5, 0xEF4444);
    }
    
    setupMobileControls() {
        // Ensure all interactive elements are touch-friendly
        this.input.addPointer(2); // Support multi-touch
        
        // Handle mobile-specific events
        this.scale.on('orientationchange', () => {
            this.repositionElements();
        });
    }
    
    repositionElements() {
        // Reposition UI elements for different orientations/screen sizes
        // This would be called on orientation change
        if (this.scale.width < this.scale.height) {
            // Portrait mode adjustments
        } else {
            // Landscape mode adjustments
        }
    }
    
    startGame() {
        if (!this.walletConnected) {
            this.showMessage('Connect wallet first or use Demo mode!', '#EF4444');
            return;
        }
        
        // Initialize player data
        this.playerData = {
            level: 1,
            experience: 0,
            currentLevel: 1,
            stats: { ...GAME_CONSTANTS.PLAYER.BASE_STATS }
        };
        
        this.scene.start('GameScene', { playerData: this.playerData });
    }
    
    startDemo() {
        // Start game without wallet connection using mock data
        this.playerData = {
            level: 1,
            experience: 0,
            currentLevel: 1,
            stats: { ...GAME_CONSTANTS.PLAYER.BASE_STATS },
            demoMode: true
        };
        
        this.showMessage('Starting Demo Mode...', '#10B981');
        
        setTimeout(() => {
            this.scene.start('GameScene', { playerData: this.playerData });
        }, 1000);
    }
    
    async connectWallet() {
        this.showMessage('Connecting to wallet...', '#F59E0B');
        
        try {
            // Import wallet connection logic
            const { connectWallet } = await import('../wallet/connection.js');
            const connection = await connectWallet();
            
            if (connection.success) {
                this.walletConnected = true;
                this.walletStatusText.setText(`Wallet: ${connection.address.slice(0, 12)}...`);
                this.walletStatusText.setColor('#10B981');
                this.walletIndicator.setFillStyle(0x10B981);
                this.showMessage('Wallet connected successfully!', '#10B981');
            } else {
                throw new Error(connection.error);
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);
            this.showMessage('Wallet connection failed. Try Demo mode!', '#EF4444');
        }
    }
    
    showHelp() {
        // Create help overlay
        const helpOverlay = this.add.container(this.scale.width / 2, this.scale.height / 2);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRect(-this.scale.width/2, -this.scale.height/2, this.scale.width, this.scale.height);
        
        const helpBg = this.add.graphics();
        helpBg.lineStyle(2, 0xF59E0B);
        helpBg.fillStyle(0x1E1B4B, 0.9);
        helpBg.fillRoundedRect(-300, -200, 600, 400, 16);
        helpBg.strokeRoundedRect(-300, -200, 600, 400, 16);
        
        const helpTitle = this.add.text(0, -150, 'HOW TO PLAY', {
            fontSize: '20px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        const helpText = this.add.text(0, -50, [
            '🎯 OBJECTIVE:',
            'Defeat the Rugpuller Wizard and',
            'liberate all NFT collections!',
            '',
            '⚔️ GAMEPLAY:',
            '• Fight through 5 castle levels',
            '• Battle real NFT enemies',
            '• Level up your character',
            '• Collect XP and grow stronger',
            '',
            '🔗 WALLET:',
            'Connect wallet for full features',
            'or play Demo mode to try it out!'
        ].join('\\n'), {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'left',
            lineSpacing: 5
        }).setOrigin(0.5);
        
        const closeButton = this.createButton(0, 120, 'CLOSE', () => {
            helpOverlay.destroy();
        });
        
        helpOverlay.add([bg, helpBg, helpTitle, helpText, closeButton]);
        
        // Make overlay interactive to close on click outside
        bg.setInteractive();
        bg.on('pointerdown', () => {
            helpOverlay.destroy();
        });
    }
    
    showMessage(text, color = '#FFFFFF') {
        // Show temporary message
        const message = this.add.text(this.scale.width / 2, 200, text, {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: color,
            align: 'center'
        }).setOrigin(0.5);
        
        // Animate message
        this.tweens.add({
            targets: message,
            alpha: 0,
            y: message.y - 30,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                message.destroy();
            }
        });
    }
}