import React from "react";
import { useNavigate } from "react-router-dom";

/* 대시보드 카드 */
function Card({ icon, badge, title, desc, actions = [] }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 16,
      boxShadow: "0 8px 24px rgba(15,23,42,.06)",
      padding: 20,
      display: "grid",
      gap: 12,
      minHeight: 180,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eef2ff", display: "grid", placeItems: "center", fontSize: 18 }}>{icon}</div>
        {badge && <div style={{ fontSize: 12, background: "#f1f5f9", padding: "4px 8px", borderRadius: 999, color: "#334155" }}>{badge}</div>}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{title}</div>
        {desc && <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.55 }}>{desc}</div>}
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 4 }}>
        {actions.map((a, idx) => (
          <button key={idx} onClick={a.onClick}
            style={{ width: "100%", textAlign: "left", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 14px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, color: "#0f172a", cursor: "pointer" }}>
            <span>{a.label}</span><span style={{ opacity: .7 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* 상단 히어로 + 카드 */}
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2.8fr", gap: 16, alignItems: "stretch" }}>
          {/* 좌측 히어로 */}
          <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: "0 8px 24px rgba(15,23,42,.06)", padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.25, color: "#0f172a" }}>
              수출입통관<br/>업무<br/>Dashboard
            </div>
            <div style={{ marginTop: 12, fontSize: 14, color: "#475569" }}>
              바로가기를 누르면 해당 기능으로 이동합니다.
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <button style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 12, textAlign: "left", border: "1px solid #e2e8f0", fontSize: 14, cursor: "pointer" }}>
                가입자용 가이드북
              </button>
              <button style={{ background: "#fff7ed", padding: "12px 14px", borderRadius: 12, textAlign: "left", border: "1px solid #fed7aa", fontSize: 14, cursor: "pointer" }}>
                수급자용 가이드북
              </button>
            </div>
          </div>

          {/* 우측 카드 3개 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 }}>
            <Card
              icon="📝"
              badge="작성"
              title="사유서 작성하기"
              desc="업체명·인보이스/BL/신고번호 중 1개·사유 입력 및 직인 업로드"
              actions={[
                { label: "사유서 폼으로 이동", onClick: () => navigate("/form") },   // ← 폼으로 이동
              ]}
            />
            <Card
              icon="👀"
              badge="미리보기"
              title="PDF 출력 전 확인"
              desc="레이아웃·직인 위치를 확인하세요"
              actions={[
                { label: "미리보기 열기", onClick: () => navigate("/preview") },
              ]}
            />
            <Card
              icon="📄"
              badge="PDF"
              title="PDF로 저장"
              desc="A4 규격으로 고품질 변환"
              actions={[
                { label: "PDF 변환 안내", onClick: () => alert("미리보기 상단의 PDF 다운로드 버튼 이용") },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
