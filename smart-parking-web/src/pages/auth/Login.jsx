import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginInputField, LoginButton } from '../../components/SharedUI';
import { fetchAPI } from '../../api/config';

// Import ảnh từ thư mục assets
import logoBk from '../../assets/logobk.png';
import loginBg from '../../assets/login.jpg';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                navigate('/admin/dashboard', { state: { user: data.user } });
            } else if (data.user.role === 'student') {
                navigate('/student/home', { state: { user: data.user } });
            } else {
                navigate('/lecturer/home', { state: { user: data.user } });
            }
        } catch (err) {
            setError(err.message);
            alert('Đăng nhập thất bại: ' + err.message);
        }
    };

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
                <form className="flex flex-col gap-[20px]" onSubmit={handleLogin}>
                    {/* Trường Username */}
                    <LoginInputField 
                        label="Username" 
                        placeholder="Nhập tên đăng nhập" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Trường Password */}
                    <LoginInputField 
                        label="Password" 
                        type="password" 
                        placeholder="Nhập mật khẩu" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Hàng nút bấm: Login và Clear */}
                    <div className="flex gap-[15px] mt-[10px]">
                        <LoginButton isMobile={false} type="submit">Login</LoginButton>
                        <LoginButton isMobile={false} className="bg-gray-500" onClick={(e) => { e.preventDefault(); setUsername(''); setPassword(''); }}>Clear</LoginButton>
                    </div>

                    {/* Link phụ */}
                    <div className="mt-2 text-primary font-medium text-sm cursor-pointer hover:underline">
                        Change password?
                    </div>
                </form>
            </main>
        </div>
    );
}