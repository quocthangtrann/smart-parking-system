import React from 'react';
import { LoginInputField, LoginButton } from '../../components/SharedUI';

// Import ảnh từ thư mục assets
import logoBk from '../../assets/logobk.png';
import loginBg from '../../assets/login.jpg';

export default function Login() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">

            {/* 1. HEADER (Giống trang trước) */}
            <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] relative z-20 shadow-md">
                <div className="w-[54px] h-[54px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoBk} alt="BK Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-white text-[18px] md:text-[24px] font-semibold ml-[17px]">
                    Central Authentication Service
                </h1>
            </header>

            {/* 2. BACKGROUND IMAGE (Opacity 20%) */}
            {/* Laptop: X:-33, Y:466. Kích thước lớn phía dưới */}
            <img
                src={loginBg}
                alt="Background"
                className="absolute bottom-0 left-0 w-full h-[476px] object-cover opacity-20 pointer-events-none z-0"
            />

            {/* 3. MAIN CONTENT AREA */}
            <main className="flex-1 relative z-10 flex flex-col md:flex-row items-start justify-center pt-[80px] md:pt-[158px] gap-[40px] md:gap-[76px] px-4">

                {/* Logo BK Lớn (Vị trí X:394, Y:158) */}
                <div className="w-[120px] h-[120px] shrink-0">
                    <img src={logoBk} alt="BK Logo Large" className="w-full h-full object-contain" />
                </div>

                {/* Form Đăng nhập (Bắt đầu từ X:590) */}
                <div className="flex flex-col gap-[20px]">
                    {/* Trường Username */}
                    <LoginInputField label="Username" placeholder="Nhập tên đăng nhập" />

                    {/* Trường Password (Tạm thời dùng chung component để giữ layout) */}
                    <LoginInputField label="Password" type="password" placeholder="Nhập mật khẩu" />

                    {/* Hàng nút bấm: Login và Clear */}
                    <div className="flex gap-[15px] mt-[10px]">
                        <LoginButton isMobile={false}>Login</LoginButton>
                        {/* Clear button có thể tùy biến màu sắc hoặc variant sau */}
                        <LoginButton isMobile={false} className="bg-gray-500">Clear</LoginButton>
                    </div>

                    {/* Link phụ */}
                    <div className="mt-2 text-primary font-medium text-sm cursor-pointer hover:underline">
                        Change password?
                    </div>
                </div>
            </main>
        </div>
    );
}