import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  { id: 1, title: "Sniper Battle", category: "Video Ads", tags: ["AI-Generated", "UGC", "Motion"], color: "#FF3366" },
  { id: 2, title: "Hunting Battle", category: "Video Ads", tags: ["AI-Generated", "Cinematic"], color: "#00E5A0" },
  { id: 3, title: "Speed League", category: "Banners", tags: ["Static", "Animated"], color: "#FFD600" },
  { id: 4, title: "Soccer Stars", category: "Store Assets", tags: ["Screenshots", "Icons"], color: "#00B4FF" },
  { id: 5, title: "Win Cash Mahjong", category: "Video Ads", tags: ["AI UGC", "Fake Ad"], color: "#B44AFF" },
  { id: 6, title: "Hero Tactics", category: "Banners", tags: ["Static", "Motion"], color: "#FF6B2B" },
];

const SERVICES = [
  {
    icon: "🎬",
    title: "Video Ads",
    subtitle: "UGC, AI-Generated & Motion",
    desc: "High-performing video creatives powered by AI generation tools like Google Veo, combined with professional motion design in After Effects and Cinema 4D.",
    accent: "#FF3366",
  },
  {
    icon: "🖼️",
    title: "Banners & Static Creatives",
    subtitle: "Scroll-stopping visuals",
    desc: "Eye-catching banner ads and static creatives optimized for CTR across ad networks. From concept to final delivery, built for performance.",
    accent: "#00E5A0",
  },
  {
    icon: "📱",
    title: "Store Assets",
    subtitle: "Screenshots & Icons",
    desc: "App store screenshots, icons, and feature graphics designed to maximize conversion rates and stand out in crowded marketplaces.",
    accent: "#FFD600",
  },
  {
    icon: "🧠",
    title: "Creative Strategy & Ideation",
    subtitle: "Data-driven creative thinking",
    desc: "Strategic ad concepting, creative testing frameworks, and scalable production pipelines. 5+ years of UA performance insights informing every decision.",
    accent: "#B44AFF",
  },
];

const TOOLS = [
  "After Effects", "Cinema 4D", "Redshift", "Blender", "Unity", "Photoshop",
  "Google Veo", "Seedance", "Sora", "Midjourney", "Runway",
];

const STATS = [
  { value: "5+", label: "Years in UA" },
  { value: "30+", label: "Game Titles" },
  { value: "1000+", label: "Ads Produced" },
  { value: "AI", label: "Native Workflow" },
];

function GlitchText({ text, className = "" }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
    </span>
  );
}

function Particle({ delay, left, size, color }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        bottom: "-10px",
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: "50%",
        opacity: 0,
        animation: `floatUp 4s ease-in-out ${delay}s infinite`,
        filter: `blur(${size > 4 ? 2 : 0}px)`,
      }}
    />
  );
}

function GridOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }}
    />
  );
}

function NoiseBg() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
      }}
    />
  );
}

