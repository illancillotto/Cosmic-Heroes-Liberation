import { GAME_CONSTANTS } from '../utils/gameConfig.js';

export class RugpullerWizard {
    constructor(scene, x, y, playerLevel = 5) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.playerLevel = playerLevel;
        
        // Boss-tier stats
        this.stats = this.calculateBossStats();
        this.currentHP = this.stats.health;
        this.maxHP = this.stats.health;
        
        // Boss phases
        this.phase = 1;
        this.maxPhases = 3;
        this.phaseThresholds = [0.66, 0.33, 0];
        
        // Visual elements
        this.sprite = null;
        this.healthBar = null;
        this.nameTag = null;
        this.phaseIndicator = null;
        
        // Battle state
        this.isAlive = true;
        this.isDefeated = false;
        this.lastAttackTime = 0;
        this.attackCooldown = 2000; // 2 seconds
        
        // Special abilities
        this.abilities = {
            rugPull: { cooldown: 5000, lastUsed: 0 },
            scamBlast: { cooldown: 3000, lastUsed: 0 },
            darkMagic: { cooldown: 7000, lastUsed: 0 },
            summonMinions: { cooldown: 10000, lastUsed: 0 }
        };
        
        // Minions
        this.minions = [];
        this.maxMinions = 2;
        
