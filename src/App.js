import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ============================================================
// PHÒNG THÍ NGHIỆM KINH TẾ THỦY LỢI
// Bài dự thi: "Ứng dụng công nghệ số thiết kế bài giảng, bài trình bày khoa học năm 2026"
// TS. Đào Mộng Anh — Bộ môn Mác-Lênin, Khoa Luật và Lý luận chính trị, trường Đại học Thủy lợi
// ============================================================

// LIGHT THEME — gam màu xanh dương đặc trưng TLU
const COLORS = {
  bg: "#f8fafc",
  bgAlt: "#f1f5f9",
  card: "#ffffff",
  cardSubtle: "#fafbfc",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  primary: "#1e40af",
  primaryLight: "#3b82f6",
  primaryPale: "#dbeafe",
  accent: "#0891b2",
  accentLight: "#06b6d4",
  supply: "#ea580c",
  demand: "#0891b2",
  equilibrium: "#059669",
  danger: "#dc2626",
  warning: "#d97706",
  gold: "#ca8a04",
  purple: "#7c3aed",
  text: "#0f172a",
  textBody: "#334155",
  textMuted: "#64748b",
  textDim: "#94a3b8",
};

// LOGO TLU - SVG inline
const TLULogo = ({ size = 60 }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 120 102" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="51" rx="58" ry="49" fill="none" stroke={COLORS.primary} strokeWidth="3" />
    <path d="M 4 75 Q 60 75 116 75 L 116 100 L 4 100 Z" fill={COLORS.primary} />
    <g transform="translate(15, 25)">
      <rect x="6" y="20" width="4" height="22" fill={COLORS.primary} />
      <ellipse cx="8" cy="14" rx="3" ry="5" fill={COLORS.primary} />
      <ellipse cx="3" cy="22" rx="2.5" ry="4" fill={COLORS.primary} />
      <ellipse cx="13" cy="22" rx="2.5" ry="4" fill={COLORS.primary} />
      <ellipse cx="3" cy="30" rx="2.5" ry="4" fill={COLORS.primary} />
      <ellipse cx="13" cy="30" rx="2.5" ry="4" fill={COLORS.primary} />
      <ellipse cx="3" cy="38" rx="2.5" ry="4" fill={COLORS.primary} />
      <ellipse cx="13" cy="38" rx="2.5" ry="4" fill={COLORS.primary} />
    </g>
    <text x="40" y="38" fill={COLORS.primary} fontSize="9" fontWeight="900" fontFamily="Arial">Đ</text>
    <text x="40" y="48" fill={COLORS.primary} fontSize="9" fontWeight="900" fontFamily="Arial">H</text>
    <text x="40" y="58" fill={COLORS.primary} fontSize="9" fontWeight="900" fontFamily="Arial">T</text>
    <text x="40" y="68" fill={COLORS.primary} fontSize="9" fontWeight="900" fontFamily="Arial">L</text>
    <g transform="translate(55, 28)">
      <rect x="0" y="6" width="55" height="3" fill={COLORS.primary} />
      <polygon points="0,9 5,9 5,28 0,30" fill={COLORS.primary} />
      <polygon points="10,9 15,9 15,28 10,30" fill={COLORS.primary} />
      <polygon points="20,9 25,9 25,28 20,30" fill={COLORS.primary} />
      <polygon points="30,9 35,9 35,28 30,30" fill={COLORS.primary} />
      <polygon points="40,9 45,9 45,28 40,30" fill={COLORS.primary} />
      <rect x="0" y="34" width="55" height="3" fill={COLORS.primary} />
      <rect x="0" y="40" width="55" height="2" fill={COLORS.primary} />
      <line x1="48" y1="2" x2="55" y2="2" stroke={COLORS.primary} strokeWidth="1.5" />
      <polygon points="55,0 58,2 55,4" fill={COLORS.primary} />
    </g>
    <text x="60" y="93" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="Arial">1959</text>
  </svg>
);

const WaterDrop = ({ size = 16, color = COLORS.primary }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const TabButton = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 18px",
      background: active ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` : COLORS.card,
      color: active ? "#fff" : COLORS.textBody,
      border: active ? "none" : `1px solid ${COLORS.border}`,
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: active ? 700 : 600,
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.25s ease",
      whiteSpace: "nowrap",
      boxShadow: active ? `0 4px 12px ${COLORS.primary}30` : "0 1px 2px rgba(0,0,0,0.04)",
    }}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    {children}
  </button>
);

const Card = ({ children, style = {}, glow = false, accent = false }) => (
  <div
    style={{
      background: COLORS.card,
      border: `1px solid ${accent ? COLORS.primary + "30" : COLORS.border}`,
      borderRadius: 14,
      padding: 22,
      boxShadow: glow
        ? `0 8px 24px ${COLORS.primary}15, 0 2px 6px rgba(0,0,0,0.04)`
        : "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Slider = ({ label, value, onChange, min, max, step = 1, unit = "", color = COLORS.primary }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ color: COLORS.textBody, fontSize: 12, fontWeight: 600 }}>{label}</span>
      <span style={{ color, fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
        {typeof value === 'number' ? value.toLocaleString() : value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        height: 6,
        borderRadius: 3,
        appearance: "none",
        background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, ${COLORS.border} ${((value - min) / (max - min)) * 100}%, ${COLORS.border} 100%)`,
        outline: "none",
        cursor: "pointer",
      }}
    />
  </div>
);

const Badge = ({ children, color = COLORS.primary, light = true }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      background: light ? color + "15" : color,
      color: light ? color : "#fff",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: "0.3px",
    }}
  >
    {children}
  </span>
);

