/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import logo from "./Assets/djappz-logo.png";
import heroPhoto from "./Assets/djappz-bio.jpeg";
import mixerPhoto from "./Assets/djappz-photo.jpg";
import streetPhoto from "./Assets/djappz-mixer.jpeg";
import weddingPhoto from "./Assets/djappz-wedding.jpeg";

// ─── EMAILJS CONFIG ────────────────────────────────────────────────────────
const EMAILJS = {
  serviceId: "service_fo4lzwj",
  templateNotify: "template_nahefvm",
  templateReply: "template_y2wlqdg",
  publicKey: "8AHoqz3PXtnNjss0c",
};

// ─── CONFIG ────────────────────────────────────────────────────────────────
const DJ = {
  name: "DJ APPZ",
  tagline: "R&B · Hip-Hop · Soul",
  bio: "DJ Appz is a UK-based DJ specialising in R&B, Hip-Hop and Soul — crafting sets that move rooms from intimate private events to late-night club floors. Known for seamless blends, crowd-reading instincts, and an ear for the perfect moment.",
  email: "dj-appz@outlook.com",
  location: "London, UK",
  instagram: "@djappz",
};

const GENRES = ["R&B", "Hip-Hop", "Neo-Soul", "Afrobeats", "Dancehall", "Old School", "House", "Commercial", "Disco", "Funk"];

const MIXES = [
  { id: "mix1", title: "Retune Episode 3", subtitle: "R&B · Hip-Hop · 90s & 2000s", tag: "R&B / Hip-Hop", src: "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2FDJAppz%2Fretune-episode-3-rnb-hip-hop-90s-2000s%2F" },
  { id: "mix2", title: "Retune — Brixton Radio", subtitle: "Dancehall · Hip-Hop", tag: "Dancehall / Hip-Hop", src: "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fbrixtonradiolive%2Fretune-271225%2F" },
];

const SERVICES = [
  { id: "private", icon: "🥂", title: "Private Events", sub: "Birthdays · House Parties · Celebrations", price: "From £350" },
  { id: "wedding", icon: "💍", title: "Weddings", sub: "Ceremony · Reception · Evening", price: "From £800" },
  { id: "corporate", icon: "◈", title: "Corporate", sub: "Launches · Parties · Brand Events", price: "From £600" },
  { id: "club", icon: "◉", title: "Club & Bar", sub: "Residencies · Guest Sets · Nights", price: "From £250" },
];

const TESTIMONIALS = [
  { name: "Simone T.", event: "30th Birthday, London", quote: "Appz had everyone on the floor all night. Knew exactly when to switch up the energy. Best party we've ever thrown." },
  { name: "Marcus & Jade", event: "Wedding Reception", quote: "From the first song to the last, it was perfect. He read the room better than anyone we've seen. Our guests are still talking about it." },
  { name: "Nadia K.", event: "Corporate Launch, Shoreditch", quote: "Professional, punctual, and the set was immaculate. Every colleague asked who the DJ was. Already booked him again." },
];

const FAQS = [
  { q: "How far in advance should I book?", a: "4–6 weeks minimum for private events, 3–6 months for weddings. Summer and December fill very fast." },
  { q: "Do you travel outside London?", a: "Yes — UK-wide. Travel and accommodation costs may apply for events more than 50 miles from London." },
  { q: "Can I request songs?", a: "Absolutely. Every booking includes a music consultation where you share must-plays, do-not-plays, and genre preferences." },
  { q: "What equipment do you bring?", a: "I perform on a professional DJ controller setup as standard. What's brought on the day ultimately depends on the nature of the gig and what's required — some venues have in-house equipment we can work with, while others need a fuller rig. This is always discussed and confirmed ahead of your event so there are no surprises." },
  { q: "How does payment work?", a: "25% deposit to secure your date. Remaining balance due 7 days before the event. Bank transfer, PayPal, or card via invoice." },
  { q: "Are you insured?", a: "Yes — fully covered with Public Liability Insurance up to £5M. Certificate available on request." },
];