        this.init();
    }
    
    calculateBossStats() {
        const baseMultiplier = this.playerLevel * 2;
        
        return {
            health: 500 + (baseMultiplier * 50),
            attack: 40 + (baseMultiplier * 5),
            defense: 25 + (baseMultiplier * 3),
            magic: 60 + (baseMultiplier * 8),
            speed: 15
        };
    }
    
    init() {
        this.createSprite();
        this.createHealthBar();
        this.createNameTag();
        this.createPhaseIndicator();
        this.setupAnimations();
        this.createBossAura();
    }
    
    createSprite() {
        // Create imposing wizard sprite
        this.sprite = this.scene.add.sprite(this.x, this.y, 'enemy-sprite');
        this.sprite.setScale(1.5); // Larger than normal enemies
        this.sprite.setTint(0x4C1D95); // Dark purple for evil wizard
        this.sprite.setOrigin(0.5, 1);
        
        // Add wizard hat and robe details
        this.createWizardDetails();
        
        // Floating animation
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.y - 20,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createWizardDetails() {
        // Wizard hat
        this.hat = this.scene.add.triangle(this.x, this.y - 120, 0, 40, -20, 0, 20, 0, 0x1E1B4B);
        
        // Staff
        this.staff = this.scene.add.rectangle(this.x + 30, this.y - 60, 4, 60, 0x8B4513);
        this.staffOrb = this.scene.add.circle(this.x + 30, this.y - 90, 8, 0xDC2626);
        
        // Evil eyes
        this.leftEye = this.scene.add.circle(this.x - 10, this.y - 80, 3, 0xFF0000);
        this.rightEye = this.scene.add.circle(this.x + 10, this.y - 80, 3, 0xFF0000);
        
        // Eye glow animation
        this.scene.tweens.add({
            targets: [this.leftEye, this.rightEye],
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Staff orb glow
        this.scene.tweens.add({
            targets: this.staffOrb,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }
    
    createBossAura() {
        // Dark aura around the wizard
        this.aura = this.scene.add.circle(this.x, this.y - 40, 80, 0x4C1D95, 0.2);
        this.aura.setBlendMode('MULTIPLY');
        
        // Aura particles
        this.auraParticles = this.scene.add.particles(this.x, this.y - 40, 'enemy-sprite', {
            scale: { start: 0.1, end: 0 },
            speed: { min: 10, max: 30 },
            lifespan: 3000,
            quantity: 1,
            frequency: 200,
            tint: [0x4C1D95, 0x7C2D12, 0x1F2937],
            alpha: { start: 0.6, end: 0 }
        });
        
        this.auraParticles.start();
        
        // Pulsating aura
        this.scene.tweens.add({
            targets: this.aura,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.4,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
    }
    
    createHealthBar() {
        const barWidth = 200; // Wider for boss
        const barHeight = 12;
        const barX = this.x - barWidth / 2;
        const barY = this.y - 160;
        
        // Boss health bar background
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x000000, 0.8);
        this.healthBarBg.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        this.healthBarBg.lineStyle(2, 0xDC2626);
        this.healthBarBg.strokeRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
        
        // Phase markers on health bar
        this.createPhaseMarkers(barX, barY, barWidth, barHeight);
    }
    
    createPhaseMarkers(barX, barY, barWidth, barHeight) {
        this.phaseMarkers = this.scene.add.graphics();
        
        // Draw phase division lines
        for (let i = 1; i < this.maxPhases; i++) {
            const markerX = barX + (barWidth * this.phaseThresholds[i - 1]);
            this.phaseMarkers.lineStyle(2, 0xFFFFFF, 0.8);
            this.phaseMarkers.moveTo(markerX, barY);
            this.phaseMarkers.lineTo(markerX, barY + barHeight);
            this.phaseMarkers.strokePath();
        }
    }
    
    updateHealthBar() {
        if (!this.healthBar) return;
        
        const barWidth = 200;
        const barHeight = 12;
        const barX = this.x - barWidth / 2;
        const barY = this.y - 160;
        
        this.healthBar.clear();
        
        const healthPercentage = this.currentHP / this.maxHP;
        const fillWidth = barWidth * healthPercentage;
        
        // Color based on phase
        let barColor;
        if (this.phase === 1) {
            barColor = 0xEF4444; // Red
        } else if (this.phase === 2) {
            barColor = 0x7C2D12; // Dark red
        } else {
            barColor = 0x1F2937; // Nearly black
        }
        
        this.healthBar.fillStyle(barColor);
        this.healthBar.fillRect(barX, barY, fillWidth, barHeight);
        
        // Add glowing effect
        this.healthBar.lineStyle(1, 0xFFFFFF, 0.5);
        this.healthBar.strokeRect(barX, barY, fillWidth, barHeight);
    }
    
    createNameTag() {
        this.nameTag = this.scene.add.text(this.x, this.y - 190, 'RUGPULLER WIZARD', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#DC2626',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Title animation
        this.scene.tweens.add({
            targets: this.nameTag,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        // Subtitle
        this.subtitle = this.scene.add.text(this.x, this.y - 170, 'Master of Mad Science & Rug Pulls', {
            fontSize: '8px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#9CA3AF',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    createPhaseIndicator() {
        this.phaseIndicator = this.scene.add.text(this.x - 120, this.y - 140, `PHASE ${this.phase}`, {
            fontSize: '10px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#F59E0B',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    setupAnimations() {
        // Menacing idle animation with all wizard elements
        const wizardElements = [this.hat, this.staff, this.staffOrb];
        
        this.scene.tweens.add({
            targets: wizardElements,
            y: (target, key, value) => value - 20,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Cloak billowing effect
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.4,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    // Combat methods
    update(time, delta) {
        if (this.isDefeated || !this.isAlive) return;
        
        // Check for phase transitions
        this.checkPhaseTransition();
        
        // AI behavior based on phase
        this.updateAI(time);
        
        // Update minions
        this.updateMinions(time);
    }
    
    checkPhaseTransition() {
        const healthPercentage = this.currentHP / this.maxHP;
        let newPhase = 1;
        
        for (let i = 0; i < this.phaseThresholds.length; i++) {
            if (healthPercentage <= this.phaseThresholds[i]) {
                newPhase = i + 2;
                break;
            }
        }
        
        if (newPhase !== this.phase) {
            this.enterPhase(newPhase);
        }
    }
    
    enterPhase(newPhase) {
        this.phase = newPhase;
        this.phaseIndicator.setText(`PHASE ${this.phase}`);
        
        // Phase transition effects
        this.phaseTransitionEffect();
        
        // Adjust stats and behavior
        switch (this.phase) {
            case 2:
                this.stats.attack += 10;
                this.stats.magic += 15;
                this.attackCooldown = 1500; // Faster attacks
                this.showPhaseMessage('The Wizard grows more desperate!');
                break;
            case 3:
                this.stats.attack += 20;
                this.stats.magic += 25;
                this.attackCooldown = 1000; // Much faster
                this.showPhaseMessage('Final Phase: Maximum Rug Pull Power!');
                break;
        }
        
        // Visual changes
        this.updatePhaseVisuals();
    }
    
    phaseTransitionEffect() {
        // Screen shake
        this.scene.cameras.main.shake(500, 0.02);
        
        // Explosion effect
        const explosion = this.scene.add.particles(this.x, this.y - 40, 'enemy-sprite', {
            scale: { start: 0.5, end: 0 },
            speed: { min: 100, max: 200 },
            lifespan: 1000,
            quantity: 20,
            tint: [0xDC2626, 0x7C2D12, 0x4C1D95],
            alpha: { start: 1, end: 0 }
        });
        
        explosion.start();
        this.scene.time.delayedCall(1000, () => explosion.destroy());
        
        // Wizard flash
        this.scene.tweens.add({
            targets: [this.sprite, this.hat, this.staff, this.staffOrb],
            tint: 0xFFFFFF,
            duration: 200,
            yoyo: true,
            repeat: 3
        });
    }
    
    updatePhaseVisuals() {
        // Change colors based on phase
        switch (this.phase) {
            case 2:
                this.sprite.setTint(0x7C2D12); // Darker red
                this.staffOrb.setFillStyle(0x991B1B);
                break;
            case 3:
                this.sprite.setTint(0x1F2937); // Nearly black
                this.staffOrb.setFillStyle(0x000000);
                // Add lightning effects
                this.createLightningAura();
                break;
        }
    }
    
    createLightningAura() {
        // Lightning effects for final phase
        this.lightning = this.scene.add.particles(this.x, this.y - 40, 'hero-sprite', {
            scale: { start: 0.2, end: 0 },
            speed: { min: 50, max: 100 },
            lifespan: 500,
            quantity: 3,
            frequency: 100,
            tint: 0xFFFFFF,
            alpha: { start: 1, end: 0 }
        });
        
        this.lightning.start();
    }
    
    updateAI(time) {
        if (time - this.lastAttackTime < this.attackCooldown) return;
        
        // Choose attack based on phase and available abilities
        const availableAttacks = this.getAvailableAttacks(time);
        
        if (availableAttacks.length > 0) {
            const attack = Phaser.Utils.Array.GetRandom(availableAttacks);
            this.performAttack(attack, time);
        }
    }
    
    getAvailableAttacks(time) {
        const available = ['basicAttack'];
        
        Object.keys(this.abilities).forEach(ability => {
            if (time - this.abilities[ability].lastUsed >= this.abilities[ability].cooldown) {
                // Phase-specific ability availability
                if (ability === 'darkMagic' && this.phase >= 2) {
                    available.push(ability);
                } else if (ability === 'summonMinions' && this.phase >= 2 && this.minions.length < this.maxMinions) {
                    available.push(ability);
                } else if (ability !== 'darkMagic' && ability !== 'summonMinions') {
                    available.push(ability);
                }
            }
        });
        
        return available;
    }
    
    performAttack(attackType, time) {
        this.lastAttackTime = time;
        
        switch (attackType) {
            case 'basicAttack':
                this.basicAttack();
                break;
            case 'rugPull':
                this.rugPullAttack(time);
                break;
            case 'scamBlast':
                this.scamBlastAttack(time);
                break;
            case 'darkMagic':
                this.darkMagicAttack(time);
                break;
            case 'summonMinions':
                this.summonMinionsAttack(time);
                break;
        }
    }
    
    basicAttack() {
        this.attackAnimation();
        
        // Emit attack event
        const damage = this.calculateAttackDamage();
        this.scene.events.emit('wizardAttack', {
            type: 'basic',
            damage: damage,
            description: 'The Wizard casts a dark spell!'
        });
    }
    
    rugPullAttack(time) {
        this.abilities.rugPull.lastUsed = time;
        
        // Special rug pull animation
        this.rugPullAnimation();
        
        const damage = this.calculateAttackDamage() * 1.5;
        this.scene.events.emit('wizardAttack', {
            type: 'rugPull',
            damage: damage,
            description: 'The Wizard performs a devastating Rug Pull!'
        });
    }
    
    scamBlastAttack(time) {
        this.abilities.scamBlast.lastUsed = time;
        
        this.scamBlastAnimation();
        
        const damage = this.calculateAttackDamage() * 1.2;
        this.scene.events.emit('wizardAttack', {
            type: 'scamBlast',
            damage: damage,
            description: 'Scam Blast! Your defenses are weakened!'
        });
    }
    
    darkMagicAttack(time) {
        this.abilities.darkMagic.lastUsed = time;
        
        this.darkMagicAnimation();
        
        const damage = this.stats.magic * 2;
        this.scene.events.emit('wizardAttack', {
            type: 'darkMagic',
            damage: damage,
            description: 'Dark Magic pierces through all defenses!'
        });
    }
    
    summonMinionsAttack(time) {
        this.abilities.summonMinions.lastUsed = time;
        
        this.summonMinionsAnimation();
        
        // Create minions
        this.createMinion();
        
        this.scene.events.emit('wizardAttack', {
            type: 'summon',
            damage: 0,
            description: 'The Wizard summons scam minions!'
        });
    }
    
    calculateAttackDamage() {
        let baseDamage = this.stats.attack;
        
        // Phase multiplier
        baseDamage *= (1 + (this.phase - 1) * 0.5);
        
        // Add some randomness
        const variance = baseDamage * 0.2;
        return Math.floor(baseDamage + (Math.random() * variance * 2 - variance));
    }
    
    // Animation methods
    attackAnimation() {
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.7,
            duration: 200,
            yoyo: true
        });
        
        // Staff glow
        this.scene.tweens.add({
            targets: this.staffOrb,
            tint: 0xFFFFFF,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            yoyo: true
        });
    }
    
    rugPullAttack() {
        // Create rug pull visual effect
        const rugEffect = this.scene.add.rectangle(this.scene.scale.width / 2, this.scene.scale.height / 2, 
            this.scene.scale.width, this.scene.scale.height, 0x7C2D12, 0.3);
        
        this.scene.tweens.add({
            targets: rugEffect,
            alpha: 0,
            duration: 1000,
            onComplete: () => rugEffect.destroy()
        });
        
        // Wizard animation
        this.scene.tweens.add({
            targets: [this.sprite, this.hat, this.staff, this.staffOrb],
            y: (target, key, value) => value - 50,
            duration: 500,
            yoyo: true
        });
    }
    
    scamBlastAnimation() {
        // Blast effect
        const blast = this.scene.add.circle(this.x, this.y - 40, 20, 0xDC2626, 0.8);
        
        this.scene.tweens.add({
            targets: blast,
            scaleX: 5,
            scaleY: 5,
            alpha: 0,
            duration: 600,
            onComplete: () => blast.destroy()
        });
    }
    
    darkMagicAnimation() {
        // Dark magic spiral
        const spiral = this.scene.add.graphics();
        spiral.lineStyle(3, 0x1F2937);
        
        let angle = 0;
        const spiralTween = this.scene.tweens.add({
            targets: { angle: 0 },
            angle: Math.PI * 4,
            duration: 1000,
            onUpdate: (tween, target) => {
                spiral.clear();
                spiral.lineStyle(3, 0x1F2937);
                for (let i = 0; i < target.angle; i += 0.1) {
                    const radius = i * 10;
                    const x = this.x + Math.cos(i) * radius;
                    const y = this.y - 40 + Math.sin(i) * radius;
                    if (i === 0) {
                        spiral.moveTo(x, y);
                    } else {
                        spiral.lineTo(x, y);
                    }
                }
                spiral.strokePath();
            },
            onComplete: () => spiral.destroy()
        });
    }
    
    summonMinionsAnimation() {
        // Summoning circle
        const circle = this.scene.add.circle(this.x - 100, this.scene.scale.height - 100, 50, 0x4C1D95, 0.5);
        circle.setStrokeStyle(2, 0xDC2626);
        
        this.scene.tweens.add({
            targets: circle,
            rotation: Math.PI * 2,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 0,
            duration: 1500,
            onComplete: () => circle.destroy()
        });
    }
    
    // Minion system
    createMinion() {
        if (this.minions.length >= this.maxMinions) return;
        
        const minionX = this.x - 100 + Math.random() * 200;
        const minionY = this.scene.scale.height - 100;
        
        const minion = {
            sprite: this.scene.add.sprite(minionX, minionY, 'enemy-sprite'),
            hp: 30,
            attack: 15,
            x: minionX,
            y: minionY
        };
        
        minion.sprite.setScale(0.5);
        minion.sprite.setTint(0x7C2D12);
        
        this.minions.push(minion);
    }
    
    updateMinions(time) {
        // Simple minion AI - they just attack periodically
        this.minions.forEach(minion => {
            if (minion.hp > 0 && Math.random() < 0.01) {
                // Minion attacks
                this.scene.events.emit('minionAttack', {
                    damage: minion.attack,
                    description: 'A scam minion attacks!'
                });
            }
        });
    }
    
    // Damage and defeat
    takeDamage(damage) {
        if (this.isDefeated) return 0;
        
        const actualDamage = Math.max(1, damage - Math.floor(this.stats.defense * 0.3));
        this.currentHP = Math.max(0, this.currentHP - actualDamage);
        
        this.updateHealthBar();
        this.takeDamageAnimation();
        this.showDamageNumber(actualDamage);
        
        if (this.currentHP <= 0) {
            this.defeat();
        }
        
        return actualDamage;
    }
    
    takeDamageAnimation() {
        // Boss damage flash
        this.scene.tweens.add({
            targets: [this.sprite, this.hat, this.staff, this.staffOrb, this.leftEye, this.rightEye],
            tint: 0xFFFFFF,
            duration: 150,
            yoyo: true
        });
        
        // Screen flash for dramatic effect
        const flash = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0xFFFFFF, 0.3);
        flash.setOrigin(0);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }
    
    showDamageNumber(damage) {
        const damageText = this.scene.add.text(this.x + Math.random() * 40 - 20, this.y - 100, `-${damage}`, {
            fontSize: '20px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#EF4444',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
    }
    
    showPhaseMessage(message) {
        const messageText = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2 - 50, message, {
            fontSize: '16px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#DC2626',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: messageText,
            alpha: 0,
            y: messageText.y - 30,
            duration: 3000,
            onComplete: () => messageText.destroy()
        });
    }
    
    defeat() {
        this.isDefeated = true;
        this.isAlive = false;
        
        // Epic defeat sequence
        this.defeatSequence();
    }
    
    defeatSequence() {
        // Stop all animations
        this.scene.tweens.killTweensOf([this.sprite, this.hat, this.staff, this.staffOrb, this.aura]);
        
        // Defeat animation sequence
        this.scene.tweens.add({
            targets: [this.sprite, this.hat, this.staff, this.staffOrb],
            alpha: 0.3,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 2000
        });
        
        // Victory particles
        const victoryEffect = this.scene.add.particles(this.x, this.y - 40, 'hero-sprite', {
            scale: { start: 0.5, end: 0 },
            speed: { min: 100, max: 200 },
            lifespan: 3000,
            quantity: 30,
            tint: [0x10B981, 0xF59E0B],
            alpha: { start: 1, end: 0 }
        });
        
        victoryEffect.start();
        
        // Defeat message
        const defeatMessage = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, [
            'THE RUGPULLER WIZARD IS DEFEATED!',
            '',
            'The cosmos is now free from scams!',
            'All NFT collections have been liberated!'
        ].join('\\n'), {
            fontSize: '14px',
            fontFamily: 'Press Start 2P, monospace',
            fill: '#10B981',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Clean up minions
        this.minions.forEach(minion => {
            if (minion.sprite) minion.sprite.destroy();
        });
        this.minions = [];
        
        // Emit victory event
        this.scene.events.emit('wizardDefeated');
    }
    
    // Cleanup
    destroy() {
        // Destroy all visual elements
        [this.sprite, this.hat, this.staff, this.staffOrb, this.leftEye, this.rightEye, 
         this.aura, this.healthBar, this.healthBarBg, this.phaseMarkers,
         this.nameTag, this.subtitle, this.phaseIndicator].forEach(element => {
            if (element) element.destroy();
        });
        
        if (this.auraParticles) this.auraParticles.destroy();
        if (this.lightning) this.lightning.destroy();
        
        // Clean up minions
        this.minions.forEach(minion => {
            if (minion.sprite) minion.sprite.destroy();
        });
    }
}