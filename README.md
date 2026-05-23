# Lớp học số KTCT — Nước & Thủy lợi

**Bài dự thi Hội thi "Ứng dụng công nghệ số thiết kế bài giảng, bài trình bày khoa học năm 2026"**

Tác giả: **TS. Đào Mộng Anh**
Bộ môn Mác-Lênin · Khoa Lý luận chính trị · Trường Đại học Thủy Lợi
Hà Nội, năm 2026

## Web app làm gì?

Một lớp học số (digital classroom) giúp sinh viên Thủy lợi học **Kinh tế chính trị Mác-Lênin — Chương 2: Hàng hóa, Thị trường và Vai trò các Chủ thể tham gia Thị trường** qua mô phỏng, role-play và AI trợ giảng. Mọi ví dụ liên hệ ngành nước sạch & thủy lợi Việt Nam.

App là phần thực hành tương tác đi kèm bộ slide 17 trang, tổ chức theo lộ trình 100 phút (2 tiết) — phương pháp Flipped Classroom + Simulation-Based Learning + AI-Assisted Teaching.

## 4 tab chính

1. **Mô phỏng Thị trường nước sạch** — Kéo slider c, v, năng suất, cung, cầu → quan sát công thức W = c + v + m và quy luật giá trị vận hành (Slide 8).
2. **Vai trò Chủ thể** — Chọn 1 trong 3 vai (Nhà nước · DN cấp nước · Người tiêu dùng) → xử lý 3 tình huống thực tế: nắng nóng 2024, DN độc quyền (HAWACO/SAWACO/VIWASUPCO), ô nhiễm sông Hồng (Slide 12).
3. **AI Trợ giảng** — Chatbot Claude AI huấn luyện riêng cho Chương 2, mọi ví dụ liên hệ thủy lợi, dẫn nguồn theo số Slide bài giảng (Slide 14).
4. **Kiểm tra** — 5 câu trắc nghiệm tương tác, chấm điểm + giải thích tự động, kèm bài tập về nhà 500 từ (Slide 16).

## Công nghệ

- React 18 + react-scripts (CRA)
- Recharts (biểu đồ)
- Anthropic Claude API (AI Tutor) — gọi qua Vercel Serverless Function `/api/chat` để giữ API key an toàn
- Vercel (hosting)

## Triển khai (GitHub → Vercel)

1. Đẩy thư mục lên GitHub.
2. Tạo project trên Vercel, import repository.
3. **Settings → Environment Variables** → thêm `ANTHROPIC_API_KEY` (giá trị: API key của tác giả).
4. Deploy. URL gợi ý: `https://ktct-thuyloi.vercel.app`.

## Liên hệ

TS. Đào Mộng Anh — Bộ môn Mác-Lênin — Khoa Lý luận chính trị — Trường Đại học Thủy Lợi
