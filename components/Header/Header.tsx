"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);
    const closeMenu = () => {
        setIsOpen(false);
        setIsDropdownOpen(false);
    };
    
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: 'TRANG CHỦ', href: '/' },
        { name: 'GIỚI THIỆU', href: '/gioi-thieu' },
        { name: 'MUA SẮM', href: '/mua-sam' },
        { name: 'HÌNH ẢNH', href: '/hinh-anh' },
        { name: 'FEEDBACK', href: '/feedback' },
        { name: 'TIN TỨC', href: '/tin-tuc' },
    ];

    const listingOptions = [
        { name: 'Xe Điện', href: '/listing/electric-car' },
        { name: 'Pin', href: '/listing/battery' },
    ];

    return (
        <header>
            <nav className="fixed w-full z-50 bg-white border-b-4 border-gray-200 px-4 lg:px-6 py-2.5 shadow-md">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

                    {/* Logo */}
                    <a href="/" className="flex items-center">
                        <img src="#" className="mr-3 h-6 sm:h-9" alt="logo" />
                        <span className="self-center text-base font-semibold text-red-600 lg:text-lg whitespace-nowrap">EV-Shop</span>
                    </a>

                    {/* Đăng nhập + toggle mobile menu */}
                    <div className="flex items-center lg:order-2">
                        <a
                            href="/login"
                            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 focus:outline-none"
                        >
                            Đăng nhập
                        </a>
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 5h14a1 1 0 010 2H3a1 1 0 110-2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Navigation menu */}
                    <div
                        id="mobile-menu"
                        className={`${isOpen ? 'block' : 'hidden'
                            } w-full lg:flex lg:w-auto lg:order-1`}
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={closeMenu}
                                        className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-200"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                            
                            {/* Listing Dropdown */}
                            <li className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={toggleDropdown}
                                    className="flex items-center py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-200 font-medium w-full text-left lg:w-auto"
                                >
                                    ĐĂNG TIN
                                    <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                        <div className="py-1">
                                            {listingOptions.map((option) => (
                                                <a
                                                    key={option.name}
                                                    href={option.href}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={closeMenu}
                                                >
                                                    {option.name === 'Xe Điện' && (
                                                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                        </svg>
                                                    )}
                                                    {option.name === 'Pin' && (
                                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {option.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
