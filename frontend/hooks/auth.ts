import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth';


export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await api.post<LoginResponse>('/login', data);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Login failed');
        },
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            try {
                const response = await api.post<LoginResponse>('/register', data);
                return response.data;
            } catch (error: any) {
                toast.error(error.response?.data?.error || 'Registration failed');
                console.log('signup error:', error);
                
                if (error.response) {
                    throw new Error(error.response.data?.error || 'Registration failed');
                }else if (error.request) {
                    throw new Error('No response from server. Please try again.');
                } else {
                    throw new Error('Failed to make request. Please try again.');
                }
            }
        },
        onSuccess: (data) => {
            toast.success('Registration successful! Please login to continue.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Registration failed');
        },
    });
};

