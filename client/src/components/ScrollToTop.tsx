import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. TẮT TÍNH NĂNG "NHỚ VỊ TRÍ" CỦA TRÌNH DUYỆT
    // Bắt buộc trình duyệt không được tự cuộn lung tung
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Cuộn lên đầu
    window.scrollTo(0, 0);

    // 3. (Phòng hờ) Đợi 10ms cuộn lại phát nữa
    // Đề phòng trường hợp Lenis hoặc React render chậm
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}