import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Phone, Lock, User, CheckCircle, Loader } from 'lucide-react';
import { loginAPI } from '../apis/auth.api';
import { useAuthStore } from '../stores/useAuthStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.login); // Lấy hàm lưu store
    const location = useLocation(); // Lấy thông tin người dùng đến từ đâu

    // Lấy trang cũ từ state, nếu không có thì mặc định về trang chủ
    const from =
    location.state?.from?.pathname &&
    location.state.from.pathname !== '/login'
        ? location.state.from.pathname
        : '/';

    
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);

    // State quản lý trạng thái: 'idle' | 'loading' | 'success'
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
        
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // setLoading(true);
        
        
        try {
            setStatus('loading');

            // 1. Gọi API
            const data = await loginAPI(formData.identifier, formData.password);

            await new Promise(resolve => setTimeout(resolve, 1200));
            
            // 2. Lưu vào Store (Zustand)
            setAuth(data.user, data.accessToken);
            
            // 3. Chuyển sang trạng thái thành công
            setStatus('success');

            // 4. Đợi 1.5 giây rồi mới chuyển trang
            setTimeout(() => {
                navigate(from, { replace: true }); // replace: true để xóa lịch sử trang login, bấm Back không bị quay lại login
            }, 700);
            
        } catch (err: any) {
            // Xử lý lỗi từ Backend trả về
            await new Promise(resolve => setTimeout(resolve, 1000));
            const msg = err.response?.data?.message || 'Đăng nhập thất bại';
            setError(msg);
            setStatus('idle'); // Về trạng thái bình thường để nhập lại
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* --- PHẦN DIALOG LOADING / SUCCESS --- */}
            {(status === 'loading' || status === 'success') && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center min-w-[250px] animate-scale-up">
                    
                    {status === 'loading' ? (
                    <>
                        <Loader size={48} className="text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Đang xác thực...</p>
                    </>
                    ) : (
                    <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Thành công!</h3>
                        <p className="text-gray-500 text-sm">Đang chuyển hướng...</p>
                    </>
                    )}
                    
                </div>
                </div>
            )}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                
                {/* Header */}
                <div className="bg-blue-600 p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <User className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Đăng nhập tài khoản</h2>
                <p className="text-blue-100 mt-2">Chào mừng bạn quay trở lại!</p>
                </div>

                {/* Form */}
                <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Input Identifier */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc Số điện thoại</label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                        <Phone size={18} />
                        </div>
                        <input 
                        type="text" 
                        required
                        placeholder="Ví dụ: 0912345678"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.identifier}
                        onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                        />
                    </div>
                    </div>

                    {/* Input Password */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                        <Lock size={18} />
                        </div>
                        <input 
                        type="password" 
                        required
                        placeholder="••••••"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    </div>

                    {/* Thông báo lỗi */}
                    {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                    )}

                    <button 
                    disabled={status !== 'idle'}
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} /> Đăng nhập
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                    Đăng ký ngay
                    </Link>
                </div>
                </div>

            </div>
        </div>
    );
}