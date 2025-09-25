"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        phone: "",
        dob: "",
    });

    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage("🎉 Đăng ký thành công!");
                setFormData({
                    userName: "",
                    userEmail: "",
                    userPassword: "",
                    phone: "",
                    dob: "",
                });
            } else {
                const err = await res.json();
                setMessage(`Lỗi: ${err.message || "Đăng ký thất bại"}`);
            }
        } catch (error) {
            console.error(error);
            setMessage("⚠️ Không thể kết nối đến server");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên đăng nhập</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        name="userPassword"
                        value={formData.userPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Ngày sinh</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Đăng ký</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}