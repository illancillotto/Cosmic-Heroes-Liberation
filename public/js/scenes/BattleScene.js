export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
        this.playerData = null;
        this.enemy = null;
        this.currentLevel = 1;
        this.gameScene = null;
        this.battleState = 'player_turn'; // 'player_turn', 'enemy_turn', 'victory', 'defeat'
        this.playerCurrentHP = 0;
        this.enemyCurrentHP = 0;
        this.turnCounter = 0;
    }
    
    init(data) {
        this.playerData = data.playerData;
        this.enemy = data.enemy;
        this.currentLevel = data.currentLevel;
        this.gameScene = data.gameScene;
        
        // Initialize battle HP
        this.playerCurrentHP = this.playerData.stats.health;
        this.enemyCurrentHP = this.enemy.stats.health;
    }
    
    create() {
        // Create battle arena
        this.createBattleArena();
        
        // Create battle UI
        this.createBattleUI();
        
        // Create player sprite
        this.createPlayerBattleSprite();
        
        // Create enemy sprite
        this.createEnemyBattleSprite();
        
        // Create action buttons
        this.createActionButtons();
        
        // Setup battle controls
        this.setupBattleControls();
        
        // Show battle intro
        this.showBattleIntro();
    }
    
    createBattleArena() {
        // Battle background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2D1B69, 0x2D1B69, 0x1E1B4B, 0x1E1B4B);
        bg.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Battle ground
        const ground = this.add.graphics();
        ground.fillStyle(0x374151);
        ground.fillRect(0, this.scale.height - 100, this.scale.width, 100);
        ground.lineStyle(2, 0x4B5563);
        ground.strokeRect(0, this.scale.height - 100, this.scale.width, 100);
        
        // Add battle atmosphere effects
        this.createBattleEffects();
    }
    
    createBattleEffects() {
        // Lightning/energy effects in background
        for (let i = 0; i < 20; i++) {
            const spark = this.add.circle(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height - 100),
                Phaser.Math.Between(1, 2),
                0xF59E0B,
                Phaser.Math.FloatBetween(0.3, 0.8)
            );
            
            this.tweens.add({
                targets: spark,
                alpha: 0,
                duration: Phaser.Math.Between(500, 2000),
                delay: Phaser.Math.Between(0, 3000),
                repeat: -1,
                yoyo: true
            });
        }
    }
    
    createBattleUI() {
        // Battle UI container
        this.battleUI = this.add.container(0, 0);
        
        // Top bar
        const topBar = this.add.graphics();
        topBar.fillStyle(0x000000, 0.8);
        topBar.fillRect(0, 0, this.scale.width, 50);
        topBar.lineStyle(2, 0xF59E0B);
        topBar.strokeRect(0, 0, this.scale.width, 50);
        
        // Battle title
        this.battleTitle = this.add.text(this.scale.width / 2, 25, 'COSMIC BATTLE', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B'
        }).setOrigin(0.5);
        
        // Turn indicator
        this.turnIndicator = this.add.text(20, 15, 'YOUR TURN', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981'
        });
        
        // Player stats (left side)
        this.createPlayerStats();
        
        // Enemy stats (right side)
        this.createEnemyStats();
        
        this.battleUI.add([topBar, this.battleTitle, this.turnIndicator]);
    }
    
    createPlayerStats() {
        const x = 20;
        const y = 70;
        
        // Player stat container
        const playerStatsBg = this.add.graphics();
        playerStatsBg.fillStyle(0x6B46C1, 0.8);
        playerStatsBg.lineStyle(1, 0xF59E0B);
        playerStatsBg.fillRoundedRect(x, y, 180, 100, 8);
        playerStatsBg.strokeRoundedRect(x, y, 180, 100, 8);
        
        this.playerStatsTitle = this.add.text(x + 10, y + 10, 'HERO', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B'
        });
        
        this.playerStatsText = this.add.text(x + 10, y + 30, [
            `Level: ${this.playerData.level}`,
            `HP: ${this.playerCurrentHP}/${this.playerData.stats.health}`,
            `ATK: ${this.playerData.stats.attack}`,
            `DEF: ${this.playerData.stats.defense}`
        ].join('\\n'), {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            lineSpacing: 2
        });
        
        // Player HP bar
        this.createPlayerHPBar(x + 10, y + 85);
        
        this.battleUI.add([playerStatsBg, this.playerStatsTitle, this.playerStatsText]);
    }
    
    createEnemyStats() {
        const x = this.scale.width - 200;
        const y = 70;
        
        // Enemy stat container
        const enemyStatsBg = this.add.graphics();
        enemyStatsBg.fillStyle(0xEF4444, 0.8);
        enemyStatsBg.lineStyle(1, 0xF59E0B);
        enemyStatsBg.fillRoundedRect(x, y, 180, 100, 8);
        enemyStatsBg.strokeRoundedRect(x, y, 180, 100, 8);
        
        this.enemyStatsTitle = this.add.text(x + 10, y + 10, this.enemy.collection.name.toUpperCase(), {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            wordWrap: { width: 160 }
        });
        
        this.enemyStatsText = this.add.text(x + 10, y + 35, [
            `HP: ${this.enemyCurrentHP}/${this.enemy.stats.health}`,
            `ATK: ${this.enemy.stats.attack}`,
            `DEF: ${this.enemy.stats.defense}`,
            `Floor: ${this.enemy.collection.floor_price} STARS`
        ].join('\\n'), {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            lineSpacing: 2
        });
        
        // Enemy HP bar
        this.createEnemyHPBar(x + 10, y + 85);
        
        // Attribution link
        const attribution = this.add.text(x + 10, y + 95, `From: ${this.enemy.collection.name}`, {
            fontSize: '6px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981'
        });
        
        attribution.setInteractive();
        attribution.on('pointerdown', () => {
            // Open collection link (if not demo mode)
            if (!this.playerData.demoMode) {
                window.open(`https://app.stargaze.zone/marketplace/${this.enemy.collection.collection_addr}`, '_blank');
            }
        });
        
        this.battleUI.add([enemyStatsBg, this.enemyStatsTitle, this.enemyStatsText, attribution]);
    }
    
    createPlayerHPBar(x, y) {
        this.playerHPBarBg = this.add.graphics();
        this.playerHPBarBg.fillStyle(0x374151);
        this.playerHPBarBg.fillRect(x, y, 160, 8);
        this.playerHPBarBg.lineStyle(1, 0x6B7280);
        this.playerHPBarBg.strokeRect(x, y, 160, 8);
        
        this.playerHPBar = this.add.graphics();
        this.updatePlayerHPBar(x, y);
        
        this.battleUI.add([this.playerHPBarBg, this.playerHPBar]);
    }
    
    createEnemyHPBar(x, y) {
        this.enemyHPBarBg = this.add.graphics();
        this.enemyHPBarBg.fillStyle(0x374151);
        this.enemyHPBarBg.fillRect(x, y, 160, 8);
        this.enemyHPBarBg.lineStyle(1, 0x6B7280);
        this.enemyHPBarBg.strokeRect(x, y, 160, 8);
        
        this.enemyHPBar = this.add.graphics();
        this.updateEnemyHPBar(x, y);
        
        this.battleUI.add([this.enemyHPBarBg, this.enemyHPBar]);
    }
    
    updatePlayerHPBar(x, y) {
        this.playerHPBar.clear();
        const hpPercentage = this.playerCurrentHP / this.playerData.stats.health;
        const barWidth = 160 * hpPercentage;
        const barColor = hpPercentage > 0.5 ? 0x10B981 : hpPercentage > 0.2 ? 0xF59E0B : 0xEF4444;
        
        this.playerHPBar.fillStyle(barColor);
        this.playerHPBar.fillRect(x, y, barWidth, 8);
    }
    
    updateEnemyHPBar(x, y) {
        this.enemyHPBar.clear();
        const hpPercentage = this.enemyCurrentHP / this.enemy.stats.health;
        const barWidth = 160 * hpPercentage;
        const barColor = hpPercentage > 0.5 ? 0x10B981 : hpPercentage > 0.2 ? 0xF59E0B : 0xEF4444;
        
        this.enemyHPBar.fillStyle(barColor);
        this.enemyHPBar.fillRect(x, y, barWidth, 8);
    }
    
    createPlayerBattleSprite() {
        this.playerSprite = this.add.sprite(150, this.scale.height - 150, 'hero-sprite');
        this.playerSprite.setScale(1.2);
        this.playerSprite.setTint(0x6B46C1);
        
        // Player glow effect
        const playerGlow = this.add.circle(150, this.scale.height - 150, 60, 0x6B46C1, 0.2);
        this.tweens.add({
            targets: playerGlow,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.4,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        // Idle animation
        this.tweens.add({
            targets: this.playerSprite,
            y: this.playerSprite.y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createEnemyBattleSprite() {
        this.enemySprite = this.add.sprite(this.scale.width - 150, this.scale.height - 150, 'enemy-sprite');
        this.enemySprite.setScale(1.2);
        this.enemySprite.setTint(0xEF4444);
        
        // Enemy glow effect
        const enemyGlow = this.add.circle(this.scale.width - 150, this.scale.height - 150, 60, 0xEF4444, 0.2);
        this.tweens.add({
            targets: enemyGlow,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.4,
            duration: 1800,
            yoyo: true,
            repeat: -1
        });
        
        // Idle animation
        this.tweens.add({
            targets: this.enemySprite,
            x: this.enemySprite.x - 10,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createActionButtons() {
        const buttonY = this.scale.height - 40;
        const centerX = this.scale.width / 2;
        const spacing = 120;
        
        // Attack button
        this.attackButton = this.createBattleButton(centerX - spacing, buttonY, '⚔️ ATTACK', () => {
            this.playerAttack();
        });
        
        // Magic button (if player has magic > 0)
        if (this.playerData.stats.magic > 0) {
            this.magicButton = this.createBattleButton(centerX, buttonY, '✨ MAGIC', () => {
                this.playerMagicAttack();
            });
        }
        
        // Flee button
        this.fleeButton = this.createBattleButton(centerX + spacing, buttonY, '🏃 FLEE', () => {
            this.playerFlee();
        });
        
        this.actionButtons = [this.attackButton, this.magicButton, this.fleeButton].filter(Boolean);
        
        // Initially enable buttons
        this.setButtonsEnabled(true);
    }
    
    createBattleButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x6B46C1, 0.8);
        bg.lineStyle(2, 0xF59E0B);
        bg.fillRoundedRect(-50, -15, 100, 30, 8);
        bg.strokeRoundedRect(-50, -15, 100, 30, 8);
        
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        button.add([bg, buttonText]);
        button.setSize(100, 30);
        button.setInteractive();
        
        // Button interactions
        button.on('pointerover', () => {
            if (button.enabled !== false) {
                bg.clear();
                bg.fillStyle(0x6B46C1, 1);
                bg.lineStyle(2, 0xFFFFFF);
                bg.fillRoundedRect(-50, -15, 100, 30, 8);
                bg.strokeRoundedRect(-50, -15, 100, 30, 8);
                buttonText.setColor('#FFFFFF');
            }
        });
        
        button.on('pointerout', () => {
            if (button.enabled !== false) {
                bg.clear();
                bg.fillStyle(0x6B46C1, 0.8);
                bg.lineStyle(2, 0xF59E0B);
                bg.fillRoundedRect(-50, -15, 100, 30, 8);
                bg.strokeRoundedRect(-50, -15, 100, 30, 8);
                buttonText.setColor('#F59E0B');
            }
        });
        
        button.on('pointerdown', () => {
            if (button.enabled !== false && this.battleState === 'player_turn') {
                this.tweens.add({
                    targets: button,
                    scaleX: 0.9,
                    scaleY: 0.9,
                    duration: 100,
                    yoyo: true,
                    onComplete: callback
                });
            }
        });
        
        // Store references for enabling/disabling
        button.bg = bg;
        button.text = buttonText;
        button.enabled = true;
        
        return button;
    }
    
    setButtonsEnabled(enabled) {
        this.actionButtons.forEach(button => {
            button.enabled = enabled;
            if (enabled) {
                button.bg.clear();
                button.bg.fillStyle(0x6B46C1, 0.8);
                button.bg.lineStyle(2, 0xF59E0B);
                button.bg.fillRoundedRect(-50, -15, 100, 30, 8);
                button.bg.strokeRoundedRect(-50, -15, 100, 30, 8);
                button.text.setColor('#F59E0B');
                button.setAlpha(1);
            } else {
                button.bg.clear();
                button.bg.fillStyle(0x4B5563, 0.5);
                button.bg.lineStyle(1, 0x6B7280);
                button.bg.fillRoundedRect(-50, -15, 100, 30, 8);
                button.bg.strokeRoundedRect(-50, -15, 100, 30, 8);
                button.text.setColor('#6B7280');
                button.setAlpha(0.6);
            }
        });
    }
    
    setupBattleControls() {
        // ESC to flee
        this.input.keyboard.on('keydown-ESC', () => {
            this.playerFlee();
        });
        
        // Number keys for quick actions
        this.input.keyboard.on('keydown-ONE', () => {
            if (this.battleState === 'player_turn') this.playerAttack();
        });
        
        this.input.keyboard.on('keydown-TWO', () => {
            if (this.battleState === 'player_turn' && this.magicButton) this.playerMagicAttack();
        });
    }
    
    showBattleIntro() {
        const intro = this.add.text(this.scale.width / 2, this.scale.height / 2, [
            `A wild ${this.enemy.collection.name.toUpperCase()} appears!`,
            '',
            'Choose your action wisely...'
        ].join('\\n'), {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: intro,
            alpha: 0,
            y: intro.y - 50,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => intro.destroy()
        });
    }
    
    playerAttack() {
        if (this.battleState !== 'player_turn') return;
        
        this.battleState = 'animating';
        this.setButtonsEnabled(false);
        
        // Calculate damage
        const damage = this.calculateDamage(this.playerData.stats.attack, this.enemy.stats.defense);
        this.enemyCurrentHP = Math.max(0, this.enemyCurrentHP - damage);
        
        // Attack animation
        this.playerAttackAnimation(() => {
            this.showDamageNumber(this.scale.width - 150, this.scale.height - 200, damage, '#EF4444');
            this.updateEnemyStats();
            
            if (this.enemyCurrentHP <= 0) {
                this.battleState = 'victory';
                this.victory();
            } else {
                this.battleState = 'enemy_turn';
                this.enemyTurn();
            }
        });
    }
    
    playerMagicAttack() {
        if (this.battleState !== 'player_turn') return;
        
        this.battleState = 'animating';
        this.setButtonsEnabled(false);
        
        // Calculate magic damage (ignores defense partially)
        const baseDamage = this.playerData.stats.magic * 2;
        const damage = Math.floor(baseDamage - (this.enemy.stats.defense * 0.3));
        this.enemyCurrentHP = Math.max(0, this.enemyCurrentHP - damage);
        
        // Magic animation
        this.playerMagicAnimation(() => {
            this.showDamageNumber(this.scale.width - 150, this.scale.height - 200, damage, '#9333EA');
            this.updateEnemyStats();
            
            if (this.enemyCurrentHP <= 0) {
                this.battleState = 'victory';
                this.victory();
            } else {
                this.battleState = 'enemy_turn';
                this.enemyTurn();
            }
        });
    }
    
    enemyTurn() {
        this.turnIndicator.setText('ENEMY TURN');
        this.turnIndicator.setColor('#EF4444');
        
        this.time.delayedCall(1000, () => {
            const damage = this.calculateDamage(this.enemy.stats.attack, this.playerData.stats.defense);
            this.playerCurrentHP = Math.max(0, this.playerCurrentHP - damage);
            
            this.enemyAttackAnimation(() => {
                this.showDamageNumber(150, this.scale.height - 200, damage, '#EF4444');
                this.updatePlayerStats();
                
                if (this.playerCurrentHP <= 0) {
                    this.battleState = 'defeat';
                    this.defeat();
                } else {
                    this.battleState = 'player_turn';
                    this.turnIndicator.setText('YOUR TURN');
                    this.turnIndicator.setColor('#10B981');
                    this.setButtonsEnabled(true);
                }
            });
        });
    }
    
    calculateDamage(attack, defense) {
        const baseDamage = attack;
        const damage = Math.max(1, baseDamage - Math.floor(defense * 0.7));
        return damage + Phaser.Math.Between(-3, 3); // Add some randomness
    }
    
    playerAttackAnimation(callback) {
        this.tweens.add({
            targets: this.playerSprite,
            x: this.playerSprite.x + 50,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                this.enemyHitAnimation();
                callback();
            }
        });
    }
    
    playerMagicAnimation(callback) {
        // Create magic effect
        const magicEffect = this.add.circle(this.scale.width - 150, this.scale.height - 150, 80, 0x9333EA, 0.5);
        
        this.tweens.add({
            targets: magicEffect,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                magicEffect.destroy();
                this.enemyHitAnimation();
                callback();
            }
        });
    }
    
    enemyAttackAnimation(callback) {
        this.tweens.add({
            targets: this.enemySprite,
            x: this.enemySprite.x - 50,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                this.playerHitAnimation();
                callback();
            }
        });
    }
    
    playerHitAnimation() {
        this.tweens.add({
            targets: this.playerSprite,
            tint: 0xFF0000,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.playerSprite.setTint(0x6B46C1);
            }
        });
    }
    
    enemyHitAnimation() {
        this.tweens.add({
            targets: this.enemySprite,
            tint: 0xFF6666,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.enemySprite.setTint(0xEF4444);
            }
        });
    }
    
    showDamageNumber(x, y, damage, color) {
        const damageText = this.add.text(x, y, `-${damage}`, {
            fontSize: '20px',
            fontFamily: 'Press Start 2P, monospace',
            fill: color
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
    }
    
    updatePlayerStats() {
        this.playerStatsText.setText([
            `Level: ${this.playerData.level}`,
            `HP: ${this.playerCurrentHP}/${this.playerData.stats.health}`,
            `ATK: ${this.playerData.stats.attack}`,
            `DEF: ${this.playerData.stats.defense}`
        ].join('\\n'));
        
        this.updatePlayerHPBar(30, 155);
    }
    
    updateEnemyStats() {
        this.enemyStatsText.setText([
            `HP: ${this.enemyCurrentHP}/${this.enemy.stats.health}`,
            `ATK: ${this.enemy.stats.attack}`,
            `DEF: ${this.enemy.stats.defense}`,
            `Floor: ${this.enemy.collection.floor_price} STARS`
        ].join('\\n'));
        
        this.updateEnemyHPBar(this.scale.width - 190, 155);
    }
    
    victory() {
        this.setButtonsEnabled(false);
        
        // Victory animation
        this.tweens.add({
            targets: this.enemySprite,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 1000
        });
        
        const victoryText = this.add.text(this.scale.width / 2, this.scale.height / 2, [
            'VICTORY!',
            '',
            `${this.enemy.collection.name} has been liberated!`,
            '',
            'Tap to continue...'
        ].join('\\n'), {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5);
        
        // Victory effect
        const particles = this.add.particles(this.scale.width / 2, this.scale.height / 2, 'hero-sprite', {
            scale: { start: 0.3, end: 0 },
            speed: { min: 50, max: 150 },
            lifespan: 2000,
            quantity: 5,
            tint: 0x10B981,
            alpha: { start: 0.7, end: 0 }
        });
        
        // Make clickable to continue
        this.input.once('pointerdown', () => {
            // Award experience
            const xpGain = Math.floor(this.enemy.collection.floor_price * 0.5) + (this.currentLevel * 20);
            this.playerData.experience += xpGain;
            
            // Return to game scene and mark enemy as defeated
            if (this.gameScene && this.gameScene.scene.isActive()) {
                this.gameScene.onEnemyDefeated(this.enemy);
                this.scene.resume('GameScene');
                this.scene.stop();
            } else {
                this.scene.start('GameScene', { playerData: this.playerData });
            }
        });
        
        particles.start();
    }
    
    defeat() {
        this.setButtonsEnabled(false);
        
        const defeatText = this.add.text(this.scale.width / 2, this.scale.height / 2, [
            'DEFEAT!',
            '',
            'The cosmic forces were too strong...',
            '',
            'Tap to try again...'
        ].join('\\n'), {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#EF4444',
            align: 'center'
        }).setOrigin(0.5);
        
        // Make clickable to restart
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene', { playerData: this.playerData });
        });
    }
    
    playerFlee() {
        if (this.battleState === 'animating') return;
        
        const fleeText = this.add.text(this.scale.width / 2, this.scale.height / 2, [
            'RETREATING...',
            '',
            'You escape back to safety!'
        ].join('\\n'), {
            fontSize: '14px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
            this.scene.start('GameScene', { playerData: this.playerData });
        });
    }
}