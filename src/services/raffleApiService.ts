//StakeWise-Frontend/src/services/raffleApiService.ts
import axios from 'axios';

// Base API URL - adjust according to your backend configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface RaffleFilterParams {
  search?: string;
  category?: string;
  status?: 'all' | 'active' | 'upcoming' | 'ended';
  minPrize?: number;
  maxPrize?: number;
  minTicketPrice?: number;
  maxTicketPrice?: number;
  sortBy?: 'createdAt' | 'prizeAmount' | 'ticketPrice' | 'endTime' | 'totalTicketsSold';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: any;
}

class RaffleApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth tokens if needed
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Get all raffles from database
  async getAllRaffles(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.axiosInstance.get('/raffles/all');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch raffles');
    }
  }

  // Get raffles with basic filtering
  async getFilteredRaffles(params: RaffleFilterParams): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);

      const response = await this.axiosInstance.get(`/raffles/filter?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered raffles');
    }
  }

  // Get unique categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.axiosInstance.get('/raffles/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Advanced search with pagination
  async searchRaffles(params: RaffleFilterParams): Promise<PaginatedResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await this.axiosInstance.get(`/raffles/search?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search raffles');
    }
  }

  // Upload raffle image (admin only)
  async uploadRaffleImage(imageFile: File): Promise<ApiResponse<{ imageURL: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await this.axiosInstance.post('/raffles/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  }

  // Save raffle to database (admin only)
  async saveRaffle(raffleData: any, imageFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      
      // Append raffle data
      Object.entries(raffleData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append image if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await this.axiosInstance.post('/raffles/save-to-db', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save raffle');
    }
  }
}

// Export singleton instance
export const raffleApiService = new RaffleApiService();

// Export individual methods for convenience
export const {
  getAllRaffles,
  getFilteredRaffles,
  getCategories,
  searchRaffles,
  uploadRaffleImage,
  saveRaffle,
} = raffleApiService;