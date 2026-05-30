import { useState, useEffect, useRef } from "react";
import logo from "./Assets/djappz-logo.png";
import heroPhoto from "./Assets/djappz-photo.jpg";
import mixerPhoto from "./Assets/djappz-mixer.jpeg";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const DJ = {
  name: "DJ APPZ",
  tagline: "R&B · Hip-Hop · Soul",
  bio: "DJ Appz is a UK-based DJ specialising in R&B, Hip-Hop and Soul — crafting sets that move rooms from intimate private events to late-night club floors. Known for seamless blends, crowd-reading instincts, and an ear for the perfect moment.",
  email: "bookings@djappz.com",
  phone: "+44 7700 000000",
  location: "London, UK",
  instagram: "@djappz",
  soundcloud: "djappz",
};

const GENRES = ["R&B", "Hip-Hop", "Neo-Soul", "Afrobeats", "Dancehall", "Old School", "UK Rap", "Drill"];
const MIXES = [
  {
    id: "mix1",
    title: "Retune Episode 3",
    subtitle: "R&B · Hip-Hop · 90s & 2000s",
    tag: "R&B / Hip-Hop",
    src: "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2FDJAppz%2Fretune-episode-3-rnb-hip-hop-90s-2000s%2F",
  },
  {
    id: "mix2",
    title: "Retune — Brixton Radio",
    subtitle: "Dancehall · Hip-Hop",
    tag: "Dancehall / Hip-Hop",
    src: "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fbrixtonradiolive%2Fretune-271225%2F",
  },
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

// ─── EMAIL SUBMIT ──────────────────────────────────────────────────────────
async function submitEnquiry(data) {
  try {
    const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, _subject: `Booking Enquiry — ${data.eventType} | ${data.name}`, _replyto: data.email }),
    });
    return res.ok;
  } catch { return true; }
}

// ─── AI CHAT ───────────────────────────────────────────────────────────────
async function askAI(messages) {
  const sys = `You are the booking assistant for ${DJ.name} — a professional DJ based in ${DJ.location} specialising in R&B, Hip-Hop, Neo-Soul, Afrobeats and Dancehall.

Personality: calm, confident, professional. Like a luxury concierge — warm but measured. Short sentences. No hype.

Your role:
- Answer questions about DJ Appz's services and sound
- Qualify bookings by asking: event type, date, location, guest count, and budget
- Pricing: Private from £350, Weddings from £800, Corporate from £600, Club from £250
- UK-wide travel, international available for the right events
- Fully insured, professional equipment provided
- Music consultation included with every booking

Keep replies to 2–3 sentences max. When you have event type + date + contact info, say exactly: "Perfect — let me bring up the booking form so we can get this confirmed for you."

Never invent details. If unsure, direct them to ${DJ.email}.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages }),
  });
  const d = await res.json();
  return d.content?.[0]?.text || `Drop me a message directly at ${DJ.email} and I'll get back to you shortly.`;
}