// ─── EMAILJS SUBMIT ────────────────────────────────────────────────────────
async function loadEmailJS() {
  if (window.emailjs) return;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  window.emailjs.init({ publicKey: EMAILJS.publicKey });
}

async function submitEnquiry(data) {
  try {
    await loadEmailJS();
    const params = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || "Not provided",
      event_type: data.eventType,
      date: data.date,
      venue: data.venue || "TBC",
      guests: data.guests || "TBC",
      budget: data.budget || "TBC",
      notes: data.notes || "None",
      to_email: DJ.email,
    };
    await window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateNotify, params);
    await window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateReply, { ...params, reply_to: data.email });
    return true;
  } catch (err) {
    console.error("EmailJS error:", err);
    return false;
  }
}

// ─── AI CHAT ───────────────────────────────────────────────────────────────
async function askAI(messages) {
  const sys = `You are the booking assistant for DJ Appz — a professional DJ based in London specialising in R&B, Hip-Hop, Neo-Soul, Afrobeats and Dancehall.
Personality: calm, confident, professional. Like a luxury concierge — warm but measured. Short sentences.
Pricing: Private from £350, Weddings from £800, Corporate from £600, Club from £250.
UK-wide travel. Fully insured. Professional controller setup. Music consultation included.
Keep replies to 2–3 sentences max. When you have event type + date + contact info, say exactly: "Perfect — let me bring up the booking form so we can get this confirmed for you."
Never invent details. If unsure, direct them to ${DJ.email}.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages }),
  });
  const d = await res.json();
  return d.content?.[0]?.text || `Drop me a message at ${DJ.email} and I'll get back to you shortly.`;
}

