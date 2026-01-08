import { User, MapPin, Phone } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho Form
export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
}

interface Props {
  onSubmit: (data: AddressFormData) => void;
  isSubmitting: boolean;
}

export default function AddressForm({ onSubmit, isSubmitting }: Props) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Gom dữ liệu từ các ô input
    const data: AddressFormData = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };

    onSubmit(data); // Gửi dữ liệu ra ngoài
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <MapPin className="text-blue-600" />
            Thông tin giao hàng
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ tên */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                    required
                    name="fullName"
                    type="text" 
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Số điện thoại */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                    required
                    name="phone"
                    type="tel" 
                    placeholder="Ví dụ: 0912345678"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Địa chỉ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ nhận hàng </label>
                <textarea 
                    required
                    name="address"
                    rows={3}
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
            </div>

            <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition mt-4"
            >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
        </form>
    </div>
  );
}