function MarketSimulation() {
  const [laborTime, setLaborTime] = useState(5);
  const [productivity, setProductivity] = useState(100);
  const [rawMaterialCost, setRawMaterialCost] = useState(3000);
  const [surplusValueRate, setSurplusValueRate] = useState(100); // m' (%) — tỷ suất giá trị thặng dư
  const [demand, setDemand] = useState(500);
  const [supply, setSupply] = useState(500);
  const [history, setHistory] = useState([]);
  const [round, setRound] = useState(0);

  const sociallyNecessaryLaborTime = 5; // TGLĐXHCT (giờ)
  const wageRate = 1000;                // đ/giờ — giá trị 1 giờ sức lao động

  // --- CÁ BIỆT (của DN) ---
  // v cá biệt: lao động sống thực tế, điều chỉnh theo NSLĐ (NSLĐ cao -> v thấp cho 1 đơn vị SP)
  const v_individual = (laborTime * wageRate) / productivity * 100;
  // m cá biệt: giá trị thặng dư DN tạo ra (m' áp lên v cá biệt)
  const m_individual = v_individual * surplusValueRate / 100;
  // k = c + v: CHI PHÍ cá biệt thực tế DN bỏ ra (KHÔNG bao gồm m)
  const individualCost = rawMaterialCost + v_individual;
  // W cá biệt = c + v + m: GIÁ TRỊ cá biệt do lao động cụ thể của DN này tạo ra
  const individualValue = rawMaterialCost + v_individual + m_individual;

  // --- XÃ HỘI (TGLĐXHCT, NSLĐ trung bình) ---
  const v_social = sociallyNecessaryLaborTime * wageRate;
  const m_social = v_social * surplusValueRate / 100;
  // W xã hội = c + v + m: GIÁ TRỊ hàng hóa do XH thừa nhận
  const socialValue = rawMaterialCost + v_social + m_social;

  // --- THỊ TRƯỜNG ---
  const supplyDemandRatio = demand / Math.max(supply, 1);
  const marketPrice = socialValue * supplyDemandRatio;
  // Lợi nhuận thực tế = Giá cả bán − Chi phí cá biệt (k)
  //   = m bình quân ± lợi nhuận siêu ngạch ± chênh lệch do cung-cầu
  const profit = marketPrice - individualCost;

  const runSimulation = () => {
    const newRound = round + 1;
    setRound(newRound);
    setHistory((prev) => [
      ...prev.slice(-9),
      { round: newRound, price: Math.round(marketPrice), value: Math.round(socialValue), supply, demand, profit: Math.round(profit) },
    ]);
  };

  const resetSim = () => {
    setHistory([]); setRound(0);
    setLaborTime(5); setProductivity(100); setRawMaterialCost(3000);
    setSurplusValueRate(100);
    setDemand(500); setSupply(500);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <WaterDrop size={24} />
          <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: 0 }}>
            Mô phỏng Thị trường Nước sạch
          </h2>
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0 }}>
          Điều chỉnh các tham số để quan sát quy luật giá trị và cung-cầu vận hành
        </p>
        <div style={{ display: "inline-block", marginTop: 12, padding: "8px 16px", background: COLORS.primaryPale, borderRadius: 20, fontSize: 12, color: COLORS.primary, fontWeight: 600 }}>
          📐 Công thức C.Mác: <strong>W = c + v + m</strong> · Tham chiếu giá nước bậc thang VN: 7.500đ → 16.000đ/m³
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <Card>
            <h3 style={{ color: COLORS.primary, fontSize: 14, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
              ⚙️ Tham số sản xuất
            </h3>
            <Slider label="Thời gian lao động cá biệt (v: lao động sống)" value={laborTime} onChange={setLaborTime} min={1} max={12} unit=" giờ" color={COLORS.supply} />
            <Slider label="Năng suất lao động" value={productivity} onChange={setProductivity} min={20} max={300} unit="%" color={COLORS.equilibrium} />
            <Slider label="Chi phí tư liệu sản xuất (c: nguyên liệu + điện + khấu hao)" value={rawMaterialCost} onChange={setRawMaterialCost} min={1000} max={8000} step={500} unit=" đ" color={COLORS.purple} />
            <Slider label="Tỷ suất giá trị thặng dư m' = m/v (sức bóc lột lao động)" value={surplusValueRate} onChange={setSurplusValueRate} min={0} max={300} step={10} unit="%" color={COLORS.gold} />
            
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16, marginTop: 8 }}>
              <h3 style={{ color: COLORS.demand, fontSize: 14, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
                📊 Quan hệ Cung - Cầu
              </h3>
              <Slider label="Cầu (nhu cầu tiêu dùng)" value={demand} onChange={setDemand} min={100} max={1000} step={50} unit=" m³" color={COLORS.demand} />
              <Slider label="Cung (sản lượng)" value={supply} onChange={setSupply} min={100} max={1000} step={50} unit=" m³" color={COLORS.supply} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={runSimulation} style={{
                flex: 1, padding: "12px",
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 4px 12px ${COLORS.primary}30`,
              }}>▶ Chạy mô phỏng</button>
              <button onClick={resetSim} style={{
                padding: "12px 16px", background: COLORS.card,
                color: COLORS.textMuted, border: `1px solid ${COLORS.border}`,
                borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}>↺ Reset</button>
            </div>
          </Card>
        </div>

        <div>
          <Card glow accent>
            <h3 style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
              📈 Kết quả phân tích
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: COLORS.textMuted, fontSize: 10, marginBottom: 4, fontWeight: 600 }}>GIÁ TRỊ XÃ HỘI (W = c+v+m)</div>
                <div style={{ color: COLORS.gold, fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                  {Math.round(socialValue).toLocaleString()}đ
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 9, marginTop: 4 }}>
                  c={Math.round(rawMaterialCost).toLocaleString()} + v={Math.round(v_social).toLocaleString()} + m={Math.round(m_social).toLocaleString()}
                </div>
              </div>
              <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: COLORS.textMuted, fontSize: 10, marginBottom: 4, fontWeight: 600 }}>GIÁ CẢ THỊ TRƯỜNG</div>
                <div style={{ color: marketPrice > socialValue ? COLORS.danger : marketPrice < socialValue ? COLORS.equilibrium : COLORS.text, fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                  {Math.round(marketPrice).toLocaleString()}đ
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 9, marginTop: 4 }}>
                  W × (Cầu/Cung) = W × {supplyDemandRatio.toFixed(2)}
                </div>
              </div>
              <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: COLORS.textMuted, fontSize: 10, marginBottom: 4, fontWeight: 600 }}>CHI PHÍ CÁ BIỆT (k = c+v)</div>
                <div style={{ color: COLORS.purple, fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                  {Math.round(individualCost).toLocaleString()}đ
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 9, marginTop: 4 }}>
                  c={Math.round(rawMaterialCost).toLocaleString()} + v={Math.round(v_individual).toLocaleString()}
                </div>
              </div>
              <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: COLORS.textMuted, fontSize: 10, marginBottom: 4, fontWeight: 600 }}>LỢI NHUẬN (P = Giá cả − k)</div>
                <div style={{ color: profit >= 0 ? COLORS.equilibrium : COLORS.danger, fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                  {profit >= 0 ? "+" : ""}{Math.round(profit).toLocaleString()}đ
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 9, marginTop: 4 }}>
                  m bình quân ± siêu ngạch
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.primaryPale, borderRadius: 10, padding: 14, borderLeft: `3px solid ${COLORS.primary}` }}>
              <div style={{ color: COLORS.primary, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>🔍 PHÂN TÍCH QUY LUẬT</div>
              <div style={{ color: COLORS.textBody, fontSize: 12, lineHeight: 1.7 }}>
                {demand > supply && <span>⚡ <strong>Cầu &gt; Cung:</strong> Giá cả <span style={{color: COLORS.danger}}>cao hơn</span> giá trị — Nhà sản xuất có lợi, kích thích mở rộng sản xuất nước sạch. Theo quy luật giá trị của C.Mác, nguồn lực sẽ dịch chuyển vào ngành cấp nước.</span>}
                {demand < supply && <span>📉 <strong>Cầu &lt; Cung:</strong> Giá cả <span style={{color: COLORS.equilibrium}}>thấp hơn</span> giá trị — Doanh nghiệp cấp nước thua lỗ, buộc phải giảm sản lượng hoặc cải tiến để hạ chi phí.</span>}
                {demand === supply && <span>⚖️ <strong>Cung = Cầu:</strong> Giá cả <span style={{color: COLORS.gold}}>bằng</span> giá trị — Thị trường nước sạch đạt trạng thái cân bằng. Đây là trạng thái lý tưởng.</span>}
                {laborTime < sociallyNecessaryLaborTime && <span><br/>✅ Hao phí lao động cá biệt ({laborTime}h) <strong>thấp hơn</strong> TGLĐXHCT ({sociallyNecessaryLaborTime}h) → DN thu <strong>lợi nhuận siêu ngạch</strong> (ngoài m bình quân)!</span>}
                {laborTime === sociallyNecessaryLaborTime && productivity === 100 && <span><br/>⚖️ TGLĐ cá biệt = TGLĐXHCT, NSLĐ trung bình → DN chỉ thu được <strong>m bình quân</strong> ({Math.round(m_social).toLocaleString()}đ), không có siêu ngạch.</span>}
                {laborTime > sociallyNecessaryLaborTime && <span><br/>⚠️ Hao phí lao động cá biệt ({laborTime}h) <strong>cao hơn</strong> TGLĐXHCT ({sociallyNecessaryLaborTime}h) → DN mất một phần m, nguy cơ thua lỗ nếu chênh quá lớn!</span>}
                <br/><span style={{fontSize: 11, color: COLORS.textMuted}}>📚 <strong>Công thức C.Mác:</strong> W = c + v + m. Lợi nhuận P = Giá cả bán − k(c+v). Khi DN cải tiến (giảm v) trong khi XH chưa kịp điều chỉnh → P {'>'} m → đó là <em>lợi nhuận siêu ngạch</em>.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {history.length > 0 && (
        <Card style={{ marginTop: 20 }}>
          <h3 style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
            📉 Biến động giá cả & giá trị qua các vòng mô phỏng
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="round" stroke={COLORS.textMuted} tick={{ fontSize: 11 }} />
              <YAxis stroke={COLORS.textMuted} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="price" stroke={COLORS.demand} strokeWidth={2.5} name="Giá cả thị trường" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="value" stroke={COLORS.gold} strokeWidth={2.5} strokeDasharray="5 5" name="Giá trị (TGLĐXHCT)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="profit" stroke={COLORS.equilibrium} strokeWidth={2.5} name="Lợi nhuận" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: 10, color: COLORS.textMuted, fontSize: 11 }}>
            💡 Quan sát: Giá cả thị trường dao động xung quanh giá trị — đây là biểu hiện của <strong>quy luật giá trị</strong> theo C.Mác
          </div>
        </Card>
      )}
    </div>
  );
}

function RolePlayGame() {
  const [role, setRole] = useState(null);
  const [gameRound, setGameRound] = useState(0);
  const [score, setScore] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [marketState, setMarketState] = useState({ price: 8000, supply: 500, demand: 500, publicSatisfaction: 70, companyProfit: 0 });
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const roles = [
    { id: "state", name: "Nhà nước", icon: "🏛️", desc: "Điều tiết thị trường nước sạch, bảo vệ lợi ích xã hội", color: COLORS.primary },
    { id: "company", name: "DN Cấp nước", icon: "🏭", desc: "Sản xuất & cung ứng nước sạch, tối đa hóa lợi nhuận", color: COLORS.supply },
    { id: "consumer", name: "Người tiêu dùng", icon: "👥", desc: "Sử dụng nước sạch, bảo vệ quyền lợi", color: COLORS.equilibrium },
  ];

  const scenarios = [
    {
      title: "Mùa hè nắng nóng — Nhu cầu nước tăng đột biến",
      context: "Nhiệt độ Hà Nội lên 42°C, nhu cầu nước sinh hoạt tăng 40%. Giá nước đang ở mức 8.000đ/m³.",
      options: {
        state: [
          { text: "Giữ giá trần, trợ giá cho DN", effect: { price: -500, publicSatisfaction: 15, companyProfit: -200, supply: 50 }, analysis: "Nhà nước can thiệp bằng giá trần — bảo vệ người tiêu dùng nhưng có thể gây thiếu hụt cung nếu DN không được bù đắp chi phí." },
          { text: "Để thị trường tự điều chỉnh", effect: { price: 3000, publicSatisfaction: -20, companyProfit: 500, supply: 100 }, analysis: "Theo quy luật cung-cầu, giá tăng kích thích DN mở rộng cung, nhưng người nghèo khó tiếp cận." },
          { text: "Tăng thuế DN để trợ giá", effect: { price: -1000, publicSatisfaction: 10, companyProfit: -600, supply: -50 }, analysis: "Thuế cao làm giảm lợi nhuận DN, có thể khiến một số DN rút khỏi thị trường, giảm cung." },
        ],
        company: [
          { text: "Tăng sản lượng, giữ giá", effect: { price: 0, publicSatisfaction: 10, companyProfit: 300, supply: 200 }, analysis: "Chiến lược mở rộng thị phần — phù hợp quy luật giá trị: DN có NSLĐ cao sẽ thu lợi nhuận siêu ngạch." },
          { text: "Tăng giá theo cung-cầu", effect: { price: 2500, publicSatisfaction: -25, companyProfit: 800, supply: 0 }, analysis: "Tối đa hóa lợi nhuận ngắn hạn nhưng gây bất mãn xã hội — tác động tiêu cực của cạnh tranh." },
          { text: "Đầu tư công nghệ lọc mới", effect: { price: 500, publicSatisfaction: 5, companyProfit: -300, supply: 300 }, analysis: "Đầu tư dài hạn: tăng NSLĐ → giảm TGLĐ cá biệt → lợi thế cạnh tranh bền vững theo quy luật giá trị." },
        ],
        consumer: [
          { text: "Tiết kiệm nước, giảm cầu", effect: { price: -800, publicSatisfaction: 5, companyProfit: -100, demand: -100 }, analysis: "Người tiêu dùng thông minh — giảm cầu giúp ổn định giá, phản ánh hành vi tiêu dùng hợp lý." },
          { text: "Yêu cầu Nhà nước can thiệp", effect: { price: -500, publicSatisfaction: 10, companyProfit: -200, supply: 0 }, analysis: "Vai trò của Nhà nước: khắc phục khuyết tật thị trường, bảo vệ quyền lợi người tiêu dùng." },
          { text: "Chuyển sang nước giếng/mưa", effect: { price: -1500, publicSatisfaction: -5, companyProfit: -400, demand: -200 }, analysis: "Tẩy chay hàng hóa — tác động mạnh đến DN nhưng rủi ro chất lượng nước không đảm bảo." },
        ],
      },
    },
    {
      title: "DN độc quyền tăng giá nước 50%",
      context: "Trong khu vực chỉ có một DN cấp nước (như HAWACO ở Hà Nội, SAWACO ở TP.HCM, hoặc VIWASUPCO) — tăng giá từ 8.000đ lên 12.000đ/m³ với lý do 'chi phí tăng'.",
      options: {
        state: [
          { text: "Phạt hành vi lạm dụng độc quyền", effect: { price: -3000, publicSatisfaction: 20, companyProfit: -500, supply: 0 }, analysis: "Nhà nước sử dụng pháp luật chống độc quyền — tác động tích cực của cạnh tranh lành mạnh." },
          { text: "Cấp phép cho DN mới tham gia", effect: { price: -2000, publicSatisfaction: 15, companyProfit: -300, supply: 200 }, analysis: "Tạo cạnh tranh trên thị trường — quy luật cạnh tranh sẽ kéo giá về gần giá trị." },
          { text: "Quốc hữu hóa ngành nước", effect: { price: -4000, publicSatisfaction: 25, companyProfit: -1000, supply: -100 }, analysis: "Biến nước sạch thành hàng hóa công — loại bỏ động cơ lợi nhuận tư nhân nhưng có thể giảm hiệu quả." },
        ],
        company: [
          { text: "Giải trình chi phí minh bạch", effect: { price: -1000, publicSatisfaction: 10, companyProfit: 200, supply: 0 }, analysis: "Minh bạch giúp xây dựng lòng tin — chi phí sản xuất (c+v) tăng thực sự thì giá trị hàng hóa tăng." },
          { text: "Giữ giá cao, chấp nhận rủi ro", effect: { price: 0, publicSatisfaction: -30, companyProfit: 600, supply: 0 }, analysis: "Lạm dụng vị thế độc quyền — tác động tiêu cực: phân hóa giàu nghèo, giảm phúc lợi xã hội." },
          { text: "Giảm giá + cải tiến quy trình", effect: { price: -2000, publicSatisfaction: 20, companyProfit: 100, supply: 100 }, analysis: "Cạnh tranh bằng cải tiến — bản chất tích cực: thúc đẩy LLSX phát triển." },
        ],
        consumer: [
          { text: "Tập thể phản đối, đàm phán", effect: { price: -2000, publicSatisfaction: 15, companyProfit: -200, demand: 0 }, analysis: "Sức mạnh tập thể của người tiêu dùng — bảo vệ quyền lợi trong quan hệ với người sản xuất." },
          { text: "Kiện ra tòa về giá độc quyền", effect: { price: -1500, publicSatisfaction: 10, companyProfit: -400, supply: 0 }, analysis: "Sử dụng pháp luật — vai trò Nhà nước trong bảo vệ người tiêu dùng trước cạnh tranh không lành mạnh." },
          { text: "Chấp nhận giá mới", effect: { price: 0, publicSatisfaction: -15, companyProfit: 400, demand: -50 }, analysis: "Khi không có lựa chọn thay thế, người tiêu dùng bị thiệt — minh chứng khuyết tật của kinh tế thị trường." },
        ],
      },
    },
    {
      title: "Ô nhiễm nguồn nước sông Hồng",
      context: "Kết quả quan trắc cho thấy nguồn nước thô bị ô nhiễm, chi phí xử lý tăng 60%. Chất lượng nước là vấn đề sống còn.",
      options: {
        state: [
          { text: "Đầu tư nâng cấp hệ thống xử lý", effect: { price: 1000, publicSatisfaction: 15, companyProfit: 100, supply: 100 }, analysis: "Nhà nước đầu tư hạ tầng — vai trò chủ thể kinh doanh + quản lý, nâng cao giá trị sử dụng hàng hóa." },
          { text: "Siết chặt xử phạt ô nhiễm", effect: { price: 500, publicSatisfaction: 20, companyProfit: 0, supply: 0 }, analysis: "Bảo vệ môi trường = bảo vệ giá trị sử dụng lâu dài — khắc phục khuyết tật thị trường." },
          { text: "Trợ giá để giữ giá nước cũ", effect: { price: -500, publicSatisfaction: 5, companyProfit: -300, supply: -50 }, analysis: "Giải pháp ngắn hạn — không giải quyết gốc rễ, tiềm ẩn rủi ro khan hiếm." },
        ],
        company: [
          { text: "Đầu tư hệ thống lọc RO mới", effect: { price: 1500, publicSatisfaction: 10, companyProfit: -400, supply: 50 }, analysis: "Ứng dụng KHCN — tăng giá trị sử dụng, cải tiến NSLĐ, phù hợp xu hướng CNH-HĐH." },
          { text: "Giảm chất lượng để giữ giá", effect: { price: 0, publicSatisfaction: -30, companyProfit: 300, supply: 0 }, analysis: "Hy sinh giá trị sử dụng — vi phạm trách nhiệm người SX, cạnh tranh không lành mạnh." },
          { text: "Tìm nguồn nước thay thế", effect: { price: 800, publicSatisfaction: 5, companyProfit: -200, supply: 150 }, analysis: "Sáng tạo trong sản xuất — đa dạng hóa nguồn cung, giảm phụ thuộc, tăng khả năng cạnh tranh." },
        ],
        consumer: [
          { text: "Sẵn sàng trả thêm cho nước sạch", effect: { price: 1000, publicSatisfaction: 5, companyProfit: 300, demand: 50 }, analysis: "Người tiêu dùng ưu tiên giá trị sử dụng (chất lượng nước) hơn giá cả — phản ánh bản chất hàng hóa thiết yếu." },
          { text: "Đòi DN công khai chất lượng", effect: { price: 0, publicSatisfaction: 15, companyProfit: -100, supply: 0 }, analysis: "Minh bạch thông tin — giảm bất cân xứng thông tin, thị trường vận hành hiệu quả hơn." },
          { text: "Tự lắp hệ thống lọc tại nhà", effect: { price: -500, publicSatisfaction: 0, companyProfit: -200, demand: -150 }, analysis: "Tự sản xuất thay vì mua — quay lại kinh tế tự cung tự cấp, giảm vai trò của trao đổi hàng hóa." },
        ],
      },
    },
  ];

  const currentScenario = scenarios[gameRound % scenarios.length];

  const makeDecision = (option) => {
    const e = option.effect;
    const newState = {
      price: Math.max(1000, marketState.price + (e.price || 0)),
      supply: Math.max(100, marketState.supply + (e.supply || 0)),
      demand: Math.max(100, marketState.demand + (e.demand || 0)),
      publicSatisfaction: Math.min(100, Math.max(0, marketState.publicSatisfaction + (e.publicSatisfaction || 0))),
      companyProfit: marketState.companyProfit + (e.companyProfit || 0),
    };
    const roundScore = (e.publicSatisfaction || 0) * 2 + Math.min(e.companyProfit || 0, 300) / 50;
    setScore((s) => s + Math.round(roundScore));
    setMarketState(newState);
    setDecisions((d) => [...d, { round: gameRound + 1, choice: option.text, analysis: option.analysis }]);
    setFeedback(option.analysis);
    if (gameRound >= 2) setGameOver(true);
    else setGameRound((r) => r + 1);
  };

  const resetGame = () => {
    setRole(null); setGameRound(0); setScore(0); setDecisions([]);
    setMarketState({ price: 8000, supply: 500, demand: 500, publicSatisfaction: 70, companyProfit: 0 });
    setFeedback(""); setGameOver(false);
  };

  if (!role) {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: 0, marginBottom: 8 }}>
            🎮 Vai trò của bạn trong Thị trường Nước sạch
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Chọn vai trò để trải nghiệm góc nhìn của từng chủ thể kinh tế</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {roles.map((r) => (
            <Card key={r.id} style={{ cursor: "pointer", textAlign: "center" }}>
              <div onClick={() => setRole(r.id)} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{r.icon}</div>
                <h3 style={{ color: r.color, fontSize: 16, fontWeight: 800, marginTop: 0, marginBottom: 8 }}>{r.name}</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{r.desc}</p>
                <button style={{
                  marginTop: 16, padding: "10px 24px",
                  background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)`,
                  color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 4px 12px ${r.color}30`,
                }}>Chọn vai này</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div>
        <Card glow accent style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h2 style={{ color: COLORS.gold, fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>Kết quả mô phỏng</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
            Vai trò: {roles.find(r => r.id === role)?.name} | Điểm: {score}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 12 }}>
              <div style={{ color: COLORS.textMuted, fontSize: 10, fontWeight: 600 }}>GIÁ NƯỚC</div>
              <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 800 }}>{marketState.price.toLocaleString()}đ</div>
            </div>
            <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 12 }}>
              <div style={{ color: COLORS.textMuted, fontSize: 10, fontWeight: 600 }}>HÀI LÒNG XH</div>
              <div style={{ color: marketState.publicSatisfaction > 50 ? COLORS.equilibrium : COLORS.danger, fontSize: 18, fontWeight: 800 }}>{marketState.publicSatisfaction}%</div>
            </div>
            <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 12 }}>
              <div style={{ color: COLORS.textMuted, fontSize: 10, fontWeight: 600 }}>LỢI NHUẬN DN</div>
              <div style={{ color: marketState.companyProfit >= 0 ? COLORS.equilibrium : COLORS.danger, fontSize: 18, fontWeight: 800 }}>{marketState.companyProfit > 0 ? "+" : ""}{marketState.companyProfit.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ background: COLORS.bgAlt, borderRadius: 10, padding: 16, textAlign: "left", marginBottom: 20 }}>
            <div style={{ color: COLORS.primary, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>📋 Nhật ký quyết định:</div>
            {decisions.map((d, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < decisions.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700 }}>Vòng {d.round}: {d.choice}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 4, lineHeight: 1.6 }}>→ {d.analysis}</div>
              </div>
            ))}
          </div>
          <button onClick={resetGame} style={{
            padding: "12px 32px",
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 12px ${COLORS.primary}30`,
          }}>🔄 Chơi lại với vai khác</button>
        </Card>
      </div>
    );
  }

  const currentRole = roles.find((r) => r.id === role);
  const options = currentScenario.options[role];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{currentRole.icon}</span>
          <div>
            <div style={{ color: currentRole.color, fontSize: 14, fontWeight: 700 }}>{currentRole.name}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11 }}>Vòng {gameRound + 1}/3</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge color={COLORS.text}>💰 Giá: {marketState.price.toLocaleString()}đ/m³</Badge>
          <Badge color={marketState.publicSatisfaction > 50 ? COLORS.equilibrium : COLORS.danger}>😊 XH: {marketState.publicSatisfaction}%</Badge>
          <Badge color={COLORS.gold}>⭐ Điểm: {score}</Badge>
        </div>
      </div>

      <Card glow accent style={{ marginBottom: 16 }}>
        <Badge color={COLORS.danger}>TÌNH HUỐNG {gameRound + 1}</Badge>
        <h3 style={{ color: COLORS.text, fontSize: 16, fontWeight: 800, margin: "10px 0 8px" }}>
          {currentScenario.title}
        </h3>
        <p style={{ color: COLORS.textBody, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{currentScenario.context}</p>
      </Card>

      <div style={{ display: "grid", gap: 12 }}>
        {options.map((opt, i) => (
          <Card key={i} style={{ cursor: "pointer" }}>
            <div onClick={() => makeDecision(opt)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `linear-gradient(135deg, ${currentRole.color}, ${currentRole.color}aa)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 600 }}>{opt.text}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {feedback && (
        <Card style={{ marginTop: 16, borderLeft: `3px solid ${COLORS.primary}`, background: COLORS.primaryPale }}>
          <div style={{ color: COLORS.primary, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>💡 PHÂN TÍCH KINH TẾ CHÍNH TRỊ (vòng trước)</div>
          <div style={{ color: COLORS.textBody, fontSize: 12, lineHeight: 1.7 }}>{feedback}</div>
        </Card>
      )}
    </div>
  );
}

function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Xin chào! Tôi là trợ giảng AI chuyên về Kinh tế chính trị Mác-Lênin, Chương 2: Hàng hóa, Thị trường và vai trò của các chủ thể tham gia thị trường.\n\n🎯 Bạn có thể hỏi tôi về:\n• Hai thuộc tính của hàng hóa (giá trị sử dụng & giá trị)\n• Quy luật giá trị, cung-cầu, cạnh tranh\n• Vai trò của Nhà nước, DN, người tiêu dùng\n• Liên hệ thực tiễn ngành nước & thủy lợi\n\nHãy đặt câu hỏi!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const suggestedQuestions = [
    "Nước sạch có phải là hàng hóa không? Phân tích hai thuộc tính?",
    "Quy luật giá trị tác động đến giá nước sạch ở VN như thế nào?",
    "Vai trò của Nhà nước trong điều tiết thị trường nước?",
    "Tại sao giá nước sạch Hà Nội tăng 30% năm 2024?",
    "Nếu Nhà nước đầu tư nâng cấp hệ thống thủy lợi Bắc Hưng Hải bằng công nghệ mới, tác động thế nào đến giá trị hàng hóa nước theo quy luật giá trị của C.Mác?",
    "Phân biệt c, v, m trong công thức W = c + v + m với ví dụ ngành nước?",
  ];

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      // Gọi qua Vercel Serverless Function /api/chat (giữ API key an toàn phía server)
      const systemPrompt = `Bạn là trợ giảng AI cho môn Kinh tế chính trị Mác-Lênin tại Trường Đại học Thủy lợi.

PHẠM VI: Chỉ trả lời câu hỏi liên quan đến Chương 2 — Hàng hóa, Thị trường và vai trò của các chủ thể tham gia thị trường.

NỘI DUNG CHÍNH:
- Sản xuất hàng hóa: điều kiện (phân công lao động XH + sự tách biệt kinh tế)
- Hàng hóa: 2 thuộc tính (giá trị sử dụng & giá trị), tính 2 mặt lao động (cụ thể & trừu tượng)
- Lượng giá trị: W = c + v + m. Thời gian lao động XH cần thiết (TGLĐXHCT), NSLĐ, cường độ LĐ
- Tiền tệ: bản chất (hàng hóa đặc biệt, vật ngang giá chung), 5 chức năng
- Thị trường: khái niệm, vai trò, cơ chế, ưu thế & khuyết tật
- Quy luật: giá trị (giá cả dao động quanh giá trị), cung-cầu, cạnh tranh, lưu thông tiền tệ (M = P.Q/V)
- Chủ thể: người SX, người tiêu dùng, Nhà nước (3 vai trò)

QUY TẮC:
1. Mọi ví dụ minh họa PHẢI liên hệ ngành NƯỚC SẠCH, THỦY LỢI, tài nguyên nước VN
2. Trả lời ngắn gọn, dưới 250 từ, dễ hiểu cho SV năm nhất
3. Dùng công thức khi cần: W = c + v + m, M = P.Q/V
4. Kết thúc bằng 1 câu hỏi gợi mở để SV tư duy thêm
5. Nếu câu hỏi ngoài phạm vi, nhẹ nhàng hướng về Chương 2
6. Dùng emoji phù hợp để tăng sinh động
7. Khi phù hợp, dẫn nguồn theo Slide bài giảng (VD: "Xem thêm Slide 6 — Hai thuộc tính của hàng hóa", "Slide 8 — Công thức W = c + v + m", "Slide 10 — Quy luật giá trị", "Slide 13 — Vai trò kép của Nhà nước")`;

      const apiMessages = [...messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0).map(m => ({
        role: m.role, content: m.content
      })), { role: "user", content: userMsg }];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Lỗi: ${response.status}`);
      }

      const assistantText = data.content?.map((item) => item.text || "").join("\n") || "Xin lỗi, tôi gặp sự cố. Hãy thử lại!";
      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      console.error("AI Tutor error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Không thể kết nối AI trợ giảng. Vui lòng kiểm tra:\n\n1️⃣ Đã thêm ANTHROPIC_API_KEY vào Vercel Environment Variables chưa?\n2️⃣ Đã deploy lại sau khi thêm key chưa?\n\n💡 **Gợi ý nhanh:** Nước sạch là hàng hóa đặc biệt — có giá trị sử dụng thiết yếu (con người không thể sống thiếu nước) nhưng giá trị (lượng lao động kết tinh) lại phụ thuộc vào công nghệ xử lý nước. Đây là ví dụ tuyệt vời về hai thuộc tính của hàng hóa!",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 280px)", maxHeight: 600 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>🤖 AI Trợ giảng KTCT</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0 }}>
          Chatbot được huấn luyện riêng cho Chương 2 | Mọi ví dụ liên hệ ngành Thủy lợi
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {suggestedQuestions.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)} style={{
            padding: "6px 12px", background: COLORS.primaryPale, color: COLORS.primary,
            border: `1px solid ${COLORS.primary}30`, borderRadius: 20,
            fontSize: 11, cursor: "pointer", fontWeight: 600,
          }}>{q}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8, background: COLORS.bgAlt, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{
              maxWidth: "80%", padding: "12px 16px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` : COLORS.card,
              color: msg.role === "user" ? "#fff" : COLORS.textBody,
              fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
              border: msg.role === "assistant" ? `1px solid ${COLORS.border}` : "none",
              boxShadow: msg.role === "user" ? `0 2px 8px ${COLORS.primary}25` : "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div style={{
              padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
              background: COLORS.card, border: `1px solid ${COLORS.border}`,
              color: COLORS.textMuted, fontSize: 13,
            }}>Đang suy nghĩ... 💭</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Hỏi về hàng hóa, thị trường, quy luật kinh tế..."
          style={{
            flex: 1, padding: "12px 16px", background: COLORS.card,
            border: `1px solid ${COLORS.border}`, borderRadius: 12,
            color: COLORS.text, fontSize: 13, outline: "none",
          }}
        />
        <button onClick={() => sendMessage()} disabled={loading} style={{
          padding: "12px 20px",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
          color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
          boxShadow: `0 2px 8px ${COLORS.primary}30`,
        }}>Gửi</button>
      </div>
    </div>
  );
}

function InteractiveQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      q: "Nước sạch sinh hoạt có phải là hàng hóa không? Vì sao?",
      options: ["Không, vì nước là tài nguyên thiên nhiên", "Có, vì là sản phẩm lao động thỏa mãn nhu cầu và được trao đổi mua bán", "Không, vì Nhà nước cung cấp miễn phí", "Có, vì nước có giá trị sử dụng"],
      correct: 1,
      explain: "Nước sạch sinh hoạt là HÀNG HÓA vì thỏa mãn đủ 2 điều kiện: (1) là sản phẩm của lao động (qua xử lý, lọc, vận chuyển), (2) được trao đổi, mua bán trên thị trường. Chỉ có giá trị sử dụng chưa đủ — phải có cả giá trị (lao động kết tinh).",
    },
    {
      q: "Khi nhu cầu nước sạch mùa hè tăng 40% nhưng sản lượng không đổi, theo quy luật cung-cầu điều gì xảy ra?",
      options: ["Giá cả giữ nguyên vì giá trị không đổi", "Giá cả tăng cao hơn giá trị hàng hóa", "Giá cả giảm do Nhà nước can thiệp", "Không có thay đổi gì"],
      correct: 1,
      explain: "Khi Cầu > Cung → giá cả cao hơn giá trị. Đây là biểu hiện của quy luật cung-cầu. Giá cả dao động xung quanh giá trị — đây là cơ chế quy luật giá trị hoạt động thông qua biến động giá cả thị trường.",
    },
    {
      q: "Một nhà máy nước áp dụng công nghệ lọc RO, giảm thời gian xử lý 1m³ nước từ 5 giờ xuống 3 giờ. Điều này tác động thế nào đến giá trị hàng hóa?",
      options: ["Giá trị 1m³ nước giảm vì thời gian lao động cá biệt giảm", "Giá trị không đổi vì TGLĐXHCT chưa thay đổi, nhưng DN thu lợi nhuận siêu ngạch", "Giá trị tăng vì công nghệ đắt tiền hơn", "Giá trị giảm về 0 vì máy móc thay thế lao động"],
      correct: 1,
      explain: "Lượng giá trị HH được đo bằng thời gian lao động XH cần thiết (TGLĐXHCT), không phải thời gian cá biệt. Khi 1 DN cải tiến, TGLĐXHCT của toàn XH chưa đổi → giá trị HH chưa đổi. Nhưng DN này có chi phí cá biệt thấp hơn → thu lợi nhuận siêu ngạch. Đây là động lực cải tiến kỹ thuật theo quy luật giá trị.",
    },
    {
      q: "Trong thị trường nước sạch, Nhà nước vừa là chủ thể kinh doanh vừa là chủ thể quản lý. Vai trò nào sau đây thuộc chức năng QUẢN LÝ?",
      options: ["Vận hành nhà máy nước", "Đặt giá trần, kiểm soát chất lượng, chống độc quyền", "Bán nước cho người tiêu dùng", "Đầu tư xây dựng đường ống"],
      correct: 1,
      explain: "Nhà nước có VAI TRÒ KÉP: (1) Chủ thể kinh doanh — vận hành nhà máy, đầu tư hạ tầng; (2) Chủ thể quản lý — đặt giá trần, ban hành tiêu chuẩn chất lượng, chống độc quyền, bảo vệ người tiêu dùng. Vai trò quản lý nhằm khắc phục khuyết tật của kinh tế thị trường.",
    },
    {
      q: "Lao động của công nhân vận hành trạm bơm thủy lợi tạo ra loại giá trị nào của hàng hóa 'dịch vụ cấp nước'?",
      options: ["Chỉ tạo giá trị sử dụng", "Chỉ tạo giá trị", "Lao động cụ thể tạo giá trị sử dụng, lao động trừu tượng tạo giá trị", "Không tạo ra giá trị vì đây là dịch vụ"],
      correct: 2,
      explain: "Lao động SX hàng hóa có TÍNH HAI MẶT: (1) Lao động CỤ THỂ (vận hành bơm, kiểm tra áp suất) → tạo giá trị sử dụng (nước được cung cấp đến người dùng); (2) Lao động TRỪU TƯỢNG (hao phí sức LĐ nói chung) → tạo giá trị hàng hóa. Dịch vụ cũng là hàng hóa (phi vật thể).",
    },
  ];

  const handleSelect = (idx) => { if (!showAnswer) setSelected(idx); };
  const checkAnswer = () => {
    setShowAnswer(true);
    const isCorrect = selected === questions[currentQ].correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => [...a, { q: currentQ, selected, correct: questions[currentQ].correct, isCorrect }]);
  };
  const nextQuestion = () => {
    if (currentQ >= questions.length - 1) setCompleted(true);
    else { setCurrentQ((q) => q + 1); setSelected(null); setShowAnswer(false); }
  };

  if (completed) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card glow accent style={{ maxWidth: 550, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👏" : "📚"}</div>
        <h2 style={{ color: COLORS.gold, fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>
          {score}/{questions.length} câu đúng ({pct}%)
        </h2>
        <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
          {pct >= 80 ? "Xuất sắc! Bạn nắm vững kiến thức Chương 2!" : pct >= 60 ? "Khá tốt! Cần ôn lại một số nội dung." : "Hãy đọc lại bài giảng và thử lại!"}
        </p>
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          {answers.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 16 }}>{a.isCorrect ? "✅" : "❌"}</span>
              <span style={{ color: COLORS.textBody, fontSize: 12 }}>Câu {i + 1}: {a.isCorrect ? "Đúng" : "Sai"}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setCurrentQ(0); setSelected(null); setShowAnswer(false); setScore(0); setCompleted(false); setAnswers([]); }} style={{
          padding: "12px 32px",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
          color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 12px ${COLORS.primary}30`,
        }}>🔄 Làm lại</button>

        <div style={{ marginTop: 24, padding: 16, background: COLORS.primaryPale, borderRadius: 12, borderLeft: `3px solid ${COLORS.primary}`, textAlign: "left" }}>
          <div style={{ color: COLORS.primary, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📝 BÀI TẬP VỀ NHÀ</div>
          <div style={{ color: COLORS.textBody, fontSize: 12, lineHeight: 1.7 }}>
            Viết bài luận <strong>500 từ</strong> với chủ đề: <em>"Vai trò của thị trường nước sạch trong nền kinh tế thị trường định hướng XHCN ở Việt Nam"</em>. Vận dụng công thức W = c + v + m và 3 quy luật (giá trị, cung-cầu, cạnh tranh) đã học.
          </div>
        </div>
      </Card>
    );
  }

  const q = questions[currentQ];

  return (
    <div style={{ maxWidth: 650, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>📝 Kiểm tra kiến thức</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 32, height: 4, borderRadius: 2,
              background: i < currentQ ? COLORS.equilibrium : i === currentQ ? COLORS.primary : COLORS.border,
            }} />
          ))}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 8 }}>Câu {currentQ + 1}/{questions.length} | Điểm: {score}</div>
      </div>

      <Card glow accent>
        <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, lineHeight: 1.7, marginTop: 0, marginBottom: 20 }}>{q.q}</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {q.options.map((opt, i) => {
            let bg = COLORS.bgAlt;
            let borderColor = COLORS.border;
            let textColor = COLORS.textBody;
            if (showAnswer) {
              if (i === q.correct) { bg = COLORS.equilibrium + "15"; borderColor = COLORS.equilibrium; textColor = COLORS.equilibrium; }
              else if (i === selected && i !== q.correct) { bg = COLORS.danger + "15"; borderColor = COLORS.danger; textColor = COLORS.danger; }
            } else if (i === selected) {
              bg = COLORS.primaryPale; borderColor = COLORS.primary; textColor = COLORS.primary;
            }
            return (
              <div key={i} onClick={() => handleSelect(i)} style={{
                padding: "12px 16px", background: bg, border: `1px solid ${borderColor}`,
                borderRadius: 10, cursor: showAnswer ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  border: `2px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: textColor, flexShrink: 0,
                }}>{String.fromCharCode(65 + i)}</div>
                <span style={{ color: textColor, fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>{opt}</span>
              </div>
            );
          })}
        </div>

        {showAnswer && (
          <div style={{ marginTop: 16, padding: 14, background: COLORS.equilibrium + "10", borderRadius: 10, borderLeft: `3px solid ${COLORS.equilibrium}` }}>
            <div style={{ color: COLORS.equilibrium, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>💡 GIẢI THÍCH</div>
            <div style={{ color: COLORS.textBody, fontSize: 12, lineHeight: 1.7 }}>{q.explain}</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          {!showAnswer ? (
            <button onClick={checkAnswer} disabled={selected === null} style={{
              padding: "10px 24px",
              background: selected !== null ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` : COLORS.border,
              color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: selected !== null ? "pointer" : "not-allowed",
              boxShadow: selected !== null ? `0 2px 8px ${COLORS.primary}30` : "none",
            }}>Kiểm tra</button>
          ) : (
            <button onClick={nextQuestion} style={{
              padding: "10px 24px",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
              color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 2px 8px ${COLORS.primary}30`,
            }}>{currentQ >= questions.length - 1 ? "Xem kết quả" : "Câu tiếp →"}</button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "Mô phỏng Thị trường", icon: "📊", component: MarketSimulation },
    { name: "Vai trò các Chủ thể", icon: "🎮", component: RolePlayGame },
    { name: "AI Trợ giảng", icon: "🤖", component: AITutor },
    { name: "Kiểm tra", icon: "📝", component: InteractiveQuiz },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* TOP BANNER — Competition Info */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
        padding: "12px 24px",
        borderBottom: `2px solid ${COLORS.primary}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", opacity: 0.95, marginBottom: 2 }}>
            🏆 BÀI DỰ THI HỘI THI "ỨNG DỤNG CÔNG NGHỆ SỐ THIẾT KẾ BÀI GIẢNG, BÀI TRÌNH BÀY KHOA HỌC NĂM 2026"
          </div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
            Tác giả: TS. Đào Mộng Anh · Bộ môn Mác-Lênin · Khoa Luật và Lý luận chính trị · Hà Nội, 2026
          </div>
        </div>
      </div>

      {/* MAIN HEADER with LOGO */}
      <div style={{
        background: COLORS.card,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flexShrink: 0 }}>
                <TLULogo size={68} />
              </div>
              <div style={{ borderLeft: `2px solid ${COLORS.primary}30`, paddingLeft: 16 }}>
                <div style={{ color: COLORS.primary, fontSize: 11, fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>
                  TRƯỜNG ĐẠI HỌC THỦY LỢI
                </div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                  Lớp học số KTCT — Mô phỏng thị trường nước sạch
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.textMuted, fontWeight: 500 }}>
                  Chương 2 · Hàng hóa, Thị trường & Vai trò của các Chủ thể tham gia thị trường — Học KTCT qua mô phỏng, role-play & AI
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Badge color={COLORS.equilibrium}>✨ AI-Powered</Badge>
              <Badge color={COLORS.purple}>🎮 Simulation</Badge>
              <Badge color={COLORS.accent}>📊 Data-Driven</Badge>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 20, overflowX: "auto", paddingBottom: 4 }}>
            {tabs.map((tab, i) => (
              <TabButton key={i} active={activeTab === i} onClick={() => setActiveTab(i)} icon={tab.icon}>
                {tab.name}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 48px" }}>
        <ActiveComponent />
      </div>

      <div style={{ textAlign: "center", padding: "20px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.card }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
          <TLULogo size={28} />
          <span style={{ color: COLORS.primary, fontSize: 12, fontWeight: 700 }}>ĐẠI HỌC THỦY LỢI · 1959</span>
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: 11, margin: 0 }}>
          © 2026 Lớp học số KTCT — Nước & Thủy lợi · TS. Đào Mộng Anh · Bộ môn Mác-Lênin · Khoa Luật và Lý luận chính trị · Bài dự thi "Ứng dụng công nghệ số thiết kế bài giảng, bài trình bày khoa học năm 2026"
        </p>
      </div>
    </div>
  );
}
