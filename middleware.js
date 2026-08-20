// middleware.js
// Thay vì redirect (đổi hẳn URL), giờ trả thẳng 1 trang HTML có chứa
// iframe trỏ tới đúng webapp Apps Script -> giữ nguyên URL đẹp trên
// thanh địa chỉ, giống hệt cách trang workspace.maxoffice.vn đang làm
// khi bấm vào từng card.

export const config = {
  matcher: "/:path*",
};

const MAP = {
  "gpkd.maxoffice.vn": {
    title: "MAX GPKD",
    target: "https://script.google.com/macros/s/AKfycbxPSzfvJ70-XLuLWcv6xXrOExB7YJ2D3SXHkEaRjkVV2ItnI-wfN30hfyMcdt9rrjMi/exec",
  },
  "qr.maxoffice.vn": {
    title: "MAX QR CODE",
    target: "https://script.google.com/macros/s/AKfycbzxu1M2jHCZx78WZIcFrVdqdHqyXvFh6QHl0WBZZevU5D1XUhpAMni3zgJoEMVXY-NI/exec",
  },
};

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  const entry = MAP[host];

  if (entry) {
    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${entry.title}</title>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe src="${entry.target}" title="${entry.title}"></iframe>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // Không khớp domain nào trong danh sách -> cho đi tiếp bình thường
  // (áp dụng cho workspace.maxoffice.vn, web-app-max.vercel.app, v.v.)
}
