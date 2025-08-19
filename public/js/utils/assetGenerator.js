// Asset Generator for creating procedural sprites until real assets are ready
export class AssetGenerator {
    static generateHeroSprite(scene, width = 100, height = 100) {
        const graphics = scene.add.graphics();
        
        // Hero body (cosmic knight)
        graphics.fillStyle(0x6B46C1); // Purple body
        graphics.fillRoundedRect(width * 0.3, height * 0.4, width * 0.4, height * 0.5, 8);
        
        // Hero head
        graphics.fillStyle(0xF3E8FF); // Light purple head
        graphics.fillCircle(width * 0.5, height * 0.25, width * 0.15);
        
        // Hero eyes
        graphics.fillStyle(0xF59E0B); // Golden eyes
        graphics.fillCircle(width * 0.45, height * 0.22, 3);
        graphics.fillCircle(width * 0.55, height * 0.22, 3);
        
        // Hero cape
        graphics.fillStyle(0x312E81); // Dark purple cape
        graphics.fillTriangle(
            width * 0.2, height * 0.4,  // Left cape
            width * 0.8, height * 0.4,  // Right cape
            width * 0.5, height * 0.9   // Cape bottom
        );
        
        // Hero weapon (cosmic staff)
        graphics.lineStyle(4, 0xF59E0B);
        graphics.lineBetween(width * 0.15, height * 0.2, width * 0.15, height * 0.8);
        
        // Staff crystal
        graphics.fillStyle(0xF59E0B);
        graphics.fillCircle(width * 0.15, height * 0.15, 8);
        
        // Generate texture
        graphics.generateTexture('hero-sprite', width, height);
        graphics.destroy();
        
        return 'hero-sprite';
    }
    
    static generateEnemySprite(scene, width = 100, height = 100) {
        const graphics = scene.add.graphics();
        
        // Enemy body (corrupted creature)
        graphics.fillStyle(0xEF4444); // Red body
        graphics.fillRoundedRect(width * 0.25, height * 0.4, width * 0.5, height * 0.5, 8);
        
        // Enemy head
        graphics.fillStyle(0x7F1D1D); // Dark red head
        graphics.fillCircle(width * 0.5, height * 0.25, width * 0.18);
        
        // Enemy eyes (glowing)
        graphics.fillStyle(0xFF0000); // Bright red eyes
        graphics.fillCircle(width * 0.42, height * 0.22, 4);
        graphics.fillCircle(width * 0.58, height * 0.22, 4);
        
        // Enemy horns
        graphics.fillStyle(0x4B5563); // Dark gray horns
        graphics.fillTriangle(
            width * 0.35, height * 0.15,
            width * 0.4, height * 0.05,
            width * 0.45, height * 0.15
        );
        graphics.fillTriangle(
            width * 0.55, height * 0.15,
            width * 0.6, height * 0.05,
            width * 0.65, height * 0.15
        );
        
        // Enemy claws
        graphics.lineStyle(3, 0x4B5563);
        graphics.lineBetween(width * 0.2, height * 0.6, width * 0.1, height * 0.5);
        graphics.lineBetween(width * 0.8, height * 0.6, width * 0.9, height * 0.5);
        
        // Dark aura effect
        graphics.fillStyle(0x7F1D1D, 0.3);
        graphics.fillCircle(width * 0.5, height * 0.5, width * 0.4);
        
        graphics.generateTexture('enemy-sprite', width, height);
        graphics.destroy();
        
        return 'enemy-sprite';
    }
    
