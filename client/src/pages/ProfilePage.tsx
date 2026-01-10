import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { updateProfile, changePassword } from '../apis/user.api';
import toast from 'react-hot-toast';
import { User, Lock, Save, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, token, login } = useAuthStore();
    const navigate = useNavigate();

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (!token) {
        navigate('/login');
        }
    }, [token, navigate]);

    // State Form thông tin
    const [info, setInfo] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });

    // State Form mật khẩu
    const [pass, setPass] = useState({
        oldPass: '',
        newPass: '',
        confirmPass: '',
    });

    // Cập nhật state info khi user thay đổi (để tránh form trống lúc mới load)
    useEffect(() => {
        if (user) {
        setInfo({
            fullName: user.fullName || '',
            phone: user.phone || '',
        });
        }
    }, [user]);

    // XỬ LÝ: CẬP NHẬT THÔNG TIN
    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        //Gọi API
        const updatedUser = await updateProfile(token!, info);
        
        //Cập nhật lại Store (Gọi hàm login giả để update data user mới)
        //token vẫn giữ nguyên
        useAuthStore.getState().login(updatedUser, token!); 
        
        toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
        toast.error('Lỗi cập nhật thông tin');
        }
    };

    // XỬ LÝ: ĐỔI MẬT KHẨU
    const handleChangePass = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (pass.newPass !== pass.confirmPass) {
        toast.error('Mật khẩu xác nhận không khớp!');
        return;
        }
        if (pass.newPass.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
        }

        try {
        await changePassword(token!, { oldPass: pass.oldPass, newPass: pass.newPass });
        toast.success('Đổi mật khẩu thành công!');
        setPass({ oldPass: '', newPass: '', confirmPass: '' }); // Reset form cho an toàn
        } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại (Sai mật khẩu cũ?)');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CỘT TRÁI: THẺ THÔNG TIN */}
            <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center sticky top-24">
                <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-4xl border-4 border-white shadow">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                {/* Nút giả Upload Avatar (Tính năng nâng cao sau này) */}
                <button className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-sm" title="Đổi ảnh đại diện">
                    <Camera size={16} />
                </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                {user.role}
                </div>
            </div>
            </div>

            {/* CỘT PHẢI: CÁC FORM NHẬP LIỆU */}
            <div className="md:col-span-2 space-y-6">
            
            {/* Form Thông tin cá nhân */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                <User size={20} className="text-blue-600" /> Thông tin cá nhân
                </h3>
                <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input 
                        type="text" required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={info.fullName}
                        onChange={e => setInfo({...info, fullName: e.target.value})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                        type="text" 
                        placeholder="Chưa cập nhật"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={info.phone}
                        onChange={e => setInfo({...info, phone: e.target.value})}
                    />
                    </div>
                </div>
                
                <div className="pt-2">
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm shadow-blue-200">
                    <Save size={18} /> Lưu thay đổi
                    </button>
                </div>
                </form>
            </div>

            {/* Form Đổi mật khẩu */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                <Lock size={20} className="text-orange-600" /> Đổi mật khẩu
                </h3>
                <form onSubmit={handleChangePass} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input 
                    type="password" required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                    placeholder="••••••••"
                    value={pass.oldPass}
                    onChange={e => setPass({...pass, oldPass: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input 
                        type="password" required minLength={6}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                        placeholder="Ít nhất 6 ký tự"
                        value={pass.newPass}
                        onChange={e => setPass({...pass, newPass: e.target.value})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input 
                        type="password" required minLength={6}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                        placeholder="Nhập lại mật khẩu mới"
                        value={pass.confirmPass}
                        onChange={e => setPass({...pass, confirmPass: e.target.value})}
                    />
                    </div>
                </div>
                <div className="pt-2">
                    <button className="bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition font-medium shadow-sm shadow-orange-200">
                    Cập nhật mật khẩu
                    </button>
                </div>
                </form>
            </div>

            </div>
        </div>
        </div>
    );
}