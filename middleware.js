// middleware.js
// Trả về trang HTML chứa iframe trỏ tới đúng webapp Apps Script,
// giữ nguyên URL đẹp trên thanh địa chỉ.
// Riêng gpkd.maxoffice.vn có thêm thẻ Open Graph để hiện đẹp khi
// chia sẻ link trên Facebook/Zalo (quảng cáo).

export const config = {
  matcher: "/:path*",
};

const MAP = {
  "gpkd.maxoffice.vn": {
    title: "MAX OFFICE — Hệ Thống Soạn Thảo Hồ Sơ Doanh Nghiệp Tự Động",
    description:
      "Tự động soạn thảo hồ sơ doanh nghiệp: thành lập mới, mở chi nhánh, chuyển nhượng vốn, đổi địa chỉ GPKD, Mẫu số 12 — nhanh chóng, chính xác, tiện lợi.",
    image: "https://workspace.maxoffice.vn/og-gpkd.jpg",
    url: "https://gpkd.maxoffice.vn",
    target:
      "https://script.google.com/macros/s/AKfycbxPSzfvJ70-XLuLWcv6xXrOExB7YJ2D3SXHkEaRjkVV2ItnI-wfN30hfyMcdt9rrjMi/exec",
  },
  "qr.maxoffice.vn": {
    title: "MAX QR CODE",
    target:
      "https://script.google.com/macros/s/AKfycbzxu1M2jHCZx78WZIcFrVdqdHqyXvFh6QHl0WBZZevU5D1XUhpAMni3zgJoEMVXY-NI/exec",
  },
};

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  const entry = MAP[host];

  if (entry) {
    const ogTags = entry.description
      ? `
  <meta name="description" content="${entry.description}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${entry.title}" />
  <meta property="og:description" content="${entry.description}" />
  <meta property="og:image" content="${entry.image}" />
  <meta property="og:url" content="${entry.url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${entry.title}" />
  <meta name="twitter:description" content="${entry.description}" />
  <meta name="twitter:image" content="${entry.image}" />`
      : "";

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${entry.title}</title>${ogTags}
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
}
