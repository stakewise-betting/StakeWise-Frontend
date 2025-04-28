import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

// For safety you can supply a fallback:
const baseURL = API_URL ?? 'http://localhost:4000/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  category?: string;
}

// Submit contact form
export const submitContactForm = async (formData: ContactFormData) => {
  try {
    // Map the frontend data to match backend expected fields
    const backendFormData = {
      fullname: formData.name,
      email: formData.email,
      queryCategory: formData.category || formData.subject,
      message: formData.message
    };

    const response = await api.post('/contact', backendFormData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error occurred' };
  }
};

// Get user's own contact submissions (requires auth)
export const getUserContacts = async () => {
  try {
    const response = await api.get('/contact/my-contacts');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error occurred' };
  }
};

// Admin functions
export const getAllContacts = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, string> = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...filters, // status, category, search
    });

    const response = await api.get(`/contact?${queryParams}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error occurred' };
  }
};

export const getContactById = async (id: string) => {
  try {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error occurred' };
  }
};

export const updateContactStatus = async (id: string, status: string) => {
  try {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error occurred' };
  }
};

export const addContactReply = async (id: string, message: string) => {
  try {
    const response = await api.post(`/contact/${id}/reply`, { message });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error occurred' };
  }
};