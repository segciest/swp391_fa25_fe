// Listing service for managing EV & Battery listings
import { ApiService } from './api';

// Types based on backend response
export interface Seller {
    userID: string;
    userName: string;
    userEmail: string;
    dob: string;
    role: {
        roleId: number;
        roleName: string;
    };
    phone: string;
    subid: {
        subId: number;
        subName: string;
        subDetails: string;
        subPrice: string;
        duration: string;
        priorityLevel: number;
        status: string;
    } | null;
    userStatus: string;
}

export interface Category {
    categoryId: number;
    categoryName: string;
}

export interface Listing {
    listingId: string;
    seller: Seller;
    category: Category;
    title: string;
    description: string;
    brand: string;
    warrantyInfo: string | null;
    model: string;
    year: number;
    seats: number | null;
    vehicleType: string | null;
    color: string | null;
    mileage: number | null;
    batteryCapacity: number | null;
    capacity: number | null;
    voltage: number | null;
    cycleCount: number | null;
    batteryLifeRemaining: number | null;
    price: number;
    contract: string;
    status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'EXPIRED';
    createdAt: string;
    updatedAt: string | null;
}

export interface ListingResponse {
    content: Listing[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface CreateListingRequest {
    title: string;
    description: string;
    brand: string;
    model: string;
    year: number;
    seats?: number | null;
    vehicleType?: string;
    color?: string;
    mileage?: number | null;
    batteryCapacity?: number | null;
    capacity?: number | null;
    voltage?: number | null;
    cycleCount?: number | null;
    batteryLifeRemaining?: number | null;
    price: number;
    contract: string;
    warrantyInfo?: string;
    categoryId: number;
}

export interface SubscriptionLimits {
    maxListings: number;
    currentListings: number;
    canPost: boolean;
    subscriptionType: string;
}

export class ListingService {
    // Get all listings with pagination
    static async getListings(page = 0, size = 10): Promise<ListingResponse> {
        return ApiService.get(`/api/listings?page=${page}&size=${size}`);
    }

    // Get listings by category
    static async getListingsByCategory(categoryId: number, page = 0, size = 10): Promise<ListingResponse> {
        return ApiService.get(`/api/listings/category/${categoryId}?page=${page}&size=${size}`);
    }

    // Get listing by ID
    static async getListingById(listingId: string): Promise<Listing> {
        return ApiService.get(`/api/listings/${listingId}`);
    }

    // Create new listing
    static async createListing(listingData: CreateListingRequest): Promise<Listing> {
        return ApiService.post('/api/listings', listingData);
    }

    // Update listing
    static async updateListing(listingId: string, listingData: Partial<CreateListingRequest>): Promise<Listing> {
        return ApiService.put(`/api/listings/${listingId}`, listingData);
    }

    // Delete listing
    static async deleteListing(listingId: string): Promise<void> {
        return ApiService.delete(`/api/listings/${listingId}`);
    }

    // Get user's listings
    static async getUserListings(userId: string, page = 0, size = 10): Promise<ListingResponse> {
        return ApiService.get(`/api/listings/user/${userId}?page=${page}&size=${size}`);
    }

    // Check subscription limits
    static async checkSubscriptionLimits(): Promise<SubscriptionLimits> {
        try {
            const response = await ApiService.get('/api/users/subscription-limits');
            return response;
        } catch (error) {
            // If endpoint doesn't exist, return default limits
            console.warn('Subscription limits endpoint not available, using defaults');
            return {
                maxListings: 1, // Free tier default
                currentListings: 0,
                canPost: true,
                subscriptionType: 'FREE'
            };
        }
    }

    // Search listings
    static async searchListings(
        query: string, 
        categoryId?: number, 
        minPrice?: number, 
        maxPrice?: number,
        page = 0, 
        size = 10
    ): Promise<ListingResponse> {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString()
        });

        if (categoryId) params.append('categoryId', categoryId.toString());
        if (minPrice) params.append('minPrice', minPrice.toString());
        if (maxPrice) params.append('maxPrice', maxPrice.toString());

        return ApiService.get(`/api/listings/search?${params.toString()}`);
    }

    // Get categories
    static async getCategories(): Promise<Category[]> {
        try {
            return await ApiService.get('/api/categories');
        } catch (error) {
            // Return default categories if endpoint not available
            return [
                { categoryId: 1, categoryName: 'Electric Car' },
                { categoryId: 2, categoryName: 'Motorbike' },
                { categoryId: 3, categoryName: 'Battery' }
            ];
        }
    }

    // Upload images for listing
    static async uploadListingImages(listingId: string, images: File[]): Promise<string[]> {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        try {
            const response = await fetch(`http://localhost:8080/api/listings/${listingId}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload images');
            }

            return await response.json();
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    }

    // Get subscription info for current user
    static async getCurrentUserSubscription(): Promise<any> {
        try {
            return await ApiService.get('/api/users/current/subscription');
        } catch (error) {
            console.warn('User subscription endpoint not available');
            return null;
        }
    }

    // Business logic: Check if user can create listing
    static async canUserCreateListing(): Promise<{ canCreate: boolean; reason?: string; upgradeNeeded?: boolean }> {
        try {
            const limits = await this.checkSubscriptionLimits();
            
            if (!limits.canPost) {
                if (limits.currentListings >= limits.maxListings) {
                    return {
                        canCreate: false,
                        reason: `You have reached the maximum number of listings (${limits.maxListings}) for your ${limits.subscriptionType} subscription.`,
                        upgradeNeeded: limits.subscriptionType === 'FREE'
                    };
                }
            }

            return { canCreate: true };
        } catch (error) {
            console.error('Error checking user listing limits:', error);
            // Allow creation if we can't check limits
            return { canCreate: true };
        }
    }

    // Format price for display
    static formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }

    // Format date for display
    static formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    // Get listing status badge color
    static getStatusColor(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'EXPIRED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Check if listing belongs to current user
    static isUserListing(listing: Listing, currentUserId: string): boolean {
        return listing.seller.userID === currentUserId;
    }

    // Get priority level for subscription
    static getSubscriptionPriority(subscription: any): number {
        if (!subscription) return 1; // Free tier
        return subscription.priorityLevel || 1;
    }
}