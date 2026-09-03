/**
 * anti-ban-addon.js - Thêm lớp bảo mật Anti-Ban, chặn Userscript & Giới hạn IP
 * Dùng kèm vào file script riêng hoặc tích hợp trực tiếp vào hệ thống của bạn.
 */

(function() {
    'use strict';

    const BAN_DB_KEY = "securesystem_banned_ips_v2";

    // --- 1. KIỂM TRA VÀ CHẶN NGAY LẬP TỨC NẾU CÓ DẤU HIỆU CAN THIỆP ---
    function executeAdvancedAntiBan() {
        let bannedList = [];
        try {
            bannedList = JSON.parse(localStorage.getItem(BAN_DB_KEY)) || [];
        } catch(e) {
            bannedList = [];
        }

        // Phát hiện các tiện ích chèn mã JavaScript bên ngoài như Tampermonkey, Violentmonkey, v.v.
        const hasUserscriptManager = 
            typeof GM_info !== 'undefined' || 
            typeof GM !== 'undefined' || 
            typeof Violentmonkey !== 'undefined' ||
            typeof Tampermonkey !== 'undefined' ||
            (window.unsafeWindow && (window.unsafeWindow.Tampermonkey || window.unsafeWindow.Violentmonkey)) ||
            document.querySelector('meta[name="tampermonkey"]') ||
            document.querySelector('meta[name="violentmonkey"]');

        // Kiểm tra xem người dùng có đang dùng đúng trình duyệt Chrome/Cốc Cốc không
        const ua = navigator.userAgent;
        const isCocCoc = ua.includes('CocCoc');
        const isAllowedBrowser = isCocCoc || (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR') && !ua.includes('Firefox') && !ua.includes('Safari') && !ua.includes('Brave'));

        let blockReason = "";
        if (hasUserscriptManager || bannedList.includes("banned_device_signature")) {
            blockReason = "Hệ thống Anti-Ban phát hiện công cụ tự động hóa, Tampermonkey hoặc Violentmonkey đang chạy.";
        } else if (!isAllowedBrowser) {
            blockReason = "Trang web này yêu cầu bắt buộc sử dụng trình duyệt Google Chrome hoặc Cốc Cốc nguyên bản.";
        }

        if (blockReason) {
            if (!bannedList.includes("banned_device_signature")) {
                bannedList.push("banned_device_signature");
                localStorage.setItem(BAN_DB_KEY, JSON.stringify(bannedList));
            }

            // Ghi đè toàn bộ giao diện bằng màn hình cảnh báo khóa tài khoản/thiết bị
            document.addEventListener('DOMContentLoaded', () => {
                document.body.innerHTML = `
                    <div style="position:fixed;inset:0;background:#030712;color:white;display:flex;align-items:center;justify-content:center;font-family:sans-serif;padding:20px;text-align:center;z-index:999999">
                        <div style="max-width:420px;background:#111827;padding:35px;border-radius:24px;border:2px solid #dc2626;box-shadow:0 25px 50px -12px rgba(220,38,38,0.25)">
                            <div style="width:72px;height:72px;background:rgba(220,38,38,0.15);color:#ef4444;border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px">🛡️</div>
                            <h2 style="color:#f87171;margin-bottom:12px;font-size:24px;font-weight:900">BẢO MẬT: TRUY CẬP BỊ CHẶN</h2>
                            <p style="font-size:14px;color:#9ca3af;line-height:1.6;margin-bottom:20px">${blockReason}</p>
                            <div style="background:#1f2937;padding:12px;border-radius:12px;font-size:12px;color:#fca5a5;border:1px solid rgba(220,38,38,0.3)">
                                Hệ thống Anti-Ban đã vô hiệu hóa phiên làm việc của bạn để đảm bảo an toàn.
                            </div>
                        </div>
                    </div>
                `;
            });
            throw new Error("Anti-Ban Triggered: Unauthorized script or environment detected.");
        }
    }

    // Thực thi quét bảo mật ngay khi file JS được nạp
    executeAdvancedAntiBan();

    // --- 2. HÀM KIỂM TRA GIỚI HẠN TỐI ĐA 2 TÀI KHOẢN CHO MỖI IP KHI ĐĂNG KÝ ---
    window.checkIpAccountLimit = function(currentUserIp, db) {
        if (!db.ipRegistry) {
            db.ipRegistry = {};
        }
        if (!db.ipRegistry[currentUserIp]) {
            db.ipRegistry[currentUserIp] = [];
        }

        // Trả về false nếu IP này đã đăng ký từ 2 tài khoản trở lên
        if (db.ipRegistry[currentUserIp].length >= 2) {
            return {
                allowed: false,
                message: "Anti-Ban: Địa chỉ IP của bạn đã đạt giới hạn tối đa (2 tài khoản). Không thể đăng ký thêm!"
            };
        }

        return { allowed: true };
    };

    // --- 3. ĐĂNG KÝ MỘT TÀI KHOẢN MỚI VÀO SỔ THEO DÕI IP ---
    window.registerIpAccountMapping = function(currentUserIp, username, db) {
        if (!db.ipRegistry) db.ipRegistry = {};
        if (!db.ipRegistry[currentUserIp]) db.ipRegistry[currentUserIp] = [];
        
        if (!db.ipRegistry[currentUserIp].includes(username)) {
            db.ipRegistry[currentUserIp].push(username);
        }
    };

})();
