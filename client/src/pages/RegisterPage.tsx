import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Phone, Mail, Lock, Loader, CheckCircle } from 'lucide-react';
import { registerAPI } from '../apis/auth.api';

export default function RegisterPage() {
    const navigate = useNavigate();
    
    // State form
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<React.ReactNode>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Validate phía Client trước
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }
        if (!formData.email && !formData.phone) {
            setError(<>Vui lòng nhập ít nhất <b>Email</b> hoặc <b>Số điện thoại</b>!</>);
            return;
        }

        setStatus('loading');

        try {
        // 2. Gọi API Đăng ký
        // Chỉ gửi những trường có dữ liệu
        const payload = {
            fullName: formData.fullName,
            password: formData.password,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
        };

        await registerAPI(payload);

        // 3. Thành công
        setStatus('success');

        // 4. Đợi 1.5s rồi chuyển sang trang Login
        setTimeout(() => {
            navigate('/login');
        }, 1500);

        } catch (err: any) {
        const msg = err.response?.data?.message || 'Đăng ký thất bại';
        setError(msg);
        setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
        
        {/* --- DIALOG LOADING / SUCCESS --- */}
        {(status === 'loading' || status === 'success') && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center min-w-[250px] animate-scale-up">
                {status === 'loading' ? (
                <>
                    <Loader size={48} className="text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Đang tạo tài khoản...</p>
                </>
                ) : (
                <>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Thành công!</h3>
                    <p className="text-gray-500 text-sm">Chuyển đến trang đăng nhập...</p>
                </>
                )}
            </div>
            </div>
        )}

        {/* --- FORM ĐĂNG KÝ --- */}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-6 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <UserPlus className="text-white w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white">Tạo tài khoản mới</h2>
                <p className="text-blue-100 text-sm mt-1">Trở thành thành viên của TechStore</p>
            </div>

            <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Họ tên */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400"><User size={18} /></div>
                    <input type="text" required placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                </div>
                </div>

                {/* Email (Optional) */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400"><Mail size={18} /></div>
                    <input type="email" placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                </div>

                {/* SĐT (Optional) */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400"><Phone size={18} /></div>
                    <input type="tel" placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                </div>

                {/* Mật khẩu */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400"><Lock size={18} /></div>
                    <input type="password" required placeholder="••••••"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                </div>

                {/* Nhập lại Mật khẩu */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400"><Lock size={18} /></div>
                        <input type="password" required placeholder="••••••"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                </div>

                {/* Thông báo lỗi */}
                {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center">{error}</div>}

                <button 
                disabled={status !== 'idle'}
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                <UserPlus size={20} /> Đăng ký
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Đăng nhập ngay
                </Link>
            </div>
            </div>
        </div>
        </div>
    );
}