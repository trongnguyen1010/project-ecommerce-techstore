import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Home, Navigation } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho Tỉnh/Huyện/Xã từ API
interface LocationOption {
  id: string;
  name: string; // Tên hiển thị (VD: Hà Nội)
  full_name?: string;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string; // Đây là chuỗi cuối cùng gửi đi
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  isSubmitting: boolean;
  initialData?: {
    fullName?: string;
    phone?: string;
    address?: string;
  };
}

export default function AddressForm({ onSubmit, isSubmitting, initialData }: AddressFormProps) {
  // State form cơ bản (Controlled Input)
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  
  // State cho địa chỉ 3 cấp
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);

  // State lưu ID của lựa chọn hiện tại
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState('');

  // 1. Load danh sách Tỉnh/Thành phố khi vào trang
  useEffect(() => {
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then(response => response.json())
      .then(data => {
        if (data.error === 0) {
            setProvinces(data.data);
        }
      })
      .catch(err => console.error("Lỗi lấy tỉnh thành:", err));
  }, []);

  // 2. Khi chọn Tỉnh -> Load Quận/Huyện
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    
    // Reset cấp dưới
    setSelectedDistrict(''); 
    setSelectedWard('');     
    setDistricts([]);        
    setWards([]);            

    if (provinceId) {
        fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) setDistricts(data.data);
            });
    }
  };

  // 3. Khi chọn Quận -> Load Phường/Xã
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    
    // Reset cấp dưới
    setSelectedWard('');
    setWards([]);

    if (districtId) {
        fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
            .then(response => response.json())
            .then(data => {
                if (data.error === 0) setWards(data.data);
            });
    }
  };

  // 4. Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tìm tên thực tế dựa vào ID đã chọn
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
    const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
    const wardName = wards.find(w => w.id === selectedWard)?.name || '';

    // Gộp thành địa chỉ full (VD: "Số 10, Ngõ 5, Phường A, Quận B, Hà Nội")
    // Đây là chuỗi sẽ lưu vào Database
    const fullAddress = `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`;

    onSubmit({
      fullName,
      phone,
      address: fullAddress, 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MapPin className="text-blue-600" size={24} />
        Thông tin giao hàng
      </h3>

      <div className="space-y-5">
        
        {/* Hàng 1: Tên & SĐT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                title="Vui lòng nhập đúng 10 số điện thoại"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Hàng 2: Chọn Tỉnh - Huyện - Xã (3 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Tỉnh/Thành phố */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                <div className="relative">
                    <Navigation className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                    >
                        <option value="">Chọn Tỉnh/Thành</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Quận/Huyện */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                <div className="relative">
                    <Navigation className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                        required
                        disabled={!selectedProvince}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                    >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Phường/Xã */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường / Xã</label>
                <div className="relative">
                    <Navigation className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                        required
                        disabled={!selectedDistrict}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                    >
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* Hàng 3: Địa chỉ chi tiết */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số nhà, Tên đường</label>
          <div className="relative">
            <Home className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập số nhà, tên đường"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>
        </div>

      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {isSubmitting ? (
           <>
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
             Đang xử lý...
           </>
        ) : (
          'Tiến hành đặt hàng'
        )}
      </button>
    </form>
  );
}