// middleware.js
// Chạy TRƯỚC khi Vercel chọn file tĩnh để phục vụ, nên có thể chặn
// và redirect theo từng subdomain riêng, kể cả khi trùng path "/"
// với file index.html có sẵn.

export const config = {
  matcher: "/:path*",
};

const MAP = {
  "gpkd.maxoffice.vn": "https://script.google.com/macros/s/AKfycbxPSzfvJ70-XLuLWcv6xXrOExB7YJ2D3SXHkEaRjkVV2ItnI-wfN30hfyMcdt9rrjMi/exec",
  "qr.maxoffice.vn": "https://script.google.com/macros/s/AKfycbzxu1M2jHCZx78WZIcFrVdqdHqyXvFh6QHl0WBZZevU5D1XUhpAMni3zgJoEMVXY-NI/exec",
};

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  const target = MAP[host];

  if (target) {
    return Response.redirect(target, 302);
  }

  // Không khớp domain nào trong danh sách -> cho đi tiếp bình thường
  // (áp dụng cho workspace.maxoffice.vn, web-app-max.vercel.app, v.v.)
}
