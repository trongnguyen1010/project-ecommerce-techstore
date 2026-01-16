import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, CreditCard, Wallet } from 'lucide-react'; // Thêm icon thanh toán
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
    const { user } = useAuthStore();

    const [successOrderId, setSuccessOrderId] = useState<number | null>(null);
    
    // Thêm State Loading để chặn bấm nhiều lần
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    if (items.length === 0 && !successOrderId) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty" className="w-48 mb-4 opacity-50"/>
                <h2 className="text-xl font-bold text-gray-700">Giỏ hàng của bạn đang trống</h2>
                <Link to="/" className="text-blue-600 font-medium hover:underline mt-2">
                    Quay lại mua sắm ngay
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async (formData: AddressFormData) => {
        // Chặn nếu đang gửi request
        if (isPlacingOrder) return;

        setIsPlacingOrder(true); // Bật loading

        try {
            const orderPayload = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                userId : user ? user.id : undefined,
                items: items.map((item) => ({
                    // productId: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: Number(item.price),
                })),
            };

            // console.log("Check Data Gửi Đi:", JSON.stringify(orderPayload, null, 2));
            
            const result = await createOrder(orderPayload);

            // Chỉ xóa giỏ và hiện modal khi API báo thành công
            clearCart(); 
            toast.success('Đặt hàng thành công!');
            setSuccessOrderId(result.id);

        } catch (error: any) {
            console.error("Lỗi chi tiết:", error);
            if (error.response) {
                toast.error(`Lỗi: ${JSON.stringify(error.response.data.message)}`);
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } finally {
            setIsPlacingOrder(false); // Tắt loading dù thành công hay thất bại
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <OrderSuccessModal isOpen={!!successOrderId} orderId={successOrderId} />
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: FORM (Chiếm 2 phần) */}
                <div className="lg:col-span-2">
                    <Link to="/cart" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition font-medium">
                        <ArrowLeft size={18} className="mr-1" /> Quay lại giỏ hàng
                    </Link>
                    
                    <div className="space-y-6">
                        {/* Component Form của bạn */}
                        <AddressForm 
                            onSubmit={handlePlaceOrder} 
                            isSubmitting={isPlacingOrder}
                            initialData={{
                                fullName : user?.fullName || '',
                                phone : user?.phone || '',
                            }}
                        />

                        {/* Thêm UI Phương thức thanh toán (Visual only) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Wallet className="text-blue-600" size={20}/> 
                                Phương thức thanh toán
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer bg-blue-50 border-blue-200">
                                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-not-allowed opacity-60">
                                    <input type="radio" name="payment" disabled className="w-5 h-5" />
                                    <span className="text-gray-500">Chuyển khoản ngân hàng (Đang bảo trì)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: TÓM TẮT (Chiếm 1 phần) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-4">Đơn hàng của bạn</h2>
                        
                        <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map(item => (
                            <div key={item.id} className="flex gap-3 py-2">
                                <div className="w-16 h-16 bg-gray-100 rounded-md border overflow-hidden flex-shrink-0 relative">
                                    {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover"/>}
                                    <span className="absolute bottom-0 right-0 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">
                                        x{item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-800 line-clamp-2">{item.name}</p>
                                    <p className="text-blue-600 font-bold text-sm mt-1">
                                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                                    </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        
                        <div className="border-t pt-4 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span>{totalPrice().toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600 font-medium">Miễn phí</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t border-dashed">
                                <span>Tổng cộng</span>
                                <span className="text-blue-600">{totalPrice().toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}