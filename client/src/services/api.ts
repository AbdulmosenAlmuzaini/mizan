import axios from 'axios';

// ============= Types =============
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'ACCOUNTANT' | 'EMPLOYEE' | 'VIEWER';
    companyName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export interface Expense {
    id: string;
    amount: number;
    currency: string;
    description?: string;
    category: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    receiptUrl?: string;
    userId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseRequest {
    amount: number;
    currency?: string;
    description?: string;
    category: string;
    receiptUrl?: string;
}

export interface UpdateExpenseRequest {
    amount?: number;
    currency?: string;
    description?: string;
    category?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    receiptUrl?: string;
}

// ============= Axios Instance =============
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - handle 401 errors (auto-logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - logout user
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============= Auth API =============
export const authAPI = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },
};

// ============= Expense API =============
export const expenseAPI = {
    getAll: async (): Promise<Expense[]> => {
        const response = await api.get<Expense[]>('/expenses');
        return response.data;
    },

    create: async (data: CreateExpenseRequest | FormData): Promise<Expense> => {
        const response = await api.post<Expense>('/expenses', data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return response.data;
    },

    update: async (id: string, data: UpdateExpenseRequest | FormData): Promise<Expense> => {
        const response = await api.put<Expense>(`/expenses/${id}`, data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },
};

export default api;