export default function PixAIPortfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const categories = ["All", ...new Set(PROJECTS.map((p) => p.category))];
  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navItems = ["about", "projects", "services", "contact"];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0A0A0F", color: "#F0F0F5", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          20% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-200px) scale(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .section-animate {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .section-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .nav-link {
          position: relative;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 600;
          color: #888;
          transition: color 0.3s;
          background: none;
          border: none;
          font-family: 'Space Mono', monospace;
          padding: 8px 0;
        }
        .nav-link:hover { color: #fff; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #FF3366, #00E5A0);
          transition: width 0.3s;
        }
        .nav-link:hover::after { width: 100%; }

        .project-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: #13131A;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .project-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,0.15);
        }

        .service-card {
          background: #13131A;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 36px 28px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .service-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 60px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }
        .cta-primary {
          background: linear-gradient(135deg, #FF3366, #FF6B2B);
          color: white;
        }
        .cta-primary:hover { transform: scale(1.05); box-shadow: 0 8px 30px rgba(255,51,102,0.3); }
        .cta-secondary {
          background: transparent;
          color: #F0F0F5;
          border: 2px solid rgba(255,255,255,0.2);
        }
        .cta-secondary:hover { border-color: #00E5A0; color: #00E5A0; }

        .filter-btn {
          padding: 8px 20px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #888;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .filter-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .filter-btn.active {
          background: linear-gradient(135deg, #FF3366, #B44AFF);
          border-color: transparent;
          color: white;
        }

        .tag {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.5px;
          background: rgba(255,255,255,0.08);
          color: #aaa;
        }

        .tool-pill {
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 13px;
          font-family: 'Space Mono', monospace;
          border: 1px solid rgba(255,255,255,0.1);
          color: #999;
          transition: all 0.3s;
          background: rgba(255,255,255,0.02);
        }
        .tool-pill:hover {
          border-color: #00E5A0;
          color: #00E5A0;
          background: rgba(0,229,160,0.05);
        }

        .stat-block {
          text-align: center;
          padding: 20px;
        }

        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,229,160,0.15), transparent);
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 100;
        }

        .marquee-track {
          display: flex;
          animation: marquee 20s linear infinite;
          width: max-content;
        }

        @media (max-width: 768px) {
          .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10,10,15,0.98);
            z-index: 999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 32px;
          }
          .mobile-menu .nav-link {
            font-size: 18px;
            letter-spacing: 4px;
          }
        }
      `}</style>

      <div className="scanline" />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        background: scrollY > 50 ? "rgba(10,10,15,0.9)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.4s",
        padding: "0 32px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 70 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #FF3366, #B44AFF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14,
            }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>PIX<span style={{ color: "#00E5A0" }}>AI</span></span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
            {navItems.map((item) => (
              <button key={item} className="nav-link" onClick={() => scrollTo(item)}>
                {item}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer", display: "none" }}
            className="mobile-only"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <GridOverlay />
        <NoiseBg />

        {/* Gradient orbs */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(255,51,102,0.15) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(0,229,160,0.1) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "50%", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(180,74,255,0.08) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        {/* Floating particles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {[...Array(12)].map((_, i) => (
            <Particle key={i} delay={i * 0.6} left={8 + i * 8} size={3 + (i % 4) * 2}
              color={["#FF3366", "#00E5A0", "#FFD600", "#B44AFF", "#00B4FF"][i % 5]} />
          ))}
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 32px 80px", position: "relative", zIndex: 2, width: "100%" }}>
          <div style={{ animation: "slideUp 0.8s ease-out" }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "8px 18px", borderRadius: 30,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: 32,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E5A0", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>
                Available for Projects
              </span>
            </div>

            {/* Main title */}
            <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginBottom: 20 }}>
              <span style={{ display: "block" }}>PIX<span style={{
                background: "linear-gradient(135deg, #00E5A0, #00B4FF)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>AI</span></span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 300, color: "#999", maxWidth: 580, lineHeight: 1.5, marginBottom: 12 }}>
              UA Ads for Mobile Games & Apps
            </p>

            {/* Founder info */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 48 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#666", letterSpacing: 1 }}>
                Founded by <span style={{ color: "#F0F0F5", fontWeight: 700 }}>Ivo Silveira</span>
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#333" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#666", letterSpacing: 1 }}>
                Senior UA Creative Specialist
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="cta-btn cta-primary" onClick={() => scrollTo("projects")}>
                View Work <span style={{ fontSize: 18 }}>→</span>
              </button>
              <button className="cta-btn cta-secondary" onClick={() => scrollTo("contact")}>
                Get in Touch
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
            marginTop: 80, paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            animation: "slideUp 1s ease-out 0.3s both",
          }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-block">
                <div style={{
                  fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: -1,
                  background: `linear-gradient(135deg, ${["#FF3366","#00E5A0","#FFD600","#B44AFF"][i]}, #fff)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{s.value}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE DIVIDER */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "14px 0" }}>
        <div className="marquee-track">
          {[...Array(3)].map((_, j) => (
            <div key={j} style={{ display: "flex", alignItems: "center", gap: 40, paddingRight: 40 }}>
              {["AI-POWERED CREATIVES", "PERFORMANCE-DRIVEN", "MOBILE GAMING", "SCALABLE PRODUCTION", "DATA-INFORMED", "MOTION DESIGN"].map((t, i) => (
                <span key={`${j}-${i}`} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, color: "#444", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t}</span>
                  <span style={{ width: 6, height: 6, background: "#FF3366", borderRadius: "50%", flexShrink: 0 }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" data-animate style={{ padding: "120px 32px", position: "relative" }}
        className={`section-animate ${visibleSections.has("about") ? "visible" : ""}`}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4,
                textTransform: "uppercase", color: "#FF3366", marginBottom: 20, display: "block",
              }}>About</span>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 24 }}>
                Where <span style={{ color: "#00E5A0" }}>AI Generation</span> meets{" "}
                <span style={{ color: "#FFD600" }}>UA Performance</span>
              </h2>
              <p style={{ color: "#999", lineHeight: 1.8, fontSize: 16, marginBottom: 20 }}>
                With 5+ years leading UA creative production for mobile games, I've built hundreds of high-performing ad creatives across video, banners, playables, and store assets.
              </p>
              <p style={{ color: "#999", lineHeight: 1.8, fontSize: 16, marginBottom: 32 }}>
                Now I'm pushing the boundaries of what's possible by integrating AI generation tools into the creative pipeline, producing more creatives, faster, without compromising quality or performance metrics.
              </p>

              {/* Tools */}
              <div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#666", marginBottom: 16, display: "block" }}>
                  Toolkit
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TOOLS.map((t) => (
                    <span key={t} className="tool-pill">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual block */}
            <div style={{ position: "relative" }}>
              <div style={{
                background: "linear-gradient(135deg, #13131A, #1A1A25)",
                borderRadius: 24, padding: 40, border: "1px solid rgba(255,255,255,0.06)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -40, right: -40, width: 200, height: 200,
                  background: "radial-gradient(circle, rgba(255,51,102,0.2) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00E5A0", marginBottom: 24, letterSpacing: 2 }}>
                    {"// creative_process.js"}
                  </div>
                  {[
                    { step: "01", label: "Strategic Brief", desc: "Ideation driven by UA goals, audience & KPIs" },
                    { step: "02", label: "AI Concept Generation", desc: "Veo, Seedance, Sora" },
                    { step: "03", label: "Professional Polish", desc: "AE, C4D, Blender, Unity, Photoshop" },
                    { step: "04", label: "Performance Optimization", desc: "Test, iterate, scale" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 16, alignItems: "flex-start",
                      padding: "16px 0",
                      borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}>
                      <span style={{
                        fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700,
                        background: `linear-gradient(135deg, ${["#FF3366","#00E5A0","#FFD600","#B44AFF"][i]}, #fff)`,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        lineHeight: 1,
                      }}>{item.step}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#666" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" data-animate style={{ padding: "120px 32px", position: "relative" }}
        className={`section-animate ${visibleSections.has("projects") ? "visible" : ""}`}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
            <div>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4,
                textTransform: "uppercase", color: "#00E5A0", marginBottom: 16, display: "block",
              }}>Selected Work</span>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, lineHeight: 1.15 }}>
                Projects
              </h2>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button key={c} className={`filter-btn ${activeFilter === c ? "active" : ""}`}
                  onClick={() => setActiveFilter(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Project grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {filtered.map((project) => (
              <div key={project.id} className="project-card"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}>
                {/* Thumbnail placeholder */}
                <div style={{
                  height: 220, position: "relative", overflow: "hidden",
                  background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)`,
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: 12,
                  }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 16,
                      border: `2px solid ${project.color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24,
                      transition: "all 0.3s",
                      transform: hoveredProject === project.id ? "scale(1.1)" : "scale(1)",
                    }}>
                      ▶
                    </div>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#666", letterSpacing: 2 }}>
                      COMING SOON
                    </span>
                  </div>

                  {/* Color accent line */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${project.color}, transparent)`,
                    opacity: hoveredProject === project.id ? 1 : 0.4,
                    transition: "opacity 0.3s",
                  }} />
                </div>

                {/* Info */}
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 18 }}>{project.title}</h3>
                    <span style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 11, color: project.color,
                      letterSpacing: 1, textTransform: "uppercase",
                    }}>{project.category}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" data-animate style={{ padding: "120px 32px", position: "relative" }}
        className={`section-animate ${visibleSections.has("services") ? "visible" : ""}`}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4,
              textTransform: "uppercase", color: "#FFD600", marginBottom: 16, display: "block",
            }}>What I Do</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, lineHeight: 1.15 }}>
              Services
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {SERVICES.map((service, i) => (
              <div key={i} className="service-card">
                {/* Accent glow */}
                <div style={{
                  position: "absolute", top: -20, right: -20, width: 120, height: 120,
                  background: `radial-gradient(circle, ${service.accent}15 0%, transparent 70%)`,
                  filter: "blur(30px)",
                }} />

                <div style={{ position: "relative", zIndex: 2 }}>
                  <span style={{ fontSize: 36, display: "block", marginBottom: 20 }}>{service.icon}</span>
                  <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{service.title}</h3>
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 11, color: service.accent,
                    letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16,
                  }}>{service.subtitle}</span>
                  <p style={{ color: "#888", lineHeight: 1.7, fontSize: 14 }}>{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" data-animate style={{ padding: "120px 32px 80px", position: "relative" }}
        className={`section-animate ${visibleSections.has("contact") ? "visible" : ""}`}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4,
            textTransform: "uppercase", color: "#B44AFF", marginBottom: 16, display: "block",
          }}>Let's Work Together</span>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Ready to <span style={{
              background: "linear-gradient(135deg, #FF3366, #FFD600)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>scale your UA creatives</span>?
          </h2>
          <p style={{ color: "#888", fontSize: 17, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
            Whether you need AI-powered video ads, static creatives, or a full creative strategy — let's talk about how to level up your ad performance.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:ivodsgs@gmail.com" className="cta-btn cta-primary">
              <span>✉</span> Email Me
            </a>
            <a href="https://www.linkedin.com/in/ivosilveira/" target="_blank" rel="noopener" className="cta-btn cta-secondary">
              <span>in</span> LinkedIn
            </a>
          </div>

          {/* Availability badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "12px 24px", borderRadius: 40,
            background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)",
            marginTop: 48,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00E5A0", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00E5A0", letterSpacing: 1 }}>
              Currently accepting new clients
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "32px", borderTop: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: "linear-gradient(135deg, #FF3366, #B44AFF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 10,
          }}>P</div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>PIX<span style={{ color: "#00E5A0" }}>AI</span></span>
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", letterSpacing: 1, marginTop: 12 }}>
          © 2026 PixAI — Ivo Silveira. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
