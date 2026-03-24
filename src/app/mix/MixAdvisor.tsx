"use client";

import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are an expert audio engineer and mixing/mastering consultant with 20+ years of experience.
When a user shares a screenshot of their DAW, plugin, or audio analysis tool, you will:
1. Identify what you see (DAW, plugins, EQ curves, compressor settings, waveforms, meters, etc.)
2. Give specific, actionable mixing/mastering advice based on the visual
3. Point out potential issues (clipping, frequency masking, dynamic problems, phase issues, etc.)
4. Suggest concrete improvements with specific values when possible
5. Keep your tone professional but approachable — like a senior engineer coaching a junior

Always respond in the same language the user writes in.`;

type Role = "user" | "assistant";
interface Message {
  role: Role;
  text: string;
  image?: string;
  imgData?: { base64: string; type: string } | null;
}

export default function MixAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ base64: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      setImageData({ base64: result.split(",")[1], type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSend = async () => {
    if (!input.trim() && !imageData) return;
    setLoading(true);

    const userMsg: Message = { role: "user", text: input, image: image ?? undefined, imgData: imageData };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    const currentImageData = imageData;
    setImage(null);
    setImageData(null);

    const apiMessages = newMessages.map((m, idx) => {
      const isLast = idx === newMessages.length - 1;
      const content: object[] = [];
      const imgSrc = isLast ? currentImageData : m.imgData;
      if (imgSrc) content.push({ type: "image", source: { type: "base64", media_type: imgSrc.type, data: imgSrc.base64 } });
      const txt = isLast ? (input.trim() || "이 스크린샷을 분석해줘.") : (m.text || "이 스크린샷을 분석해줘.");
      content.push({ type: "text", text: txt });
      return { role: m.role, content };
    });

    try {
      const res = await fetch("/api/mix-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages: apiMessages }),
      });
      const data = await res.json();
      const reply = data.content?.map((b: { text?: string }) => b.text || "").join("") || "응답 없음";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ 오류가 발생했습니다. 다시 시도해주세요." }]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const getQAPairs = () => {
    const pairs: { q: Message; a: Message | null }[] = [];
    let i = 0;
    while (i < messages.length) {
      if (messages[i].role === "user") {
        const a = messages[i + 1]?.role === "assistant" ? messages[i + 1] : null;
        pairs.push({ q: messages[i], a });
        i += a ? 2 : 1;
      } else i++;
    }
    return pairs;
  };

  const downloadHTML = () => {
    const pairs = getQAPairs();
    const now = new Date().toLocaleString("ko-KR");
    let qaSections = "";
    pairs.forEach((p, i) => {
      qaSections += `<div class="qa-block">
        <div class="question"><span class="label">Q${i + 1}</span><div class="content">
          <p>${p.q.text || "<em>(스크린샷 첨부)</em>"}</p>
          ${p.q.image ? `<img src="${p.q.image}" alt="screenshot" style="max-width:100%;border-radius:8px;margin-top:10px;" />` : ""}
        </div></div>
        ${p.a ? `<div class="answer"><span class="label ai">AI</span><div class="content"><p>${p.a.text.replace(/\n/g, "<br/>")}</p></div></div>` : ""}
      </div>`;
    });
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>Mix & Master Session Report</title>
    <style>body{font-family:sans-serif;background:#0f0f13;color:#e0e0f0;max-width:780px;margin:0 auto;padding:40px 24px;}
    h1{font-size:22px;border-bottom:2px solid #2563eb;padding-bottom:12px;}.meta{color:#6b6b8a;font-size:12px;margin-bottom:32px;}
    .qa-block{margin-bottom:32px;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden;}
    .question,.answer{display:flex;gap:16px;padding:18px 20px;}.question{background:#12121a;border-bottom:1px solid #1e1e2e;}.answer{background:#0f0f13;}
    .label{min-width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;background:#1e1e2e;color:#7c3aed;flex-shrink:0;}
    .label.ai{background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;}.content p{margin:0;line-height:1.7;font-size:14px;}</style>
    </head><body><h1>🎚️ Mix & Master AI Advisor — 세션 리포트</h1><p class="meta">생성일시: ${now}</p>${qaSections}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `mix-session-${Date.now()}.html`; a.click();
    URL.revokeObjectURL(url); setShowExport(false);
  };

  const downloadMD = () => {
    const pairs = getQAPairs();
    const now = new Date().toLocaleString("ko-KR");
    let md = `# 🎚️ Mix & Master AI Advisor — 세션 리포트\n\n> 생성일시: ${now}\n\n---\n\n`;
    pairs.forEach((p, i) => {
      md += `## Q${i + 1}. ${p.q.text || "(스크린샷 첨부)"}\n\n${p.q.image ? "> 📸 스크린샷 첨부됨\n\n" : ""}`;
      if (p.a) md += `### 💡 AI 조언\n\n${p.a.text}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `mix-session-${Date.now()}.md`; a.click();
    URL.revokeObjectURL(url); setShowExport(false);
  };

  const downloadTXT = () => {
    const pairs = getQAPairs();
    const now = new Date().toLocaleString("ko-KR");
    let txt = `Mix & Master AI Advisor — 세션 리포트\n생성일시: ${now}\n${"=".repeat(50)}\n\n`;
    pairs.forEach((p, i) => {
      txt += `[Q${i + 1}] ${p.q.text || "(스크린샷 첨부)"}\n${p.q.image ? "     📸 스크린샷 첨부됨\n" : ""}`;
      if (p.a) txt += `\n[AI 조언]\n${p.a.text}\n\n${"-".repeat(50)}\n\n`;
    });
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `mix-session-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url); setShowExport(false);
  };

  const hasSessions = messages.some((m) => m.role === "assistant");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0f0f13", color: "#e8e8f0", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#12121a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🎚</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Mix & Master AI Advisor</div>
            <div style={{ fontSize: 11, color: "#6b6b8a" }}>스크린샷을 첨부하면 AI가 분석합니다</div>
          </div>
        </div>
        {hasSessions && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowExport(!showExport)} style={{ background: "#7c3aed22", border: "1px solid #2563eb55", borderRadius: 9, padding: "7px 14px", color: "#a78bfa", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
              📥 세션 저장
            </button>
            {showExport && (
              <div style={{ position: "absolute", right: 0, top: 42, background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 12, padding: 8, zIndex: 100, minWidth: 180, boxShadow: "0 8px 32px #00000088" }}>
                {[
                  { label: "📄 HTML 문서", sub: "이미지 포함, 스타일 유지", fn: downloadHTML },
                  { label: "📝 Markdown (.md)", sub: "Notion·Obsidian 호환", fn: downloadMD },
                  { label: "🗒 텍스트 (.txt)", sub: "범용 plain text", fn: downloadTXT },
                ].map((opt) => (
                  <button key={opt.label} onClick={opt.fn}
                    style={{ width: "100%", background: "none", border: "none", padding: "10px 14px", cursor: "pointer", textAlign: "left", borderRadius: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#2a2a3e")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    <div style={{ color: "#e0e0f0", fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ color: "#6b6b8a", fontSize: 11 }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "15vh", color: "#3d3d5c" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎛️</div>
            <div style={{ fontSize: 15, marginBottom: 6, color: "#5a5a7a" }}>DAW 스크린샷을 첨부해보세요</div>
            <div style={{ fontSize: 12 }}>EQ, 컴프레서, 미터, 웨이브폼 등 무엇이든 OK</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🎚</div>
            )}
            <div style={{ maxWidth: "72%", background: m.role === "user" ? "#2563eb18" : "#1a1a28", border: `1px solid ${m.role === "user" ? "#2563eb44" : "#2a2a3e"}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px" }}>
              {m.image && <img src={m.image} alt="screenshot" style={{ width: "100%", borderRadius: 8, marginBottom: m.text ? 10 : 0 }} />}
              {m.text && <div style={{ fontSize: 13.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.text}</div>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎚</div>
            <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5 }}>
              {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${j*0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Image preview */}
      {image && (
        <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <img src={image} alt="preview" style={{ height: 60, borderRadius: 8, border: "1px solid #2a2a3e" }} />
            <button onClick={() => { setImage(null); setImageData(null); }} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", border: "none", color: "#fff", fontSize: 11, cursor: "pointer" }}>✕</button>
          </div>
          <span style={{ fontSize: 12, color: "#6b6b8a" }}>스크린샷 첨부됨</span>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 20px 20px", background: "#12121a", borderTop: "1px solid #1e1e2e" }} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 14, padding: "10px 12px" }}>
          <button onClick={() => fileRef.current?.click()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b6b8a", padding: "2px 4px", flexShrink: 0 }}>📎</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="질문을 입력하거나 스크린샷을 첨부하세요... (Shift+Enter 줄바꿈)"
            rows={1} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e8e8f0", fontSize: 13.5, resize: "none", lineHeight: 1.6, maxHeight: 120, overflowY: "auto", fontFamily: "inherit" }} />
          <button onClick={handleSend} disabled={loading || (!input.trim() && !imageData)}
            style={{ background: loading || (!input.trim() && !imageData) ? "#2a2a3e" : "linear-gradient(135deg,#7c3aed,#2563eb)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>↑</button>
        </div>
        <div style={{ fontSize: 11, color: "#3d3d5c", textAlign: "center", marginTop: 8 }}>이미지를 드래그 앤 드롭으로도 첨부 가능</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}