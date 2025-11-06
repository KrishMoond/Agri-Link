import api from '../configs/api';

export interface Product {
  _id: string;
  productId: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  minimumOrder: number;
  quality: string;
  harvestDate?: string;
  expiryDate?: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  location: {
    state: string;
    district: string;
    village?: string;
    pincode: string;
  };
  images: string[];
  availability: string;
  certifications: Array<{
    type: string;
    authority: string;
    certificateNumber: string;
    validUntil: string;
  }>;
  ratings: Array<{
    buyerId: string;
    rating: number;
    review: string;
    createdAt: string;
  }>;
  averageRating: number;
  totalSales: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  quality?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

class ProductService {
  async createProduct(productData: FormData): Promise<{ message: string; product: Product }> {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getProducts(filters: ProductFilters = {}): Promise<{
    products: Product[];
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

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async updateProduct(id: string, productData: FormData): Promise<{ message: string; product: Product }> {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    const response = await api.get(`/products/farmer/${farmerId}`);
    return response.data;
  }

  async addProductRating(productId: string, rating: number, review: string): Promise<{ message: string; averageRating: number }> {
    const response = await api.post(`/products/${productId}/rating`, {
      rating,
      review,
    });
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    return [
      'vegetables',
      'fruits',
      'grains',
      'pulses',
      'spices',
      'dairy',
      'organic',
      'other'
    ];
  }

  async getUnits(): Promise<string[]> {
    return [
      'kg',
      'quintal',
      'ton',
      'piece',
      'dozen',
      'liter'
    ];
  }

  async getQualityTypes(): Promise<string[]> {
    return [
      'premium',
      'standard',
      'organic',
      'export-quality'
    ];
  }
}

export default new ProductService();