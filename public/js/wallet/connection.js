import { API_CONFIG } from '../utils/gameConfig.js';

export class WalletConnection {
    constructor() {
        this.wallet = null;
        this.address = null;
        this.chainId = API_CONFIG.COSMOS.CHAIN_ID;
        this.connected = false;
        this.walletType = null;
    }
    
    async connectWallet(preferredWallet = 'auto') {
        try {
            console.log('🔗 Attempting to connect wallet...');
            
            // Try different wallet connection methods
            if (preferredWallet === 'auto') {
                return await this.autoConnectWallet();
            } else if (preferredWallet === 'keplr') {
                return await this.connectKeplr();
            } else if (preferredWallet === 'leap') {
                return await this.connectLeap();
            } else {
                throw new Error('Unsupported wallet type');
            }
            
        } catch (error) {
            console.error('❌ Wallet connection failed:', error);
            return {
                success: false,
                error: error.message,
                address: null,
                walletType: null
            };
        }
    }
    
    async autoConnectWallet() {
        // Try to connect to available wallets in order of preference
        const walletMethods = [
            { name: 'keplr', method: () => this.connectKeplr() },
            { name: 'leap', method: () => this.connectLeap() },
            { name: 'cosmostation', method: () => this.connectCosmostation() }
        ];
        
        for (const { name, method } of walletMethods) {
            try {
                console.log(`🔍 Trying ${name} wallet...`);
                const result = await method();
                if (result.success) {
                    console.log(`✅ Successfully connected to ${name}`);
                    return result;
                }
            } catch (error) {
                console.warn(`⚠️ ${name} connection failed:`, error.message);
                continue;
            }
        }
        
        throw new Error('No compatible wallet found. Please install Keplr, Leap, or Cosmostation wallet.');
    }
    
    async connectKeplr() {
        if (!window.keplr) {
            throw new Error('Keplr wallet not found. Please install Keplr extension.');
        }
        
        try {
            // Enable Stargaze chain
            await window.keplr.enable(this.chainId);
            
            // Get offline signer
            const offlineSigner = window.keplr.getOfflineSigner(this.chainId);
            const accounts = await offlineSigner.getAccounts();
            
            if (accounts.length === 0) {
                throw new Error('No accounts found in Keplr wallet');
            }
            
            this.wallet = window.keplr;
            this.address = accounts[0].address;
            this.connected = true;
            this.walletType = 'keplr';
            
            // Set up event listeners for account changes
            this.setupKeplrEventListeners();
            
            return {
                success: true,
                address: this.address,
                walletType: 'keplr',
                accounts: accounts
            };
            
        } catch (error) {
            throw new Error(`Keplr connection error: ${error.message}`);
        }
    }
    
    async connectLeap() {
        if (!window.leap) {
            throw new Error('Leap wallet not found. Please install Leap extension.');
        }
        
        try {
            // Enable Stargaze chain
            await window.leap.enable(this.chainId);
            
            // Get offline signer
            const offlineSigner = window.leap.getOfflineSigner(this.chainId);
            const accounts = await offlineSigner.getAccounts();
            
            if (accounts.length === 0) {
                throw new Error('No accounts found in Leap wallet');
            }
            
            this.wallet = window.leap;
            this.address = accounts[0].address;
            this.connected = true;
            this.walletType = 'leap';
            
            // Set up event listeners for account changes
            this.setupLeapEventListeners();
            
            return {
                success: true,
                address: this.address,
                walletType: 'leap',
                accounts: accounts
            };
            
        } catch (error) {
            throw new Error(`Leap connection error: ${error.message}`);
        }
    }
    
    async connectCosmostation() {
        if (!window.cosmostation) {
            throw new Error('Cosmostation wallet not found. Please install Cosmostation extension.');
        }
        
        try {
            // Request account
            const account = await window.cosmostation.cosmos.request({
                method: 'cos_requestAccount',
                params: { chainName: 'stargaze' }
            });
            
            if (!account || !account.address) {
                throw new Error('Failed to get account from Cosmostation');
            }
            
            this.wallet = window.cosmostation;
            this.address = account.address;
            this.connected = true;
            this.walletType = 'cosmostation';
            
            return {
                success: true,
                address: this.address,
                walletType: 'cosmostation',
                accounts: [account]
            };
            
        } catch (error) {
            throw new Error(`Cosmostation connection error: ${error.message}`);
        }
    }
    
