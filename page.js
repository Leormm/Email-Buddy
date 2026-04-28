'use client';

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
        const samplesRes = await window.storage?.get("voice:samples");
        if (samplesRes?.value) setVoiceSamples(JSON.parse(samplesRes.value));
      } catch (e) { /* no samples yet */ }
      try {
        const profileRes = await window.storage?.get("voice:profile");
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
        await window.storage?.set("voice:samples", JSON.stringify(voiceSamples));
      } catch (e) { console.warn("Could not persist voice samples", e); }
    })();
  }, [voiceSamples, voiceLoaded]);

  useEffect(() => {
    if (!voiceLoaded) return;
    (async () => {
      try {
        if (voiceProfile) {
          await window.storage?.set("voice:profile", JSON.stringify(voiceProfile));
        } else {
          await window.storage?.delete("voice:profile");
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

function kbdStyle() {
  return {
    display: "inline-block",
    padding: "2px 6px",
    background: "#f4f3f8",
    border: "1px solid #ddd9e6",
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 500,
    marginRight: 2,
  };
}

function BuddyLogo() {
  return (
    <div style={{
      width: 32,
      height: 32,
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    }}>
      ✉
    </div>
  );
}

function ColdOutreach({ voiceProfile, onGoToVoice }) {
  const [prospects, setProspects] = useState([]);
  const [draftText, setDraftText] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = mockColdOutreach(prospects[0] || {}, draftText, voiceProfile);
      setGeneratedEmail(generated);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Your Draft</h3>
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Paste your email draft here..."
            style={{
              width: "100%",
              minHeight: 200,
              padding: 12,
              border: "1px solid #e8e6f0",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader2 size={14} /> : <Sparkles size={14} />}
            Generate
          </button>
        </div>
        {!voiceProfile && (
          <div style={{ background: "#f0f4ff", padding: 16, borderRadius: 8, border: "1px solid #dce4ff" }}>
            <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
              <AlertCircle size={16} style={{ color: "#4f46e5", flexShrink: 0 }} />
              <div>
                <strong>No voice profile yet.</strong> Set one up in the Voice tab for personalized emails.
                <button onClick={onGoToVoice} style={{ display: "block", marginTop: 8, padding: "6px 12px", background: "#4f46e5", color: "white", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                  Go to Voice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {generatedEmail && (
          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Generated Email</h3>
            <div style={{ background: "#f9f8fc", padding: 16, borderRadius: 6, marginBottom: 12 }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{generatedEmail.body}</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generatedEmail.body)}
              style={{
                padding: "8px 12px",
                background: "#f4f3f8",
                border: "1px solid #e8e6f0",
                borderRadius: 4,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Clipboard size={12} /> Copy to clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FollowUp({ voiceProfile, onGoToVoice }) {
  const [transcript, setTranscript] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = mockFollowUp("John Smith", "Acme Corp", transcript, "", voiceProfile);
      setGeneratedEmail(generated);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Call Transcript</h3>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste call transcript or notes here..."
            style={{
              width: "100%",
              minHeight: 200,
              padding: 12,
              border: "1px solid #e8e6f0",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader2 size={14} /> : <Sparkles size={14} />}
            Generate Follow-Up
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {generatedEmail && (
          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Follow-Up Email</h3>
            <div style={{ background: "#f9f8fc", padding: 16, borderRadius: 6, marginBottom: 12 }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{generatedEmail.body}</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generatedEmail.body)}
              style={{
                padding: "8px 12px",
                background: "#f4f3f8",
                border: "1px solid #e8e6f0",
                borderRadius: 4,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Clipboard size={12} /> Copy to clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function VoicePage({ samples, setSamples, profile, setProfile }) {
  const [newSample, setNewSample] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAddSample = () => {
    if (newSample.trim()) {
      setSamples([...samples, { id: Date.now(), content: newSample }]);
      setNewSample("");
    }
  };

  const handleAnalyze = () => {
    if (samples.length === 0) return;
    setAnalyzing(true);
    setTimeout(() => {
      const analyzed = mockVoiceAnalysis(samples);
      setProfile(analyzed);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add Writing Samples</h3>
          <textarea
            value={newSample}
            onChange={(e) => setNewSample(e.target.value)}
            placeholder="Paste a past email, message, or writing sample..."
            style={{
              width: "100%",
              minHeight: 120,
              padding: 12,
              border: "1px solid #e8e6f0",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              marginBottom: 12,
            }}
          />
          <button
            onClick={handleAddSample}
            style={{
              padding: "8px 12px",
              background: "#f4f3f8",
              border: "1px solid #e8e6f0",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={12} /> Add Sample
          </button>
        </div>

        {samples.length > 0 && (
          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Samples ({samples.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {samples.map((sample) => (
                <div key={sample.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: 12, background: "#f9f8fc", borderRadius: 6, fontSize: 12 }}>
                  <div style={{ flex: 1, marginRight: 12 }}>{sample.content.substring(0, 60)}...</div>
                  <button
                    onClick={() => setSamples(samples.filter((s) => s.id !== sample.id))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9b8ba8" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "10px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: analyzing ? 0.7 : 1,
              }}
            >
              {analyzing ? <Loader2 size={14} /> : <Wand2 size={14} />}
              Analyze Voice
            </button>
          </div>
        )}
      </div>

      <div>
        {profile && (
          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e8e6f0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Your Voice Profile</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Style</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", textTransform: "capitalize" }}>{profile.style}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Tone</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: "#6b6580" }}>{profile.tone}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Observations</div>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                  {profile.observations.map((obs, i) => (
                    <li key={i} style={{ fontSize: 13, color: "#6b6580", lineHeight: 1.4 }}>{obs}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Greeting</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{profile.greeting}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#8a8398", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Signoff</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{profile.signoff}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function mockColdOutreach(prospect, draft, voiceProfile) {
  const firstName = "Sarah";
  const company = "Acme Corp";
  const style = voiceProfile?.style || "neutral";

  const openerByStyle = {
    punchy: `Quick question on your ${company} stack:`,
    warm: `Hope this finds you well — quick question on your ${company} setup:`,
    formal: `I hope this message finds you well. I have a brief question regarding your current`,
    neutral: `Quick question on your ${company} setup:`,
  };

  const body = `Hi ${firstName},

${openerByStyle[style]}

${draft || "I noticed your team uses HubSpot. We've helped teams like yours reduce rep manual entry by ~40%, which typically frees up 2-3 hours per rep per week."}

Worth a quick conversation?

Best,
Alex`;

  return {
    subject: `Question on ${company}`,
    body,
  };
}

function mockFollowUp(customer, company, transcript, draft, voiceProfile) {
  const firstName = customer.split(" ")[0];
  const style = voiceProfile?.style || "neutral";
  const greeting = voiceProfile?.greeting || "Hi";
  const signoff = voiceProfile?.signoff || "Best";
  const senderName = "Alex";

  const openerByStyle = {
    punchy: `Quick recap from today:`,
    warm: `Thanks again for the time today — really enjoyed the conversation. Quick recap and what I'm sending over:`,
    formal: `Thank you for taking the time to speak today. Below is a brief recap along with the materials I committed to sending:`,
    neutral: `Thanks again for the time today. Quick recap and what I'm sending over:`,
  };

  const body = `${greeting} ${firstName},

${openerByStyle[style]}

Implementation timeline: ~3 weeks to live (based on your HubSpot + custom field setup).

ROI model: attached — built for a team of 12 reps at your stage. Conservative case shows ~$180k/yr in recovered rep time.

Gong: native integration. Activity logs flow both directions.

Locking Thursday for our next call — calendar hold coming for 11am ET.

${signoff},
${senderName}`;

  return {
    subject: `Recap + ROI model — ${company}`,
    body,
  };
}

function mockVoiceAnalysis(samples) {
  const allText = samples.map(s => s.content).join("\n\n");
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWords = sentences.length ? Math.round(wordCount / sentences.length) : 0;

  const exclaimRatio = (allText.match(/!/g) || []).length / Math.max(1, sentences.length);
  const dashRatio = (allText.match(/—|--/g) || []).length / Math.max(1, sentences.length);
  const lower = allText.toLowerCase();

  let style = "neutral";
  if (avgWords < 10 || dashRatio > 0.3) style = "punchy";
  else if (exclaimRatio > 0.15 || lower.includes("appreciate") || lower.includes("hope you")) style = "warm";
  else if (avgWords > 22) style = "formal";

  const signoffMatch = allText.match(/\n(Best|Thanks|Cheers|Talk soon|—|Regards)[,!]?\s*\n?[A-Z][a-z]+/);
  const signoff = signoffMatch ? signoffMatch[1] : (style === "warm" ? "Thanks" : style === "punchy" ? "—" : "Best");

  const greetingMatch = allText.match(/(Hey|Hi|Hello|Good morning|Quick note)/);
  const greeting = greetingMatch ? greetingMatch[1] : "Hi";

  const observations = [];
  if (avgWords < 12) observations.push("Sentences run short and direct — rarely more than one clause.");
  else if (avgWords > 22) observations.push("Sentences are fuller and more layered, with subordinate clauses.");
  else observations.push("Sentence length is conversational, mid-range — not clipped, not long-winded.");

  if (dashRatio > 0.25) observations.push("Heavy use of em-dashes for rhythm and parenthetical asides.");
  if (exclaimRatio > 0.1) observations.push("Light use of exclamation points to convey warmth.");
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
