import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoBk from '../../assets/logobk.png';
import { fetchAPI } from '../../api/config';

export default function UserMobileLogin() {
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

            if (data.user.role === 'student') {
                navigate('/student/home', { state: { user: data.user } });
            } else if (data.user.role === 'lecturer') {
                navigate('/lecturer/home', { state: { user: data.user } });
            } else {
                navigate('/admin/dashboard', { state: { user: data.user } });
            }
        } catch (err) {
            setError(err.message);
            alert('Đăng nhập thất bại: ' + err.message);
        }
    };
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">

            {/* 1. HEADER SECTION (Tương tự các trang trước) */}
            <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] relative shadow-md shrink-0">
                <div className="w-[54px] h-[54px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoBk} alt="BK Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-white text-[18px] font-semibold ml-[17px] leading-tight">
                    Central Authentication Service
                </h1>
            </header>

            {/* MAIN BODY */}
            <main className="flex-1 flex flex-col items-center px-[16px] pt-[40px]">

                {/* 2. LOGIN BOX (CARD) 
            - W: 343px, Nền: F0F0F0, Viền đen 1px, Bo góc 4px
        */}
                <div className="w-full max-w-[343px] bg-[#F0F0F0] border border-black rounded-[4px] px-[23px] py-[25px] flex flex-col">

                    {/* Title */}
                    <h2 className="text-[#990033] text-[16px] font-bold mb-[19px]">
                        Enter your Username and Password
                    </h2>

                    {/* Form */}
                    <form className="flex flex-col w-full" onSubmit={handleLogin}>

                        {/* Username Field */}
                        <div className="flex flex-col gap-[3px] mb-[21px]">
                            <label className="text-[#777777] text-[16px] font-semibold">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full max-w-[297px] h-[30px] rounded-[4px] bg-white border border-gray-300 px-2 text-sm focus:outline-none focus:border-[#006DCC]"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-[3px] mb-[20px]">
                            <label className="text-[#777777] text-[16px] font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full max-w-[297px] h-[30px] rounded-[4px] bg-white border border-gray-300 px-2 text-sm focus:outline-none focus:border-[#006DCC]"
                            />
                        </div>

                        {/* Checkbox (Tự thêm để giống UI mẫu chung nếu cần, hoặc bỏ qua nếu Figma điện thoại không vẽ) */}
                        <div className="flex items-center gap-2 mb-[20px]">
                            <input type="checkbox" id="warn-me" className="rounded" />
                            <label htmlFor="warn-me" className="text-[12px] text-gray-700">
                                Warn me before logging me into other sites.
                            </label>
                        </div>

                        {/* Buttons (Login & Clear) */}
                        <div className="flex gap-[14px] mb-[20px]">
                            <button
                                type="submit"
                                className="w-[60px] h-[29px] bg-[#006DCC] text-white text-sm font-medium rounded-[4px] hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setUsername(''); setPassword(''); }}
                                className="w-[60px] h-[29px] bg-[#006DCC] text-white text-sm font-medium rounded-[4px] hover:bg-blue-700 transition-colors"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Change Password Link */}
                        <a href="#" className="text-[#5C2FFF] text-[13px] font-semibold underline hover:text-blue-800 transition-colors">
                            Change password?
                        </a>

                    </form>
                </div>

                {/* 3. TECHNICAL SUPPORT SECTION (Mặc định căn giữa dưới form) */}
                <div className="mt-[40px] text-center max-w-[343px]">
                    <h3 className="text-black text-[14px] font-bold mb-[8px]">
                        Technical support
                    </h3>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                        E-mail: support@hcmut.edu.vn <br />
                        Tel: (84-8) 38647256 - 7204
                    </p>
                </div>

            </main>
        </div>
    );
}