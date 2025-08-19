import { GAME_CONSTANTS } from '../utils/gameConfig.js';

export class Player {
    constructor(scene, x, y, playerData = null) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // Initialize player data
        this.data = playerData || this.createDefaultPlayerData();
        
        // Create player sprite
        this.sprite = null;
        this.healthBar = null;
        this.statusEffects = [];
        
        this.init();
    }
    
    createDefaultPlayerData() {
        return {
            level: 1,
            experience: 0,
            currentLevel: 1,
            stats: { ...GAME_CONSTANTS.PLAYER.BASE_STATS },
            demoMode: false,
            skills: {
                swordMastery: 0,
                magicPower: 0,
                defense: 0,
                vitality: 0
            },
            inventory: [],
            achievements: []
        };
    }
    
    init() {
        this.createSprite();
        this.createHealthBar();
        this.setupAnimations();
    }
    
    createSprite() {
        this.sprite = this.scene.add.sprite(this.x, this.y, 'hero-sprite');
        this.sprite.setScale(0.8);
        this.sprite.setTint(0x6B46C1);
        this.sprite.setOrigin(0.5, 1);
        
        // Add glow effect
        this.glowEffect = this.scene.add.circle(this.x, this.y, 40, 0x6B46C1, 0.2);
        this.glowEffect.setBlendMode('ADD');
        
        // Player name tag
        this.nameTag = this.scene.add.text(this.x, this.y - 100, 'COSMIC HERO', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Level indicator
        this.levelIndicator = this.scene.add.text(this.x - 40, this.y - 80, `LV.${this.data.level}`, {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center'
        }).setOrigin(0.5, 0);
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
    
    setupAnimations() {
        // Idle animation
        this.idleAnimation = this.scene.tweens.add({
            targets: this.sprite,
            y: this.y - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glow animation
        this.scene.tweens.add({
            targets: this.glowEffect,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.4,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    updateHealthBar() {
        if (!this.healthBar) return;
        
        const barWidth = 60;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - 90;
        
        this.healthBar.clear();
        
        const healthPercentage = this.getCurrentHP() / this.getMaxHP();
        const fillWidth = barWidth * healthPercentage;
        
        // Determine color based on health percentage
        let barColor;
        if (healthPercentage > 0.6) {
            barColor = 0x10B981; // Green
        } else if (healthPercentage > 0.3) {
            barColor = 0xF59E0B; // Orange
        } else {
            barColor = 0xEF4444; // Red
        }
        
        this.healthBar.fillStyle(barColor);
        this.healthBar.fillRect(barX, barY, fillWidth, barHeight);
    }
    
    // Stats and progression methods
    getCurrentHP() {
        return this.data.currentHP || this.data.stats.health;
    }
    
    getMaxHP() {
        return this.data.stats.health;
    }
    
    setCurrentHP(value) {
        this.data.currentHP = Math.max(0, Math.min(value, this.getMaxHP()));
        this.updateHealthBar();
        
        // Visual feedback for health changes
        if (value < this.getCurrentHP()) {
            this.takeDamageAnimation();
        }
    }
    
    heal(amount) {
        const oldHP = this.getCurrentHP();
        this.setCurrentHP(oldHP + amount);
        this.healAnimation(amount);
    }
    
    takeDamage(damage) {
        const oldHP = this.getCurrentHP();
        this.setCurrentHP(oldHP - damage);
        this.takeDamageAnimation();
        return damage;
    }
    
    isAlive() {
        return this.getCurrentHP() > 0;
    }
    
    getAttackPower() {
        const baseAttack = this.data.stats.attack;
        const skillBonus = this.data.skills.swordMastery * 2;
        const levelBonus = Math.floor(this.data.level / 2);
        return baseAttack + skillBonus + levelBonus;
    }
    
    getMagicPower() {
        const baseMagic = this.data.stats.magic;
        const skillBonus = this.data.skills.magicPower * 3;
        const levelBonus = Math.floor(this.data.level / 3);
        return baseMagic + skillBonus + levelBonus;
    }
    
    getDefense() {
        const baseDefense = this.data.stats.defense;
        const skillBonus = this.data.skills.defense * 2;
        const levelBonus = Math.floor(this.data.level / 4);
        return baseDefense + skillBonus + levelBonus;
    }
    
    // Experience and leveling
    gainExperience(amount) {
        this.data.experience += amount;
        const requiredXP = this.getRequiredXPForNextLevel();
        
        if (this.data.experience >= requiredXP) {
            this.levelUp();
        }
        
        this.showExperienceGain(amount);
    }
    
    getRequiredXPForNextLevel() {
        return this.data.level * 200 + Math.pow(this.data.level, 2) * 50;
    }
    
    levelUp() {
        this.data.level++;
        this.data.experience = Math.max(0, this.data.experience - this.getRequiredXPForNextLevel());
        
        // Increase stats
        const growth = GAME_CONSTANTS.PLAYER.STAT_GROWTH;
        this.data.stats.health += growth.health;
        this.data.stats.attack += growth.attack;
        this.data.stats.defense += growth.defense;
        this.data.stats.magic += growth.magic;
        
        // Heal to full on level up
        this.setCurrentHP(this.getMaxHP());
        
        // Update UI
        this.levelIndicator.setText(`LV.${this.data.level}`);
        
        // Level up animation and effects
        this.levelUpAnimation();
    }
    
    // Skill system
    allocateSkillPoint(skill) {
        if (this.getAvailableSkillPoints() > 0 && this.data.skills[skill] < 10) {
            this.data.skills[skill]++;
            return true;
        }
        return false;
    }
    
    getAvailableSkillPoints() {
        const totalPoints = Math.floor(this.data.level / 2);
        const usedPoints = Object.values(this.data.skills).reduce((sum, value) => sum + value, 0);
        return Math.max(0, totalPoints - usedPoints);
    }
    
    // Combat methods
    performAttack(target) {
        const damage = this.calculateAttackDamage(target);
        this.attackAnimation();
        return target.takeDamage(damage);
    }
    
    performMagicAttack(target) {
        const damage = this.calculateMagicDamage(target);
        this.magicAttackAnimation();
        return target.takeDamage(damage);
    }
    
    calculateAttackDamage(target) {
        const baseDamage = this.getAttackPower();
        const targetDefense = target.getDefense ? target.getDefense() : 0;
        const damage = Math.max(1, baseDamage - Math.floor(targetDefense * 0.7));
        
        // Add some randomness (±20%)
        const variance = damage * 0.2;
        return Math.floor(damage + (Math.random() * variance * 2 - variance));
    }
    
    calculateMagicDamage(target) {
        const baseDamage = this.getMagicPower() * 1.5;
        const targetDefense = target.getDefense ? target.getDefense() : 0;
        const damage = Math.max(1, baseDamage - Math.floor(targetDefense * 0.3));
        
        // Magic has less variance but ignores more defense
        const variance = damage * 0.1;
        return Math.floor(damage + (Math.random() * variance * 2 - variance));
    }
    
    // Animation methods
    attackAnimation() {
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.x + 30,
            scaleX: 1.1,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Attack effect
        const attackEffect = this.scene.add.circle(this.x + 40, this.y - 20, 20, 0xF59E0B, 0.7);
        this.scene.tweens.add({
            targets: attackEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => attackEffect.destroy()
        });
    }
    
    magicAttackAnimation() {
        // Magic circle effect
        const magicCircle = this.scene.add.circle(this.x, this.y - 40, 50, 0x9333EA, 0.5);
        magicCircle.setStrokeStyle(2, 0xA855F7);
        
        this.scene.tweens.add({
            targets: this.sprite,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
        
        this.scene.tweens.add({
            targets: magicCircle,
            rotation: Math.PI * 2,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 0,
            duration: 800,
            onComplete: () => magicCircle.destroy()
        });
    }
    
    takeDamageAnimation() {
        // Damage flash
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xFF4444,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.sprite.setTint(0x6B46C1);
            }
        });
        
        // Screen shake effect
        this.scene.cameras.main.shake(100, 0.01);
    }
    
    healAnimation(amount) {
        // Heal particles
        const healEffect = this.scene.add.particles(this.x, this.y - 40, 'hero-sprite', {
            scale: { start: 0.1, end: 0 },
            speed: { min: 20, max: 60 },
            lifespan: 1000,
            quantity: 3,
            tint: 0x10B981,
            alpha: { start: 0.7, end: 0 }
        });
        
        // Heal number
        this.showFloatingText(`+${amount}`, 0x10B981);
        
        healEffect.start();
        this.scene.time.delayedCall(1000, () => healEffect.destroy());
    }
    
    levelUpAnimation() {
        // Level up effect
        const levelUpEffect = this.scene.add.particles(this.x, this.y - 50, 'hero-sprite', {
            scale: { start: 0.3, end: 0 },
            speed: { min: 50, max: 100 },
            lifespan: 2000,
            quantity: 10,
            tint: 0xF59E0B,
            alpha: { start: 1, end: 0 }
        });
        
        // Level up text
        this.showFloatingText('LEVEL UP!', 0xF59E0B, 20);
        
        // Sprite flash
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xFFFFFF,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            onComplete: () => {
                this.sprite.setTint(0x6B46C1);
            }
        });
        
        levelUpEffect.start();
        this.scene.time.delayedCall(2000, () => levelUpEffect.destroy());
    }
    
    showExperienceGain(amount) {
        this.showFloatingText(`+${amount} XP`, 0x10B981, 12);
    }
    
    showFloatingText(text, color, size = 14) {
        const floatingText = this.scene.add.text(this.x, this.y - 80, text, {
            fontSize: `${size}px`,
            fontFamily: 'Press Start 2P, monospace',
            fill: `#${color.toString(16).padStart(6, '0')}`,
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: floatingText,
            y: floatingText.y - 40,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => floatingText.destroy()
        });
    }
    
    // Movement and positioning
    moveTo(x, y, duration = 1000) {
        this.scene.tweens.add({
            targets: [this.sprite, this.glowEffect, this.nameTag, this.levelIndicator, this.healthBarBg, this.healthBar],
            x: x,
            y: y,
            duration: duration,
            ease: 'Power2'
        });
        
        this.x = x;
        this.y = y;
    }
    
    // Cleanup
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.glowEffect) this.glowEffect.destroy();
        if (this.nameTag) this.nameTag.destroy();
        if (this.levelIndicator) this.levelIndicator.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        
        if (this.idleAnimation) this.idleAnimation.destroy();
    }
    
    // Save/load methods
    serialize() {
        return {
            data: this.data,
            position: { x: this.x, y: this.y }
        };
    }
    
    static deserialize(scene, serializedData) {
        const player = new Player(
            scene, 
            serializedData.position.x, 
            serializedData.position.y, 
            serializedData.data
        );
        return player;
    }
}