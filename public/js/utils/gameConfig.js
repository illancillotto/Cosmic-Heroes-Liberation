export const GAME_CONFIG = {
    // Phaser Configuration
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-game',
    backgroundColor: '#1E1B4B',
    
    // Mobile-optimized scaling
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: { width: 320, height: 240 },
        max: { width: 1920, height: 1080 },
        zoom: 1
    },
    
    // Physics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    
    // Performance optimizations
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
        powerPreference: 'high-performance'
    },
    
    // Input
    input: {
        touch: true,
        mouse: true,
        keyboard: true,
        gamepad: false
    }
};

// Game Constants
export const GAME_CONSTANTS = {
    LEVELS: {
        TOTAL: 5,
        NAMES: [
            'Cosmos Hub Castle',
            'Osmosis Fortress', 
            'Juno Stronghold',
            'Stargaze Citadel',
            'Rugpuller\'s Tower'
        ]
    },
    
    PLAYER: {
        MAX_LEVEL: 10,
        BASE_STATS: {
            health: 100,
            attack: 20,
            defense: 15,
            magic: 10
        },
        STAT_GROWTH: {
            health: 15,
            attack: 3,
            defense: 2,
            magic: 2
        }
    },
    
    ENEMIES: {
        STAT_MULTIPLIER: 0.1, // floor_price * multiplier
        BASE_STATS: {
            health: 50,
            attack: 15,
            defense: 10,
            magic: 5
        }
    },
    
    UI: {
        COLORS: {
            primary: '#6B46C1',
            secondary: '#F59E0B', 
            success: '#10B981',
            danger: '#EF4444',
            text: '#FFFFFF',
            background: '#1E1B4B'
        },
        TOUCH_SIZE: 44 // Minimum touch target size
    }
};

// API Configuration
export const API_CONFIG = {
    STARGAZE: {
        GRAPHQL_ENDPOINT: 'https://graphql.mainnet.stargaze-apis.com/graphql',
        CORS_PROXY: 'https://api.allorigins.win/raw?url=',
        MARKETPLACE_BASE: 'https://app.stargaze.zone/marketplace/',
        TIMEOUT: 10000
    },
    
    COSMOS: {
        CHAIN_ID: 'stargaze-1',
        RPC_ENDPOINT: 'https://rpc.stargaze-apis.com:443',
        REST_ENDPOINT: 'https://rest.stargaze-apis.com:443'
    }
};

// Mock data fallback
export const MOCK_DATA = {
    collections: [
        {
            collection_addr: 'stars1...',
            name: 'Stargaze Punks',
            image: 'https://via.placeholder.com/100x100/6B46C1/FFFFFF?text=SP',
            floor_price: 100,
            volume_7d: 5000,
            total_supply: 10000
        },
        {
            collection_addr: 'stars2...',
            name: 'Cosmic Dragons',
            image: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=CD',
            floor_price: 250,
            volume_7d: 12000,
            total_supply: 5000
        },
        {
            collection_addr: 'stars3...',
            name: 'Space Warriors',
            image: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=SW',
            floor_price: 75,
            volume_7d: 8000,
            total_supply: 15000
        },
        {
            collection_addr: 'stars4...',
            name: 'Galaxy Guardians',
            image: 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=GG',
            floor_price: 500,
            volume_7d: 20000,
            total_supply: 3000
        },
        {
            collection_addr: 'stars5...',
            name: 'Nebula Knights',
            image: 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=NK',
            floor_price: 150,
            volume_7d: 6000,
            total_supply: 8000
        }
    ]
};