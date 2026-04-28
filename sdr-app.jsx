import React, { useState, useRef, useEffect } from "react";
import { Mail, Send, Sparkles, Mic, Building2, User, Search, Check, RotateCcw, Clipboard, ArrowRight, Edit3, Loader2, Zap, ChevronRight, FileText, AlertCircle, Upload, X, Plus, Wand2, Trash2 } from "lucide-react";

export default function SDRApp() {
  const [mode, setMode] = useState("cold"); // "cold" | "followup" | "voice"

  // ===== Persisted voice profile =====
  // Loaded once on mount from storage; saved on every change.
  // Lives at the top level so both Cold Outreach and Call Follow-Up can read it.
  const [voiceSamples, setVoiceSamples] = useState([]);
  const [voiceProfile, setVoiceProfile] = useState(null);
  const [voiceLoaded, setVoiceLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const samplesRes = await window.storage.get("voice:samples");
        if (samplesRes?.value) setVoiceSamples(JSON.parse(samplesRes.value));
      } catch (e) { /* no samples yet */ }
      try {
        const profileRes = await window.storage.get("voice:profile");
        if (profileRes?.value) setVoiceProfile(JSON.parse(profileRes.value));
      } catch (e) { /* no profile yet */ }
      setVoiceLoaded(true);
    })();
  }, []);

  // Persist on change (skip the first render before storage has loaded)
  useEffect(() => {
    if (!voiceLoaded) return;
    (async () => {
      try {
        await window.storage.set("voice:samples", JSON.stringify(voiceSamples));
      } catch (e) { console.warn("Could not persist voice samples", e); }
    })();
  }, [voiceSamples, voiceLoaded]);

  useEffect(() => {
    if (!voiceLoaded) return;
    (async () => {
      try {
        if (voiceProfile) {
          await window.storage.set("voice:profile", JSON.stringify(voiceProfile));
        } else {
          await window.storage.delete("voice:profile");
        }
      } catch (e) { console.warn("Could not persist voice profile", e); }
    })();
  }, [voiceProfile, voiceLoaded]);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", color: "#1a1625", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .display-font { font-family: 'Fraunces', serif; font-feature-settings: "ss01"; letter-spacing: -0.02em; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        .accent-glow { box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.30), 0 0 20px rgba(124, 58, 237, 0.12); }
        textarea, input { font-family: inherit; }
        textarea::-webkit-scrollbar, .scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        textarea::-webkit-scrollbar-track, .scroll::-webkit-scrollbar-track { background: #f4f3f8; }
        textarea::-webkit-scrollbar-thumb, .scroll::-webkit-scrollbar-thumb { background: #c4bcd6; border-radius: 4px; }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #e8e6f0", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(250,250,250,0.85)", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BuddyLogo />
            <div>
              <div className="display-font" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>
                email <em style={{ color: "#7c3aed", fontStyle: "italic" }}>buddy</em>
              </div>
              <div className="mono-font" style={{ fontSize: 9, color: "#8a8398", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>your sending sidekick</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#f4f3f8", padding: 3, borderRadius: 6, border: "1px solid #e8e6f0" }}>
            <button onClick={() => setMode("cold")} style={tabStyle(mode === "cold")}><Sparkles size={13} /> Cold Outreach</button>
            <button onClick={() => setMode("followup")} style={tabStyle(mode === "followup")}><Mic size={13} /> Call Follow-Up</button>
            <button onClick={() => setMode("voice")} style={tabStyle(mode === "voice")}>
              <Wand2 size={13} /> Voice
              {voiceProfile && <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10b981", marginLeft: 2 }} title="Voice profile active" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div style={{ borderBottom: "1px solid #e8e6f0", padding: "32px 32px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div className="mono-font" style={{ fontSize: 10, color: "#7c3aed", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
            {mode === "cold" ? "01 / Personalize cold outreach" : mode === "followup" ? "02 / Follow-up from call" : "03 / Set your voice"}
          </div>
          <h1 className="display-font" style={{ fontSize: 42, fontWeight: 500, margin: 0, lineHeight: 1, maxWidth: 720 }}>
            {mode === "cold" ? <>Stop researching. <em style={{ color: "#7c3aed", fontStyle: "italic" }}>Start sending.</em></>
              : mode === "followup" ? <>Turn calls into <em style={{ color: "#7c3aed", fontStyle: "italic" }}>replies.</em></>
              : <>Train Claude to <em style={{ color: "#7c3aed", fontStyle: "italic" }}>sound like you.</em></>}
          </h1>
          <p style={{ fontSize: 14, color: "#6b6580", margin: "12px 0 0", maxWidth: 560, lineHeight: 1.5 }}>
            {mode === "cold" ? "Drop in an Apollo export and your draft. Claude pulls company context and fills your personalization tokens. Review, send, move on."
              : mode === "followup" ? "Paste a call transcript or upload the recording. Claude drafts the follow-up tied to what was actually said. You review in seconds."
              : "Set this up once. Upload past emails, sales notes, anything you've written. Every email you generate after — cold or follow-up — sounds like you, not a robot."}
          </p>
        </div>
      </div>

      {/* Main */}
      <main style={{ padding: 32 }}>
        {mode === "cold" && <ColdOutreach voiceProfile={voiceProfile} onGoToVoice={() => setMode("voice")} />}
        {mode === "followup" && <FollowUp voiceProfile={voiceProfile} onGoToVoice={() => setMode("voice")} />}
        {mode === "voice" && (
          <VoicePage
            samples={voiceSamples}
            setSamples={setVoiceSamples}
            profile={voiceProfile}
            setProfile={setVoiceProfile}
          />
        )}
      </main>

      <footer style={{ borderTop: "1px solid #e8e6f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#a09bb0" }}>
        <div className="mono-font" style={{ letterSpacing: "0.1em" }}>EMAIL BUDDY • v0.1 • PROTOTYPE</div>
        <div style={{ display: "flex", gap: 16 }}>
          <span><kbd style={kbdStyle}>⌘</kbd><kbd style={kbdStyle}>↵</kbd> Generate</span>
          <span><kbd style={kbdStyle}>⌘</kbd><kbd style={kbdStyle}>S</kbd> Send</span>
          <span><kbd style={kbdStyle}>⌘</kbd><kbd style={kbdStyle}>K</kbd> Next prospect</span>
        </div>
      </footer>
    </div>
  );
}

function tabStyle(active) {
  return {
    background: active ? "#ffffff" : "transparent",
    color: active ? "#7c3aed" : "#6b6580",
    border: "none",
    padding: "7px 14px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.15s",
    boxShadow: active ? "0 1px 3px rgba(124, 58, 237, 0.15), 0 0 0 1px rgba(124, 58, 237, 0.08)" : "none",
  };
}

const kbdStyle = { background: "#f4f3f8", border: "1px solid #d4cfe0", borderRadius: 3, padding: "1px 5px", fontSize: 10, fontFamily: "JetBrains Mono, monospace", marginRight: 2 };

// Custom logo: a paper airplane carrying an envelope. Hand-built SVG so it
// has actual character rather than being a stock lucide icon.
function BuddyLogo() {
  return (
    <div style={{
      width: 36, height: 36,
      background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 60%, #6d28d9 100%)",
      borderRadius: 9,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25), inset 0 1px 0 rgba(255,255,255,0.55)",
      position: "relative",
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Paper airplane body */}
        <path d="M2.5 11.5 L21 3 L15 21 L11 13 L2.5 11.5 Z"
          fill="#fafafa" strokeLinejoin="round" strokeLinecap="round" stroke="#fafafa" strokeWidth="1.2" />
        {/* Inner fold line */}
        <path d="M11 13 L21 3" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        {/* Tiny smile on the airplane nose — a buddy! */}
        <circle cx="17.5" cy="6.5" r="0.7" fill="#7c3aed" />
        <circle cx="15" cy="8" r="0.7" fill="#7c3aed" />
      </svg>
      {/* Little motion swoosh */}
      <div style={{
        position: "absolute", left: -6, top: 14,
        width: 10, height: 1.5, background: "#7c3aed",
        borderRadius: 1, opacity: 0.65,
      }} />
      <div style={{
        position: "absolute", left: -3, top: 18,
        width: 6, height: 1.5, background: "#7c3aed",
        borderRadius: 1, opacity: 0.4,
      }} />
    </div>
  );
}

// ============= COLD OUTREACH FLOW =============
function ColdOutreach({ voiceProfile, onGoToVoice }) {
  const [step, setStep] = useState(1); // 1: input, 2: review queue
  const [apolloData, setApolloData] = useState("");
  const [draft, setDraft] = useState("");
  const [prospects, setProspects] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  const parseApollo = () => {
    const lines = apolloData.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const cells = line.split(",").map(c => c.trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = cells[i] || "");
      return obj;
    });
  };

  const generateAll = async () => {
    setGenerating(true);
    const parsed = parseApollo();
    const tokens = []; // skeleton mode — no tokens, just `--` markers

    // Simulate Claude doing research + writing personalized prose for each gap
    await new Promise(r => setTimeout(r, 1600));

    const generated = parsed.map(p => {
      const research = mockResearch(p);
      const filled = fillSkeleton(draft, p, research, voiceProfile);
      return {
        ...p,
        research,
        email: filled,
        subject: `Quick thought on ${p.company}`,
        status: "draft",
      };
    });
    setProspects(generated);
    setGenerating(false);
    setStep(2);
  };

  // Count `$` markers — each one is a personalization gap
  const gapCount = (draft.match(/\$/g) || []).length;

  return (
    <div className="fade-in">
      {step === 1 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Apollo input — file upload */}
          <ApolloUploadPanel apolloData={apolloData} setApolloData={setApolloData} parseApollo={parseApollo} />

          {/* Draft input — file upload */}
          <DraftUploadPanel draft={draft} setDraft={setDraft} gapCount={gapCount} />

          {/* Voice Profile status — full-width row */}
          <div style={{ gridColumn: "1 / -1" }}>
            <VoiceStatusBanner profile={voiceProfile} onGoToVoice={onGoToVoice} />
          </div>

          {/* CTA */}
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "linear-gradient(135deg, #f5f1ff 0%, #faf8ff 100%)", border: "1px solid #ddd6fe", borderRadius: 8, boxShadow: "0 1px 2px rgba(124, 58, 237, 0.04)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Ready to personalize</div>
              <div style={{ fontSize: 11, color: "#8a8398", marginTop: 4 }}>
                Claude will research each company, write the personalized parts{voiceProfile ? <>, and match <span style={{ color: "#7c3aed" }}>your voice</span></> : " (set up your voice in the Voice tab to mirror your writing style)"}.
              </div>
            </div>
            <button onClick={generateAll} disabled={generating || !draft.trim() || gapCount === 0 || !apolloData.trim()} style={primaryBtn(generating || !draft.trim() || gapCount === 0 || !apolloData.trim())}>
              {generating ? <><Loader2 size={14} className="pulse-dot" /> Generating...</> : <><Zap size={14} strokeWidth={2.5} /> Generate {apolloData.trim() ? parseApollo().length : 0} emails</>}
            </button>
          </div>
        </div>
      ) : (
        <ReviewQueue prospects={prospects} setProspects={setProspects} activeIdx={activeIdx} setActiveIdx={setActiveIdx} onBack={() => setStep(1)} />
      )}
    </div>
  );
}

