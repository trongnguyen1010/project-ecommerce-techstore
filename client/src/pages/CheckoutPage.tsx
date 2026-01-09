import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import AddressForm, { type AddressFormData } from '../components/checkout/AddressForm';
import { createOrder } from '../apis/order.api';
import { useState } from 'react';
import OrderSuccessModal from '../components/checkout/OrderSuccessModal';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore(); // lấy thông tin user nếu đã login

    // Tạo state lưu mã đơn hàng thành công (nếu có mã -> hiện modal)
    const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

    // Nếu giỏ hàng trống thì về trang chủ
    if (items.length === 0 && !successOrderId) {
        return (
        <div className="text-center mt-20">
            <h2 className="text-xl font-bold text-gray-700">Giỏ hàng trống!</h2>
            <Link to="/" className="text-blue-500 underline mt-2 inline-block">Quay lại mua sắm</Link>
        </div>
        );
    }

    const handlePlaceOrder = async (formData: AddressFormData) => {
        try {
        // Log dữ liệu sắp gửi đi để kiểm tra
        const orderPayload = {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            userId : user ? user.id : undefined, //thêm userID, gắn đơn hàng với tài khoản
            items: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: Number(item.price), // CHẮC CHẮN LÀ SỐ
            })),
        };
        
        // console.log("Dữ liệu gửi đi:", orderPayload);

        // Gọi API (Lưu kết quả vào biến result)
        const result = await createOrder(orderPayload);

        clearCart(); // Xóa giỏ hàng
        toast.success('Đặt hàng thành công!');
        setSuccessOrderId(result.id); // Lưu ID đơn hàng

        } catch (error: any) {
        console.error("Lỗi chi tiết:", error);
        
        // // THÊM ĐOẠN NÀY ĐỂ HIỆN LỖI RÕ RÀNG
        // if (error.response) {
        //     // Lỗi từ Backend trả về (400, 500)
        //     alert(`Lỗi Backend: ${JSON.stringify(error.response.data.message)}`);
        // } else {
        //     // Lỗi mạng hoặc code React
        //     alert(`Lỗi: ${error.message}`);
        // }
        // Thay alert bằng toast.error
        if (error.response) {
            toast.error(`Lỗi: ${JSON.stringify(error.response.data.message)}`);
        } else {
            toast.error('Có lỗi xảy ra khi đặt hàng');
        }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            {/*Nhúng Modal vào */}
            <OrderSuccessModal isOpen={!!successOrderId} orderId={successOrderId} />
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* CỘT TRÁI: FORM NHẬP LIỆU */}
                <div>
                <Link to="/cart" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition">
                    <ArrowLeft size={18} className="mr-1" /> Quay lại giỏ hàng
                </Link>
                <AddressForm 
                onSubmit={handlePlaceOrder} 
                isSubmitting={false} 
                // tự động điền inf nếu đã login
                initialData={{
                    fullName : user ?.fullName || '',
                    phone : user?.phone || '',
                    // address : user?.address // dùng sau nếu có sổ ghi lại địa chỉ  
                }}
                />
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Đơn hàng của bạn</h2>
                
                {/* List sản phẩm rút gọn */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                            {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover"/>}
                        </div>
                        <div>
                            <p className="font-medium text-gray-700 line-clamp-1">{item.name}</p>
                            <p className="text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        </div>
                        <span className="font-bold text-gray-700">
                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                        </span>
                    </div>
                    ))}
                </div>
                
                {/* Tổng tiền */}
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{totalPrice().toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-blue-600 pt-2 border-t mt-2">
                    <span>Tổng thanh toán</span>
                    <span>{totalPrice().toLocaleString('vi-VN')} ₫</span>
                    </div>
                </div>
                </div>

            </div>
        </div>
    );
}