    static generateCastleSprite(scene, width = 64, height = 64) {
        const graphics = scene.add.graphics();
        
        // Castle base
        graphics.fillStyle(0x4B5563); // Gray stone
        graphics.fillRect(width * 0.2, height * 0.5, width * 0.6, height * 0.4);
        
        // Castle towers
        graphics.fillRect(width * 0.1, height * 0.3, width * 0.15, height * 0.6);
        graphics.fillRect(width * 0.75, height * 0.3, width * 0.15, height * 0.6);
        graphics.fillRect(width * 0.35, height * 0.2, width * 0.3, height * 0.7);
        
        // Castle details
        graphics.lineStyle(1, 0x6B7280);
        graphics.strokeRect(width * 0.2, height * 0.5, width * 0.6, height * 0.4);
        graphics.strokeRect(width * 0.1, height * 0.3, width * 0.15, height * 0.6);
        graphics.strokeRect(width * 0.75, height * 0.3, width * 0.15, height * 0.6);
        graphics.strokeRect(width * 0.35, height * 0.2, width * 0.3, height * 0.7);
        
        // Castle door
        graphics.fillStyle(0x1F2937);
        graphics.fillRoundedRect(width * 0.45, height * 0.7, width * 0.1, width * 0.15, 3);
        
        // Castle windows
        graphics.fillStyle(0xF59E0B, 0.8); // Golden light
        graphics.fillRect(width * 0.4, height * 0.35, width * 0.05, width * 0.05);
        graphics.fillRect(width * 0.55, height * 0.35, width * 0.05, width * 0.05);
        
        graphics.generateTexture('castle-tile', width, height);
        graphics.destroy();
        
        return 'castle-tile';
    }
    
    static generateWizardBossSprite(scene, width = 120, height = 120) {
        const graphics = scene.add.graphics();
        
        // Wizard robe
        graphics.fillStyle(0x1F1F1F); // Dark black robe
        graphics.fillTriangle(
            width * 0.5, width * 0.3,   // Top
            width * 0.2, height * 0.9,  // Bottom left
            width * 0.8, height * 0.9   // Bottom right
        );
        
        // Wizard head (hidden in hood)
        graphics.fillStyle(0x4B5563);
        graphics.fillCircle(width * 0.5, height * 0.25, width * 0.12);
        
        // Glowing eyes
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(width * 0.45, height * 0.22, 3);
        graphics.fillCircle(width * 0.55, height * 0.22, 3);
        
        // Wizard staff
        graphics.lineStyle(6, 0x4B5563);
        graphics.lineBetween(width * 0.15, height * 0.1, width * 0.15, height * 0.85);
        
        // Corrupted crystal
        graphics.fillStyle(0x7F1D1D);
        graphics.fillCircle(width * 0.15, height * 0.08, 12);
        
        // Dark energy
        graphics.fillStyle(0x7F1D1D, 0.4);
        graphics.fillCircle(width * 0.5, height * 0.5, width * 0.3);
        
        graphics.generateTexture('wizard-boss', width, height);
        graphics.destroy();
        
        return 'wizard-boss';
    }
    
    static generateParticleSprite(scene, size = 8) {
        const graphics = scene.add.graphics();
        
        graphics.fillStyle(0xF59E0B);
        graphics.fillCircle(size/2, size/2, size/2);
        
        graphics.generateTexture('particle', size, size);
        graphics.destroy();
        
        return 'particle';
    }
    
    static generateUIButton(scene, width = 200, height = 50, color = 0x6B46C1) {
        const graphics = scene.add.graphics();
        
        // Button background
        graphics.fillStyle(color, 0.8);
        graphics.fillRoundedRect(0, 0, width, height, 8);
        
        // Button border
        graphics.lineStyle(2, 0xF59E0B);
        graphics.strokeRoundedRect(0, 0, width, height, 8);
        
        graphics.generateTexture(`ui-button-${color}`, width, height);
        graphics.destroy();
        
        return `ui-button-${color}`;
    }
    
    static generateAllAssets(scene) {
        const assets = {
            hero: this.generateHeroSprite(scene),
            enemy: this.generateEnemySprite(scene),
            castle: this.generateCastleSprite(scene),
            wizard: this.generateWizardBossSprite(scene),
            particle: this.generateParticleSprite(scene),
            button: this.generateUIButton(scene)
        };
        
        console.log('🎨 Generated placeholder assets:', Object.keys(assets));
        return assets;
    }
}