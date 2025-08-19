import { request } from 'graphql-request';
import { API_CONFIG, MOCK_DATA } from '../utils/gameConfig.js';

export class StargazeAPI {
    constructor() {
        this.endpoint = API_CONFIG.STARGAZE.GRAPHQL_ENDPOINT;
        this.corsProxy = API_CONFIG.STARGAZE.CORS_PROXY;
        this.timeout = API_CONFIG.STARGAZE.TIMEOUT;
    }
    
    async fetchTopCollections(limit = 5) {
        try {
            console.log('🔍 Fetching top NFT collections from Stargaze...');
            
            const query = `
                query GetTopCollections($limit: Int!) {
                    collections(
                        limit: $limit
                        order_by: {volume_7d: desc}
                        where: {
                            verified: {_eq: true}
                            volume_7d: {_gt: 0}
                        }
                    ) {
                        collection_addr
                        name
                        image
                        floor_price
                        volume_7d
                        total_supply
                        verified
                    }
                }
            `;
            
            const variables = { limit };
            
            // Try direct GraphQL call first
            let data;
            try {
                data = await this.makeGraphQLRequest(query, variables);
            } catch (directError) {
                console.warn('❌ Direct GraphQL request failed:', directError.message);
                console.log('🔄 Attempting with CORS proxy...');
                
                // Try with CORS proxy
                try {
                    data = await this.makeProxiedRequest(query, variables);
                } catch (proxyError) {
                    console.error('❌ Proxied request also failed:', proxyError.message);
                    throw new Error('Both direct and proxied requests failed');
                }
            }
            
            if (data && data.collections && data.collections.length > 0) {
                console.log(`✅ Successfully fetched ${data.collections.length} collections`);
                return this.processCollectionData(data.collections);
            } else {
                console.warn('⚠️ No collections returned from API');
                throw new Error('No collections data received');
            }
            
        } catch (error) {
            console.error('🚨 Stargaze API error:', error);
            console.log('🔄 Falling back to mock data...');
            return this.getMockData();
        }
    }
    
    async makeGraphQLRequest(query, variables) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const data = await request(this.endpoint, query, variables, {
                'User-Agent': 'Cosmic-Heroes-Liberation/1.0.0',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    }
    
    async makeProxiedRequest(query, variables) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            // Use allorigins.win as CORS proxy
            const proxiedUrl = `${this.corsProxy}${encodeURIComponent(this.endpoint)}`;
            
            const response = await fetch(proxiedUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.errors && result.errors.length > 0) {
                throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
            }
            
            return result.data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Proxied request timed out');
            }
            throw error;
        }
    }
    
    processCollectionData(collections) {
        return collections.map(collection => ({
            collection_addr: collection.collection_addr || 'unknown',
            name: collection.name || 'Unknown Collection',
            image: this.validateImageUrl(collection.image),
            floor_price: Math.max(0, parseInt(collection.floor_price) || 0),
            volume_7d: Math.max(0, parseInt(collection.volume_7d) || 0),
            total_supply: Math.max(1, parseInt(collection.total_supply) || 1),
            verified: collection.verified || false
        })).filter(collection => 
            collection.name !== 'Unknown Collection' && 
            collection.volume_7d > 0
        );
    }
    
    validateImageUrl(imageUrl) {
        // Validate and sanitize image URLs
        if (!imageUrl) return this.getPlaceholderImage();
        
        try {
            const url = new URL(imageUrl);
            // Allow common image hosting services
            const allowedDomains = [
                'ipfs.io',
                'gateway.pinata.cloud', 
                'stargaze-zone.github.io',
                'cloudflare-ipfs.com',
                'via.placeholder.com'
            ];
            
            if (allowedDomains.some(domain => url.hostname.includes(domain))) {
                return imageUrl;
            } else {
                console.warn(`⚠️ Image URL from untrusted domain: ${url.hostname}`);
                return this.getPlaceholderImage();
            }
        } catch (error) {
            console.warn('⚠️ Invalid image URL:', imageUrl);
            return this.getPlaceholderImage();
        }
    }
    
    getPlaceholderImage() {
        // Return a placeholder image URL
        const colors = ['6B46C1', 'F59E0B', '10B981', 'EF4444', '8B5CF6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return `https://via.placeholder.com/100x100/${randomColor}/FFFFFF?text=NFT`;
    }
    
    getMockData() {
        console.log('📊 Using mock NFT collection data');
        return MOCK_DATA.collections.map(collection => ({
            ...collection,
            image: this.validateImageUrl(collection.image)
        }));
    }
    
    // Additional utility methods
    async fetchCollectionDetails(collectionAddr) {
        try {
            const query = `
                query GetCollectionDetails($addr: String!) {
                    collection(collection_addr: $addr) {
                        collection_addr
                        name
                        description
                        image
                        floor_price
                        volume_7d
                        volume_total
                        total_supply
                        num_owners
                        verified
                        creator_addr
                        royalty_percentage
                    }
                }
            `;
            
            const variables = { addr: collectionAddr };
            const data = await this.makeGraphQLRequest(query, variables);
            
            if (data && data.collection) {
                return this.processCollectionData([data.collection])[0];
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching collection details:', error);
            return null;
        }
    }
    
    async fetchCollectionNFTs(collectionAddr, limit = 10) {
        try {
            const query = `
                query GetCollectionNFTs($addr: String!, $limit: Int!) {
                    nfts(
                        collection_addr: $addr
                        limit: $limit
                        order_by: {token_id: asc}
                    ) {
                        token_id
                        name
                        image
                        description
                        owner
                        price {
                            amount
                            denom
                        }
                    }
                }
            `;
            
            const variables = { addr: collectionAddr, limit };
            const data = await this.makeGraphQLRequest(query, variables);
            
            return data?.nfts || [];
        } catch (error) {
            console.error('Error fetching collection NFTs:', error);
            return [];
        }
    }
}

// Create singleton instance
const stargazeAPI = new StargazeAPI();

// Export convenience functions
export async function fetchTopCollections(limit = 5) {
    return await stargazeAPI.fetchTopCollections(limit);
}

export async function fetchCollectionDetails(collectionAddr) {
    return await stargazeAPI.fetchCollectionDetails(collectionAddr);
}

export async function fetchCollectionNFTs(collectionAddr, limit = 10) {
    return await stargazeAPI.fetchCollectionNFTs(collectionAddr, limit);
}

export default stargazeAPI;