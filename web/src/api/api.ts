import {
  LoginFormDto,
  RegisterFormDto,
  UserDto,
  LoginDto,
  UpdateProfileDto,
  ChangePasswordDto,
  UpdateUserDto,
} from '@/models/user';
import { ClothingItemDto, ClothingItemFormDto, ClothingItemQueryDto, ClothingItemUpdateDto } from '@/models/item';
import { CreateOrderDto, OrderDto, UpdateOrderStatusDto, OrderQueryDto } from '@/models/order';
import apiClient from './client';
import { FileDto } from '@/models/file';
import { Paginated } from '@/models/common';
import { cleanSearchParams } from '@/lib/object';

export const api = {
  users: {
    login: async (form: LoginFormDto): Promise<LoginDto> => {
      const response = await apiClient.post('api/v1/users/login', form);
      return response.data;
    },
    register: async (form: RegisterFormDto): Promise<UserDto> => {
      const response = await apiClient.post('api/v1/users/register', form);
      return response.data;
    },
    getMe: async (): Promise<UserDto> => {
      const response = await apiClient.get('api/v1/users/me');
      return response.data;
    },
    updateProfile: async (form: UpdateProfileDto): Promise<UserDto> => {
      const response = await apiClient.put('api/v1/users/me', form);
      return response.data;
    },
    changePassword: async (form: ChangePasswordDto): Promise<void> => {
      const response = await apiClient.put('api/v1/users/me/password', form);
      return response.data;
    },
    getAllUsers: async (): Promise<UserDto[]> => {
      const response = await apiClient.get('api/v1/users');
      return response.data;
    },
    getUserById: async (id: string): Promise<UserDto> => {
      const response = await apiClient.get(`api/v1/users/${id}`);
      return response.data;
    },
    updateUser: async (id: string, form: UpdateUserDto): Promise<UserDto> => {
      const response = await apiClient.put(`api/v1/users/${id}`, form);
      return response.data;
    },
    deleteUser: async (id: string): Promise<void> => {
      const response = await apiClient.delete(`api/v1/users/${id}`);
      return response.data;
    },
  },
  clothingItems: {
    getAll: async (query?: ClothingItemQueryDto): Promise<Paginated<ClothingItemDto>> => {
      const response = await apiClient.get('api/v1/items', { params: cleanSearchParams(query) });
      return response.data;
    },
    getById: async (id: string): Promise<ClothingItemDto> => {
      const response = await apiClient.get(`api/v1/items/${id}`);
      return response.data;
    },
    create: async (form: ClothingItemFormDto): Promise<ClothingItemDto> => {
      const response = await apiClient.post('api/v1/items', form);
      return response.data;
    },
    update: async (id: string, form: ClothingItemUpdateDto): Promise<ClothingItemDto> => {
      const response = await apiClient.put(`api/v1/items/${id}`, form);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      const response = await apiClient.delete(`api/v1/items/${id}`);
      return response.data;
    },
  },
  orders: {
    create: async (form: CreateOrderDto): Promise<OrderDto> => {
      const response = await apiClient.post('api/v1/orders', form);
      return response.data;
    },
    trackOrder: async (trackingCode: string): Promise<OrderDto> => {
      const response = await apiClient.get(`api/v1/orders/track/${trackingCode}`);
      return response.data;
    },
    getUserOrders: async (): Promise<OrderDto[]> => {
      const response = await apiClient.get('api/v1/orders/user');
      return response.data;
    },
    getOrderById: async (id: string): Promise<OrderDto> => {
      const response = await apiClient.get(`api/v1/orders/${id}`);
      return response.data;
    },
    updateOrderStatus: async (id: string, form: UpdateOrderStatusDto): Promise<OrderDto> => {
      const response = await apiClient.patch(`api/v1/orders/${id}/status`, form);
      return response.data;
    },
    getAllOrders: async (query?: OrderQueryDto): Promise<Paginated<OrderDto>> => {
      const response = await apiClient.get('api/v1/orders', { params: cleanSearchParams(query) });
      return response.data;
    },
  },
  files: {
    upload: async (formData: FormData): Promise<FileDto> => {
      const response = await apiClient.post('api/v1/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  },
};

export default api;
