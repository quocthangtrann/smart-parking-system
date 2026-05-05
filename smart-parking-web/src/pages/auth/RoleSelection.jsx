import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleButton } from '../../components/SharedUI';

// 1. IMPORT ẢNH ĐÚNG CÁCH (Đảm bảo đường dẫn này trỏ đúng tới file ảnh của bạn)
import logoBk from '../../assets/logobk.png';

export default function RoleSelection() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        console.log("Đã chọn:", role);
        if (role === 'admin') {
            navigate('/login');
        } else if (role === 'hcmut') {
            navigate('/user-login');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">

            {/* HEADER: 
                - Chiều cao giữ nguyên 77px.
                - Font chữ: Điện thoại (18px) để không bị rớt dòng, Laptop (md:text-[24px]).
            */}
            <header className="h-[77px] bg-primary flex items-center px-[17px] relative shadow-md">
                {/* Logo góc trái: 54x54 */}
                <div className="w-[54px] h-[54px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        src={logoBk} // 2. SỬ DỤNG BIẾN ẢNH ĐÃ IMPORT Ở TRÊN
                        alt="BK Logo"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Tiêu đề */}
                <h1 className="text-white text-[18px] md:text-[24px] font-semibold ml-[17px] leading-tight">
                    Central Authentication Service
                </h1>
            </header>

            {/* MAIN BODY: 
                - pt (padding-top): Điện thoại đẩy xuống ít hơn (80px), Laptop đẩy xuống sâu (147px) 
            */}
            <main className="flex-1 flex flex-col items-center pt-[80px] md:pt-[147px]">

                {/* Logo Lớn ở giữa: 120x120 */}
                <div className="w-[120px] h-[120px] mb-[27px] bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                    <img
                        src={logoBk}
                        alt="HCMUT Logo Lớn"
                        className="w-full h-full object-contain p-2"
                    />
                </div>

                {/* CỤM 2 NÚT BẤM: 
                    - Vẫn nằm ngang trên cả điện thoại (flex-row) vì 130px + 130px vẫn vừa màn hình 375px.
                    - gap (khoảng cách): Điện thoại là 20px, Laptop (md:gap-[48px]) là 48px.
                */}
                <div className="flex flex-row gap-[20px] md:gap-[48px]">
                    {/* Nút Admin (Icon viền đen, rỗng ruột) */}
                    <RoleButton
                        label="Admin"
                        isFilled={false}
                        onClick={() => handleRoleSelect('admin')}
                    />

                    {/* Nút HCMUT Account (Icon bôi đen hoàn toàn) */}
                    <RoleButton
                        label="HCMUT account"
                        isFilled={true}
                        onClick={() => handleRoleSelect('hcmut')}
                    />
                </div>

            </main>
        </div>
    );
}