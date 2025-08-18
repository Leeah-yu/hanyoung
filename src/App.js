import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import watermarkImage from "./assets/HYLOGO_NAVY.png";
import Home from "./Home"; // ← 새로 만든 홈 컴포넌트

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.documentElement.style.background = "#f8fafc";
  }, []);

  return (
    <BrowserRouter basename="/hanyoung">
      <div style={{ minHeight: "100vh", color: "#0f172a" }}>
        <header style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ fontSize: 20, fontWeight: 800, textDecoration: "none", color: "inherit" }}>관세법인 한영 업무 대시보드</Link>
          <nav style={{ fontSize: 14, display: "flex", gap: 16 }}>
            <Link to="/" style={{ textDecoration: "underline", color: "inherit" }}>홈</Link>
            <Link to="/form" style={{ textDecoration: "underline", color: "inherit" }}>작성하기</Link>
            <Link to="/preview" style={{ textDecoration: "underline", color: "inherit" }}>미리보기</Link>
          </nav>
        </header>

        <main style={{ maxWidth: 1120, margin: "0 auto", padding: "0 16px 64px" }}>
          <Routes>
            <Route path="/" element={<Home />} />          {/* 기본 진입 페이지 */}
            <Route path="/form" element={<WhyForm />} />   {/* 사유서 폼 */}
            <Route path="/preview" element={<PreviewWhy />}/> {/* 미리보기 */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

/* -------------------- why.js (Form) -------------------- */
function WhyForm() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [exportNo, setExportNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [blNo, setBlNo] = useState("");
  const [reasons, setReasons] = useState([""]);
  const [sealDataUrl, setSealDataUrl] = useState("");
  const [errors, setErrors] = useState({});

  function onSealChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSealDataUrl(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  }

  function addReason() { setReasons(prev => [...prev, ""]); }
  function updateReason(idx, v) { setReasons(prev => prev.map((x,i)=> i===idx ? v : x)); }
  function removeReason(idx) { setReasons(prev => prev.filter((_,i)=> i!==idx)); }

  function validate() {
    const next = {};
    if (!company.trim()) next.company = "업체명을 입력해 주세요.";
    const hasAnyRef = invoiceNo.trim() || blNo.trim() || exportNo.trim();
    if (!hasAnyRef) next.exportNo = "인보이스번호/BL번호/신고번호 중 하나 이상 입력해 주세요.";
    const nonEmptyReasons = reasons.map(r=>r.trim()).filter(Boolean);
    if (nonEmptyReasons.length === 0) next.reasons = "사유를 최소 1개 이상 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    navigate("/preview", {
      state: {
        company, exportNo, invoiceNo, blNo,
        reasons,
        sealDataUrl,
        createdAt: new Date().toISOString(),
      },
    });
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* 메인 입력 카드 */}
      <section id="reason-form" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(15,23,42,.06)", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>사유서 작성</h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>업체명</label>
            <input
              type="text" value={company} onChange={(e) => setCompany(e.target.value)}
              placeholder="예) 관세법인 한영"
              style={{ width: "95%", borderRadius: 12, border: "1px solid #cbd5e1", padding: "12px 14px" }}
            />
            {errors.company && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{errors.company}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, marginTop: 30  }}>참조 번호</label>
            <div style={{ fontSize: 12, color: "#6ba2f0ff", marginTop: 6 }}>
              ※ <b>인보이스번호 / BL번호 / 신고번호</b> 중 <b>하나만</b> 입력하셔도 됩니다.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, marginTop: 20, color: "#062e79ff" }}>ㅇ 인보이스 번호 (수출)</div>
                <input
                  type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)}
                  placeholder="수출 인보이스 번호를 입력해주세요"
                  style={{ width: "90%", borderRadius: 12, border: "1px solid #cbd5e1", padding: "12px 14px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, marginTop: 20, color: "#062e79ff" }}>ㅇ BL 번호 (수입)</div>
                <input
                  type="text" value={blNo} onChange={(e) => setBlNo(e.target.value)}
                  placeholder="수입 BL번호를 입력해주세요"
                  style={{ width: "90%", borderRadius: 12, border: "1px solid #cbd5e1", padding: "12px 14px" }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#062e79ff" }}>ㅇ 수출/수입신고번호</label>
            <input
              type="text" value={exportNo} onChange={(e) => setExportNo(e.target.value)}
              placeholder="수출 또는 수입신고번호를 알고있는 경우 입력해주세요"
              style={{ width: "95%", borderRadius: 12, border: "1px solid #cbd5e1", padding: "12px 14px" }}
            />
            {errors.exportNo && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{errors.exportNo}</p>}
          </div>

          {/* 사유 (동적 추가) */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, marginTop: 30  }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>사유</label>
              <button type="button" onClick={addReason}
                style={{ borderRadius: 10, border: "1px solid #cbd5e1", padding: "6px 10px", background: "#f8fafc", fontSize: 13, cursor: "pointer" }}>
                + 사유 행 추가
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {reasons.map((val, idx) => (
                <div key={idx} style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{idx + 1}번째 사유</div>
                  <textarea
                    value={val} onChange={(e) => updateReason(idx, e.target.value)} rows={5}
                    placeholder="예) 창고 패킹 과정에서 아래 품목이 누락되어 수출신고 정정이 필요합니다."
                    style={{ width: "95%", borderRadius: 12, border: "1px solid #cbd5e1", padding: "12px 14px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                  />
                  {reasons.length > 1 && (
                    <div>
                      <button type="button" onClick={() => removeReason(idx)}
                        style={{ fontSize: 12, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer" }}>
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.reasons && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{errors.reasons}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, marginTop: 30  }}>명판·직인 이미지 업로드</label>
            <input type="file" accept="image/*" onChange={onSealChange} />
            {sealDataUrl && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>미리보기</p>
                <img src={sealDataUrl} alt="seal preview" style={{ height: "auto", width: "auto", maxWidth: 80, maxHeight: 80, userSelect: "none" }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8 }}>
            <button type="submit" style={{ borderRadius: 14, background: "#0f172a", color: "#fff", padding: "10px 16px", fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,.12)", cursor: "pointer", marginTop: 30  }}>
              생성
            </button>
  <Link
    to="/preview"
    state={{ company, exportNo, invoiceNo, blNo, reasons, sealDataUrl, createdAt: new Date().toISOString() }}
    style={{
      borderRadius: 14,
      background: "#e2e8f0", // 회색 계열
      color: "#1e293b",       // 어두운 텍스트
      padding: "10px 16px",
      fontWeight: 700,
      textDecoration: "none",
      boxShadow: "0 4px 14px rgba(0,0,0,.06)",
      cursor: "pointer",
      marginTop: 30,
      display: "inline-block"
    }}
  >
    미리보기로 이동
  </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

/* -------------------- previewwhy.js (Preview + PDF) -------------------- */
function PreviewWhy() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const docRef = useRef(null);

  const company = state?.company || "";
  const exportNo = state?.exportNo || "";
  const invoiceNo = state?.invoiceNo || "";
  const blNo = state?.blNo || "";
  const reasons = Array.isArray(state?.reasons) ? state.reasons : [];
  const sealDataUrl = state?.sealDataUrl || "";
  const createdAt = state?.createdAt ? new Date(state.createdAt) : new Date();
  const todayStr = createdAt.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  async function handleDownload() {
    const target = docRef.current; if (!target) return;
    const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false, windowWidth: 842 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
    pdf.save(`사유서_${company || "무제"}.pdf`);
  }

  const cleanReasons = reasons.map(r => (r || "").trim()).filter(Boolean);
  // const lastNumber = 2 + cleanReasons.length;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>사유서 미리보기</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate(-1)} style={{ borderRadius: 10, border: "1px solid #cbd5e1", padding: "8px 12px", cursor: "pointer" }}>뒤로</button>
          <button onClick={handleDownload} style={{ borderRadius: 10, background: "#0f172a", color: "#fff", padding: "8px 12px", fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,.12)", cursor: "pointer" }}>PDF 다운로드</button>
        </div>
      </div>

      <div
        ref={docRef}
        style={{
          background: "#fff",
          width: 794,
          minHeight: 1123,
          padding: "64px 72px",
          boxSizing: "border-box",
          position: "relative",
          fontFamily: '"Pretendard Variable", Pretendard, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Arial, sans-serif',
          fontSize: 18,
          lineHeight: 1.8,
        }}
      >
        {/* 워터마크 */}
        <img
          src={watermarkImage}
          alt="watermark"
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.1,
            maxWidth: "60%", height: "auto",
            pointerEvents: "none", zIndex: 0, filter: "grayscale(20%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 56 }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.2 }}>사유서</div>
          </div>

          <table className="w-full border-t border-b"
            style={{ borderColor: "#e5e7eb", fontSize: "16px", marginBottom: "30px", width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ width: 160, background: "#f8fafc", padding: 12, fontWeight: 700 }}>
                  <strong>업체명</strong>
                </td>
                <td style={{ padding: 12 }}>{company || <span style={{ color: "#94a3b8" }}>(미입력)</span>}</td>
              </tr>
              {invoiceNo && (
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ background: "#f8fafc", padding: 12, fontWeight: 700 }}>인보이스 번호</td>
                  <td style={{ padding: 12 }}>{invoiceNo}</td>
                </tr>
              )}
              {blNo && (
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ background: "#f8fafc", padding: 12, fontWeight: 700 }}>BL 번호</td>
                  <td style={{ padding: 12 }}>{blNo}</td>
                </tr>
              )}
              {exportNo && (
                <tr>
                  <td style={{ background: "#f8fafc", padding: 12, fontWeight: 700 }}>신고번호</td>
                  <td style={{ padding: 12 }}>{exportNo}</td>
                </tr>
              )}
            </tbody>
          </table>

          <section style={{ marginTop: 8 }}>
            <p style={{ margin: 0, marginBottom: 16 }}>1. 귀 기관의 발전을 기원합니다.</p>
            {cleanReasons.length === 0
              ? <p style={{ margin: 0, marginBottom: 16, color: "#94a3b8" }}>2. (사유가 여기에 표시됩니다)</p>
              : cleanReasons.map((r, i) => (
                  <p key={i} style={{ margin: 0, marginBottom: 16, whiteSpace: "pre-wrap" }}>
                    {`${2 + i}. ${r}`}
                  </p>
                ))}
            <p style={{ margin: 0, marginBottom: 16 }}>{2 + cleanReasons.length}. 귀관의 선처 부탁드리겠습니다.</p>
            <p style={{ marginTop: 24, textAlign: "right" }}>{todayStr}</p>
          </section>
        </div>

        {/* 우하단 고정: 귀중 + 직인 */}
        <footer style={{ position: "absolute", right: 72, bottom: 72, zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ textAlign: "right", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700 }}>{company || "(업체명)"} </div>
            </div>
            {sealDataUrl && (
              <img src={sealDataUrl} alt="seal" style={{ width: "auto", height: "auto", maxWidth: 220, maxHeight: 220, pointerEvents: "none", display: "block" }}/>
            )}
          </div>
        </footer>

        {/* 하단 안내문 */}
        <div style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)", fontSize: 12, color: "#94a3b8", letterSpacing: "-0.2px" }}>
          본 사유서는 관세법인 한영에서 제공하는 양식입니다.
        </div>

        <div aria-hidden style={{ position: "absolute", inset: 16, border: "1px solid #f1f5f9", pointerEvents: "none" }} />
      </div>

      <p style={{ fontSize: 12, color: "#64748b" }}>* 미리보기 화면의 회색 여백은 PDF에는 포함되지 않습니다.</p>
    </div>
  );
}
