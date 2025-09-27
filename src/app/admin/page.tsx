"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function AdminPage() {
    const router = useRouter();


    // Check token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);


}
