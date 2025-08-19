# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cosmic Heroes: Liberation** - A web-based Heroes of Might and Magic style strategy game built with Phaser.js 3.x. Players fight to liberate NFT collections that have been enslaved by a Rugpuller Wizard across different blockchain-themed castles.

### Tech Stack
- **Game Engine**: Phaser.js 3.70.0
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **Build Tool**: Vite 4.x
- **Styling**: Tailwind CSS 3.3.0
- **Wallet Integration**: Direct Keplr/Leap integration
- **API**: Stargaze GraphQL API
- **Deployment**: Vercel/Netlify compatible

## Common Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build locally

# Dependencies
npm install          # Install all dependencies
```

## Architecture Overview

### Core Game Structure
```
src/
├── scenes/          # Phaser game scenes
│   ├── MenuScene.js    # Main menu with wallet connection
│   ├── GameScene.js    # Level progression and exploration
│   ├── BattleScene.js  # Turn-based combat system
│   └── VictoryScene.js # Level completion and final victory
├── entities/        # Game entity classes
│   ├── Player.js       # Hero character with stats/leveling
│   ├── NFTEnemy.js     # Enemies based on real NFT collections
│   └── Wizard.js       # Final boss with multi-phase combat
├── api/            # External API integrations
│   └── stargaze.js     # Stargaze GraphQL API client
├── wallet/         # Blockchain wallet integration
│   └── connection.js   # Multi-wallet support (Keplr/Leap/Cosmostation)
├── utils/          # Shared utilities and configuration
│   └── gameConfig.js   # Game constants, mock data, API config
└── main.js         # Game initialization and mobile optimizations
```

### Game Flow
1. **MenuScene**: Player connects wallet or chooses demo mode
2. **GameScene**: Navigate through 5 levels, each representing different blockchains
3. **BattleScene**: Turn-based combat against NFT enemies with real collection data
4. **VictoryScene**: Level completion or final victory against Rugpuller Wizard

### Key Features
- **Mobile-First Design**: Responsive Phaser scaling with touch controls
- **Real NFT Integration**: Enemies generated from top Stargaze collections by 7-day volume
- **Wallet Connection**: Support for Keplr, Leap, and Cosmostation wallets
- **Progressive Difficulty**: 5 levels with increasing challenge
- **Attribution**: Proper crediting of NFT collections and links to Stargaze marketplace

## NFT Integration Details

### Data Sources
- **Primary**: Stargaze GraphQL API (`https://graphql.mainnet.stargaze-apis.com/graphql`)
- **Fallback**: Mock data with placeholder images
- **CORS Handling**: Automatic fallback to proxy or mock data

### Enemy Generation
- Enemy stats calculated from `floor_price`, `volume_7d`, and `total_supply`
- Visual tinting based on collection rarity/value
- Collection images loaded dynamically when available
- Attribution links to original collections

## Mobile Optimization

### Phaser Configuration
```javascript
scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 320, height: 240 },
    max: { width: 1920, height: 1080 }
}
```

### Touch Controls
- Minimum 44px touch targets
- Double-tap prevention
- Context menu disabled
- Orientation change handling
- Multi-touch support

## Error Handling Strategy

### API Failures
1. Try direct GraphQL request
2. Fallback to CORS proxy
3. Final fallback to mock data
4. User notification with graceful degradation

### Wallet Errors
- Clear error messages for missing extensions
- Installation links for supported wallets  
- Demo mode always available as fallback
- Connection status indicators

## Development Notes

### Asset Management
- Placeholder sprites generated programmatically
- Real NFT images loaded dynamically
- Efficient memory management for mobile
- Image URL validation and sanitization

### Performance Targets
- 60fps on mobile devices
- <100MB memory usage
- <3MB total bundle size
- <2s initial load time

### Browser Compatibility
- Modern browsers with ES6+ support
- Mobile Safari and Chrome optimization
- PWA-ready with proper meta tags

## Deployment Considerations

### Environment Variables
- No sensitive data in client-side code
- API endpoints configurable
- Demo mode for development/testing

### Build Optimization
- Vite bundling with code splitting
- Legacy browser support via plugin
- Asset compression and caching
- Manual chunks for Phaser library

## Attribution Requirements

- NFT collection names displayed prominently in battles
- Links back to collections on Stargaze marketplace
- Credit message: "NFT art courtesy of [Collection Name] on Stargaze"
- No permanent storage of NFT images (dynamic loading only)