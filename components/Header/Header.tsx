'use client';

import { useState } from 'react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { name: 'TRANG CHỦ', href: '/' },
        { name: 'GIỚI THIỆU', href: '/gioi-thieu' },
        { name: 'MUA SẮM', href: '/mua-sam' },
        { name: 'HÌNH ẢNH', href: '/hinh-anh' },
        { name: 'FEEDBACK', href: '/feedback' },
        { name: 'TIN TỨC', href: '/tin-tuc' },
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
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
