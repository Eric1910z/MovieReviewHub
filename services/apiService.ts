import type { Review } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred with the API request.');
    }
    return data;
};

export const registerUser = async (credentials: { username: string, password: string }) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const loginUser = async (credentials: { username: string, password: string }) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const getReviews = async (movieId: number): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/movie/${movieId}/reviews`);
    return handleResponse(response);
};

export const postReview = async (movieId: number, reviewData: { username: string, rating: number, content: string }): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/movie/${movieId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
};
