// Background Generator for creating level-specific backgrounds
export class BackgroundGenerator {
    static generateCosmosBackground(scene, width, height) {
        const graphics = scene.add.graphics();
        
        // Base gradient (purple cosmic theme)
        graphics.fillGradientStyle(0x1E1B4B, 0x1E1B4B, 0x312E81, 0x312E81, 1, 1, 1, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Add cosmic nebula effects
        for (let i = 0; i < 8; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(60, 120);
            
            graphics.fillStyle(0x6B46C1, 0.3);
            graphics.fillCircle(x, y, size);
        }
        
        // Add stars
        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(1, 3);
            
            graphics.fillStyle(0xFFFFFF, Phaser.Math.FloatBetween(0.3, 1));
            graphics.fillCircle(x, y, size);
        }
        
        graphics.generateTexture('cosmos-bg', width, height);
        graphics.destroy();
        return 'cosmos-bg';
    }
    
    static generateOsmosisBackground(scene, width, height) {
        const graphics = scene.add.graphics();
        
        // Base gradient (blue water theme)
        graphics.fillGradientStyle(0x1E3A8A, 0x1E3A8A, 0x3730A3, 0x3730A3, 1, 1, 1, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Add water wave effects
        for (let i = 0; i < 12; i++) {
            const y = (height / 12) * i;
            graphics.fillStyle(0x3B82F6, 0.2);
            graphics.fillEllipse(width / 2, y, width, 40);
        }
        
        // Add floating bubbles
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(3, 8);
            
            graphics.fillStyle(0x60A5FA, 0.4);
            graphics.fillCircle(x, y, size);
        }
        
        graphics.generateTexture('osmosis-bg', width, height);
        graphics.destroy();
        return 'osmosis-bg';
    }
    
    static generateJunoBackground(scene, width, height) {
        const graphics = scene.add.graphics();
        
        // Base gradient (orange/red volcanic theme)
        graphics.fillGradientStyle(0x7C2D12, 0x7C2D12, 0xB91C1C, 0xB91C1C, 1, 1, 1, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Add volcanic rock formations
        for (let i = 0; i < 6; i++) {
            const x = (width / 6) * i;
            graphics.fillStyle(0x4B5563, 0.6);
            graphics.fillTriangle(
                x, height,
                x + Phaser.Math.Between(50, 100), height - Phaser.Math.Between(100, 200),
                x + Phaser.Math.Between(100, 150), height
            );
        }
        
        // Add lava glow effects
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(height * 0.7, height);
            const size = Phaser.Math.Between(20, 40);
            
            graphics.fillStyle(0xF97316, 0.3);
            graphics.fillCircle(x, y, size);
        }
        
        graphics.generateTexture('juno-bg', width, height);
        graphics.destroy();
        return 'juno-bg';
    }
    
    static generateStargazeBackground(scene, width, height) {
        const graphics = scene.add.graphics();
        
        // Base gradient (green nature theme)
        graphics.fillGradientStyle(0x166534, 0x166534, 0x15803D, 0x15803D, 1, 1, 1, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Add forest silhouettes
        for (let i = 0; i < 10; i++) {
            const x = (width / 10) * i;
            const treeHeight = Phaser.Math.Between(80, 150);
            
            graphics.fillStyle(0x1F2937, 0.7);
            graphics.fillTriangle(
                x, height,
                x + 25, height - treeHeight,
                x + 50, height
            );
        }
        
        // Add magical fireflies
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.8);
            
            graphics.fillStyle(0x10B981, 0.6);
            graphics.fillCircle(x, y, 3);
        }
        
        // Add observatory structure
        graphics.fillStyle(0x4B5563);
        graphics.fillCircle(width * 0.8, height * 0.3, 40);
        graphics.fillRect(width * 0.75, height * 0.3, 50, height * 0.7);
        
        graphics.generateTexture('stargaze-bg', width, height);
        graphics.destroy();
        return 'stargaze-bg';
    }
    
    static generateRugpullerBackground(scene, width, height) {
        const graphics = scene.add.graphics();
        
        // Base gradient (dark evil theme)
        graphics.fillGradientStyle(0x000000, 0x000000, 0x7F1D1D, 0x7F1D1D, 1, 1, 1, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Add dark clouds
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.4);
            const size = Phaser.Math.Between(60, 100);
            
            graphics.fillStyle(0x1F1F1F, 0.8);
            graphics.fillCircle(x, y, size);
        }
        
        // Add evil tower
        graphics.fillStyle(0x1F1F1F);
        graphics.fillRect(width * 0.8, height * 0.2, 60, height * 0.8);
        
        // Add glowing red windows
        for (let i = 0; i < 8; i++) {
            const y = height * 0.3 + (i * 40);
            graphics.fillStyle(0xFF0000, 0.8);
            graphics.fillRect(width * 0.82, y, 8, 12);
            graphics.fillRect(width * 0.92, y, 8, 12);
        }
        
        // Add lightning effects
        graphics.lineStyle(3, 0xFF0000, 0.8);
        for (let i = 0; i < 5; i++) {
            const startX = Phaser.Math.Between(0, width);
            const endX = startX + Phaser.Math.Between(-50, 50);
            graphics.lineBetween(startX, 0, endX, height * 0.3);
        }
        
        graphics.generateTexture('rugpuller-bg', width, height);
        graphics.destroy();
        return 'rugpuller-bg';
    }
    
    static generateBackgroundForLevel(scene, level, width, height) {
        switch (level) {
            case 1:
                return this.generateCosmosBackground(scene, width, height);
            case 2:
                return this.generateOsmosisBackground(scene, width, height);
            case 3:
                return this.generateJunoBackground(scene, width, height);
            case 4:
                return this.generateStargazeBackground(scene, width, height);
            case 5:
                return this.generateRugpullerBackground(scene, width, height);
            default:
                return this.generateCosmosBackground(scene, width, height);
        }
    }
    
    static generateAllBackgrounds(scene, width = 800, height = 600) {
        const backgrounds = {};
        
        backgrounds.cosmos = this.generateCosmosBackground(scene, width, height);
        backgrounds.osmosis = this.generateOsmosisBackground(scene, width, height);
        backgrounds.juno = this.generateJunoBackground(scene, width, height);
        backgrounds.stargaze = this.generateStargazeBackground(scene, width, height);
        backgrounds.rugpuller = this.generateRugpullerBackground(scene, width, height);
        
        console.log('🌌 Generated level backgrounds:', Object.keys(backgrounds));
        return backgrounds;
    }
}