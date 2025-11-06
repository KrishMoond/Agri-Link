import api from '../configs/api';

export interface Transaction {
  _id: string;
  transactionId: string;
  type: 'direct-purchase' | 'auction-win' | 'bulk-order';
  buyerId: string;
  sellerId: string;
  productId?: string;
  auctionId?: string;
  orderDetails: {
    itemName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalAmount: number;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
    };
  };
  payment: {
    method: 'upi' | 'bank-transfer' | 'cod' | 'escrow';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentId?: string;
    paidAt?: string;
    escrowReleased: boolean;
  };
  delivery: {
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    estimatedDate?: string;
    actualDate?: string;
    trackingId?: string;
    deliveryPartner?: string;
  };
  communication: Array<{
    senderId: string;
    message: string;
    timestamp: string;
    type: 'message' | 'status-update' | 'system';
  }>;
  dispute: {
    isDisputed: boolean;
    reason?: string;
    raisedBy?: string;
    raisedAt?: string;
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    resolution?: string;
  };
  feedback: {
    buyerRating?: number;
    buyerReview?: string;
    sellerRating?: number;
    sellerReview?: string;
  };
  invoice: {
    invoiceNumber?: string;
    gstAmount: number;
    finalAmount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: 'direct-purchase' | 'auction-win' | 'bulk-order';
  sellerId: string;
  productId?: string;
  auctionId?: string;
  orderDetails: {
    itemName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalAmount: number;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
    };
  };
  paymentMethod: 'upi' | 'bank-transfer' | 'cod' | 'escrow';
}

class TransactionService {
  async createTransaction(data: CreateTransactionData): Promise<{ message: string; transaction: Transaction; transactionId: string }> {
    const response = await api.post('/transactions', data);
    return response.data;
  }

  async getMyTransactions(filters: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    transactions: Transaction[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/transactions/my-transactions?${params.toString()}`);
    return response.data;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  }

  async updateTransactionStatus(id: string, updates: {
    deliveryStatus?: string;
    paymentStatus?: string;
    trackingId?: string;
  }): Promise<{ message: string; transaction: Transaction }> {
    const response = await api.put(`/transactions/${id}/status`, updates);
    return response.data;
  }

  async addMessage(id: string, message: string, type: 'message' | 'status-update' = 'message'): Promise<{ message: string }> {
    const response = await api.post(`/transactions/${id}/message`, {
      message,
      type
    });
    return response.data;
  }

  async raiseDispute(id: string, reason: string): Promise<{ message: string }> {
    const response = await api.post(`/transactions/${id}/dispute`, {
      reason
    });
    return response.data;
  }

  async addFeedback(id: string, rating: number, review: string): Promise<{ message: string }> {
    const response = await api.post(`/transactions/${id}/feedback`, {
      rating,
      review
    });
    return response.data;
  }

  async getAnalytics(): Promise<{
    totalTransactions: number;
    completedTransactions: number;
    pendingTransactions: number;
    disputedTransactions: number;
    totalRevenue: number;
    completionRate: string;
  }> {
    const response = await api.get('/transactions/analytics/overview');
    return response.data;
  }

  // Helper methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentMethodIcon(method: string): string {
    switch (method) {
      case 'upi': return '📱';
      case 'bank-transfer': return '🏦';
      case 'cod': return '💵';
      case 'escrow': return '🔒';
      default: return '💳';
    }
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  calculateGST(amount: number, gstRate: number = 5): number {
    return (amount * gstRate) / 100;
  }

  generateInvoiceNumber(): string {
    return 'INV' + Date.now() + Math.random().toString(36).substr(2, 5);
  }
}

export default new TransactionService();