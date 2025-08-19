import { GAME_CONSTANTS, API_CONFIG } from '../utils/gameConfig.js';

export class NFTEnemy {
    constructor(scene, x, y, collectionData, level = 1) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.collectionData = collectionData;
        this.level = level;
        
        // Calculate stats based on NFT collection data
        this.stats = this.calculateStats();
        this.currentHP = this.stats.health;
        
        // Visual elements
        this.sprite = null;
        this.healthBar = null;
        this.nameTag = null;
        this.collectionInfo = null;
        
        // Battle state
        this.isAlive = true;
        this.isDefeated = false;
        this.statusEffects = [];
        
        this.init();
    }
    
    calculateStats() {
        const baseStats = { ...GAME_CONSTANTS.ENEMIES.BASE_STATS };
        const multiplier = GAME_CONSTANTS.ENEMIES.STAT_MULTIPLIER;
        const levelMultiplier = this.level * 0.5;
        const floorPrice = this.collectionData.floor_price || 0;
        
        // Calculate stats based on NFT collection metrics
        const volumeBonus = Math.floor((this.collectionData.volume_7d || 0) * 0.0001);
        const rarityBonus = Math.floor(10000 / (this.collectionData.total_supply || 10000));
        
        return {
            health: Math.floor(baseStats.health + (floorPrice * multiplier * 2) + volumeBonus + (baseStats.health * levelMultiplier)),
            attack: Math.floor(baseStats.attack + (floorPrice * multiplier) + rarityBonus + (baseStats.attack * levelMultiplier)),
            defense: Math.floor(baseStats.defense + (floorPrice * multiplier * 0.5) + (baseStats.defense * levelMultiplier)),
            magic: Math.floor(baseStats.magic + (floorPrice * multiplier * 0.3) + (baseStats.magic * levelMultiplier)),
            speed: Math.floor(baseStats.speed || 10 + rarityBonus * 0.1)
        };
    }
    
    init() {
        this.createSprite();
        this.createHealthBar();
        this.createNameTag();
        this.createCollectionInfo();
        this.setupAnimations();
    }
    
    createSprite() {
        // Create enemy sprite with collection-based appearance
        this.sprite = this.scene.add.sprite(this.x, this.y, 'enemy-sprite');
        this.sprite.setScale(0.7);
        this.sprite.setOrigin(0.5, 1);
        
        // Tint based on collection rarity/value
        const tint = this.getCollectionTint();
        this.sprite.setTint(tint);
        
        // Add collection image overlay if available
        if (this.collectionData.image) {
            this.loadCollectionImage();
        }
        
        // Add glow effect based on rarity
        this.glowEffect = this.scene.add.circle(this.x, this.y - 30, 35, tint, 0.3);
        this.glowEffect.setBlendMode('ADD');
        
        // Make interactive
        this.sprite.setInteractive();
        this.setupInteractions();
    }
    
    getCollectionTint() {
        const floorPrice = this.collectionData.floor_price || 0;
        
        if (floorPrice >= 1000) {
            return 0xFFD700; // Legendary - Gold
        } else if (floorPrice >= 500) {
            return 0x9333EA; // Epic - Purple
        } else if (floorPrice >= 100) {
            return 0x3B82F6; // Rare - Blue
        } else if (floorPrice >= 50) {
            return 0x10B981; // Uncommon - Green
        } else {
            return 0xEF4444; // Common - Red
        }
    }
    
    async loadCollectionImage() {
        try {
            // Create a texture from the collection image URL
            const imageKey = `collection_${this.collectionData.collection_addr}`;
            
            if (!this.scene.textures.exists(imageKey)) {
                this.scene.load.image(imageKey, this.collectionData.image);
                this.scene.load.once('complete', () => {
                    if (this.scene.textures.exists(imageKey)) {
                        // Replace sprite texture with collection image
                        this.sprite.setTexture(imageKey);
                        this.sprite.setDisplaySize(80, 80);
                    }
                });
                this.scene.load.start();
            } else {
                this.sprite.setTexture(imageKey);
                this.sprite.setDisplaySize(80, 80);
            }
        } catch (error) {
            console.warn('Failed to load collection image:', error);
            // Keep using the default sprite
        }
    }
    
    createHealthBar() {
        const barWidth = 60;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - 90;
        
        // Background
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x374151);
        this.healthBarBg.fillRect(barX, barY, barWidth, barHeight);
        this.healthBarBg.lineStyle(1, 0x6B7280);
        this.healthBarBg.strokeRect(barX, barY, barWidth, barHeight);
        
        // Health bar
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }
    
    createNameTag() {
        // Collection name
        this.nameTag = this.scene.add.text(this.x, this.y - 100, this.collectionData.name.toUpperCase(), {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#EF4444',
            align: 'center',
            wordWrap: { width: 100 }
        }).setOrigin(0.5, 0);
        
        // Enemy level
        this.levelTag = this.scene.add.text(this.x + 40, this.y - 80, `LV.${this.level}`, {
            fontSize: '6px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5, 0);
    }
    
    createCollectionInfo() {
        // Collection stats display
        this.collectionInfo = this.scene.add.text(this.x, this.y + 50, [
            `Floor: ${this.collectionData.floor_price || 0} STARS`,
            `Supply: ${this.formatNumber(this.collectionData.total_supply || 0)}`,
            `Vol 7d: ${this.formatNumber(this.collectionData.volume_7d || 0)}`
        ].join('\\n'), {
            fontSize: '6px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Verification badge
        if (this.collectionData.verified) {
            this.verifiedBadge = this.scene.add.text(this.x - 45, this.y - 70, '✓', {
                fontSize: '12px',
                fill: '#10B981'
            }).setOrigin(0.5);
        }
        
        // Attribution link
        this.attributionLink = this.scene.add.text(this.x, this.y + 80, 'View on Stargaze', {
            fontSize: '5px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#6366F1',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        this.attributionLink.setInteractive();
        this.attributionLink.on('pointerdown', () => {
            this.openCollectionLink();
        });
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    setupAnimations() {
        // Idle animation
        this.idleAnimation = this.scene.tweens.add({
            targets: this.sprite,
            x: this.x - 8,
            duration: 1500 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glow animation
        this.scene.tweens.add({
            targets: this.glowEffect,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.1,
            duration: 2000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    setupInteractions() {
        this.sprite.on('pointerover', () => {
            if (!this.isDefeated) {
                // Hover effect
                this.sprite.setTint(0xFF6666);
                this.scene.tweens.add({
                    targets: this.sprite,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 100
                });
                
                // Show detailed stats
                this.showDetailedStats();
            }
        });
        
        this.sprite.on('pointerout', () => {
            if (!this.isDefeated) {
                this.sprite.setTint(this.getCollectionTint());
                this.scene.tweens.add({
                    targets: this.sprite,
                    scaleX: 0.7,
                    scaleY: 0.7,
                    duration: 100
                });
                
                this.hideDetailedStats();
            }
        });
        
        this.sprite.on('pointerdown', () => {
            if (!this.isDefeated) {
                this.onBattleStart();
            }
        });
    }
    
    showDetailedStats() {
        if (this.detailedStats) return;
        
        this.detailedStats = this.scene.add.container(this.x, this.y - 120);
        
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.lineStyle(1, 0xF59E0B);
        bg.fillRoundedRect(-80, -30, 160, 60, 8);
        bg.strokeRoundedRect(-80, -30, 160, 60, 8);
        
        const statsText = this.scene.add.text(0, 0, [
            `HP: ${this.currentHP}/${this.stats.health}`,
            `ATK: ${this.stats.attack} | DEF: ${this.stats.defense}`,
            `MAG: ${this.stats.magic} | SPD: ${this.stats.speed}`,
            '',
            'Click to battle!'
        ].join('\\n'), {
            fontSize: '6px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
        
        this.detailedStats.add([bg, statsText]);
    }
    
    hideDetailedStats() {
        if (this.detailedStats) {
            this.detailedStats.destroy();
            this.detailedStats = null;
        }
    }
    
    updateHealthBar() {
        if (!this.healthBar) return;
        
        const barWidth = 60;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - 90;
        
        this.healthBar.clear();
        
        const healthPercentage = this.currentHP / this.stats.health;
        const fillWidth = barWidth * healthPercentage;
        
        // Color based on health
        let barColor;
        if (healthPercentage > 0.6) {
            barColor = 0x10B981;
        } else if (healthPercentage > 0.3) {
            barColor = 0xF59E0B;
        } else {
            barColor = 0xEF4444;
        }
        
        this.healthBar.fillStyle(barColor);
        this.healthBar.fillRect(barX, barY, fillWidth, barHeight);
    }
    
    // Combat methods
    takeDamage(damage) {
        if (this.isDefeated) return 0;
        
        const actualDamage = Math.max(1, damage);
        this.currentHP = Math.max(0, this.currentHP - actualDamage);
        
        this.updateHealthBar();
        this.takeDamageAnimation();
        this.showDamageNumber(actualDamage);
        
        if (this.currentHP <= 0) {
            this.defeat();
        }
        
        return actualDamage;
    }
    
    performAttack(target) {
        if (this.isDefeated) return 0;
        
        const damage = this.calculateAttackDamage(target);
        this.attackAnimation();
        return damage;
    }
    
    calculateAttackDamage(target) {
        const baseDamage = this.stats.attack;
        const targetDefense = target.getDefense ? target.getDefense() : 0;
        const damage = Math.max(1, baseDamage - Math.floor(targetDefense * 0.6));
        
        // Add variance based on collection volatility
        const variance = damage * 0.15;
        return Math.floor(damage + (Math.random() * variance * 2 - variance));
    }
    
    getDefense() {
        return this.stats.defense;
    }
    
    // Animation methods
    attackAnimation() {
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.x - 30,
            scaleX: 0.8,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Attack effect
        const attackEffect = this.scene.add.circle(this.x - 40, this.y - 20, 15, 0xEF4444, 0.8);
        this.scene.tweens.add({
            targets: attackEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => attackEffect.destroy()
        });
    }
    
    takeDamageAnimation() {
        // Damage flash
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xFFFFFF,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                if (!this.isDefeated) {
                    this.sprite.setTint(this.getCollectionTint());
                }
            }
        });
        
        // Shake effect
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3
        });
    }
    
    showDamageNumber(damage) {
        const damageText = this.scene.add.text(this.x + Math.random() * 20 - 10, this.y - 60, `-${damage}`, {
            fontSize: '12px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#EF4444'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
    }
    
    defeat() {
        this.isDefeated = true;
        this.isAlive = false;
        
        // Defeat animation
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            scaleX: 0.5,
            scaleY: 0.5,
            tint: 0x666666,
            duration: 1000
        });
        
        // Update UI elements
        if (this.nameTag) this.nameTag.setColor('#666666');
        if (this.levelTag) this.levelTag.setColor('#666666');
        if (this.collectionInfo) this.collectionInfo.setColor('#666666');
        
        // Liberation effect
        this.liberationEffect();
        
        // Stop animations
        if (this.idleAnimation) {
            this.idleAnimation.destroy();
        }
        
        // Disable interactions
        this.sprite.removeInteractive();
    }
    
    liberationEffect() {
        // Particles for liberation
        const liberationParticles = this.scene.add.particles(this.x, this.y - 40, 'hero-sprite', {
            scale: { start: 0.2, end: 0 },
            speed: { min: 30, max: 80 },
            lifespan: 2000,
            quantity: 8,
            tint: [0x10B981, 0xF59E0B],
            alpha: { start: 0.8, end: 0 }
        });
        
        // Liberation text
        const liberationText = this.scene.add.text(this.x, this.y - 80, 'LIBERATED!', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: liberationText,
            y: liberationText.y - 40,
            alpha: 0,
            duration: 2000,
            onComplete: () => liberationText.destroy()
        });
        
        liberationParticles.start();
        this.scene.time.delayedCall(2000, () => liberationParticles.destroy());
    }
    
    // Utility methods
    onBattleStart() {
        // Emit battle start event
        const event = new CustomEvent('nftEnemyBattleStart', {
            detail: {
                enemy: this,
                collection: this.collectionData,
                stats: this.stats
            }
        });
        window.dispatchEvent(event);
    }
    
    openCollectionLink() {
        const url = `${API_CONFIG.STARGAZE.MARKETPLACE_BASE}${this.collectionData.collection_addr}`;
        window.open(url, '_blank');
    }
    
    // Cleanup
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.glowEffect) this.glowEffect.destroy();
        if (this.nameTag) this.nameTag.destroy();
        if (this.levelTag) this.levelTag.destroy();
        if (this.collectionInfo) this.collectionInfo.destroy();
        if (this.verifiedBadge) this.verifiedBadge.destroy();
        if (this.attributionLink) this.attributionLink.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.detailedStats) this.detailedStats.destroy();
        
        if (this.idleAnimation) this.idleAnimation.destroy();
    }
    
    // Serialization
    serialize() {
        return {
            collectionData: this.collectionData,
            level: this.level,
            currentHP: this.currentHP,
            stats: this.stats,
            position: { x: this.x, y: this.y },
            isDefeated: this.isDefeated
        };
    }
    
    static deserialize(scene, serializedData) {
        const enemy = new NFTEnemy(
            scene,
            serializedData.position.x,
            serializedData.position.y,
            serializedData.collectionData,
            serializedData.level
        );
        
        enemy.currentHP = serializedData.currentHP;
        enemy.stats = serializedData.stats;
        
        if (serializedData.isDefeated) {
            enemy.defeat();
        }
        
        return enemy;
    }
}