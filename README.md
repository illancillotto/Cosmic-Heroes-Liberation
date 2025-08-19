# 🚀 Cosmic Heroes: Liberation

A pixel-art Heroes of Might and Magic style strategy game where you fight to liberate NFT collections from the Rugpuller Wizard! Built with Phaser.js and real blockchain integration.

![Game Preview](https://via.placeholder.com/800x400/6B46C1/FFFFFF?text=Cosmic+Heroes+Liberation)

## 🎮 Game Features

- **🏰 5 Epic Levels**: Fight through blockchain-themed castles (Cosmos Hub, Osmosis, Juno, Stargaze, Rugpuller's Tower)
- **⚔️ Turn-Based Combat**: Strategic battles against NFT-powered enemies
- **🔗 Real NFT Integration**: Enemies generated from top Stargaze collections by trading volume
- **💼 Wallet Support**: Connect with Keplr, Leap, or Cosmostation wallets
- **📱 Mobile-First**: Fully responsive design optimized for all devices
- **🎯 Demo Mode**: Play without wallet connection using mock data

## 🛠️ Tech Stack

- **Game Engine**: [Phaser.js 3.70.0](https://phaser.io/)
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API**: [Stargaze GraphQL](https://docs.stargaze.zone/)
- **Blockchain**: Cosmos ecosystem wallets

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cosmic-heroes-liberation.git
cd cosmic-heroes-liberation

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to play the game!

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

### 1. Choose Your Path
- **Connect Wallet**: Full experience with real NFT data
- **Demo Mode**: Try the game with sample collections

### 2. Battle Strategy
- **Attack**: Standard damage based on your Attack stat
- **Magic**: Higher damage that partially ignores defense
- **Defend**: Reduce incoming damage for the turn
- **Flee**: Escape from battle (available anytime)

### 3. Progression System
- **Level Up**: Gain XP from victories to increase stats
- **Stats Growth**: Health, Attack, Defense, and Magic improve each level
- **Skill Points**: Allocate points to specialize your hero

### 4. Liberation Campaign
- **Phase 1-4**: Battle through blockchain kingdoms
- **Phase 5**: Face the Rugpuller Wizard in epic final boss battle
- **Victory**: Free all NFT collections from tyranny!

## 🔧 Development

### Project Structure
```
cosmic-heroes-liberation/
├── public/
│   ├── assets/          # Game assets (sprites, sounds)
│   └── index.html       # Main HTML file
├── src/
│   ├── scenes/          # Phaser game scenes
│   ├── entities/        # Game entities (Player, Enemies, Boss)
│   ├── api/            # Stargaze API integration
│   ├── wallet/         # Blockchain wallet connection
│   ├── utils/          # Utilities and configuration
│   └── main.js         # Game entry point
├── package.json
└── README.md
```

### Key Architecture Decisions

- **Mobile-First**: Phaser configured with responsive scaling
- **Error Resilience**: Multiple fallback layers for API failures
- **Modular Design**: Clean separation between game logic and blockchain integration
- **Performance**: Optimized for 60fps on mobile devices

## 🌐 API Integration

### Stargaze GraphQL
```graphql
query GetTopCollections {
  collections(
    limit: 5
    order_by: {volume_7d: desc}
    where: {verified: {_eq: true}}
  ) {
    collection_addr
    name
    image
    floor_price
    volume_7d
    total_supply
  }
}
```

### CORS Handling
1. Direct GraphQL request
2. Proxy server fallback
3. Mock data as final fallback

## 💰 NFT Attribution

This game respects NFT creators and collections:

- ✅ Collection names displayed prominently
- ✅ Links to original collections on Stargaze
- ✅ Proper attribution: "NFT art courtesy of [Collection] on Stargaze"
- ✅ No permanent storage of NFT images
- ✅ Fair use for gaming/educational purposes

## 🔒 Wallet Security

- **No Private Keys**: Game never accesses or stores private keys
- **Read-Only**: Only reads public blockchain data
- **User Control**: Players maintain full control of their wallets
- **Demo Available**: Full experience without wallet connection

## 📱 Mobile Optimization

### Responsive Features
- **Touch Controls**: 44px minimum touch targets
- **Orientation Support**: Automatic layout adjustment
- **Performance**: Optimized sprites and animations
- **Loading**: Progressive loading with visual feedback

### Browser Support
- Chrome/Chromium 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build and deploy
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables
No environment variables required - all configuration is client-side.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add JSDoc comments for functions
- Test on mobile devices
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Stargaze](https://stargaze.zone)** - NFT marketplace and API
- **[Phaser.js](https://phaser.io)** - Game development framework
- **[Cosmos SDK](https://cosmos.network)** - Blockchain infrastructure
- **NFT Creators** - All the amazing collections featured in the game

## 🔗 Links

- **Live Demo**: [Play Game](https://cosmic-heroes-liberation.vercel.app)
- **Stargaze Marketplace**: [Visit Stargaze](https://app.stargaze.zone)
- **Documentation**: [Game Docs](./CLAUDE.md)
- **Bug Reports**: [GitHub Issues](https://github.com/your-username/cosmic-heroes-liberation/issues)

---

**Made with ❤️ for the Cosmos ecosystem**

*Liberate the NFTs. Save the cosmos. Become a Cosmic Hero.*