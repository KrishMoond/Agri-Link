import apiClient from '../configs/api';
import { Auction, TopBid } from '../types';

export const auctionService = {
  // Create new auction
  async createAuction(auctionData: Omit<Auction, 'id'>): Promise<string> {
    const response = await apiClient.post('/auctions', auctionData);
    return response.data._id;
  },

  // Get all active auctions
  async getActiveAuctions(): Promise<Auction[]> {
    const response = await apiClient.get('/auctions/active');
    return response.data.map((auction: any) => ({ ...auction, id: auction._id }));
  },

  // Get auctions by seller
  async getAuctionsBySeller(sellerId: string): Promise<Auction[]> {
    const response = await apiClient.get(`/auctions/seller/${sellerId}`);
    return response.data.map((auction: any) => ({ ...auction, id: auction._id }));
  },

  // Place bid
  async placeBid(auctionId: string, bid: TopBid): Promise<void> {
    await apiClient.post(`/auctions/${auctionId}/bid`, bid);
  },

  // Delete auction
  async deleteAuction(auctionId: string): Promise<void> {
    await apiClient.delete(`/auctions/${auctionId}`);
  }
};