function ReviewQueue({ prospects, setProspects, activeIdx, setActiveIdx, onBack }) {
  const active = prospects[activeIdx];
  const sentCount = prospects.filter(p => p.status === "sent").length;

  const updateActive = (patch) => {
    setProspects(ps => ps.map((p, i) => i === activeIdx ? { ...p, ...patch } : p));
  };

  const sendIt = () => {
    updateActive({ status: "sent" });
    setTimeout(() => {
      const nextIdx = prospects.findIndex((p, i) => i > activeIdx && p.status !== "sent");
      if (nextIdx !== -1) setActiveIdx(nextIdx);
    }, 200);
  };

  if (!active) return null;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={onBack} style={{ ...chipBtn, padding: "6px 12px" }}>← Back to inputs</button>
        <div className="mono-font" style={{ fontSize: 11, color: "#6b6580" }}>
          {sentCount} of {prospects.length} sent · {prospects.length - sentCount} remaining
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 320px", gap: 20 }}>
        {/* Queue list */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e6f0", borderRadius: 8, overflow: "hidden", maxHeight: 620, overflowY: "auto", boxShadow: "0 1px 2px rgba(26, 22, 37, 0.04), 0 1px 3px rgba(26, 22, 37, 0.03)" }} className="scroll">
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #e8e6f0", fontSize: 11, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.1em" }} className="mono-font">Queue</div>
          {prospects.map((p, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              width: "100%", textAlign: "left", padding: "12px 14px", border: "none",
              borderBottom: "1px solid #f0eef5",
              background: i === activeIdx ? "#f4f3f8" : "transparent",
              borderLeft: i === activeIdx ? "2px solid #7c3aed" : "2px solid transparent",
              cursor: "pointer", color: "#1a1625", display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                {p.status === "sent" ? <Check size={12} color="#10b981" /> : <span style={{ width: 6, height: 6, borderRadius: 3, background: "#7c3aed" }} />}
              </div>
              <div style={{ fontSize: 11, color: "#8a8398" }}>{p.title} · {p.company}</div>
            </button>
          ))}
        </div>

        {/* Email editor */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e6f0", borderRadius: 8, padding: 24, boxShadow: "0 1px 2px rgba(26, 22, 37, 0.04), 0 1px 3px rgba(26, 22, 37, 0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #e8e6f0" }}>
            <div>
              <div style={{ fontSize: 11, color: "#8a8398" }} className="mono-font">TO</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{active.name} <span style={{ color: "#8a8398", fontWeight: 400 }}>&lt;{active.email_address || `${active.name.toLowerCase().replace(" ",".")}@${active.domain}`}&gt;</span></div>
            </div>
            <span style={{ fontSize: 10, padding: "3px 8px", background: active.status === "sent" ? "#ecfdf5" : "#ddd6fe", color: active.status === "sent" ? "#10b981" : "#7c3aed", borderRadius: 3 }} className="mono-font">{active.status.toUpperCase()}</span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#8a8398", marginBottom: 4 }} className="mono-font">SUBJECT</div>
            <input
              value={active.subject}
              onChange={e => updateActive({ subject: e.target.value })}
              style={{ width: "100%", background: "transparent", border: "none", color: "#1a1625", fontSize: 16, fontWeight: 500, outline: "none", padding: "4px 0", borderBottom: "1px solid #e8e6f0" }}
            />
          </div>

          <textarea
            value={active.email}
            onChange={e => updateActive({ email: e.target.value })}
            style={{ ...textareaStyle(340), border: "1px solid #f4f3f8" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={chipBtn}><RotateCcw size={11} /> Regenerate</button>
              <button style={chipBtn}><Clipboard size={11} /> Copy</button>
            </div>
            <button onClick={sendIt} disabled={active.status === "sent"} style={primaryBtn(active.status === "sent")}>
              {active.status === "sent" ? <><Check size={14} /> Sent</> : <><Send size={14} /> Send & next</>}
            </button>
          </div>
        </div>

        {/* Research sidebar */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e6f0", borderRadius: 8, padding: 18, boxShadow: "0 1px 2px rgba(26, 22, 37, 0.04), 0 1px 3px rgba(26, 22, 37, 0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #e8e6f0" }}>
            <Search size={12} color="#7c3aed" />
            <span className="mono-font" style={{ fontSize: 10, color: "#6b6580", textTransform: "uppercase", letterSpacing: "0.1em" }}>Research · Claude</span>
          </div>

          <ResearchRow label="Company" value={active.company} />
          <ResearchRow label="Industry" value={active.industry} />
          <ResearchRow label="Headcount" value={active.employee_count} />
          <ResearchRow label="Recent signal" value={active.research?.signal} highlight />
          <ResearchRow label="Tech stack" value={active.research?.stack} />
          <ResearchRow label="Hook angle" value={active.research?.hook} highlight />

          <div style={{ marginTop: 16, padding: 12, background: "#fafafa", border: "1px dashed #ddd6fe", borderRadius: 4 }}>
            <div style={{ fontSize: 10, color: "#7c3aed", marginBottom: 6 }} className="mono-font">PERSONALIZATION USED</div>
            <div style={{ fontSize: 12, color: "#5d5470", lineHeight: 1.5, fontStyle: "italic" }}>"{active.research?.personalization_line}"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchRow({ label, value, highlight }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="mono-font" style={{ fontSize: 10, color: "#8a8398", letterSpacing: "0.05em", marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 12, color: highlight ? "#7c3aed" : "#46405a", lineHeight: 1.4 }}>{value || "—"}</div>
    </div>
  );
}

// ============= FOLLOW-UP FLOW =============
function FollowUp({ voiceProfile, onGoToVoice }) {
  const [customer, setCustomer] = useState("");
  const [company, setCompany] = useState("");
  const [recording, setRecording] = useState(""); // text transcript
  const [audioFile, setAudioFile] = useState(null); // {name, size, type}
  const [draft, setDraft] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordingMode, setRecordingMode] = useState("audio"); // audio first

  const draftGapCount = (draft.match(/\$/g) || []).length;

  // Generate is enabled when we have a customer, company, *some* call context
  // (either an audio file or a non-empty transcript), and a draft with `$` markers.
  const hasCallContext = !!audioFile || recording.trim().length > 0;
  const canGenerate = customer.trim() && company.trim() && hasCallContext && draft.trim() && draftGapCount > 0;

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    const transcriptForModel = recording.trim() || `[audio file: ${audioFile?.name}]`;
    const result = mockFollowUp(customer, company, transcriptForModel, draft, voiceProfile);
    setGenerated(result);
    setLoading(false);
  };

  return (
    <div className="fade-in">
      {/* Voice status banner above the work area */}
      <div style={{ marginBottom: 20 }}>
        <VoiceStatusBanner profile={voiceProfile} onGoToVoice={onGoToVoice} compact />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: generated ? "1fr 1.2fr" : "1fr", gap: 24 }}>
        <div>
          <Panel title="Call Context" subtitle="Who you spoke with and what about" icon={<User size={14} />}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <Field label="Customer" value={customer} onChange={setCustomer} />
              <Field label="Company" value={company} onChange={setCompany} />
            </div>

            <div style={{ display: "flex", gap: 4, background: "#f4f3f8", padding: 3, borderRadius: 5, border: "1px solid #e8e6f0", marginBottom: 12, width: "fit-content" }}>
              <button onClick={() => setRecordingMode("audio")} style={{ ...tabStyle(recordingMode === "audio"), padding: "5px 10px", fontSize: 11 }}><Mic size={11} /> Upload audio</button>
              <button onClick={() => setRecordingMode("transcript")} style={{ ...tabStyle(recordingMode === "transcript"), padding: "5px 10px", fontSize: 11 }}><FileText size={11} /> Transcript</button>
            </div>

            {recordingMode === "audio" ? (
              <AudioDropZone audioFile={audioFile} setAudioFile={setAudioFile} />
            ) : (
              <textarea
                value={recording}
                onChange={e => setRecording(e.target.value)}
                placeholder="Paste your call transcript here..."
                style={textareaStyle(220)}
              />
            )}
          </Panel>

          <div style={{ height: 16 }} />

          {/* Same skeleton-draft pattern as cold outreach */}
          <DraftUploadPanel draft={draft} setDraft={setDraft} gapCount={draftGapCount} />

          <button onClick={generate} disabled={loading || !canGenerate} style={{ ...primaryBtn(loading || !canGenerate), width: "100%", marginTop: 16, padding: "14px", justifyContent: "center", fontSize: 14 }}>
            {loading ? <><Loader2 size={14} className="pulse-dot" /> Listening to the call...</> : <><Sparkles size={14} strokeWidth={2.5} /> Draft follow-up</>}
          </button>
        </div>

        {generated && (
          <div className="fade-in">
            <div style={{ background: "#ffffff", border: "1px solid #e8e6f0", borderRadius: 8, overflow: "hidden", height: "fit-content", position: "sticky", top: 100, boxShadow: "0 1px 2px rgba(26, 22, 37, 0.04), 0 1px 3px rgba(26, 22, 37, 0.03)" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #e8e6f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="mono-font" style={{ fontSize: 10, color: "#6b6580", letterSpacing: "0.1em", textTransform: "uppercase" }}>Generated · Review & Send</div>
              <span style={{ fontSize: 10, padding: "3px 8px", background: "#ddd6fe", color: "#7c3aed", borderRadius: 3 }} className="mono-font">DRAFT</span>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #e8e6f0" }}>
                <div style={{ fontSize: 11, color: "#8a8398" }} className="mono-font">TO</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{customer} · {company}</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#8a8398", marginBottom: 4 }} className="mono-font">SUBJECT</div>
                <input
                  value={generated.subject}
                  onChange={e => setGenerated({ ...generated, subject: e.target.value })}
                  style={{ width: "100%", background: "transparent", border: "none", color: "#1a1625", fontSize: 16, fontWeight: 500, outline: "none", padding: "4px 0", borderBottom: "1px solid #e8e6f0" }}
                />
              </div>

              <textarea
                value={generated.body}
                onChange={e => setGenerated({ ...generated, body: e.target.value })}
                style={{ ...textareaStyle(360), border: "1px solid #f4f3f8" }}
              />

              {/* Call points referenced */}
              <div style={{ marginTop: 16, padding: 14, background: "#fafafa", border: "1px solid #f4f3f8", borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: "#6b6580", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }} className="mono-font">
                  <AlertCircle size={11} color="#7c3aed" /> CALL POINTS REFERENCED
                </div>
                {generated.callPoints.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: "#5d5470", lineHeight: 1.4 }}>
                    <span style={{ color: "#7c3aed", flexShrink: 0 }} className="mono-font">→</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={chipBtn} onClick={generate}><RotateCcw size={11} /> Regenerate</button>
                  <button style={chipBtn}><Clipboard size={11} /> Copy</button>
                </div>
                <button style={primaryBtn(false)}>
                  <Send size={14} /> Send to {customer.split(" ")[0] || "customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// ============= SHARED COMPONENTS =============
function Panel({ title, subtitle, icon, children }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e8e6f0",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 1px 2px rgba(26, 22, 37, 0.04), 0 1px 3px rgba(26, 22, 37, 0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #e8e6f0" }}>
        <div style={{ width: 24, height: 24, background: "#f4f3f8", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>{icon}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: "#8a8398", marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <div className="mono-font" style={{ fontSize: 10, color: "#8a8398", letterSpacing: "0.05em", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: "#fafafa", border: "1px solid #e8e6f0", borderRadius: 5,
        padding: "9px 11px", color: "#1a1625", fontSize: 13, outline: "none",
      }} />
    </div>
  );
}

const textareaStyle = (h) => ({
  width: "100%", minHeight: h, background: "#fafafa", border: "1px solid #e8e6f0",
  borderRadius: 5, padding: 12, color: "#1a1625", fontSize: 13, outline: "none",
  resize: "vertical", lineHeight: 1.55, fontFamily: "'JetBrains Mono', monospace",
});

const chipBtn = {
  background: "#f4f3f8", border: "1px solid #d4cfe0", color: "#5d5470",
  padding: "5px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 5,
};

const primaryBtn = (disabled) => ({
  background: disabled ? "#e8e6f0" : "#7c3aed",
  color: disabled ? "#8a8398" : "#ffffff",
  border: "none", padding: "10px 18px", borderRadius: 5,
  fontWeight: 600, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
  display: "flex", alignItems: "center", gap: 6,
  boxShadow: disabled ? "none" : "0 1px 3px rgba(124, 58, 237, 0.25), 0 1px 2px rgba(124, 58, 237, 0.15)",
  transition: "all 0.15s",
});

// ============= APOLLO UPLOAD PANEL =============
function ApolloUploadPanel({ apolloData, setApolloData, parseApollo }) {
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [parseError, setParseError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setParseError(null);
    const name = file.name.toLowerCase();
    if (!name.endsWith(".csv") && !name.endsWith(".tsv") && !name.endsWith(".txt")) {
      setParseError("Apollo exports should be .csv files. This file may not parse correctly.");
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // Quick sanity check — does it have a header row with name/email/company-ish columns?
      const firstLine = text.split("\n")[0]?.toLowerCase() || "";
      const looksLikeApollo = /name|email|company|title|domain/.test(firstLine);
      if (!looksLikeApollo) {
        setParseError("This file doesn't look like an Apollo export. Expected columns like name, title, company, domain.");
      }
      setApolloData(text);
      setFileName(file.name);
    };
    reader.onerror = () => setParseError("Could not read the file.");
    reader.readAsText(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const useSample = () => {
    setApolloData(SAMPLE_APOLLO);
    setFileName("sample-apollo-export.csv");
    setParseError(null);
  };

  const clear = () => {
    setApolloData("");
    setFileName(null);
    setParseError(null);
  };

  const hasData = apolloData.trim().length > 0;
  const prospects = hasData ? parseApollo() : [];

  return (
    <Panel title="Apollo Export" subtitle="Drop your CSV — Claude reads name, title, company, domain" icon={<Building2 size={14} />}>
      {!hasData ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            height: 280,
            border: `1px dashed ${dragActive ? "#7c3aed" : "#d4cfe0"}`,
            background: dragActive ? "rgba(124,58,237,0.04)" : "#fafafa",
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <div style={{ width: 44, height: 44, background: "#f4f3f8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e6f0" }}>
            <Upload size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Drop your Apollo export</div>
          <div style={{ fontSize: 12, color: "#8a8398", textAlign: "center", maxWidth: 320, lineHeight: 1.5 }}>
            Export prospects from Apollo as <span style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>.csv</span> and drop the file here
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.tsv,.txt,text/csv"
            onChange={(e) => handleFile(e.target.files?.[0])}
            style={{ display: "none" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ ...chipBtn, padding: "6px 12px" }}>
              <Upload size={11} /> Browse
            </button>
            <button onClick={(e) => { e.stopPropagation(); useSample(); }} style={{ ...chipBtn, padding: "6px 12px" }}>
              <FileText size={11} /> Use sample
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* File header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "8px 12px", background: "#fafafa", border: "1px solid #e8e6f0", borderRadius: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={13} color="#7c3aed" />
              <span style={{ fontSize: 12, fontWeight: 500 }} className="mono-font">{fileName || "apollo-export.csv"}</span>
              <span style={{ fontSize: 10, color: "#8a8398" }} className="mono-font">· {prospects.length} prospect{prospects.length === 1 ? "" : "s"}</span>
            </div>
            <button onClick={clear} style={chipBtn}>
              <X size={10} /> Clear
            </button>
          </div>

          {/* Parse error if present */}
          {parseError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 5, marginBottom: 10 }}>
              <AlertCircle size={12} color="#8b5cf6" />
              <span style={{ fontSize: 11, color: "#8b5cf6" }}>{parseError}</span>
            </div>
          )}

          {/* Prospect preview list */}
          <div style={{
            maxHeight: 210,
            overflowY: "auto",
            background: "#fafafa",
            border: "1px solid #e8e6f0",
            borderRadius: 5,
          }} className="scroll">
            {prospects.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#8a8398", fontSize: 12 }}>
                No prospects parsed from this file.
              </div>
            ) : (
              prospects.slice(0, 50).map((p, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderBottom: i === Math.min(prospects.length, 50) - 1 ? "none" : "1px solid #f0eef5",
                  fontSize: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 4,
                      background: "#f4f3f8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 600, color: "#7c3aed", flexShrink: 0,
                    }} className="mono-font">
                      {(p.name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 500, color: "#1a1625", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name || "—"}</div>
                      <div style={{ color: "#8a8398", fontSize: 11, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title || "—"}{p.title && p.company ? " · " : ""}{p.company || ""}
                      </div>
                    </div>
                  </div>
                  <div className="mono-font" style={{ fontSize: 10, color: "#a09bb0", flexShrink: 0, marginLeft: 8 }}>{p.domain || ""}</div>
                </div>
              ))
            )}
            {prospects.length > 50 && (
              <div style={{ padding: "8px 12px", fontSize: 10, color: "#8a8398", textAlign: "center", borderTop: "1px solid #f0eef5" }} className="mono-font">
                + {prospects.length - 50} more prospects
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "#8a8398" }}>
            <span className="mono-font">{prospects.length} prospect{prospects.length === 1 ? "" : "s"}</span>
            <span className="mono-font">•</span>
            <span className="mono-font">{Object.keys(prospects[0] || {}).length} fields detected</span>
          </div>
        </>
      )}
    </Panel>
  );
}

// ============= DRAFT UPLOAD PANEL =============
function DraftUploadPanel({ draft, setDraft, gapCount }) {
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setDraft(e.target.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const useSample = () => {
    setDraft(SAMPLE_DRAFT);
    setFileName("sample-draft.txt");
  };

  const clearDraft = () => {
    setDraft("");
    setFileName(null);
  };

  const hasDraft = draft.trim().length > 0;

  // Render the skeleton with `$` highlighted as orange "personalize here" pills
  const renderSkeleton = () => {
    const parts = draft.split(/(\$)/g);
    return parts.map((part, i) => {
      if (part === "$") {
        return (
          <span key={i} style={{
            display: "inline-block",
            background: "rgba(124, 58, 237, 0.10)",
            border: "1px dashed #7c3aed",
            color: "#7c3aed",
            padding: "0 6px",
            borderRadius: 3,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            margin: "0 2px",
            verticalAlign: "middle",
          }}>personalize</span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <Panel title="Email Draft" subtitle="Upload your skeleton — Claude writes the personalized parts" icon={<Edit3 size={14} />}>
      {!hasDraft ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            height: 280,
            border: `1px dashed ${dragActive ? "#7c3aed" : "#d4cfe0"}`,
            background: dragActive ? "rgba(124,58,237,0.04)" : "#fafafa",
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <div style={{ width: 44, height: 44, background: "#f4f3f8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e6f0" }}>
            <Upload size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Upload your draft</div>
          <div style={{ fontSize: 12, color: "#8a8398", textAlign: "center", maxWidth: 320, lineHeight: 1.5 }}>
            A `.txt` or `.md` file with <span style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>$</span> wherever you want Claude to write something personal
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md,.text"
            onChange={(e) => handleFile(e.target.files?.[0])}
            style={{ display: "none" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ ...chipBtn, padding: "6px 12px" }}>
              <Upload size={11} /> Browse
            </button>
            <button onClick={(e) => { e.stopPropagation(); useSample(); }} style={{ ...chipBtn, padding: "6px 12px" }}>
              <FileText size={11} /> Use sample
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* File header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "8px 12px", background: "#fafafa", border: "1px solid #e8e6f0", borderRadius: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={13} color="#7c3aed" />
              <span style={{ fontSize: 12, fontWeight: 500 }} className="mono-font">{fileName || "draft.txt"}</span>
              <span style={{ fontSize: 10, color: "#8a8398" }} className="mono-font">· {draft.length} chars</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setEditing(!editing)} style={chipBtn}>
                {editing ? <><Check size={10} /> Done</> : <><Edit3 size={10} /> Edit</>}
              </button>
              <button onClick={clearDraft} style={chipBtn}>
                <X size={10} /> Clear
              </button>
            </div>
          </div>

          {/* Skeleton preview or raw editor */}
          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={textareaStyle(220)}
            />
          ) : (
            <div style={{
              minHeight: 220,
              background: "#fafafa",
              border: "1px solid #e8e6f0",
              borderRadius: 5,
              padding: 14,
              fontSize: 13,
              lineHeight: 1.7,
              color: "#46405a",
              whiteSpace: "pre-wrap",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {renderSkeleton()}
            </div>
          )}

          {/* Gap counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11, color: "#8a8398" }}>
            <span className="mono-font">
              {gapCount === 0 ? (
                <span style={{ color: "#8b5cf6" }}>⚠ no `$` markers found — add them where you want personalization</span>
              ) : (
                <><span style={{ color: "#7c3aed" }}>{gapCount}</span> personalization gap{gapCount === 1 ? "" : "s"} detected</>
              )}
            </span>
            <span className="mono-font">.txt · .md</span>
          </div>
        </>
      )}
    </Panel>
  );
}

// ============= AUDIO DROP ZONE =============
// Used inside the Call Follow-Up panel. Real drag-and-drop, file-picker click,
// and a loaded-state chip showing filename + size + remove. Audio files stay
// client-side here — in production this is where you'd kick off transcription.
function AudioDropZone({ audioFile, setAudioFile }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const ACCEPTED = [".mp3", ".m4a", ".wav", ".mp4", ".mpeg", ".webm", ".ogg"];
  const MAX_BYTES = 100 * 1024 * 1024; // 100MB

  const handleFile = (file) => {
    if (!file) return;
    setError(null);
    const lower = file.name.toLowerCase();
    const isAccepted = ACCEPTED.some(ext => lower.endsWith(ext)) || file.type?.startsWith("audio/") || file.type?.startsWith("video/");
    if (!isAccepted) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED.join(", ")}`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is 100MB.`);
      return;
    }
    setAudioFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (audioFile) {
    return (
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "#fafafa",
          border: "1px solid #a7f3d0",
          borderLeft: "2px solid #10b981",
          borderRadius: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "rgba(16,185,129,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#10b981", flexShrink: 0,
            }}>
              <Mic size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="mono-font">
                {audioFile.name}
              </div>
              <div style={{ fontSize: 11, color: "#8a8398", marginTop: 2 }} className="mono-font">
                {formatSize(audioFile.size)} · ready to transcribe
              </div>
            </div>
          </div>
          <button onClick={() => setAudioFile(null)} style={chipBtn}>
            <X size={11} /> Remove
          </button>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#8a8398" }} className="mono-font">
          Claude will transcribe this when you draft the follow-up.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          height: 220,
          border: `1px dashed ${dragActive ? "#7c3aed" : "#d4cfe0"}`,
          background: dragActive ? "rgba(124,58,237,0.04)" : "#fafafa",
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <div style={{ width: 44, height: 44, background: "#f4f3f8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e6f0" }}>
          <Mic size={20} color="#7c3aed" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Drop a call recording</div>
        <div style={{ fontSize: 11, color: "#8a8398" }} className="mono-font">.mp3 · .m4a · .wav up to 100MB</div>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,video/*,.mp3,.m4a,.wav,.mp4,.webm,.ogg"
          onChange={(e) => handleFile(e.target.files?.[0])}
          style={{ display: "none" }}
        />
        <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ ...chipBtn, marginTop: 4, padding: "6px 12px" }}>
          <Upload size={11} /> Browse files
        </button>
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 5, marginTop: 10 }}>
          <AlertCircle size={12} color="#8b5cf6" />
          <span style={{ fontSize: 11, color: "#8b5cf6" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

// ============= VOICE PAGE (standalone tab) =============
function VoicePage({ samples, setSamples, profile, setProfile }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteName, setPasteName] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSamples(prev => [...prev, { name: file.name, content: e.target.result, id: Date.now() + Math.random() }]);
      };
      reader.readAsText(file);
    });
  };

  const addPaste = () => {
    if (!pasteText.trim()) return;
    setSamples(prev => [...prev, {
      name: pasteName.trim() || `pasted-sample-${prev.length + 1}.txt`,
      content: pasteText,
      id: Date.now(),
    }]);
    setPasteText("");
    setPasteName("");
    setPasteMode(false);
  };

  const removeSample = (id) => {
    setSamples(prev => prev.filter(s => s.id !== id));
    if (samples.length === 1) setProfile(null); // last sample removed
  };

  const analyze = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1300));
    setProfile(mockVoiceAnalysis(samples));
    setAnalyzing(false);
  };

  const totalChars = samples.reduce((sum, s) => sum + s.content.length, 0);

  return (
    <Panel title="Your Voice" subtitle="Set this up once. Applied to every cold email and follow-up you generate — saved automatically." icon={<Wand2 size={14} />}>
      <div style={{ display: "grid", gridTemplateColumns: profile ? "1.1fr 1fr" : "1fr", gap: 20 }}>
        {/* LEFT: sample uploader */}
        <div>
          {samples.length === 0 && !pasteMode ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              style={{
                height: 180,
                border: "1px dashed #d4cfe0",
                background: "#fafafa",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div style={{ width: 38, height: 38, background: "#f4f3f8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e6f0" }}>
                <Wand2 size={17} color="#7c3aed" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Drop in writing samples</div>
              <div style={{ fontSize: 11, color: "#8a8398", textAlign: "center", maxWidth: 380, lineHeight: 1.5 }}>
                Past sent emails, sales notes, LinkedIn DMs — anything you've written. The more authentic, the better. 3+ samples recommended.
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} style={{ ...chipBtn, padding: "5px 10px" }}>
                  <Upload size={11} /> Upload files
                </button>
                <button onClick={(e) => { e.stopPropagation(); setPasteMode(true); }} style={{ ...chipBtn, padding: "5px 10px" }}>
                  <Plus size={11} /> Paste sample
                </button>
              </div>
              <input ref={inputRef} type="file" accept=".txt,.md,.eml,.text" multiple onChange={(e) => handleFiles(e.target.files)} style={{ display: "none" }} />
            </div>
          ) : pasteMode ? (
            <div style={{ background: "#fafafa", border: "1px solid #e8e6f0", borderRadius: 6, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>Paste a writing sample</span>
                <button onClick={() => { setPasteMode(false); setPasteText(""); setPasteName(""); }} style={chipBtn}><X size={10} /> Cancel</button>
              </div>
              <input
                placeholder="Label (e.g. 'follow-up email to Acme')"
                value={pasteName}
                onChange={(e) => setPasteName(e.target.value)}
                style={{ width: "100%", background: "#f4f3f8", border: "1px solid #e8e6f0", borderRadius: 4, padding: "7px 10px", color: "#1a1625", fontSize: 12, outline: "none", marginBottom: 8 }}
              />
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste an email or note you've written..."
                style={{ ...textareaStyle(140), fontSize: 12 }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button onClick={addPaste} disabled={!pasteText.trim()} style={primaryBtn(!pasteText.trim())}>
                  <Plus size={12} /> Add sample
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 240, overflowY: "auto" }} className="scroll">
                {samples.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#fafafa", border: "1px solid #e8e6f0", borderRadius: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                      <FileText size={13} color="#7c3aed" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="mono-font">{s.name}</div>
                        <div style={{ fontSize: 10, color: "#8a8398", marginTop: 2 }} className="mono-font">{s.content.length} chars · ~{Math.ceil(s.content.split(/\s+/).length)} words</div>
                      </div>
                    </div>
                    <button onClick={() => removeSample(s.id)} style={{ ...chipBtn, padding: "4px 6px" }}>
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => inputRef.current?.click()} style={chipBtn}><Upload size={11} /> Add files</button>
                  <button onClick={() => setPasteMode(true)} style={chipBtn}><Plus size={11} /> Paste</button>
                  <input ref={inputRef} type="file" accept=".txt,.md,.eml,.text" multiple onChange={(e) => handleFiles(e.target.files)} style={{ display: "none" }} />
                </div>
                <div className="mono-font" style={{ fontSize: 10, color: "#8a8398" }}>
                  {samples.length} sample{samples.length === 1 ? "" : "s"} · {totalChars.toLocaleString()} chars
                </div>
              </div>

              <button onClick={analyze} disabled={analyzing || samples.length === 0} style={{ ...primaryBtn(analyzing || samples.length === 0), width: "100%", marginTop: 12, justifyContent: "center" }}>
                {analyzing ? <><Loader2 size={13} className="pulse-dot" /> Reading your writing...</> : profile ? <><RotateCcw size={13} /> Re-analyze voice</> : <><Wand2 size={13} strokeWidth={2.5} /> Build voice profile</>}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: voice profile observations */}
        {profile && (
          <div className="fade-in" style={{ background: "#fafafa", border: "1px solid #e8e6f0", borderRadius: 6, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #e8e6f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Wand2 size={12} color="#7c3aed" />
                <span className="mono-font" style={{ fontSize: 10, color: "#6b6580", textTransform: "uppercase", letterSpacing: "0.1em" }}>Voice Profile</span>
              </div>
              <span style={{ fontSize: 10, padding: "2px 7px", background: "#ecfdf5", color: "#10b981", borderRadius: 3 }} className="mono-font">ACTIVE</span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="mono-font" style={{ fontSize: 10, color: "#8a8398", marginBottom: 4 }}>OVERALL TONE</div>
              <div style={{ fontSize: 13, color: "#1a1625", lineHeight: 1.5 }}>{profile.tone}</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="mono-font" style={{ fontSize: 10, color: "#8a8398", marginBottom: 6 }}>OBSERVATIONS</div>
              {profile.observations.map((o, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: "#52495f", lineHeight: 1.45 }}>
                  <span style={{ color: "#7c3aed", flexShrink: 0 }} className="mono-font">·</span>
                  <span>{o}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 10, background: "#ffffff", borderRadius: 4, border: "1px solid #f0eef5" }}>
              <ProfileChip label="Avg sentence" value={profile.avgSentence} />
              <ProfileChip label="Sign-off" value={profile.signoff} />
              <ProfileChip label="Greeting" value={profile.greeting} />
              <ProfileChip label="Quirks" value={profile.quirks} />
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

function ProfileChip({ label, value }) {
  return (
    <div>
      <div className="mono-font" style={{ fontSize: 9, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#3d3650" }}>{value}</div>
    </div>
  );
}

// Compact banner shown inside Cold Outreach and Follow-Up so the user always
// knows whether their voice profile is active, with a quick link to manage it.
function VoiceStatusBanner({ profile, onGoToVoice, compact }) {
  const active = !!profile;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: compact ? "10px 16px" : "14px 20px",
      background: active ? "linear-gradient(90deg, rgba(16,185,129,0.06), transparent 60%), #ffffff" : "#ffffff",
      border: `1px solid ${active ? "#a7f3d0" : "#e8e6f0"}`,
      borderLeft: `2px solid ${active ? "#10b981" : "#7c3aed"}`,
      borderRadius: 6,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: active ? "rgba(16,185,129,0.10)" : "rgba(124,58,237,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: active ? "#10b981" : "#7c3aed",
        }}>
          <Wand2 size={14} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            {active ? <>Voice profile active</> : <>No voice profile yet</>}
            {active && <span className="mono-font" style={{ fontSize: 10, color: "#8a8398", fontWeight: 400 }}>· {profile.style}</span>}
          </div>
          <div style={{ fontSize: 11, color: "#6b6580", marginTop: 2 }}>
            {active
              ? <>Generated emails will sound like you. <span style={{ color: "#8a8398" }}>{profile.tone}</span></>
              : <>Generated emails will use Claude's default voice. Set up once and it applies to every email after.</>}
          </div>
        </div>
      </div>
      <button onClick={onGoToVoice} style={{ ...chipBtn, padding: "6px 12px" }}>
        {active ? <><Edit3 size={11} /> Manage</> : <><Plus size={11} /> Set up voice</>}
      </button>
    </div>
  );
}

// ============= MOCK DATA & HELPERS =============
const SAMPLE_APOLLO = `name,title,company,domain,industry,employee_count
Marcus Webb,VP Engineering,Northwind Logistics,northwind.io,Logistics,420
Priya Shah,Director of Sales Ops,Brightline Health,brightline.health,Healthcare SaaS,180
Daniel Ortega,Head of Growth,Foundry Robotics,foundry.so,Industrial Automation,85
Lena Kowalski,COO,Meridian Capital,meridiancap.com,Financial Services,250`;

const SAMPLE_DRAFT = `Hi $,

I am reaching out with $, I was hoping to tell you a little bit about our product. We know that you might $, $,

We are Dialtone, we help SDR teams cut research time so reps spend more hours on the phone. We integrate with Apollo, Outreach, and HubSpot out of the box.

$

* Leo`;

function mockResearch(p) {
  const map = {
    "Northwind Logistics": {
      signal: "Just opened a Series B round — $32M led by Insight (announced 6 weeks ago)",
      stack: "Salesforce, Snowflake, Outreach, custom warehouse mgmt",
      hook: "Series B logistics co at 400+ headcount = classic 'sales process is held together with spreadsheets' moment",
      personalization_line: "just closed a Series B and are scaling the GTM org",
      signal_short: "the Series B announcement last month",
      hook_short: "scaling Northwind's GTM motion post-Series B",
      pain: "be feeling the strain of ramping new reps fast enough to deploy that capital",
      role_specific: "as the VP of Engineering, you're probably also fielding more 'where is this lead' questions from sales than you'd like",
      closing: "Either way — congrats on the round. Open to a 15-min look at what Flexport's GTM team did post-Series B?",
    },
    "Brightline Health": {
      signal: "New SOC2 Type II announced last month; hiring 15 sales roles on LinkedIn",
      stack: "HubSpot, Mixpanel, Zendesk",
      hook: "Healthcare SaaS scaling sales — compliance + speed-to-deal tension is real",
      personalization_line: "are hiring aggressively in sales right after the SOC2 milestone",
      signal_short: "the SOC2 Type II announcement and the 15 sales roles open on LinkedIn",
      hook_short: "ramping the new Brightline sales team",
      pain: "be hitting that point where every new AE you hire spends their first 30 days just figuring out what's already in the CRM",
      role_specific: "and as Director of Sales Ops you're the one getting pinged about it",
      closing: "Worth a 15 min look at what Komodo Health did when they were in the same spot?",
    },
    "Foundry Robotics": {
      signal: "Featured in TechCrunch piece on warehouse automation 2 weeks ago",
      stack: "Salesforce, Outreach, Pendo",
      hook: "Industrial automation co at 85 ppl scaling from founder-led to repeatable sales",
      personalization_line: "just got the TechCrunch feature on warehouse automation",
      signal_short: "the TechCrunch feature a couple weeks back",
      hook_short: "Foundry's shift from founder-led to repeatable sales",
      pain: "be at the moment where inbound is finally flowing but the team isn't sized to chase all of it",
      role_specific: "and as Head of Growth, that gap is yours to close",
      closing: "Open to comparing notes on how Bright Machines handled the same transition?",
    },
    "Meridian Capital": {
      signal: "Recently appointed new CRO (Jane Mackenzie, ex-BlackRock) — 3 weeks ago",
      stack: "Salesforce Financial Services Cloud, Tableau",
      hook: "New CRO at FS firm — first 90 days they want to show pipeline visibility wins",
      personalization_line: "just brought on a new CRO from BlackRock",
      signal_short: "Jane Mackenzie joining as CRO",
      hook_short: "the new CRO's first 90 days at Meridian",
      pain: "be getting asked for pipeline visibility numbers that aren't easy to pull cleanly today",
      role_specific: "and as COO, you're probably the one fielding those asks before they hit IT",
      closing: "Happy to share what AlphaSense's ops team built for their incoming CRO — 15 min?",
    },
  };
  return map[p.company] || {
    signal: "Recent hiring activity suggests GTM expansion",
    stack: "Salesforce, modern data stack",
    hook: "Growing team = process pain",
    personalization_line: "are scaling the team based on recent hiring",
    signal_short: "the recent hiring push",
    hook_short: `${p.company}'s GTM expansion`,
    pain: "be hitting the point where rep ramp time is starting to bite",
    role_specific: `and as ${p.title}, that's landing on your desk`,
    closing: "Worth a 15 min conversation?",
  };
}

// Skeleton-aware fill: walks through the draft, replacing each `--` gap with
// research-driven prose appropriate to its position (greeting, opener, pain,
// company specifics, closing). Fixed copy ("we are X, we do Y") stays verbatim.
function fillSkeleton(draft, p, research, voiceProfile) {
  const firstName = p.name.split(" ")[0];
  const lines = draft.split("\n");
  const totalGaps = (draft.match(/\$/g) || []).length;
  let gapIdx = 0;

  const fragments = buildFragments(p, research, totalGaps, voiceProfile);

  return lines.map(line => {
    if (!line.includes("$")) return line;
    return line.replace(/\$/g, () => {
      const replacement = fragments[gapIdx] || "";
      gapIdx++;
      return replacement;
    });
  }).join("\n");
}

// Decide what each `$` gap becomes based on its position in the draft.
// Position 0 = greeting (first name)
// Position 1 = "reaching out with [reason]"
// Positions 2-3 = pain point + company specifics
// Last position = personalized closing
function buildFragments(p, research, totalGaps, voiceProfile) {
  const firstName = p.name.split(" ")[0];
  const fragments = [];
  const style = voiceProfile?.style || "neutral";

  // Voice-flavored phrasings for the opener
  const opener = (signal) => {
    if (style === "punchy") return `caught wind of ${signal} — wanted to reach out`;
    if (style === "warm") return `I noticed ${signal} and wanted to drop you a quick note`;
    if (style === "formal") return `I came across ${signal} and thought it worth reaching out`;
    return `a quick note after seeing ${signal}`;
  };

  // Voice-flavored "specifics" connector
  const specifics = (role) => {
    if (style === "punchy") return role.replace(/^(and )?as /, "— as ");
    if (style === "warm") return `and I'd guess that ${role.replace(/^(and )?as /, "as ")}`;
    return role;
  };

  // Slot 0: greeting name (untouched by voice — it's a name)
  fragments.push(firstName);

  if (totalGaps >= 4) {
    fragments.push(opener(research.signal_short));
    fragments.push(research.pain);
    fragments.push(specifics(research.role_specific));
  } else if (totalGaps === 3) {
    fragments.push(opener(research.signal_short));
    fragments.push(`${research.pain} — especially given ${research.role_specific}`);
  } else if (totalGaps === 2) {
    fragments.push(opener(research.hook_short));
  }

  // Last slot: personalized closing — flavored by voice
  if (totalGaps >= 2) {
    let close = research.closing;
    if (style === "punchy") close = close.replace(/Worth a /, "Worth ").replace(/Open to /, "Up for ");
    if (style === "warm") close = close.replace(/Worth a /, "Would love to do a ").replace(/Open to /, "Would you be open to ");
    fragments.push(close);
  }

  return fragments;
}

// Mock voice analysis — in production, Claude reads the samples and returns
// a structured profile that gets passed back into the generation prompt.
function mockVoiceAnalysis(samples) {
  const allText = samples.map(s => s.content).join("\n\n");
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWords = sentences.length ? Math.round(wordCount / sentences.length) : 0;

  // Crude heuristics for the demo. Real version: send samples to Claude.
  const exclaimRatio = (allText.match(/!/g) || []).length / Math.max(1, sentences.length);
  const dashRatio = (allText.match(/—|--/g) || []).length / Math.max(1, sentences.length);
  const lower = allText.toLowerCase();

  let style = "neutral";
  if (avgWords < 10 || dashRatio > 0.3) style = "punchy";
  else if (exclaimRatio > 0.15 || lower.includes("appreciate") || lower.includes("hope you")) style = "warm";
  else if (avgWords > 22) style = "formal";

  // Detect signoff
  const signoffMatch = allText.match(/\n(Best|Thanks|Cheers|Talk soon|—|Regards)[,!]?\s*\n?[A-Z][a-z]+/);
  const signoff = signoffMatch ? signoffMatch[1] : (style === "warm" ? "Thanks" : style === "punchy" ? "—" : "Best");

  // Detect greeting
  const greetingMatch = allText.match(/(Hey|Hi|Hello|Good morning|Quick note)/);
  const greeting = greetingMatch ? greetingMatch[1] : "Hi";

  const observations = [];
  if (avgWords < 12) observations.push("Sentences run short and direct — rarely more than one clause.");
  else if (avgWords > 22) observations.push("Sentences are fuller and more layered, with subordinate clauses.");
  else observations.push("Sentence length is conversational, mid-range — not clipped, not long-winded.");

  if (dashRatio > 0.25) observations.push("Heavy use of em-dashes for rhythm and parenthetical asides.");
  if (exclaimRatio > 0.1) observations.push("Light use of exclamation points to convey warmth.");
  if (lower.includes("honestly") || lower.includes("frankly")) observations.push("Uses 'honestly' / 'frankly' to soften direct statements.");
  if (lower.includes("worth a")) observations.push("Frames asks as 'worth a [look/conversation]' rather than 'can we schedule'.");
  if ((allText.match(/\bi\b/gi) || []).length / Math.max(1, wordCount) > 0.04) observations.push("First-person heavy — speaks from personal POV, not company.");
  if (lower.includes("?")) observations.push("Closes with questions rather than statements when making asks.");
  if (observations.length < 3) observations.push("Mixes specifics with conversational phrasing — not boilerplate.");

  const tone = {
    punchy: "Direct, fast-moving. Short sentences. Cuts straight to the value. No throat-clearing.",
    warm: "Conversational and personable. Acknowledges the reader before getting to the ask. Optimistic register.",
    formal: "Polished and considered. Full sentences, proper transitions. Reads like a written letter, not a quick DM.",
    neutral: "Balanced and clear. Neither overly casual nor stiff. Lets the specifics carry the message.",
  }[style];

  const quirks = {
    punchy: "Em-dashes, sentence fragments",
    warm: "'Hope you...', soft openers",
    formal: "Complete sentences, fuller transitions",
    neutral: "Plain phrasing, low ornament",
  }[style];

  return {
    style,
    tone,
    observations,
    avgSentence: `${avgWords} words`,
    signoff,
    greeting,
    quirks,
  };
}

function mockFollowUp(customer, company, transcript, draft, voiceProfile) {
  const firstName = customer.split(" ")[0];
  const style = voiceProfile?.style || "neutral";
  const greeting = voiceProfile?.greeting || "Hi";
  const signoff = voiceProfile?.signoff || "Best";
  const senderName = "Alex"; // would come from user profile in production

  // Voice-shaped opener and bodies
  const openerByStyle = {
    punchy: `Quick recap from today:`,
    warm: `Thanks again for the time today — really enjoyed the conversation. Quick recap and what I'm sending over:`,
    formal: `Thank you for taking the time to speak today. Below is a brief recap along with the materials I committed to sending:`,
    neutral: `Thanks again for the time today. Quick recap and what I'm sending over:`,
  };

  // Bullet-style for punchy, prose for others
  const isPunchy = style === "punchy";

  const body = isPunchy
    ? `${greeting} ${firstName},

${openerByStyle[style]}

— Timeline: ~3 weeks to live on HubSpot (faster than the standard 4-6). Need 30 min with your HubSpot admin to confirm field mapping.
— ROI model: attached. Built for 12 reps. Conservative case ~$180k/yr recovered, payback month 4.
— Gong: native. Two-way activity sync.
— Thursday locked. Calendar hold coming for 11am ET.

${signoff},
${senderName}`
    : `${greeting} ${firstName},

${openerByStyle[style]}

Implementation timeline: based on HubSpot + custom field structure, we're looking at ~3 weeks to live (faster than the typical 4-6 because you're not on Salesforce). I'll need a 30-min session with whoever owns your HubSpot config to confirm the field mapping.

ROI model: attached — I built it for a team of 12 reps at your stage. The conservative case shows ~$180k/yr in recovered rep time, payback in month 4.

Gong: yes, native integration. Activity logs flow both directions, no Zapier in the middle.

Locking Thursday for the next call — I'll send a calendar hold for 11am ET. Bring your HubSpot admin if possible so we can pressure-test the timeline.

${signoff},
${senderName}`;

  return {
    subject: `Recap + ROI model — ${company}`,
    body,
    callPoints: [
      "Sarah flagged $4k/mo as high for team size — ROI model addresses this directly",
      "She's on HubSpot, not Salesforce — adjusted timeline from 4-6 to ~3 weeks",
      "Gong integration confirmed natively — no caveat needed",
      "Thursday reconvene committed verbally at 02:05 — calendar hold needed",
      "Custom field structure flagged as risk — proposed 30-min session to de-risk",
    ],
  };
}
