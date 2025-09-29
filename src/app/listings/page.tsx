"use client";

import { useState, useEffect } from "react";
import { ListingService, Listing, ListingResponse } from "@/services/listingService";

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch listings
    const fetchListings = async (page = 0, categoryId?: number, query = "") => {
        setLoading(true);
        try {
            let response: ListingResponse;
            
            if (query.trim()) {
                response = await ListingService.searchListings(query, categoryId, undefined, undefined, page, 10);
            } else if (categoryId) {
                response = await ListingService.getListingsByCategory(categoryId, page, 10);
            } else {
                response = await ListingService.getListings(page, 10);
            }

            setListings(response.content);
            setTotalPages(response.totalPages);
            setCurrentPage(response.number);
        } catch (err) {
            setError("Failed to load listings");
            console.error("Error fetching listings:", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchListings();
    }, []);

    // Handle category filter
    const handleCategoryChange = (categoryId: number | undefined) => {
        setSelectedCategory(categoryId);
        setCurrentPage(0);
        fetchListings(0, categoryId, searchQuery);
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchListings(0, selectedCategory, searchQuery);
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        fetchListings(page, selectedCategory, searchQuery);
    };

    if (loading && listings.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading listings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">EV & Battery Marketplace</h1>
                    
                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for electric cars, batteries..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryChange(undefined)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    selectedCategory === undefined
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All Categories
                            </button>
                            <button
                                onClick={() => handleCategoryChange(1)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    selectedCategory === 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Electric Cars
                            </button>
                            <button
                                onClick={() => handleCategoryChange(2)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    selectedCategory === 2
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Motorbikes
                            </button>
                            <button
                                onClick={() => handleCategoryChange(3)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    selectedCategory === 3
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Batteries
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Listings Grid */}
                {listings.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new listing.</p>
                        <div className="mt-6">
                            <a
                                href="/listing/electric-car"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Create Listing
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.listingId} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                {/* Listing Image Placeholder */}
                                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div className="p-4">
                                    {/* Category & Status */}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {listing.category.categoryName}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ListingService.getStatusColor(listing.status)}`}>
                                            {listing.status}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {listing.title}
                                    </h3>

                                    {/* Brand & Model */}
                                    <p className="text-sm text-gray-600 mb-2">
                                        {listing.brand} {listing.model} ({listing.year})
                                    </p>

                                    {/* Price */}
                                    <p className="text-xl font-bold text-green-600 mb-3">
                                        {ListingService.formatPrice(listing.price)}
                                    </p>

                                    {/* Additional Info */}
                                    <div className="text-xs text-gray-500 space-y-1 mb-3">
                                        {listing.mileage && (
                                            <p>Mileage: {listing.mileage.toLocaleString()} km</p>
                                        )}
                                        {listing.batteryCapacity && (
                                            <p>Battery: {listing.batteryCapacity} kWh</p>
                                        )}
                                        {listing.seats && (
                                            <p>Seats: {listing.seats}</p>
                                        )}
                                    </div>

                                    {/* Seller Info */}
                                    <div className="border-t pt-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {listing.seller.userName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {ListingService.formatDate(listing.createdAt)}
                                                </p>
                                            </div>
                                            {listing.seller.subid && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {listing.seller.subid.subName}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Contact Button */}
                                        <div className="mt-3">
                                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
                                                Contact: {listing.contract}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0 || loading}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index)}
                                    disabled={loading}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        index === currentPage
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1 || loading}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}

                {/* Loading overlay */}
                {loading && listings.length > 0 && (
                    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}