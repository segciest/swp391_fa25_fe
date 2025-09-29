"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Type definitions based on backend response
interface Category {
    categoryId: number;
    categoryName: string;
}

interface ListingFormData {
    title: string;
    description: string;
    brand: string;
    model: string;
    year: number;
    seats: number | null;
    vehicleType: string;
    color: string;
    mileage: number | null;
    price: number;
    contract: string;
    warrantyInfo: string;
    categoryId: number;
}

export default function ElectricCarListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // Form state
    const [formData, setFormData] = useState<ListingFormData>({
        title: "",
        description: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        seats: null,
        vehicleType: "",
        color: "",
        mileage: null,
        price: 0,
        contract: "",
        warrantyInfo: "",
        categoryId: 1 // Electric Car category
    });

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' || name === 'seats' || name === 'mileage' || name === 'price' || name === 'categoryId'
                ? (value === '' ? null : Number(value))
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to create a listing");
                return;
            }

            const response = await fetch("http://localhost:8080/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create listing");
            }

            setSuccess("🎉 Listing created successfully!");
            // Reset form
            setFormData({
                title: "",
                description: "",
                brand: "",
                model: "",
                year: new Date().getFullYear(),
                seats: null,
                vehicleType: "",
                color: "",
                mileage: null,
                price: 0,
                contract: "",
                warrantyInfo: "",
                categoryId: 1
            });

            // Redirect to listings page after 2 seconds
            setTimeout(() => {
                router.push("/listings");
            }, 2000);

        } catch (err: any) {
            setError(err.message || "An error occurred while creating the listing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng tin bán xe điện</h1>
                    <p className="text-gray-600">Điền thông tin chi tiết về xe điện của bạn</p>
                </div>

                {/* Main Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error/Success Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <p className="text-green-600 text-sm">{success}</p>
                            </div>
                        )}

                        {/* Images Upload Section */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div className="mt-4">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            ĐĂNG TỚI 10 HÌNH CHO TIN ĐĂNG
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">Hình đầu tiên sẽ được dùng làm ảnh bìa</p>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={1}>Xe điện</option>
                            </select>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hãng xe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: VinFast, Tesla..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại xe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: VF e34, Model 3..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đời xe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="2000"
                                    max={new Date().getFullYear() + 1}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Màu sắc
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: Trắng, Đen, Xanh..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số chỗ ngồi
                                </label>
                                <input
                                    type="number"
                                    name="seats"
                                    value={formData.seats || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="8"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Km đã đi
                                </label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: 15000"
                                />
                            </div>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại phương tiện
                            </label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn loại phương tiện</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Scooter">Xe tay ga</option>
                                <option value="Motorcycle">Xe mô tô</option>
                            </select>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề tin đăng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="VD: Bán VinFast VF e34 2023 màu trắng, mới 98%"
                                maxLength={100}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Tối đa 100 ký tự</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả chi tiết <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="- Xuất xứ, tình trạng chiếc xe
- Chính sách bảo hành, bảo trì, đổi trả
- Ưu điểm của gian hàng, uy tín
- Thời gian sử dụng xe"
                                maxLength={1500}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Tối đa 1500 ký tự</p>
                        </div>

                        {/* Warranty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bảo hành
                            </label>
                            <input
                                type="text"
                                name="warrantyInfo"
                                value={formData.warrantyInfo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="VD: Bảo hành 2 năm hoặc 50,000km"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá bán <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">USD</span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số điện thoại liên hệ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="contract"
                                value={formData.contract}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0912345678"
                                required
                            />
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="agree-terms"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-700">
                                Tôi muốn cho đăng miễn phí
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-between pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Xem trước
                            </button>
                            
                            <div className="space-x-4">
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Lưu nháp
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                                >
                                    {loading ? "Đang đăng..." : "Đăng tin"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}