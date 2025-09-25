// src/components/ClientHeader.tsx
"use client";

import { useEffect, useState } from 'react';
import { initializeFlowbite } from '../../utils/initFlowbite';
import Header from './Header';

export default function ClientHeader() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        initializeFlowbite();
    }, []);
    if (!mounted) return null;
    return <Header />;
}