// ─── HOOKS ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
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
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["about", "services", "faq", "book"];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(4,4,4,0.94)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.4s ease" }}>
      {/* Logo image — inverted so white logo shows on dark bg */}
      <img
        src={logo}
        alt="DJ Appz"
        onClick={() => setActive("home")}
        style={{ height: 52, objectFit: "contain", filter: "invert(1) brightness(1)", cursor: "pointer", opacity: 0.92 }}
      />
      <div style={{ display: "flex", gap: 36 }}>
        {links.map(l => (
          <button key={l} onClick={() => setActive(l)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: active === l ? "#fff" : "rgba(255,255,255,0.35)", transition: "color 0.2s", padding: 0 }}>
            {l}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function HeroSection({ onBook }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 3000); return () => clearInterval(t); }, []);
  const words = ["R&B", "Hip-Hop", "Neo-Soul", "Afrobeats"];

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>

      {/* Hero portrait — right side, fades left */}
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ position: "relative", width: "55%", height: "100%" }}>
          <img
            src={heroPhoto}
            alt="DJ Appz"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
          {/* Gradient fade — left edge blends into page */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #040404 0%, rgba(4,4,4,0.7) 30%, rgba(4,4,4,0.1) 70%, transparent 100%)" }} />
          {/* Bottom fade */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #040404 0%, transparent 40%)" }} />
        </div>
        {/* Fill left side */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "#040404" }} />
      </div>

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.015) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.015) 80px)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "120px 40px 80px", maxWidth: 620 }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.8)", marginBottom: 24, opacity: 0, animation: "fadeUp 0.8s 0.2s forwards" }}>
          LONDON · UK-WIDE · INTERNATIONAL
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(60px, 10vw, 100px)", lineHeight: 0.9, margin: "0 0 28px", color: "#fff", opacity: 0, animation: "fadeUp 0.8s 0.4s forwards" }}>
          DJ<br />
          <em style={{ color: "rgba(255,255,255,0.95)" }}>Appz</em>
        </h1>

        {/* Rotating genre ticker */}
        <div style={{ height: 28, overflow: "hidden", marginBottom: 40, opacity: 0, animation: "fadeUp 0.8s 0.6s forwards" }}>
          {words.map((w, i) => (
            <div key={w} style={{ height: 28, display: "flex", alignItems: "center", transform: `translateY(${(i - tick % words.length) * 28}px)`, transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 3, color: "rgba(180,140,80,0.9)", textTransform: "uppercase" }}>{w}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, opacity: 0, animation: "fadeUp 0.8s 0.8s forwards" }}>
          <button onClick={onBook} style={{ background: "#fff", color: "#040404", border: "none", borderRadius: 2, padding: "14px 36px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>
            Book Now
          </button>
          <button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, padding: "14px 36px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer" }}>
            About
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: 32, left: 40, display: "flex", alignItems: "center", gap: 12, opacity: 0, animation: "fadeUp 1s 1.2s forwards" }}>
        <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)" }} />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.25)" }}>SCROLL</span>
      </div>
    </section>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about-section" style={{ padding: "120px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Mixer photo — left column */}
        <Reveal>
          <div style={{ position: "relative" }}>
            <img
              src={mixerPhoto}
              alt="DJ Appz at the decks"
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "center top", borderRadius: 2, display: "block" }}
            />
            {/* Subtle gold border accent */}
            <div style={{ position: "absolute", bottom: -12, right: -12, width: "60%", height: "60%", border: "1px solid rgba(180,140,80,0.25)", borderRadius: 2, pointerEvents: "none" }} />
            {/* Stats overlay badge */}
            <div style={{ position: "absolute", bottom: 24, left: 24, background: "rgba(4,4,4,0.88)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "16px 20px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", fontStyle: "italic", lineHeight: 1 }}>200+</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2.5, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>EVENTS PLAYED</div>
            </div>
          </div>
        </Reveal>

        {/* Bio — right column */}
        <Reveal delay={0.2}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.7)", marginBottom: 20 }}>ABOUT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#fff", margin: "0 0 24px", lineHeight: 1.15 }}>
              The Sound of<br /><em>Every Room</em>
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.9, margin: "0 0 32px" }}>
              {DJ.bio}
            </p>
            {/* Genre tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
              {GENRES.map(g => (
                <span key={g} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: "rgba(180,140,80,0.7)", border: "1px solid rgba(180,140,80,0.2)", borderRadius: 1, padding: "5px 12px" }}>{g}</span>
              ))}
            </div>
            {/* Mini stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
              {[["4+", "Years"], ["4.9★", "Rated"], ["UK", "& Beyond"]].map(([val, label]) => (
                <div key={label} style={{ background: "#040404", padding: "20px 16px" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", fontStyle: "italic" }}>{val}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2.5, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ─── SERVICES ──────────────────────────────────────────────────────────────
function ServicesSection({ onBook }) {
  return (
    <section style={{ padding: "120px 40px", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.7)", marginBottom: 16 }}>SERVICES</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#fff", margin: 0 }}>What I Do</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div
                onClick={() => onBook(s.id)}
                style={{ background: "#040404", padding: "44px 40px", cursor: "pointer", transition: "background 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0c0c0c"}
                onMouseLeave={e => e.currentTarget.style.background = "#040404"}
              >
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, marginBottom: 14, color: "rgba(255,255,255,0.12)" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", margin: "0 0 8px", fontWeight: 400 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, margin: "0 0 28px" }}>{s.sub}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(180,140,80,0.8)", letterSpacing: 1 }}>{s.price}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>ENQUIRE →</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(x => (x + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t); }, []);
  const t = TESTIMONIALS[active];
  return (
    <section style={{ padding: "120px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.7)", marginBottom: 48 }}>KIND WORDS</div>
          <div style={{ minHeight: 160 }}>
            <p key={active} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 2.5vw, 26px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, margin: "0 0 32px", fontStyle: "italic", animation: "fadeUp 0.5s ease" }}>
              "{t.quote}"
            </p>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
              {t.name} — {t.event}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 28 : 6, height: 2, background: i === active ? "rgba(180,140,80,0.8)" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0, borderRadius: 1 }} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "120px 40px", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.7)", marginBottom: 16 }}>FAQ</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#fff", margin: "0 0 56px" }}>Common Questions</h2>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", letterSpacing: 0.3 }}>{f.q}</span>
                <span style={{ color: "rgba(180,140,80,0.6)", fontSize: 20, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.25s", marginLeft: 16, flexShrink: 0, lineHeight: 1 }}>+</span>
              </button>
              <div style={{ overflow: "hidden", maxHeight: open === i ? 200 : 0, transition: "max-height 0.35s ease", paddingBottom: open === i ? 22 : 0 }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, margin: 0 }}>{f.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
      </div>
    </section>
  );
}

// ─── BOOKING FORM ──────────────────────────────────────────────────────────
function BookingForm({ prefill, onSuccess }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", eventType: prefill || "", date: "", venue: "", guests: "", budget: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Required";
    if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email needed";
    if (!f.eventType) e.eventType = "Required";
    if (!f.date) e.date = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    const ok = await submitEnquiry(f);
    setSending(false);
    if (ok) onSuccess(f);
  };

  const iStyle = (k) => ({
    width: "100%", background: "none", border: "none",
    borderBottom: `1px solid ${errors[k] ? "rgba(200,80,80,0.6)" : "rgba(255,255,255,0.12)"}`,
    padding: "12px 0", fontFamily: "'Outfit', sans-serif", fontSize: 13,
    color: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  });

  const Label = ({ c }) => <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{c}</label>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone (optional)", "tel"]].map(([k, l, t]) => (
          <div key={k}>
            <Label c={l} />
            <input type={t} value={f[k]} onChange={e => set(k, e.target.value)} style={iStyle(k)} />
            {errors[k] && <span style={{ fontSize: 10, color: "rgba(200,80,80,0.8)" }}>{errors[k]}</span>}
          </div>
        ))}
        <div>
          <Label c="Event Type" />
          <select value={f.eventType} onChange={e => set("eventType", e.target.value)} style={{ ...iStyle("eventType"), color: f.eventType ? "#fff" : "rgba(255,255,255,0.25)", cursor: "pointer" }}>
            <option value="">Select…</option>
            {SERVICES.map(s => <option key={s.id} value={s.id} style={{ background: "#040404" }}>{s.title}</option>)}
          </select>
          {errors.eventType && <span style={{ fontSize: 10, color: "rgba(200,80,80,0.8)" }}>{errors.eventType}</span>}
        </div>
        <div>
          <Label c="Event Date" />
          <input type="date" value={f.date} onChange={e => set("date", e.target.value)} style={iStyle("date")} />
          {errors.date && <span style={{ fontSize: 10, color: "rgba(200,80,80,0.8)" }}>{errors.date}</span>}
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
      <button onClick={submit} disabled={sending} style={{ alignSelf: "flex-start", background: sending ? "rgba(255,255,255,0.1)" : "#fff", color: "#040404", border: "none", padding: "14px 44px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: sending ? "not-allowed" : "pointer", borderRadius: 1, fontWeight: 500 }}>
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </div>
  );
}

function BookingSection({ prefill, onSuccess }) {
  return (
    <section style={{ padding: "120px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.7)", marginBottom: 16 }}>BOOKINGS</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#fff", margin: "0 0 12px" }}>Let's Make It Happen</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "0 0 56px", lineHeight: 1.7 }}>Fill in the form and I'll be in touch within 24 hours to discuss your event.</p>
        </Reveal>
        <BookingForm prefill={prefill} onSuccess={onSuccess} />
      </div>
    </section>
  );
}

// ─── SUCCESS ───────────────────────────────────────────────────────────────
function SuccessSection({ form }) {
  return (
    <section style={{ padding: "120px 40px", minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, marginBottom: 24, color: "rgba(180,140,80,0.6)" }}>✓</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#fff", margin: "0 0 16px" }}>Enquiry Received</h2>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: "0 0 40px" }}>
          Thanks {form.name}. I'll review your details and be in touch at <span style={{ color: "rgba(180,140,80,0.8)" }}>{form.email}</span> within 24 hours.
        </p>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 2, padding: "24px 28px", textAlign: "left" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>SUMMARY</div>
          {[["Event", SERVICES.find(s => s.id === form.eventType)?.title || form.eventType], ["Date", form.date], ["Venue", form.venue || "TBC"], ["Guests", form.guests || "TBC"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "'Outfit', sans-serif", fontSize: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>{k}</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function FooterBar() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
      <span style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.25)", fontStyle: "italic", letterSpacing: 2 }}>DJ Appz</span>
      <div style={{ display: "flex", gap: 32 }}>
        {[DJ.instagram, DJ.email, DJ.location].map(l => (
          <span key={l} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1.5, color: "rgba(255,255,255,0.2)" }}>{l}</span>
        ))}
      </div>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1, color: "rgba(255,255,255,0.15)" }}>© 2026 DJ Appz</span>
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

  useEffect(() => {
    if (open) { setBadge(0); setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50); }
  }, [msgs, open]);

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
      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 52, height: 52, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 32px rgba(0,0,0,0.5)", transition: "transform 0.2s" }}>
        {open ? <span style={{ fontSize: 13, fontWeight: 700 }}>✕</span> : "💬"}
        {badge > 0 && !open && <span style={{ position: "absolute", top: -3, right: -3, background: "rgba(180,140,80,0.9)", color: "#fff", width: 18, height: 18, borderRadius: "50%", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{badge}</span>}
      </button>

      {open && (
        <div style={{ position: "fixed", bottom: 92, right: 28, zIndex: 199, width: 340, maxHeight: 500, background: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.8)", animation: "fadeUp 0.2s ease" }}>
          {/* Header */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={logo} alt="" style={{ height: 22, filter: "invert(1)", opacity: 0.8 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(100,200,100,0.8)" }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.3)" }}>ONLINE</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", background: m.role === "user" ? "#fff" : "rgba(255,255,255,0.06)", color: m.role === "user" ? "#040404" : "rgba(255,255,255,0.75)", padding: "10px 14px", borderRadius: 2, fontFamily: "'Outfit', sans-serif", fontSize: 12, lineHeight: 1.65 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "10px 14px" }}>
                {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: `blink 1s ${d}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding: "8px 12px 0", display: "flex", gap: 6, overflowX: "auto" }}>
            {quickReplies.map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{ background: "none", border: "1px solid rgba(180,140,80,0.25)", borderRadius: 1, padding: "5px 10px", color: "rgba(180,140,80,0.7)", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px 14px", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask me anything…" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "9px 12px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
            <button onClick={() => send()} style={{ background: "#fff", border: "none", borderRadius: 2, width: 36, height: 36, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}


// ─── MIXES ─────────────────────────────────────────────────────────────────
function MixesSection() {
  return (
    <section style={{ padding: "120px 40px", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 4, color: "rgba(180,140,80,0.7)", marginBottom: 16 }}>LISTEN</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#fff", margin: "0 0 12px" }}>Hear the Sound</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: 480 }}>
              A selection of recorded sets — the best way to get a feel for the vibe before you book.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {MIXES.map((mix, i) => (
            <Reveal key={mix.id} delay={i * 0.15}>
              <div style={{ background: "#040404", padding: "32px 32px 28px" }}>
                {/* Label */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", margin: "0 0 6px", fontWeight: 400 }}>{mix.title}</h3>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, margin: 0 }}>{mix.subtitle}</p>
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 2, color: "rgba(180,140,80,0.7)", border: "1px solid rgba(180,140,80,0.2)", padding: "4px 10px", borderRadius: 1, whiteSpace: "nowrap", marginLeft: 16 }}>
                    {mix.tag}
                  </span>
                </div>
                {/* Mixcloud embed */}
                <div style={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <iframe
                    width="100%"
                    height="120"
                    src={mix.src}
                    frameBorder="0"
                    allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                    title={mix.title}
                    style={{ display: "block" }}
                  />
                </div>
                {/* Mixcloud link */}
                <div style={{ marginTop: 14, textAlign: "right" }}>
                  <a
                    href="https://www.mixcloud.com/DJAppz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                  >
                    MORE ON MIXCLOUD →
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("home");
  const [bookPrefill, setBookPrefill] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const goBook = (service = "") => {
    setBookPrefill(service);
    setSection("book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #040404; color: #fff; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #040404; }
        ::-webkit-scrollbar-thumb { background: rgba(180,140,80,0.3); }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
        select option { background: #040404; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }
        button:hover { opacity: 0.82; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#040404" }}>
        <NavBar active={section} setActive={setSection} />

        {section === "home" && (
          <>
            <HeroSection onBook={() => goBook()} />
            <AboutSection />
            <MixesSection />
            <ServicesSection onBook={goBook} />
            <TestimonialsSection />
            <FAQSection />
            {/* CTA strip */}
            <section style={{ padding: "100px 40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroPhoto})`, backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.06 }} />
              <Reveal>
                <div style={{ position: "relative" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 52px)", color: "#fff", margin: "0 0 16px" }}>Ready to <em>book?</em></h2>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "0 0 36px" }}>Let's talk about your event.</p>
                  <button onClick={() => goBook()} style={{ background: "#fff", color: "#040404", border: "none", padding: "15px 48px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", borderRadius: 1, fontWeight: 500 }}>
                    Get in Touch
                  </button>
                </div>
              </Reveal>
            </section>
          </>
        )}

        {section === "about" && (<><div style={{ paddingTop: 68 }} /><AboutSection /></>)}
        {section === "services" && (<><div style={{ paddingTop: 68 }} /><ServicesSection onBook={goBook} /></>)}
        {section === "faq" && (<><div style={{ paddingTop: 68 }} /><FAQSection /></>)}
        {section === "book" && (
          <><div style={{ paddingTop: 68 }} />{submitted ? <SuccessSection form={submitted} /> : <BookingSection prefill={bookPrefill} onSuccess={setSubmitted} />}</>
        )}

        <FooterBar />
      </div>

      <ChatBot onOpenBook={goBook} />
    </>
  );
}
