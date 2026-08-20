// api/proxy.js
// Lấy nội dung thật từ Apps Script (/exec) rồi trả thẳng về cho trình duyệt,
// nhờ vậy thanh địa chỉ vẫn giữ nguyên URL đẹp (vd: workspace.maxoffice.vn/gpkd)
// thay vì bị Google tự chuyển sang script.googleusercontent.com.

const TARGETS = {
  home:     "https://script.google.com/macros/s/AKfycbxYcvXL0-wssZeNYGZciDPP1pMecETqflMDgGBJSXtqAWdbdczkUG9ef5efjZ1zHrjW/exec",
  qr:       "https://script.google.com/macros/s/AKfycbzxu1M2jHCZx78WZIcFrVdqdHqyXvFh6QHl0WBZZevU5D1XUhpAMni3zgJoEMVXY-NI/exec",
  office:   "https://script.google.com/macros/s/AKfycbxp_UDX9pOGZspayjgQDp8hk6pWA8fHBxuEkADegLi2hYaHQsFdRrY0LE_4Eeyx9MFBxA/exec",
  lienket:  "https://script.google.com/macros/s/AKfycbwF22dGgfwn1uIiNrpOfyNePDM3iP29YJ1-Kezg1MfXjtOPwieg1hF0Dl7qt_-XReqy0A/exec",
  congviec: "https://script.google.com/macros/s/AKfycbwLyJJESZpz_XAJidKhrphKxD2qJcAnCZZFm4mManyeGR15Ugdtps8j3G0tnjLsfFuUqA/exec",
  gpkd:     "https://script.google.com/macros/s/AKfycbxPSzfvJ70-XLuLWcv6xXrOExB7YJ2D3SXHkEaRjkVV2ItnI-wfN30hfyMcdt9rrjMi/exec",
  archive:  "https://script.google.com/macros/s/AKfycbyBLQNghBZ5UXMuXDL1hEvYehuC6vGTYHVA9fDwyurTBvy0KJ3e2urS6j6PXggM3o1i/exec",
  payment:  "https://script.google.com/macros/s/AKfycbwlYOkHbS7UnlOjFD9GEbTXoL2Zn1gRXFV7FrRDKNYuw1SjHMd77fOEro2F9JVkr4spww/exec"
};

export default async function handler(req, res) {
  const slug = req.query.slug;
  const target = TARGETS[slug];

  if (!target) {
    res.status(404).send("Không tìm thấy tiện ích này.");
    return;
  }

  try {
    // redirect: 'follow' để tự động đi qua bước Google chuyển hướng sang
    // script.googleusercontent.com rồi lấy nội dung HTML thật ở đó.
    const upstream = await fetch(target, { redirect: "follow" });
    const contentType = upstream.headers.get("content-type") || "text/html; charset=utf-8";
    const body = await upstream.text();

    res.setHeader("Content-Type", contentType);
    // Không cache để luôn lấy dữ liệu mới nhất từ Apps Script.
    res.setHeader("Cache-Control", "no-store");
    res.status(upstream.status).send(body);
  } catch (err) {
    res.status(502).send("Không thể kết nối tới dịch vụ MAX WORKSPACE lúc này. Vui lòng thử lại sau.");
  }
}
