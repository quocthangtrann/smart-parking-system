import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Layouts
import AuthLayout from './layouts/AuthLayout';
import MobileLayout from './layouts/MobileLayout';
// import AdminLayout from './layouts/AdminLayout';

// Import Pages
import RoleSelection from './pages/auth/RoleSelection';
import Login from './pages/auth/Login';
import UserMobileLogin from './pages/auth/UserLogin';

// import AdminDashboard from './pages/admin/AdminDashboard';
import StudentHome from './pages/student/StudentHome';
import LecturerHome from './pages/lecturer/LecturerHome';
import ReserveSlot from './pages/lecturer/ReserveSlot';

// import RealtimeParking from './pages/shared/RealtimeParking';
import DigitalCard from './pages/shared/DigitalCard';
import HistoryBilling from './pages/shared/HistoryBilling';
import Notifications from './pages/shared/Notifications';
import SessionDetail from './pages/shared/SessionDetail';
import Settings from './pages/shared/Settings';
import MyVehicle from './pages/shared/MyVehicle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* NHÓM AUTH: Đăng nhập */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<RoleSelection />} />       {/* Chọn role */}
          <Route path="/login" element={<Login />} />          {/* Nhập pass admin */}
          <Route path="/user-login" element={<UserMobileLogin />} /> {/* Nhập pass hcmut */}
        </Route>

        {/* NHÓM ADMIN: Giao diện Laptop */}
        {/* <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route> */}

        {/* NHÓM MOBILE: Sinh viên & Giảng viên */}
        <Route element={<MobileLayout />}>
          {/* Dashboard riêng */}
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/lecturer/home" element={<LecturerHome />} />

          {/* Tính năng riêng của Lecturer */}
          <Route path="/lecturer/reserve" element={<ReserveSlot />} />

          {/* Các trang dùng chung (e, f, g, h, I, J, K) */}
          {/* <Route path="/map" element={<RealtimeParking />} /> */}
          <Route path="/digital-card" element={<DigitalCard />} />
          <Route path="/billing" element={<HistoryBilling />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/session" element={<SessionDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/vehicles" element={<MyVehicle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;