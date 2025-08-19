import { GAME_CONSTANTS } from '../utils/gameConfig.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.playerData = null;
        this.currentLevel = 1;
        this.enemies = [];
        this.nftCollections = [];
    }
    
    init(data) {
        this.playerData = data.playerData || {
            level: 1,
            experience: 0,
            currentLevel: 1,
            stats: { ...GAME_CONSTANTS.PLAYER.BASE_STATS },
            demoMode: true
        };
        this.currentLevel = this.playerData.currentLevel || 1;
    }
    
    async create() {
        // Create game world
        this.createBackground();
        this.createUI();
        
        // Load NFT data
        await this.loadNFTData();
        
        // Create player
        this.createPlayer();
        
        // Create level elements
        this.createLevel();
        
        // Setup input controls
        this.setupControls();
        
        // Show level intro
        this.showLevelIntro();
    }
    
    createBackground() {
        // Generate detailed background for current level
        import('../utils/backgroundGenerator.js').then(({ BackgroundGenerator }) => {
            const bgTexture = BackgroundGenerator.generateBackgroundForLevel(
                this, 
                this.currentLevel, 
                this.scale.width, 
                this.scale.height
            );
            
            // Add the generated background
            this.add.image(0, 0, bgTexture).setOrigin(0, 0);
            
        }).catch(() => {
            // Fallback to simple gradient
            const levelColors = [
                [0x1E1B4B, 0x312E81], // Cosmos Hub - Purple
                [0x1E3A8A, 0x3730A3], // Osmosis - Blue  
                [0x7C2D12, 0xB91C1C], // Juno - Orange/Red
                [0x166534, 0x15803D], // Stargaze - Green
                [0x7C2D12, 0x000000]  // Rugpuller Tower - Dark Red/Black
            ];
            
            const colors = levelColors[this.currentLevel - 1] || levelColors[0];
            const bg = this.add.graphics();
            bg.fillGradientStyle(colors[0], colors[0], colors[1], colors[1]);
            bg.fillRect(0, 0, this.scale.width, this.scale.height);
        });
        
        // Add atmospheric effects
        this.createAtmosphericEffects();
    }
    
    createAtmosphericEffects() {
        // Generate particle texture first
        import('../utils/assetGenerator.js').then(({ AssetGenerator }) => {
            AssetGenerator.generateParticleSprite(this);
            
            // Floating particles
            const particles = this.add.particles(0, 0, 'particle', {
                scale: { start: 0.3, end: 0 },
                speed: { min: 20, max: 80 },
                lifespan: 2000,
                quantity: 2,
                alpha: { start: 0.8, end: 0 },
                tint: 0xF59E0B
            });
            
            particles.startFollow(this.input.activePointer);
        }).catch(() => {
            // Fallback to simple circle particles
            this.add.graphics()
                .fillStyle(0xF59E0B)
                .fillCircle(4, 4, 4)
                .generateTexture('particle', 8, 8);
        });
    }
    
    createUI() {
        // Top UI Bar
        const uiBar = this.add.graphics();
        uiBar.fillStyle(0x000000, 0.7);
        uiBar.fillRect(0, 0, this.scale.width, 60);
        uiBar.lineStyle(2, 0xF59E0B);
        uiBar.strokeRect(0, 0, this.scale.width, 60);
        
        // Level indicator
        this.levelText = this.add.text(20, 20, `Level: ${this.currentLevel}/5`, {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B'
        });
        
        this.levelName = this.add.text(20, 40, GAME_CONSTANTS.LEVELS.NAMES[this.currentLevel - 1], {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF'
        });
        
        // Player stats (right side)
        const statsX = this.scale.width - 200;
        this.statsText = this.add.text(statsX, 15, [
            `HP: ${this.playerData.stats.health}`,
            `ATK: ${this.playerData.stats.attack} DEF: ${this.playerData.stats.defense}`,
            `XP: ${this.playerData.experience}`
        ].join('\\n'), {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            lineSpacing: 2
        });
        
        // Back to menu button
        this.createBackButton();
    }
    
    createBackButton() {
        const backButton = this.add.text(this.scale.width / 2, 30, '⬅ BACK', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#EF4444'
        }).setOrigin(0.5);
        
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        backButton.on('pointerover', () => {
            backButton.setColor('#FFFFFF');
        });
        
        backButton.on('pointerout', () => {
            backButton.setColor('#EF4444');
        });
    }
    
    async loadNFTData() {
        try {
            if (this.playerData.demoMode) {
                // Use mock data for demo
                const { MOCK_DATA } = await import('../utils/gameConfig.js');
                this.nftCollections = MOCK_DATA.collections;
            } else {
                // Load real NFT data
                const { fetchTopCollections } = await import('../api/stargaze.js');
                this.nftCollections = await fetchTopCollections();
            }
        } catch (error) {
            console.error('Failed to load NFT data:', error);
            // Fallback to mock data
            const { MOCK_DATA } = await import('../utils/gameConfig.js');
            this.nftCollections = MOCK_DATA.collections;
        }
    }
    
    createPlayer() {
        // Player sprite (hero character)
        this.player = this.add.sprite(100, this.scale.height - 150, 'hero-sprite');
        this.player.setScale(0.8);
        this.player.setTint(0x6B46C1);
        
        // Player name tag
        this.add.text(100, this.scale.height - 100, 'HERO', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Add subtle idle animation
        this.tweens.add({
            targets: this.player,
            y: this.player.y - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createLevel() {
        // Create castle/fortress based on current level
        this.createCastle();
        
        // Create enemies based on NFT collections
        this.createNFTEnemies();
        
        // Create level objectives
        this.createObjectives();
    }
    
    createCastle() {
        // Simple castle representation
        const castleX = this.scale.width - 150;
        const castleY = this.scale.height - 200;
        
        // Castle base
        const castle = this.add.graphics();
        castle.fillStyle(0x4B5563);
        castle.fillRect(castleX - 50, castleY, 100, 80);
        
        // Castle towers
        castle.fillRect(castleX - 60, castleY - 20, 20, 100);
        castle.fillRect(castleX + 40, castleY - 20, 20, 100);
        castle.fillRect(castleX - 20, castleY - 40, 40, 120);
        
        // Castle details
        castle.lineStyle(2, 0x6B7280);
        castle.strokeRect(castleX - 50, castleY, 100, 80);
        castle.strokeRect(castleX - 60, castleY - 20, 20, 100);
        castle.strokeRect(castleX + 40, castleY - 20, 20, 100);
        castle.strokeRect(castleX - 20, castleY - 40, 40, 120);
        
        // Castle flag/banner showing level
        const flag = this.add.text(castleX, castleY - 60, GAME_CONSTANTS.LEVELS.NAMES[this.currentLevel - 1], {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        this.castle = { graphics: castle, flag: flag, x: castleX, y: castleY };
    }
    
    createNFTEnemies() {
        this.enemies = [];
        const startX = 300;
        const spacing = 80;
        
        // Create up to 3 enemies for this level
        const enemyCount = Math.min(3, this.nftCollections.length);
        
        for (let i = 0; i < enemyCount; i++) {
            if (i >= this.nftCollections.length) break;
            
            const collection = this.nftCollections[i];
            const x = startX + (i * spacing);
            const y = this.scale.height - 150;
            
            // Create enemy sprite
            const enemy = this.add.sprite(x, y, 'enemy-sprite');
            enemy.setScale(0.7);
            enemy.setTint(0xEF4444);
            
            // Enemy stats based on NFT data
            const stats = this.calculateEnemyStats(collection);
            
            // Enemy info
            const nameText = this.add.text(x, y + 60, collection.name, {
                fontSize: '8px',
                fontFamily: 'Press Start 2P, monospace',
                fill: '#EF4444',
                align: 'center',
                wordWrap: { width: 100 }
            }).setOrigin(0.5, 0);
            
            const statsText = this.add.text(x, y + 90, `HP: ${stats.health}\\nATK: ${stats.attack}`, {
                fontSize: '6px',
                fontFamily: 'Press Start 2P, monospace',
                fill: '#FFFFFF',
                align: 'center'
            }).setOrigin(0.5, 0);
            
            // Make enemy interactive
            enemy.setInteractive();
            enemy.on('pointerdown', () => {
                this.startBattle(collection, stats);
            });
            
            enemy.on('pointerover', () => {
                enemy.setTint(0xFF6B6B);
                this.tweens.add({
                    targets: enemy,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 100
                });
            });
            
            enemy.on('pointerout', () => {
                enemy.setTint(0xEF4444);
                this.tweens.add({
                    targets: enemy,
                    scaleX: 0.7,
                    scaleY: 0.7,
                    duration: 100
                });
            });
            
            // Idle animation
            this.tweens.add({
                targets: enemy,
                x: x - 5,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.enemies.push({
                sprite: enemy,
                collection: collection,
                stats: stats,
                nameText: nameText,
                statsText: statsText,
                defeated: false
            });
        }
    }
    
    calculateEnemyStats(collection) {
        const baseStats = { ...GAME_CONSTANTS.ENEMIES.BASE_STATS };
        const multiplier = GAME_CONSTANTS.ENEMIES.STAT_MULTIPLIER;
        const levelMultiplier = this.currentLevel * 0.5;
        
        return {
            health: Math.floor(baseStats.health + (collection.floor_price * multiplier) + (baseStats.health * levelMultiplier)),
            attack: Math.floor(baseStats.attack + (collection.floor_price * multiplier * 0.5) + (baseStats.attack * levelMultiplier)),
            defense: Math.floor(baseStats.defense + (collection.floor_price * multiplier * 0.3) + (baseStats.defense * levelMultiplier)),
            magic: Math.floor(baseStats.magic + (collection.floor_price * multiplier * 0.2) + (baseStats.magic * levelMultiplier))
        };
    }
    
    createObjectives() {
        // Level objectives
        const objectiveText = this.add.text(this.scale.width / 2, 80, [
            'MISSION OBJECTIVES:',
            '• Defeat all NFT enemies',
            '• Liberate the castle',
            '• Grow stronger for the next level'
        ].join('\\n'), {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Make it fade out after showing
        this.tweens.add({
            targets: objectiveText,
            alpha: 0,
            delay: 5000,
            duration: 1000
        });
    }
    
    setupControls() {
        // Mobile-friendly controls
        this.input.on('pointerdown', (pointer, targets) => {
            if (targets.length === 0) {
                // Clicked empty space - show help or context menu
                this.showContextMenu(pointer.x, pointer.y);
            }
        });
        
        // Keyboard controls (for desktop)
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // ESC to return to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }
    
    showContextMenu(x, y) {
        // Quick action menu
        const menu = this.add.container(x, y);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRoundedRect(-80, -40, 160, 80, 8);
        bg.lineStyle(1, 0xF59E0B);
        bg.strokeRoundedRect(-80, -40, 160, 80, 8);
        
        const menuText = this.add.text(0, 0, [
            '⚔️ Click enemies to battle',
            '🏰 Defeat all to advance',
            '📊 Check stats above'
        ].join('\\n'), {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
        
        menu.add([bg, menuText]);
        
        // Auto-hide after 3 seconds
        this.tweens.add({
            targets: menu,
            alpha: 0,
            delay: 3000,
            duration: 500,
            onComplete: () => menu.destroy()
        });
    }
    
    startBattle(collection, enemyStats) {
        // Start battle scene with selected enemy
        this.scene.start('BattleScene', {
            playerData: this.playerData,
            enemy: {
                collection: collection,
                stats: enemyStats
            },
            currentLevel: this.currentLevel,
            gameScene: this
        });
    }
    
    showLevelIntro() {
        // Level introduction overlay
        const intro = this.add.container(this.scale.width / 2, this.scale.height / 2);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRect(-this.scale.width/2, -this.scale.height/2, this.scale.width, this.scale.height);
        
        const levelBg = this.add.graphics();
        levelBg.fillStyle(0x1E1B4B, 0.9);
        levelBg.lineStyle(2, 0xF59E0B);
        levelBg.fillRoundedRect(-200, -100, 400, 200, 16);
        levelBg.strokeRoundedRect(-200, -100, 400, 200, 16);
        
        const levelTitle = this.add.text(0, -50, `LEVEL ${this.currentLevel}`, {
            fontSize: '24px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B'
        }).setOrigin(0.5);
        
        const levelSubtitle = this.add.text(0, -10, GAME_CONSTANTS.LEVELS.NAMES[this.currentLevel - 1], {
            fontSize: '14px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const continueText = this.add.text(0, 40, 'TAP TO CONTINUE', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981'
        }).setOrigin(0.5);
        
        intro.add([bg, levelBg, levelTitle, levelSubtitle, continueText]);
        
        // Animate continue text
        this.tweens.add({
            targets: continueText,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Make clickable to dismiss
        bg.setInteractive();
        bg.on('pointerdown', () => {
            intro.destroy();
        });
        
        // Auto-dismiss after 5 seconds
        this.time.delayedCall(5000, () => {
            if (intro.active) {
                intro.destroy();
            }
        });
    }
    
    onEnemyDefeated(enemy) {
        // Mark enemy as defeated
        const enemyData = this.enemies.find(e => e.collection === enemy.collection);
        if (enemyData) {
            enemyData.defeated = true;
            enemyData.sprite.setTint(0x666666);
            enemyData.sprite.setAlpha(0.5);
            enemyData.nameText.setColor('#666666');
            enemyData.statsText.setColor('#666666');
        }
        
        // Check if all enemies defeated
        if (this.enemies.every(e => e.defeated)) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        // Award experience
        const xpGain = this.currentLevel * 100;
        this.playerData.experience += xpGain;
        
        // Level up if enough XP
        const requiredXP = this.playerData.level * 200;
        if (this.playerData.experience >= requiredXP) {
            this.playerData.level++;
            this.levelUpPlayer();
        }
        
        // Advance to next level or show victory
        if (this.currentLevel >= GAME_CONSTANTS.LEVELS.TOTAL) {
            this.scene.start('VictoryScene', { playerData: this.playerData });
        } else {
            this.playerData.currentLevel = this.currentLevel + 1;
            this.scene.start('VictoryScene', { 
                playerData: this.playerData,
                levelComplete: true,
                nextLevel: this.currentLevel + 1
            });
        }
    }
    
    levelUpPlayer() {
        // Increase player stats
        const growth = GAME_CONSTANTS.PLAYER.STAT_GROWTH;
        this.playerData.stats.health += growth.health;
        this.playerData.stats.attack += growth.attack;
        this.playerData.stats.defense += growth.defense;
        this.playerData.stats.magic += growth.magic;
        
        // Show level up effect
        this.showLevelUpEffect();
    }
    
    showLevelUpEffect() {
        const levelUpText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'LEVEL UP!', {
            fontSize: '32px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: levelUpText,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => levelUpText.destroy()
        });
    }
}