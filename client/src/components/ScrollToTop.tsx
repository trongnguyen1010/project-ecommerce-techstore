import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Tắt chế độ tự nhớ vị trí của trình duyệt
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // 2. Hàm cuộn tất cả các thẻ có thể cuộn
    const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
        document.getElementById('root')?.scrollTo(0, 0);
        document.getElementById('main-layout')?.scrollTo(0, 0);
    };

    // 3. Cuộn ngay lập tức
    scrollToTop();

    // 4. Cuộn bồi thêm phát nữa sau 50ms (đề phòng React render chậm)
    const timer = setTimeout(scrollToTop, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}