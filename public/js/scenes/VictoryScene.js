import { GAME_CONSTANTS } from '../utils/gameConfig.js';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
        this.playerData = null;
        this.levelComplete = false;
        this.nextLevel = null;
        this.gameComplete = false;
    }
    
    init(data) {
        this.playerData = data.playerData;
        this.levelComplete = data.levelComplete || false;
        this.nextLevel = data.nextLevel || null;
        this.gameComplete = !this.nextLevel && !this.levelComplete;
    }
    
    create() {
        // Create victory background
        this.createVictoryBackground();
        
        // Show appropriate victory content
        if (this.gameComplete) {
            this.showGameCompleteVictory();
        } else {
            this.showLevelCompleteVictory();
        }
        
        // Create victory UI
        this.createVictoryUI();
        
        // Victory effects
        this.createVictoryEffects();
    }
    
    createVictoryBackground() {
        // Cosmic victory background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1E1B4B, 0x1E1B4B, 0x6B46C1, 0x6B46C1);
        bg.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Animated stars
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                Phaser.Math.Between(1, 4),
                0xFFFFFF,
                Phaser.Math.FloatBetween(0.3, 1)
            );
            
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(500, 2000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 1000)
            });
        }
    }
    
    showGameCompleteVictory() {
        // Final victory - game complete
        const title = this.add.text(this.scale.width / 2, 100, 'ULTIMATE VICTORY!', {
            fontSize: '32px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(this.scale.width / 2, 150, 'THE RUGPULLER WIZARD IS DEFEATED!', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5);
        
        const story = this.add.text(this.scale.width / 2, 220, [
            'You have successfully liberated all',
            'NFT collections across the cosmos!',
            '',
            'The blockchain is now free from the',
            'tyranny of rug pulls and scams.',
            '',
            'Heroes like you are what make the',
            'crypto space truly decentralized!'
        ].join('\\n'), {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        
        // Final stats
        const stats = this.add.text(this.scale.width / 2, 380, [
            '🏆 FINAL STATS 🏆',
            `Hero Level: ${this.playerData.level}`,
            `Total XP: ${this.playerData.experience}`,
            `Health: ${this.playerData.stats.health}`,
            `Attack: ${this.playerData.stats.attack}`,
            `Defense: ${this.playerData.stats.defense}`,
            `Magic: ${this.playerData.stats.magic}`
        ].join('\\n'), {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center',
            lineSpacing: 3
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
    }
    
    showLevelCompleteVictory() {
        // Level completion victory
        const title = this.add.text(this.scale.width / 2, 100, 'LEVEL COMPLETE!', {
            fontSize: '28px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        const levelName = this.add.text(this.scale.width / 2, 140, GAME_CONSTANTS.LEVELS.NAMES[this.nextLevel - 2] + ' LIBERATED!', {
            fontSize: '14px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5);
        
        const progress = this.add.text(this.scale.width / 2, 180, `Progress: ${this.nextLevel - 1}/${GAME_CONSTANTS.LEVELS.TOTAL}`, {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
        
        // Next level preview
        if (this.nextLevel <= GAME_CONSTANTS.LEVELS.TOTAL) {
            const nextLevelText = this.add.text(this.scale.width / 2, 220, [
                'NEXT CHALLENGE:',
                GAME_CONSTANTS.LEVELS.NAMES[this.nextLevel - 1],
                '',
                'New enemies await your liberation!'
            ].join('\\n'), {
                fontSize: '10px',
                fontFamily: 'Press Start 2P, monospace',
                fill: '#10B981',
                align: 'center',
                lineSpacing: 3
            }).setOrigin(0.5);
        }
        
        // Current stats
        const stats = this.add.text(this.scale.width / 2, 320, [
            '📊 HERO STATS 📊',
            `Level: ${this.playerData.level}`,
            `XP: ${this.playerData.experience}`,
            `HP: ${this.playerData.stats.health}`,
            `ATK: ${this.playerData.stats.attack} | DEF: ${this.playerData.stats.defense}`,
            `Magic: ${this.playerData.stats.magic}`
        ].join('\\n'), {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        
        // Level progress bar
        this.createLevelProgressBar();
        
        // Title animations
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createLevelProgressBar() {
        const barWidth = 300;
        const barHeight = 20;
        const x = (this.scale.width - barWidth) / 2;
        const y = 280;
        
        // Progress bar background
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0x374151);
        progressBg.fillRect(x, y, barWidth, barHeight);
        progressBg.lineStyle(2, 0xF59E0B);
        progressBg.strokeRect(x, y, barWidth, barHeight);
        
        // Progress bar fill
        const progress = (this.nextLevel - 1) / GAME_CONSTANTS.LEVELS.TOTAL;
        const fillWidth = barWidth * progress;
        
        const progressBar = this.add.graphics();
        progressBar.fillStyle(0x10B981);
        progressBar.fillRect(x, y, fillWidth, barHeight);
        
        // Progress segments
        for (let i = 1; i < GAME_CONSTANTS.LEVELS.TOTAL; i++) {
            const segmentX = x + (barWidth / GAME_CONSTANTS.LEVELS.TOTAL) * i;
            progressBg.lineStyle(1, 0x6B7280);
            progressBg.moveTo(segmentX, y);
            progressBg.lineTo(segmentX, y + barHeight);
            progressBg.strokePath();
        }
        
        // Progress label
        this.add.text(x + barWidth / 2, y + barHeight / 2, `${this.nextLevel - 1}/${GAME_CONSTANTS.LEVELS.TOTAL}`, {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    createVictoryUI() {
        const buttonY = this.scale.height - 80;
        const centerX = this.scale.width / 2;
        
        if (this.gameComplete) {
            // Game complete buttons
            const playAgainButton = this.createVictoryButton(centerX - 100, buttonY, 'PLAY AGAIN', () => {
                this.playAgain();
            });
            
            const menuButton = this.createVictoryButton(centerX + 100, buttonY, 'MAIN MENU', () => {
                this.returnToMenu();
            });
            
        } else {
            // Level complete buttons
            const continueButton = this.createVictoryButton(centerX - 100, buttonY, 'CONTINUE', () => {
                this.continueToNextLevel();
            });
            
            const menuButton = this.createVictoryButton(centerX + 100, buttonY, 'MAIN MENU', () => {
                this.returnToMenu();
            });
        }
        
        // Credits and attribution
        this.createCredits();
    }
    
    createVictoryButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x6B46C1, 0.8);
        bg.lineStyle(2, 0xF59E0B);
        bg.fillRoundedRect(-80, -20, 160, 40, 8);
        bg.strokeRoundedRect(-80, -20, 160, 40, 8);
        
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        button.add([bg, buttonText]);
        button.setSize(160, 40);
        button.setInteractive();
        
        // Button hover effects
        button.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0x6B46C1, 1);
            bg.lineStyle(2, 0xFFFFFF);
            bg.fillRoundedRect(-80, -20, 160, 40, 8);
            bg.strokeRoundedRect(-80, -20, 160, 40, 8);
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
            bg.fillStyle(0x6B46C1, 0.8);
            bg.lineStyle(2, 0xF59E0B);
            bg.fillRoundedRect(-80, -20, 160, 40, 8);
            bg.strokeRoundedRect(-80, -20, 160, 40, 8);
            buttonText.setColor('#F59E0B');
            
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: callback
            });
        });
        
        return button;
    }
    
    createCredits() {
        const credits = this.add.text(this.scale.width / 2, this.scale.height - 30, [
            'NFT Art courtesy of collections on Stargaze',
            'Built with ❤️ for the Cosmos ecosystem'
        ].join(' • '), {
            fontSize: '6px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5);
        
        // Link to Stargaze
        credits.setInteractive();
        credits.on('pointerdown', () => {
            if (!this.playerData.demoMode) {
                window.open('https://app.stargaze.zone', '_blank');
            }
        });
    }
    
    createVictoryEffects() {
        // Particle celebration
        const particles = this.add.particles(this.scale.width / 2, 50, 'hero-sprite', {
            scale: { start: 0.2, end: 0 },
            speed: { min: 50, max: 150 },
            lifespan: 3000,
            quantity: 2,
            tint: [0xF59E0B, 0x10B981, 0x6B46C1, 0xEF4444],
            alpha: { start: 0.8, end: 0 },
            angle: { min: 0, max: 360 },
            gravityY: 100
        });
        
        particles.start();
        
        // Floating victory elements
        for (let i = 0; i < 5; i++) {
            const trophy = this.add.text(
                Phaser.Math.Between(50, this.scale.width - 50),
                this.scale.height + 50,
                ['🏆', '⭐', '💎', '🚀', '👑'][i],
                {
                    fontSize: '24px',
                    fill: '#F59E0B'
                }
            );
            
            this.tweens.add({
                targets: trophy,
                y: -50,
                rotation: Phaser.Math.PI2,
                duration: Phaser.Math.Between(8000, 12000),
                delay: i * 1000,
                ease: 'Power1',
                onComplete: () => trophy.destroy()
            });
            
            this.tweens.add({
                targets: trophy,
                x: trophy.x + Phaser.Math.Between(-100, 100),
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Screen flash effect for dramatic impact
        const flash = this.add.graphics();
        flash.fillStyle(0xFFFFFF, 0.8);
        flash.fillRect(0, 0, this.scale.width, this.scale.height);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
    }
    
    continueToNextLevel() {
        if (this.nextLevel && this.nextLevel <= GAME_CONSTANTS.LEVELS.TOTAL) {
            this.playerData.currentLevel = this.nextLevel;
            this.scene.start('GameScene', { playerData: this.playerData });
        } else {
            // This shouldn't happen, but fallback to menu
            this.returnToMenu();
        }
    }
    
    playAgain() {
        // Reset player data for new game
        const newPlayerData = {
            level: 1,
            experience: 0,
            currentLevel: 1,
            stats: { ...GAME_CONSTANTS.PLAYER.BASE_STATS },
            demoMode: this.playerData.demoMode
        };
        
        this.scene.start('GameScene', { playerData: newPlayerData });
    }
    
    returnToMenu() {
        this.scene.start('MenuScene');
    }
    
    update() {
        // Add some ambient movement to background elements
        // This could include floating particles or gentle color shifts
    }
}