    setupKeplrEventListeners() {
        if (window.keplr) {
            // Listen for account changes
            window.addEventListener('keplr_keystorechange', () => {
                console.log('🔄 Keplr account changed');
                this.handleAccountChange();
            });
        }
    }
    
    setupLeapEventListeners() {
        if (window.leap) {
            // Listen for account changes
            window.addEventListener('leap_keystorechange', () => {
                console.log('🔄 Leap account changed');
                this.handleAccountChange();
            });
        }
    }
    
    async handleAccountChange() {
        try {
            // Reconnect to get updated account
            const result = await this.connectWallet(this.walletType);
            if (result.success) {
                // Notify the game about account change
                this.onAccountChange(result);
            }
        } catch (error) {
            console.error('Error handling account change:', error);
            this.disconnect();
        }
    }
    
    onAccountChange(newConnection) {
        // Emit custom event for account changes
        const event = new CustomEvent('walletAccountChanged', {
            detail: {
                address: newConnection.address,
                walletType: newConnection.walletType
            }
        });
        window.dispatchEvent(event);
    }
    
    disconnect() {
        this.wallet = null;
        this.address = null;
        this.connected = false;
        this.walletType = null;
        
        console.log('👋 Wallet disconnected');
        
        // Emit disconnect event
        const event = new CustomEvent('walletDisconnected');
        window.dispatchEvent(event);
    }
    
    isConnected() {
        return this.connected && this.address !== null;
    }
    
    getAddress() {
        return this.address;
    }
    
    getWalletType() {
        return this.walletType;
    }
    
    async getBalance() {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            // This would typically query the blockchain for balance
            // For now, return mock balance data
            return {
                amount: '1000000',
                denom: 'ustars',
                formatted: '1.0 STARS'
            };
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return null;
        }
    }
    
    async signTransaction(transaction) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            let result;
            
            switch (this.walletType) {
                case 'keplr':
                    result = await window.keplr.signDirect(
                        this.chainId,
                        this.address,
                        transaction
                    );
                    break;
                    
                case 'leap':
                    result = await window.leap.signDirect(
                        this.chainId,
                        this.address,
                        transaction
                    );
                    break;
                    
                case 'cosmostation':
                    result = await window.cosmostation.cosmos.request({
                        method: 'cos_signDirect',
                        params: {
                            chainName: 'stargaze',
                            doc: transaction
                        }
                    });
                    break;
                    
                default:
                    throw new Error(`Unsupported wallet type: ${this.walletType}`);
            }
            
            return result;
        } catch (error) {
            throw new Error(`Transaction signing failed: ${error.message}`);
        }
    }
    
    // Utility method to check if wallet extensions are available
    static getAvailableWallets() {
        const wallets = [];
        
        if (window.keplr) {
            wallets.push({
                name: 'Keplr',
                key: 'keplr',
                installed: true
            });
        }
        
        if (window.leap) {
            wallets.push({
                name: 'Leap',
                key: 'leap',
                installed: true
            });
        }
        
        if (window.cosmostation) {
            wallets.push({
                name: 'Cosmostation',
                key: 'cosmostation',
                installed: true
            });
        }
        
        return wallets;
    }
    
    // Method to suggest wallet installation
    static getWalletInstallLinks() {
        return {
            keplr: 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
            leap: 'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
            cosmostation: 'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf'
        };
    }
}

// Create singleton instance
const walletConnection = new WalletConnection();

// Export convenience functions
export async function connectWallet(preferredWallet = 'auto') {
    return await walletConnection.connectWallet(preferredWallet);
}

export function disconnectWallet() {
    walletConnection.disconnect();
}

export function isWalletConnected() {
    return walletConnection.isConnected();
}

export function getWalletAddress() {
    return walletConnection.getAddress();
}

export function getWalletType() {
    return walletConnection.getWalletType();
}

export function getAvailableWallets() {
    return WalletConnection.getAvailableWallets();
}

export function getWalletInstallLinks() {
    return WalletConnection.getWalletInstallLinks();
}

// Export the singleton instance as default
export default walletConnection;