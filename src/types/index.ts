export interface User {
  uid: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string[];
  gender: string;
  dob: string;
  role: 'buyer' | 'seller';
  gstNumber?: string;
  farmerCardNumber?: string;
  profilePicUrl?: string;
}

export interface Auction {
  id: string;
  _id?: string;
  auctionId: string;
  itemName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  auctionStartDate: string;
  auctionEndDate: string;
  sellerName: string;
  sellerEmail: string;
  sellerId: string;
  location: string;
  imageUrl?: string;
  topBids?: TopBid[];
}

export interface TopBid {
  bidAmount: number;
  userId: string;
  userName?: string;
  location?: string;
  phone?: string;
}

export interface Order {
  orderId: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}