// ─── HOOKS ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease` }}>
      {children}
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function NavBar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["home", "about", "services", "faq", "book"];
  const nav = (l) => { setActive(l); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled || menuOpen ? "rgba(245,240,232,0.97)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(26,24,21,0.1)" : "none", transition: "all 0.4s ease" }}>
        <img src={logo} alt="DJ Appz" onClick={() => nav("home")} style={{ height: 44, objectFit: "contain", mixBlendMode: "screen", cursor: "pointer", opacity: 1 }} />
        {isMobile ? (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: scrolled ? "#1a1815" : "#fff", fontSize: 22, padding: 4 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 36 }}>
            {links.map(l => (
              <button key={l} onClick={() => nav(l)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: scrolled ? (active === l ? "#1a1815" : "rgba(26,24,21,0.5)") : (active === l ? "#fff" : "rgba(255,255,255,0.6)"), transition: "color 0.2s", padding: 0 }}>{l}</button>
            ))}
          </div>
        )}
      </nav>
      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(245,240,232,0.98)", borderBottom: "1px solid rgba(26,24,21,0.1)", padding: "16px 0" }}>
          {links.map(l => (
            <button key={l} onClick={() => nav(l)} style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: active === l ? "#1a1815" : "rgba(26,24,21,0.5)", padding: "16px 24px", textAlign: "left" }}>{l}</button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function HeroSection({ onBook }) {
  const [tick, setTick] = useState(0);
  const isMobile = useIsMobile();
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 3000); return () => clearInterval(t); }, []);
  const words = ["R&B", "Hip-Hop", "Neo-Soul", "Afrobeats"];
  return (
    <section style={{ minHeight: "calc(var(--vh, 1vh) * 100)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Background photo — full bleed on mobile, right-side on desktop */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img src={heroPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? "center 20%" : "center 20%" }} />
        {/* Dark overlay — stronger on mobile for text readability */}
        <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(to bottom, rgba(26,24,21,0.45) 0%, rgba(26,24,21,0.65) 60%, rgba(245,240,232,0.97) 100%)" : "linear-gradient(to right, rgba(245,240,232,0.96) 0%, rgba(245,240,232,0.75) 45%, rgba(245,240,232,0.05) 100%)" }} />
      </div>

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.015) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.015) 80px)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "120px 24px 80px" : "120px 48px 80px", maxWidth: 640, width: "100%" }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.9)", marginBottom: 24, opacity: 0, animation: "fadeUp 0.8s 0.2s forwards" }}>
          LONDON · UK-WIDE · INTERNATIONAL
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? "72px" : "clamp(72px, 10vw, 108px)", lineHeight: 0.9, margin: "0 0 28px", color: "#fff", opacity: 0, animation: "fadeUp 0.8s 0.4s forwards" }}>
          DJ<br /><em style={{ color: "rgba(255,255,255,0.95)" }}>Appz</em>
        </h1>
        <div style={{ height: 28, overflow: "hidden", marginBottom: 40, opacity: 0, animation: "fadeUp 0.8s 0.6s forwards" }}>
          {words.map((w, i) => (
            <div key={w} style={{ height: 28, display: "flex", alignItems: "center", transform: `translateY(${(i - tick % words.length) * 28}px)`, transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 3, color: "rgba(200,165,80,0.95)", textTransform: "uppercase" }}>{w}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s 0.8s forwards" }}>
          <button onClick={onBook} style={{ background: "#fff", color: "#1a1815", border: "none", borderRadius: 2, padding: "14px 36px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>Book Now</button>
          <button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2, padding: "14px 36px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer" }}>About</button>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────
function AboutSection() {
  const isMobile = useIsMobile();
  return (
    <section id="about-section" style={{ padding: isMobile ? "80px 24px" : "120px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80, alignItems: "center" }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <img src={streetPhoto} alt="DJ Appz" style={{ width: "100%", aspectRatio: isMobile ? "4/3" : "3/4", objectFit: "cover", objectPosition: "center 15%", borderRadius: 2, display: "block" }} />
            <div style={{ position: "absolute", bottom: -10, right: -10, width: "60%", height: "60%", border: "1px solid rgba(180,140,80,0.2)", borderRadius: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(22,20,18,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "14px 18px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#1a1815", fontStyle: "italic", lineHeight: 1 }}>200+</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2.5, color: "rgba(26,24,21,0.55)", marginTop: 4 }}>EVENTS PLAYED</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={isMobile ? 0 : 0.2}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 20 }}>ABOUT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#1a1815", margin: "0 0 24px", lineHeight: 1.15 }}>The Sound of<br /><em>Every Room</em></h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(26,24,21,0.65)", lineHeight: 1.9, margin: "0 0 32px" }}>{DJ.bio}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {GENRES.map(g => <span key={g} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: "rgba(140,100,30,0.85)", border: "1px solid rgba(180,140,80,0.2)", borderRadius: 1, padding: "5px 12px" }}>{g}</span>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(26,24,21,0.08)" }}>
              {[["4+", "Years"], ["4.9★", "Rated"], ["UK", "& Beyond"]].map(([val, label]) => (
                <div key={label} style={{ background: "#ede8df", padding: "20px 16px" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#1a1815", fontStyle: "italic" }}>{val}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2.5, color: "rgba(26,24,21,0.4)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── MIXES ─────────────────────────────────────────────────────────────────
function MixesSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 24px" : "120px 48px", background: "rgba(26,24,21,0.03)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 16 }}>LISTEN</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#1a1815", margin: "0 0 12px" }}>Hear the Sound</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(26,24,21,0.55)", lineHeight: 1.7, maxWidth: 480 }}>A selection of recorded sets — the best way to get a feel for the vibe before you book.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 16 : 1, background: isMobile ? "transparent" : "rgba(26,24,21,0.08)" }}>
          {MIXES.map((mix, i) => (
            <Reveal key={mix.id} delay={i * 0.15}>
              <div style={{ background: "#fff", padding: isMobile ? "24px 20px" : "32px 32px 28px", borderRadius: isMobile ? 4 : 0, border: "1px solid rgba(26,24,21,0.07)" }}>
                <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 18, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#1a1815", margin: "0 0 4px", fontWeight: 400 }}>{mix.title}</h3>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(26,24,21,0.4)", letterSpacing: 1.5, margin: 0 }}>{mix.subtitle}</p>
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2, color: "rgba(140,100,30,0.85)", border: "1px solid rgba(180,140,80,0.2)", padding: "4px 10px", borderRadius: 1, whiteSpace: "nowrap" }}>{mix.tag}</span>
                </div>
                <div style={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <iframe width="100%" height="120" src={mix.src} frameBorder="0" allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share" title={mix.title} style={{ display: "block" }} />
                </div>
                <div style={{ marginTop: 12, textAlign: "right" }}>
                  <a href="https://www.mixcloud.com/DJAppz/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: "rgba(26,24,21,0.3)", textDecoration: "none" }}>MORE ON MIXCLOUD →</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ──────────────────────────────────────────────────────────────
function ServicesSection({ onBook }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 24px" : "120px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 16 }}>SERVICES</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#1a1815", margin: 0 }}>What I Do</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 12 : 1, background: isMobile ? "transparent" : "rgba(26,24,21,0.08)" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div onClick={() => onBook(s.id)} style={{ background: "#fff", padding: isMobile ? "28px 24px" : "44px 40px", cursor: "pointer", transition: "background 0.3s", borderRadius: isMobile ? 4 : 0, border: "1px solid rgba(26,24,21,0.06)" }} onMouseEnter={e => e.currentTarget.style.background = "#252220"} onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>
                <div style={{ fontSize: 28, marginBottom: 12, color: "rgba(26,24,21,0.25)" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#1a1815", margin: "0 0 8px", fontWeight: 400 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(26,24,21,0.4)", letterSpacing: 1.5, margin: "0 0 24px" }}>{s.sub}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(140,100,30,0.9)", letterSpacing: 1 }}>{s.price}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "rgba(26,24,21,0.3)", letterSpacing: 2 }}>ENQUIRE →</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Wedding venue photo strip */}
        <Reveal delay={0.2}>
          <div style={{ marginTop: isMobile ? 16 : 1, overflow: "hidden", borderRadius: isMobile ? 4 : 0, background: "rgba(26,24,21,0.08)" }}>
            <img
              src={weddingPhoto}
              alt="DJ Appz at a wedding"
              style={{ width: "100%", height: isMobile ? 260 : 340, objectFit: "cover", objectPosition: "center 30%", display: "block", opacity: 0.9 }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  useEffect(() => { const t = setInterval(() => setActive(x => (x + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t); }, []);
  const t = TESTIMONIALS[active];
  return (
    <section style={{ padding: isMobile ? "80px 24px" : "120px 48px", background: "rgba(26,24,21,0.03)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 40 }}>KIND WORDS</div>
          <div style={{ minHeight: 160 }}>
            <p key={active} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 2.5vw, 24px)", color: "rgba(26,24,21,0.9)", lineHeight: 1.65, margin: "0 0 28px", fontStyle: "italic", animation: "fadeUp 0.5s ease" }}>"{t.quote}"</p>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(26,24,21,0.4)", letterSpacing: 2 }}>{t.name} — {t.event}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
            {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 28 : 6, height: 2, background: i === active ? "rgba(140,100,30,0.9)" : "rgba(26,24,21,0.15)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0, borderRadius: 1 }} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 24px" : "120px 48px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 16 }}>FAQ</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#1a1815", margin: "0 0 48px" }}>Common Questions</h2>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(26,24,21,0.8)" }}>{f.q}</span>
                <span style={{ color: "rgba(140,100,30,0.85)", fontSize: 20, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.25s", flexShrink: 0, lineHeight: 1 }}>+</span>
              </button>
              <div style={{ overflow: "hidden", maxHeight: open === i ? 300 : 0, transition: "max-height 0.35s ease", paddingBottom: open === i ? 20 : 0 }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(26,24,21,0.5)", lineHeight: 1.8, margin: 0 }}>{f.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
      </div>
    </section>
  );
}

// ─── CALENDAR PICKER ───────────────────────────────────────────────────────
function DatePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const selectDate = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }));
    setOpen(false);
  };
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const isPast = (day) => new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (day) => value === new Date(viewYear, viewMonth, day).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const isToday = (day) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", borderBottom: `1px solid ${error ? "rgba(200,80,80,0.6)" : "rgba(26,24,21,0.15)"}`, padding: "12px 0", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: value ? "#fff" : "rgba(255,255,255,0.25)", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{value || "Select a date…"}</span>
        <span style={{ color: "rgba(140,100,30,0.75)", fontSize: 11 }}>📅</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: isMobile ? "50%" : 0, transform: isMobile ? "translateX(-50%)" : "none", zIndex: 300, background: "#ffffff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: 16, width: isMobile ? "calc(100vw - 48px)" : 300, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button type="button" onClick={prevMonth} style={{ background: "none", border: "none", color: "rgba(26,24,21,0.5)", cursor: "pointer", fontSize: 18, padding: "4px 10px" }}>‹</button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#1a1815", fontStyle: "italic" }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} style={{ background: "none", border: "none", color: "rgba(26,24,21,0.5)", cursor: "pointer", fontSize: 18, padding: "4px 10px" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
            {DAYS.map(d => <div key={d} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 1, color: "rgba(26,24,21,0.3)", textAlign: "center", padding: "4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const past = isPast(day); const sel = isSelected(day); const tod = isToday(day);
              return (
                <button type="button" key={day} onClick={() => !past && selectDate(day)} style={{ background: sel ? "rgba(140,100,30,0.95)" : tod ? "rgba(26,24,21,0.1)" : "none", border: tod && !sel ? "1px solid rgba(180,140,80,0.3)" : "1px solid transparent", borderRadius: 2, padding: "8px 0", fontFamily: "'Outfit', sans-serif", fontSize: 11, color: past ? "rgba(26,24,21,0.2)" : sel ? "#f5f0e8" : "#1a1815", cursor: past ? "not-allowed" : "pointer", textAlign: "center", fontWeight: sel ? 600 : 400 }}
                  onMouseEnter={e => { if (!past && !sel) e.currentTarget.style.background = "rgba(140,100,30,0.15)"; }}
                  onMouseLeave={e => { if (!past && !sel) e.currentTarget.style.background = "none"; }}>
                  {day}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: "rgba(26,24,21,0.35)", cursor: "pointer" }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BOOKING FORM ──────────────────────────────────────────────────────────
function BookingForm({ prefill, onSuccess }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", eventType: prefill || "", date: "", venue: "", guests: "", budget: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const isMobile = useIsMobile();
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Required";
    if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email needed";
    if (!f.eventType || f.eventType.trim() === "") e.eventType = "Please select an event type";
    if (!f.date) e.date = "Please select a date";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    setSendError(false);
    const ok = await submitEnquiry(f);
    setSending(false);
    if (ok) onSuccess(f);
    else setSendError(true);
  };

  const iStyle = (k) => ({ width: "100%", background: "none", border: "none", borderBottom: `1px solid ${errors[k] ? "rgba(200,80,80,0.7)" : "rgba(26,24,21,0.2)"}`, padding: "12px 0", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#1a1815", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" });
  const Label = ({ c }) => <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(26,24,21,0.4)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{c}</label>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 24 }}>
        {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone (optional)", "tel"]].map(([k, l, t]) => (
          <div key={k}>
            <Label c={l} />
            <input type={t} value={f[k]} onChange={e => set(k, e.target.value)} style={iStyle(k)} placeholder={t === "tel" ? "+44 7700 000000" : ""} />
            {errors[k] && <span style={{ fontSize: 10, color: "rgba(200,80,80,0.8)", marginTop: 4, display: "block" }}>{errors[k]}</span>}
          </div>
        ))}
        <div>
          <Label c="Event Type" />
          <select value={f.eventType} onChange={e => set("eventType", e.target.value)} style={{ ...iStyle("eventType"), color: f.eventType ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer" }}>
            <option value="">Select your event type…</option>
            {SERVICES.map(s => <option key={s.id} value={s.title} style={{ background: "#ffffff" }}>{s.title}</option>)}
          </select>
          {errors.eventType && <span style={{ fontSize: 10, color: "rgba(200,80,80,0.8)", marginTop: 4, display: "block" }}>{errors.eventType}</span>}
        </div>
        <div>
          <Label c="Event Date" />
          <DatePicker value={f.date} onChange={v => set("date", v)} error={errors.date} />
          {errors.date && <span style={{ fontSize: 10, color: "rgba(200,80,80,0.8)", marginTop: 4, display: "block" }}>{errors.date}</span>}
        </div>
        <div>
          <Label c="Guest Count" />
          <input type="number" value={f.guests} onChange={e => set("guests", e.target.value)} placeholder="e.g. 80" style={iStyle("guests")} />
        </div>
      </div>
      <div><Label c="Venue / Location" /><input value={f.venue} onChange={e => set("venue", e.target.value)} placeholder="City or venue name" style={iStyle("venue")} /></div>
      <div><Label c="Approximate Budget" /><input value={f.budget} onChange={e => set("budget", e.target.value)} placeholder="e.g. £600–£1,000" style={iStyle("budget")} /></div>
      <div>
        <Label c="Music Preferences & Notes" />
        <textarea value={f.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder="Genres, must-plays, vibe you're going for…" style={{ ...iStyle("notes"), resize: "none", fontFamily: "'Outfit', sans-serif" }} />
      </div>
      {sendError && <div style={{ background: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.3)", borderRadius: 2, padding: "12px 16px", fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,150,150,0.9)" }}>Something went wrong sending your enquiry. Please email us directly at {DJ.email}</div>}
      <button onClick={submit} disabled={sending} style={{ alignSelf: isMobile ? "stretch" : "flex-start", background: sending ? "rgba(26,24,21,0.12)" : "#1a1815", color: "#f5f0e8", border: "none", padding: "16px 48px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: sending ? "not-allowed" : "pointer", borderRadius: 1, fontWeight: 500, textAlign: "center" }}>
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </div>
  );
}

function BookingSection({ prefill, onSuccess }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 24px" : "120px 48px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 16 }}>BOOKINGS</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#1a1815", margin: "0 0 12px" }}>Let's Make It Happen</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(26,24,21,0.55)", margin: "0 0 48px", lineHeight: 1.7 }}>Fill in the form and I'll be in touch within 24 hours to discuss your event.</p>
        </Reveal>
        <BookingForm prefill={prefill} onSuccess={onSuccess} />
      </div>
    </section>
  );
}

// ─── SUCCESS ───────────────────────────────────────────────────────────────
function SuccessSection({ form }) {
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <section style={{ padding: isMobile ? "80px 24px" : "120px 48px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(140,100,30,0.1)", border: "1px solid rgba(180,140,80,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "rgba(140,100,30,0.95)", margin: "0 auto 28px", animation: "pulseRing 2s ease-in-out infinite" }}>✓</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(140,100,30,0.85)", marginBottom: 16 }}>ENQUIRY RECEIVED</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", color: "#1a1815", margin: "0 0 20px", lineHeight: 1.2 }}>You're on our <em>radar</em>, {form.name.split(" ")[0]}.</h2>
        <div style={{ background: "rgba(140,100,30,0.06)", border: "1px solid rgba(180,140,80,0.2)", borderRadius: 4, padding: "20px 24px", marginBottom: 20, textAlign: "left" }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(26,24,21,0.65)", lineHeight: 1.9, margin: 0 }}>
            Your booking enquiry has been successfully submitted. A member of the <strong style={{ color: "#1a1815" }}>DJ Appz</strong> team will be in touch at <strong style={{ color: "rgba(140,100,30,0.95)" }}>{form.email}</strong> within <strong style={{ color: "#1a1815" }}>24 hours</strong>. A confirmation has also been sent to your email.
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: "20px 24px", textAlign: "left", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(26,24,21,0.3)", marginBottom: 14 }}>YOUR BOOKING SUMMARY</div>
          {[["Event Type", form.eventType], ["Date", form.date], ["Venue", form.venue || "TBC"], ["Guests", form.guests || "TBC"], ["Budget", form.budget || "TBC"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "'Outfit', sans-serif", fontSize: 12 }}>
              <span style={{ color: "rgba(26,24,21,0.35)" }}>{k}</span>
              <span style={{ color: "rgba(26,24,21,0.8)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: "20px 24px", textAlign: "left", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(26,24,21,0.3)", marginBottom: 16 }}>WHAT HAPPENS NEXT</div>
          {[["01", "We review your enquiry and check availability for your date"], ["02", "You'll receive a personalised response within 24 hours"], ["03", "We'll confirm details, discuss your music preferences, and send a quote"], ["04", "A 25% deposit secures your booking"]].map(([num, text]) => (
            <div key={num} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "rgba(180,140,80,0.5)", fontStyle: "italic", flexShrink: 0, lineHeight: 1.4 }}>{num}</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(26,24,21,0.5)", lineHeight: 1.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(26,24,21,0.3)", letterSpacing: 1 }}>Direct line: <span style={{ color: "rgba(140,100,30,0.75)" }}>{DJ.email}</span></p>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function FooterBar() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: isMobile ? "32px 24px" : "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "rgba(26,24,21,0.35)", fontStyle: "italic", letterSpacing: 2 }}>DJ Appz</span>
      <div style={{ display: "flex", gap: isMobile ? 16 : 28, flexWrap: "wrap" }}>
        {[DJ.instagram, DJ.email, DJ.location].map(l => <span key={l} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1.5, color: "rgba(26,24,21,0.3)" }}>{l}</span>)}
      </div>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1, color: "rgba(26,24,21,0.25)" }}>© 2026 DJ Appz</span>
    </footer>
  );
}

// ─── CHATBOT ───────────────────────────────────────────────────────────────
function ChatBot({ onOpenBook }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Hey — I'm here to help with any questions about bookings or DJ Appz. What are you looking for?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [badge, setBadge] = useState(0);
  const endRef = useRef(null);
  useEffect(() => { if (open) { setBadge(0); setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50); } }, [msgs, open]);
  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const next = [...msgs, { role: "user", content: msg }];
    setMsgs(next);
    setLoading(true);
    const reply = await askAI(next.map(m => ({ role: m.role, content: m.content })));
    const final = [...next, { role: "assistant", content: reply }];
    setMsgs(final);
    setLoading(false);
    if (!open) setBadge(b => b + 1);
    if (reply.toLowerCase().includes("booking form")) setTimeout(() => onOpenBook(), 900);
  };
  const quickReplies = ["What's your price?", "Do you travel?", "How do I book?", "What genres?"];
  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, width: 52, height: 52, borderRadius: "50%", background: "#1a1815", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 32px rgba(0,0,0,0.2)", color: "#f5f0e8", transition: "transform 0.2s" }}>
        {open ? <span style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>✕</span> : "💬"}
        {badge > 0 && !open && <span style={{ position: "absolute", top: -3, right: -3, background: "rgba(140,100,30,0.95)", color: "#1a1815", width: 18, height: 18, borderRadius: "50%", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{badge}</span>}
      </button>
      {open && (
        <div style={{ position: "fixed", bottom: 88, right: 24, zIndex: 199, width: "min(340px, calc(100vw - 48px))", maxHeight: 500, background: "#ffffff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.8)", animation: "fadeUp 0.2s ease" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={logo} alt="" style={{ height: 22, mixBlendMode: "screen", opacity: 0.9 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(100,200,100,0.8)" }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2, color: "rgba(26,24,21,0.4)" }}>ONLINE</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", background: m.role === "user" ? "#fff" : "rgba(26,24,21,0.1)", color: m.role === "user" ? "#f5f0e8" : "rgba(255,255,255,0.75)", padding: "10px 13px", borderRadius: 2, fontFamily: "'Outfit', sans-serif", fontSize: 12, lineHeight: 1.65 }}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{ display: "flex", gap: 5, padding: "10px 13px" }}>{[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(26,24,21,0.3)", animation: `blink 1s ${d}s infinite` }} />)}</div>}
            <div ref={endRef} />
          </div>
          <div style={{ padding: "8px 12px 0", display: "flex", gap: 6, overflowX: "auto" }}>
            {quickReplies.map((q, i) => <button key={i} onClick={() => send(q)} style={{ background: "none", border: "1px solid rgba(180,140,80,0.4)", borderRadius: 1, padding: "5px 10px", color: "rgba(140,100,30,0.9)", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>{q}</button>)}
          </div>
          <div style={{ padding: "10px 12px 14px", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask me anything…" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "9px 12px", color: "#1a1815", fontSize: 12, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
            <button onClick={() => send()} style={{ background: "#1a1815", border: "none", borderRadius: 2, width: 36, height: 36, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#f5f0e8" }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  // Fix mobile 100vh blank space bug
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const [section, setSection] = useState("home");
  const [bookPrefill, setBookPrefill] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const isMobile = useIsMobile();
  const goBook = (service = "") => { setBookPrefill(service); setSection("book"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        /* Fix mobile browser viewport height */
        :root { --vh: 1vh; }
        body {
          background-color: #f5f0e8;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
          color: #fff;
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #f5f0e8; }
        ::-webkit-scrollbar-thumb { background: rgba(140,100,30,0.35); }
        input::placeholder, textarea::placeholder { color: rgba(26,24,21,0.3); }
        select option { background: #f5f0e8; color: #1a1815; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }
        @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(180,140,80,0.3); } 50% { box-shadow: 0 0 0 12px rgba(180,140,80,0); } }
        button:hover { opacity: 0.82; }
        html, body { overflow-x: hidden; max-width: 100%; }
        * { max-width: 100%; }
        img { max-width: 100%; height: auto; }
        input, select, textarea, button { max-width: 100%; }
        input:focus { border-bottom-color: rgba(140,100,30,0.6) !important; }
        textarea:focus { border-bottom-color: rgba(140,100,30,0.6) !important; outline: none; }
      `}</style>

      <div style={{ minHeight: "100vh" }}>
        <NavBar active={section} setActive={setSection} />

        {section === "home" && (
          <>
            <HeroSection onBook={() => goBook()} />
            <AboutSection />
            <MixesSection />
            <ServicesSection onBook={goBook} />
            <TestimonialsSection />
            <FAQSection />
            <section style={{ padding: isMobile ? "80px 24px" : "100px 48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroPhoto})`, backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.05 }} />
              <Reveal>
                <div style={{ position: "relative" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 52px)", color: "#1a1815", margin: "0 0 16px" }}>Ready to <em>book?</em></h2>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(26,24,21,0.4)", margin: "0 0 32px" }}>Let's talk about your event.</p>
                  <button onClick={() => goBook()} style={{ background: "#fff", color: "#1a1815", border: "none", padding: "15px 48px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", borderRadius: 1, fontWeight: 500 }}>Get in Touch</button>
                </div>
              </Reveal>
            </section>
          </>
        )}

        {section === "about" && (<><div style={{ paddingTop: 80 }} /><AboutSection /></>)}
        {section === "services" && (<><div style={{ paddingTop: 80 }} /><ServicesSection onBook={goBook} /></>)}
        {section === "faq" && (<><div style={{ paddingTop: 80 }} /><FAQSection /></>)}
        {section === "book" && (<><div style={{ paddingTop: 80 }} />{submitted ? <SuccessSection form={submitted} /> : <BookingSection prefill={bookPrefill} onSuccess={setSubmitted} />}</>)}

        <FooterBar />
      </div>
      <ChatBot onOpenBook={goBook} />
    </>
  );
}
