/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import logo from "./Assets/djappz-logo.png";
import heroPhoto from "./Assets/djappz-bio.jpeg";
import showreel from "./Assets/showreel-djappz.mp4";
import mixerPhoto from "./Assets/djappz-photo.jpg";
import streetPhoto from "./Assets/djappz-mixer.jpeg";
import weddingPhoto from "./Assets/djappz-wedding.jpeg";
import crowdPhoto from "./Assets/djappz - Crowd Shot.png";
import logoDirtyMartini from "./Assets/brand-dirtymartini.png";
import logoBelushis from "./Assets/brand-belushis.png";
import logoBoxpark from "./Assets/brand-boxpark.png";
import logoJubel from "./Assets/brand-jubel.png";
import logoLightbox from "./Assets/brand-lightbox.png";
import logoSimmons from "./Assets/brand-simmons.png";

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
  bio: "DJ Appz is a London-based DJ, entertainer, and former professional dancer with over 4 years of experience behind the decks. Specialising in R&B, Hip-Hop, Soul, Afrobeats and Dancehall, he brings a performer's instinct to every set — reading the crowd, building energy, and keeping the floor moving from first track to last. He has played at some of London's most respected venues including Boxpark, Dirty Martini, All Bar One, Lightbox Vauxhall, Simmons Bars, and Proper Snacks, as well as a growing portfolio of private events, weddings, and corporate functions across the UK.",
  email: "dj-appz@outlook.com",
  location: "London, UK",
  instagram: "@djappz",
};

const GENRES = ["R&B", "Hip-Hop", "Neo-Soul", "Afrobeats", "Dancehall", "Old School", "House", "Commercial", "Funk"];

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
  const links = ["home", "about", "services", "faq", "enquire"];
  const nav = (l) => { setActive(l === "enquire" ? "book" : l); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 48px", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,20,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", transition: "all 0.4s ease" }}>
        <div onClick={() => nav("home")} style={{ cursor: "pointer", height: 44, display: "flex", alignItems: "center" }}>
          <img src={logo} alt="DJ Appz" style={{ height: 44, objectFit: "contain", filter: "invert(1) brightness(2)", opacity: 0.95 }} />
        </div>
        {isMobile ? (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ffffff", fontSize: 14, padding: 4 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 36 }}>
            {links.map(l => (
              <button key={l} onClick={() => nav(l)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: (l === "enquire" ? active === "book" : active === l) ? "#ffffff" : "rgba(255,255,255,0.55)", transition: "color 0.2s", padding: 0 }}>{l}</button>
            ))}
          </div>
        )}
      </nav>
      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.99)", borderBottom: "1px solid rgba(240,240,240,0.1)", padding: "16px 0" }}>
          {links.map(l => (
            <button key={l} onClick={() => nav(l)} style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color: (l === "enquire" ? active === "book" : active === l) ? "#ffffff" : "rgba(255,255,255,0.55)", padding: "16px 24px", textAlign: "left" }}>{l}</button>
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
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1950); return () => clearInterval(t); }, []);
  const words = GENRES;
  return (
    <section style={{ minHeight: isMobile ? "55svh" : "60vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", width: "100%" }}>
      {/* Showreel video background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
        >
          <source src={showreel} type="video/mp4" />
          {/* Fallback to photo if video fails */}
          <img src={heroPhoto} alt="DJ Appz" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </video>
        {/* Overlay — light ivory wash so text stays readable */}
        <div style={{ position: "absolute", inset: 0, background: isMobile
          ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%)"
        }} />
      </div>

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(17,17,17,0.02) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(17,17,17,0.02) 80px)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "100px 24px 36px" : "150px 48px 45px", maxWidth: isMobile ? "100%" : 640, width: "100%", boxSizing: "border-box" }}>
        


        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s 0.8s forwards" }}>
          <button onClick={onBook} style={{ background: "#fff", color: "#ffffff", border: "none", borderRadius: 2, padding: "14px 36px", fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>Enquire Now</button>
          <button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2, padding: "14px 36px", fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer" }}>About</button>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────
function AboutSection() {
  const isMobile = useIsMobile();
  return (
    <section id="about-section" style={{ padding: isMobile ? "61px 24px" : "68px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80, alignItems: "center" }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <img src={streetPhoto} alt="DJ Appz" style={{ width: "100%", aspectRatio: isMobile ? "4/3" : "3/4", objectFit: "cover", objectPosition: "center 15%", borderRadius: 2, display: "block" }} />
            <div style={{ position: "absolute", bottom: -10, right: -10, width: "60%", height: "60%", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(17,17,17,0.88)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2, padding: "14px 18px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", fontStyle: "italic", lineHeight: 1 }}>200+</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2.5, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>EVENTS PLAYED</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={isMobile ? 0 : 0.2}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 20 }}>ABOUT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 14px", lineHeight: 1.15 }}>The Sound of<br /><em>Every Room</em></h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 18px" }}>{DJ.bio}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {GENRES.map(g => <span key={g} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 21, letterSpacing: 2, color: "rgba(245,166,35,0.85)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 1, padding: "5px 12px" }}>{g}</span>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.1)" }}>
              {[["4+", "Years"], ["4.9★", "Rated"], ["UK", "& Beyond"]].map(([val, label]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.08)", padding: "20px 16px" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", fontStyle: "italic" }}>{val}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2.5, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{label}</div>
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
    <section style={{ padding: isMobile ? "50px 24px" : "73px 48px", background: "rgba(255,255,255,0.03)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>LISTEN</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 8px" }}>Hear the Sound</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 480 }}>A selection of recorded sets — the best way to get a feel for the vibe before you book.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 16 : 1, background: isMobile ? "transparent" : "rgba(255,255,255,0.1)" }}>
          {MIXES.map((mix, i) => (
            <Reveal key={mix.id} delay={i * 0.15}>
              <div style={{ background: "#fff", padding: isMobile ? "20px 18px" : "28px 28px 24px", borderRadius: isMobile ? 4 : 0, border: "1px solid rgba(17,17,17,0.07)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexDirection: "row", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#ffffff", margin: "0 0 4px", fontWeight: 400, lineHeight: 1.3 }}>{mix.title}</h3>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1, margin: 0 }}>{mix.subtitle}</p>
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, letterSpacing: 1.5, color: "rgba(245,166,35,0.85)", border: "1px solid rgba(245,166,35,0.2)", padding: "4px 10px", borderRadius: 1, whiteSpace: "nowrap", flexShrink: 0 }}>{mix.tag}</span>
                </div>
                <div style={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <iframe width="100%" height="120" src={mix.src} frameBorder="0" allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share" title={mix.title} style={{ display: "block", width: "100%" }} />
                </div>
                <div style={{ marginTop: 12, textAlign: "right" }}>
                  <a href="https://www.mixcloud.com/DJAppz/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, letterSpacing: 2, color: "rgba(245,166,35,0.7)", textDecoration: "none" }}>MORE ON MIXCLOUD →</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}




// ─── GENRE BANNER ──────────────────────────────────────────────────────────
function GenreBanner() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1950); return () => clearInterval(t); }, []);
  const words = GENRES;
  return (
    <div style={{ background: "transparent", padding: "14px 0", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", transform: `translateX(-${(tick % words.length) * 140}px)`, transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", whiteSpace: "nowrap" }}>
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 3, color: "rgba(245,166,35,0.9)", textTransform: "uppercase", marginRight: 0, display: "inline-block", padding: "0 28px" }}>
            {w} <span style={{ color: "rgba(245,166,35,0.4)", marginLeft: 4 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── WELCOME SECTION ───────────────────────────────────────────────────────
function WelcomeSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "43px 24px" : "61px 48px", textAlign: "center", background: "rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16, textTransform: "uppercase" }}>Welcome</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 26 : 34, color: "#ffffff", margin: "0 0 20px", lineHeight: 1.25 }}>
            London's DJ for <em>Every Occasion</em>
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 13 : 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 auto", maxWidth: 580 }}>
            From intimate private events to weddings, corporate functions and club nights — DJ Appz delivers seamless sets rooted in R&B, Hip-Hop, Afrobeats and Soul. Based in London, available UK-wide and internationally.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── QUICK NAV SECTION ─────────────────────────────────────────────────────
function QuickNavSection({ onBook, setSection }) {
  const isMobile = useIsMobile();
  const cards = [
    {
      id: "services",
      label: "Services",
      tag: "What I Offer",
      desc: "Private events, weddings, corporate functions, club & bar residencies.",
      icon: "🎧",
      action: () => setSection("services"),
    },
    {
      id: "mixes",
      label: "Mixes",
      tag: "Listen",
      desc: "Recorded sets across R&B, Hip-Hop, Dancehall and more.",
      icon: "🎵",
      action: () => setSection("mixes"),
    },
    {
      id: "enquire",
      label: "Enquire",
      tag: "Book a Date",
      desc: "Tell me about your event and I'll be in touch within 24 hours.",
      icon: "📩",
      action: () => onBook(),
    },
    {
      id: "faq",
      label: "FAQ",
      tag: "Common Questions",
      desc: "Pricing, equipment, travel, music consultation and more.",
      icon: "💬",
      action: () => setSection("faq"),
    },

  ];

  return (
    <section style={{ padding: isMobile ? "50px 24px" : "73px 48px", background: "rgba(255,255,255,0.03)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>EXPLORE</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 24 : 32, color: "#ffffff", margin: 0 }}>What Would You Like to Do?</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 12 : 16, background: "transparent" }}>
          {cards.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.1}>
              <div
                onClick={c.action}
                style={{ background: "#fff", padding: isMobile ? "28px 20px" : "48px 36px", cursor: "pointer", transition: "all 0.3s", borderRadius: isMobile ? 6 : 2, border: "1px solid rgba(255,255,255,0.08)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(255,255,255,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,240,240,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "none"; }}
              >
                <div>
                  <div style={{ fontSize: isMobile ? 32 : 44, marginBottom: 18 }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, letterSpacing: 2.5, color: "rgba(245,166,35,0.8)", marginBottom: 8, textTransform: "uppercase" }}>{c.tag}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 17 : 20, color: "#ffffff", margin: "0 0 8px", fontWeight: 500 }}>{c.label}</h3>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                </div>
                <div style={{ marginTop: 28, fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2, color: "rgba(245,166,35,0.9)", fontWeight: 500 }}>
                  {c.label === "Enquire" ? "GET IN TOUCH →" : c.label === "Mixes" ? "LISTEN NOW →" : `VIEW ${c.label.toUpperCase()} →`}
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
    <section style={{ padding: isMobile ? "61px 24px" : "68px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>SERVICES</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: 0 }}>What I Do</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 12 : 16, background: "transparent" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div onClick={() => onBook(s.id)} style={{ background: "#fff", padding: isMobile ? "28px 24px" : "44px 40px", cursor: "pointer", transition: "background 0.3s", borderRadius: isMobile ? 4 : 0, border: "1px solid rgba(255,255,255,0.06)" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <div style={{ fontSize: 36, marginBottom: 12, color: "rgba(255,255,255,0.3)" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#ffffff", margin: "0 0 8px", fontWeight: 400 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 1.5, margin: "0 0 24px" }}>{s.sub}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(245,166,35,1)", letterSpacing: 1 }}>{s.price}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(245,166,35,1)", letterSpacing: 2, fontWeight: 600 }}>ENQUIRE →</span>
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
  const isMobile = useIsMobile();
  useEffect(() => { const t = setInterval(() => setActive(x => (x + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t); }, []);
  const t = TESTIMONIALS[active];
  return (
    <section style={{ padding: isMobile ? "50px 24px" : "73px 48px", background: "rgba(255,255,255,0.03)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 40 }}>KIND WORDS</div>
          <div style={{ minHeight: 160 }}>
            <p key={active} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(17,17,17,0.9)", lineHeight: 1.65, margin: "0 0 28px", fontStyle: "italic", animation: "fadeUp 0.5s ease" }}>"{t.quote}"</p>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: 2 }}>{t.name} — {t.event}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
            {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 28 : 6, height: 2, background: i === active ? "rgba(245,166,35,0.9)" : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0, borderRadius: 1 }} />)}
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
    <section style={{ padding: isMobile ? "61px 24px" : "68px 48px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>FAQ</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 50px)", color: "#ffffff", margin: "0 0 48px" }}>Common Questions</h2>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div style={{ borderTop: "1px solid rgba(240,240,240,0.1)" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "rgba(240,240,240,0.8)" }}>{f.q}</span>
                <span style={{ color: "rgba(245,166,35,0.85)", fontSize: 22, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.25s", flexShrink: 0, lineHeight: 1 }}>+</span>
              </button>
              <div style={{ overflow: "hidden", maxHeight: open === i ? 300 : 0, transition: "max-height 0.35s ease", paddingBottom: open === i ? 20 : 0 }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0 }}>{f.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <div style={{ borderTop: "1px solid rgba(240,240,240,0.1)" }} />
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
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", borderBottom: `1px solid ${error ? "rgba(200,80,80,0.6)" : "rgba(255,255,255,0.2)"}`, padding: "12px 0", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: value ? "#ffffff" : "rgba(255,255,255,0.35)", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{value || "Select a date…"}</span>
        <span style={{ color: "rgba(245,166,35,0.75)", fontSize: 14 }}>📅</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: isMobile ? "50%" : 0, transform: isMobile ? "translateX(-50%)" : "none", zIndex: 300, background: "#1a1a2e", border: "1px solid rgba(240,240,240,0.15)", borderRadius: 4, padding: 16, width: isMobile ? "calc(100vw - 48px)" : 300, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button type="button" onClick={prevMonth} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 18, padding: "4px 10px" }}>‹</button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#ffffff", fontStyle: "italic" }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 18, padding: "4px 10px" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
            {DAYS.map(d => <div key={d} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 1, color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const past = isPast(day); const sel = isSelected(day); const tod = isToday(day);
              return (
                <button type="button" key={day} onClick={() => !past && selectDate(day)} style={{ background: sel ? "rgba(245,166,35,0.95)" : tod ? "rgba(255,255,255,0.12)" : "none", border: tod && !sel ? "1px solid rgba(245,166,35,0.3)" : "1px solid transparent", borderRadius: 2, padding: "8px 0", fontFamily: "'Outfit', sans-serif", fontSize: 14, color: past ? "rgba(255,255,255,0.25)" : sel ? "rgba(255,255,255,0.05)" : "#ffffff", cursor: past ? "not-allowed" : "pointer", textAlign: "center", fontWeight: sel ? 600 : 400 }}
                  onMouseEnter={e => { if (!past && !sel) e.currentTarget.style.background = "rgba(245,166,35,0.15)"; }}
                  onMouseLeave={e => { if (!past && !sel) e.currentTarget.style.background = "none"; }}>
                  {day}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BOOKING FORM ──────────────────────────────────────────────────────────
function BookingForm({ prefill, onSuccess, onPrivacyClick }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", eventType: prefill || "", date: "", venue: "", guests: "", budget: "", notes: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
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
    if (!privacyAccepted) e.privacy = "Please accept our Privacy Policy to continue";
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

  const iStyle = (k) => ({ width: "100%", background: "none", border: "none", borderBottom: `1px solid ${errors[k] ? "rgba(200,80,80,0.7)" : "rgba(255,255,255,0.25)"}`, padding: "12px 0", fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#ffffff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" });
  const Label = ({ c }) => <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{c}</label>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 24 }}>
        {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone (optional)", "tel"]].map(([k, l, t]) => (
          <div key={k}>
            <Label c={l} />
            <input type={t} value={f[k]} onChange={e => set(k, e.target.value)} style={iStyle(k)} placeholder={t === "tel" ? "+44 7700 000000" : ""} />
            {errors[k] && <span style={{ fontSize: 11, color: "rgba(200,80,80,0.8)", marginTop: 4, display: "block" }}>{errors[k]}</span>}
          </div>
        ))}
        <div>
          <Label c="Event Type" />
          <select value={f.eventType} onChange={e => set("eventType", e.target.value)} style={{ ...iStyle("eventType"), color: f.eventType ? "#ffffff" : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
            <option value="">Select your event type…</option>
            {SERVICES.map(s => <option key={s.id} value={s.title} style={{ background: "rgba(255,255,255,0.05)" }}>{s.title}</option>)}
          </select>
          {errors.eventType && <span style={{ fontSize: 11, color: "rgba(200,80,80,0.8)", marginTop: 4, display: "block" }}>{errors.eventType}</span>}
        </div>
        <div>
          <Label c="Event Date" />
          <DatePicker value={f.date} onChange={v => set("date", v)} error={errors.date} />
          {errors.date && <span style={{ fontSize: 11, color: "rgba(200,80,80,0.8)", marginTop: 4, display: "block" }}>{errors.date}</span>}
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
      {/* Privacy Notice */}
      <div style={{ borderTop: "1px solid rgba(240,240,240,0.1)", paddingTop: 20 }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 12px" }}>
          We will use the information you provide to respond to your enquiry, discuss your event requirements, and where applicable take steps towards entering into a contract for DJ services. For more information, please see our{" "}
          <button type="button" onClick={() => onPrivacyClick && onPrivacyClick()} style={{ background: "none", border: "none", padding: 0, fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(245,166,35,0.9)", cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</button>.
        </p>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} style={{ marginTop: 3, width: 15, height: 15, cursor: "pointer", accentColor: "#F5A623", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(240,240,240,0.7)", lineHeight: 1.6 }}>I have read and understood the Privacy Policy.</span>
        </label>
        {errors.privacy && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(200,80,80,0.9)", margin: "8px 0 0 26px" }}>{errors.privacy}</p>}
      </div>
      {sendError && <div style={{ background: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.3)", borderRadius: 2, padding: "12px 16px", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,150,150,0.9)" }}>Something went wrong sending your enquiry. Please email us directly at {DJ.email}</div>}
      <button onClick={submit} disabled={sending} style={{ alignSelf: isMobile ? "stretch" : "flex-start", background: sending ? "rgba(240,240,240,0.1)" : "#ffffff", color: "rgba(255,255,255,0.05)", border: "none", padding: "16px 48px", fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: sending ? "not-allowed" : "pointer", borderRadius: 1, fontWeight: 500, textAlign: "center" }}>
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </div>
  );
}

function BookingSection({ prefill, onSuccess, onPrivacyClick }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "61px 24px" : "68px 48px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>ENQUIRIES</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 50px)", color: "#ffffff", margin: "0 0 12px" }}>Let's Make It Happen</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 48px", lineHeight: 1.7 }}>Fill in the form and I'll be in touch within 24 hours to discuss your event.</p>
        </Reveal>
        <BookingForm prefill={prefill} onSuccess={onSuccess} onPrivacyClick={onPrivacyClick} />
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
    <section style={{ padding: isMobile ? "61px 24px" : "68px 48px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, color: "rgba(245,166,35,0.95)", margin: "0 auto 28px", animation: "pulseRing 2s ease-in-out infinite" }}>✓</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>ENQUIRY RECEIVED</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 20px", lineHeight: 1.2 }}>You're on our <em>radar</em>, {form.name.split(" ")[0]}.</h2>
        <div style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 4, padding: "20px 24px", marginBottom: 20, textAlign: "left" }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.9, margin: 0 }}>
            Your booking enquiry has been successfully submitted. A member of the <strong style={{ color: "#ffffff" }}>DJ Appz</strong> team will be in touch at <strong style={{ color: "rgba(245,166,35,0.95)" }}>{form.email}</strong> within <strong style={{ color: "#ffffff" }}>24 hours</strong>. A confirmation has also been sent to your email.
          </p>
        </div>
        <div style={{ background: "rgba(17,17,17,0.02)", border: "1px solid rgba(240,240,240,0.1)", borderRadius: 4, padding: "20px 24px", textAlign: "left", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>YOUR BOOKING SUMMARY</div>
          {[["Event Type", form.eventType], ["Date", form.date], ["Venue", form.venue || "TBC"], ["Guests", form.guests || "TBC"], ["Budget", form.budget || "TBC"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
              <span style={{ color: "rgba(240,240,240,0.8)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(17,17,17,0.02)", border: "1px solid rgba(240,240,240,0.1)", borderRadius: 4, padding: "20px 24px", textAlign: "left", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>WHAT HAPPENS NEXT</div>
          {[["01", "We review your enquiry and check availability for your date"], ["02", "You'll receive a personalised response within 24 hours"], ["03", "We'll confirm details, discuss your music preferences, and send a quote"], ["04", "A 25% deposit secures your booking"]].map(([num, text]) => (
            <div key={num} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "rgba(245,166,35,0.6)", fontStyle: "italic", flexShrink: 0, lineHeight: 1.4 }}>{num}</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>Direct line: <span style={{ color: "rgba(245,166,35,0.75)" }}>{DJ.email}</span></p>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function FooterBar({ onPrivacy }) {
  const isMobile = useIsMobile();
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: isMobile ? "32px 24px" : "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, background: "#0a0a0a" }}>
      <img src={logo} alt="DJ Appz" style={{ height: 36, objectFit: "contain", filter: "brightness(10)", opacity: 0.8 }} />
      <div style={{ display: "flex", gap: isMobile ? 16 : 28, flexWrap: "wrap" }}>
        {[DJ.instagram, DJ.email, DJ.location].map(l => <span key={l} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.35)" }}>{l}</span>)}
      </div>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.3)" }}>© 2026 DJ Appz</span>
    </footer>
  );
}



// ─── PRIVACY MODAL ─────────────────────────────────────────────────────────
function PrivacyModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const sections = [
    { title: "1. Who We Are", body: "DJ Appz (\"we\", \"us\", \"our\") provides professional DJ and entertainment services across the UK.\n\nData Controller\nName: Jesse Appiah (DJ Appz)\nEmail: dj-appz@outlook.com\nPhone: Available on request\nBusiness: London, UK\nWebsite: www.dj-appz.com" },
    { title: "2. Personal Information We Collect", body: "When you contact us through our website, email, phone, social media, or booking forms, we may collect:\n\n• Name\n• Email address\n• Telephone number\n• Event details (date, venue, type of event, requirements)\n• Any other information you choose to provide\n\nWe may also collect limited technical information when you visit our website, such as IP address, browser type, and website usage data." },
    { title: "3. How We Use Your Information", body: "We use your personal information to:\n\n• Respond to enquiries and booking requests\n• Provide quotations\n• Communicate regarding potential or confirmed bookings\n• Prepare and perform contracts for DJ services\n• Manage payments and invoices\n• Meet legal, accounting, and tax obligations\n• Improve our services and website\n\nWe do not sell your personal information to third parties." },
    { title: "4. Our Legal Basis for Processing", body: "Under the UK GDPR and EU GDPR, we rely on the following lawful bases:\n\nContract — Processing is necessary to take steps at your request before entering into a contract or to perform a contract with you. This includes responding to booking enquiries, preparing quotes, and managing confirmed bookings.\n\nLegitimate Interests — We may process information where it is necessary for our legitimate business interests, including managing customer relationships, maintaining business records, and improving our services.\n\nLegal Obligations — We may process personal information where required to comply with legal obligations, including tax and accounting requirements." },
    { title: "5. How Long We Keep Your Information", body: "Enquiry data that does not result in a booking will generally be retained for up to 12 months.\n\nBooking, contract, and financial records may be retained for up to 7 years to comply with legal, tax, and accounting requirements.\n\nWe will not keep personal data longer than necessary." },
    { title: "6. Sharing Your Information", body: "We may share information with:\n\n• Accountants and professional advisers\n• Payment providers\n• Website hosting providers\n• Cloud storage and business software providers\n• Government authorities where required by law\n\nWe only share information where necessary and appropriate safeguards are in place." },
    { title: "7. International Transfers", body: "Where service providers process data outside the UK or European Economic Area, we will ensure appropriate safeguards are in place, including approved contractual protections where required." },
    { title: "8. Your Rights", body: "Under applicable data protection laws, you may have the right to:\n\n• Access your personal information\n• Correct inaccurate information\n• Request deletion of your information\n• Restrict processing\n• Object to processing\n• Request transfer of your data where applicable\n• Lodge a complaint with a supervisory authority" },
    { title: "9. Complaints", body: "If you have concerns about how we process your personal information, please contact us first at dj-appz@outlook.com.\n\nUK residents may also complain to the Information Commissioner's Office (ICO) at ico.org.uk." },
    { title: "10. Contact Us", body: "DJ Appz\nEmail: dj-appz@outlook.com\nWebsite: www.dj-appz.com\nLocation: London, UK\n\nFor any questions about this Privacy Policy or your personal information, please contact us directly." },
  ];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}
    >
      <div style={{ background: "#1a1a2e", borderRadius: 4, width: "100%", maxWidth: 640, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(240,240,240,0.1)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, letterSpacing: 3, color: "rgba(245,166,35,0.8)", marginBottom: 6, textTransform: "uppercase" }}>Legal</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 4px", fontWeight: 500 }}>Privacy Policy</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>DJ Appz · Last updated May 2026</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(240,240,240,0.15)", borderRadius: 2, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 16 }}>✕</button>
        </div>
        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "24px 28px", flex: 1 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#ffffff", margin: "0 0 10px", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8 }}>{s.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "transparent", color: "rgba(255,255,255,0.05)", border: "none", borderRadius: 2, padding: "11px 28px", fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", width: "100%" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRIVACY POLICY ────────────────────────────────────────────────────────
function PrivacyPolicy() {
  const isMobile = useIsMobile();
  const sections = [
    { title: "1. Who We Are", content: `DJ Appz ("we", "us", "our") provides professional DJ and entertainment services.\n\nData Controller:\nName: Jesse Appiah (DJ Appz)\nEmail: dj-appz@outlook.com\nBusiness: London, UK` },
    { title: "2. Personal Information We Collect", content: `When you contact us through our website, email, phone, or booking forms, we may collect:\n\n• Name\n• Email address\n• Telephone number\n• Event details (date, venue, type of event, requirements)\n• Any other information you choose to provide\n\nWe may also collect limited technical information when you visit our website, such as IP address, browser type, and website usage data.` },
    { title: "3. How We Use Your Information", content: `We use your personal information to:\n\n• Respond to enquiries and booking requests\n• Provide quotations\n• Communicate regarding potential or confirmed bookings\n• Prepare and perform contracts for DJ services\n• Manage payments and invoices\n• Meet legal, accounting, and tax obligations\n• Improve our services and website\n\nWe do not sell your personal information to third parties.` },
    { title: "4. Our Legal Basis for Processing", content: `Under the UK GDPR and EU GDPR, we rely on the following lawful bases:\n\nContract — Processing is necessary to take steps at your request before entering into a contract or to perform a contract with you, including responding to booking enquiries, preparing quotes, and managing confirmed bookings.\n\nLegitimate Interests — We may process information where it is necessary for our legitimate business interests, including managing customer relationships, maintaining business records, and improving our services.\n\nLegal Obligations — We may process personal information where required to comply with legal obligations, including tax and accounting requirements.` },
    { title: "5. How Long We Keep Your Information", content: `Enquiry data that does not result in a booking will generally be retained for up to 12 months.\n\nBooking, contract, and financial records may be retained for up to 7 years to comply with legal, tax, and accounting requirements.\n\nWe will not keep personal data longer than necessary.` },
    { title: "6. Sharing Your Information", content: `We may share information with:\n\n• Accountants and professional advisers\n• Payment providers\n• Website hosting providers\n• Cloud storage and business software providers\n• Government authorities where required by law\n\nWe only share information where necessary and appropriate safeguards are in place.` },
    { title: "7. International Transfers", content: `Where service providers process data outside the UK or European Economic Area, we will ensure appropriate safeguards are in place, including approved contractual protections where required.` },
    { title: "8. Your Rights", content: `Under applicable data protection laws, you may have the right to:\n\n• Access your personal information\n• Correct inaccurate information\n• Request deletion of your information\n• Restrict processing\n• Object to processing\n• Request transfer of your data where applicable\n• Lodge a complaint with a supervisory authority` },
    { title: "9. Complaints", content: `If you have concerns about how we process your personal information, please contact us first.\n\nUK residents may also complain to the Information Commissioner's Office (ICO) at ico.org.uk.` },
    { title: "10. Contact Us", content: `If you have any questions about this Privacy Policy or your personal information, please contact:\n\nDJ Appz\nEmail: dj-appz@outlook.com\nWebsite: www.dj-appz.com` },
  ];

  return (
    <section style={{ padding: isMobile ? "61px 24px" : "68px 48px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, letterSpacing: 3, color: "rgba(245,166,35,0.75)", marginBottom: 12 }}>LEGAL</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 8px" }}>Privacy Policy</h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 48px" }}>Last updated: May 2026</p>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {sections.map((s, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div style={{ borderTop: "1px solid rgba(240,240,240,0.1)", paddingTop: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#ffffff", margin: "0 0 14px", fontWeight: 500 }}>{s.title}</h2>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>{s.content}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── MIXES PAGE ─────────────────────────────────────────────────────────────
function MixesPage() {
  const isMobile = useIsMobile();

  const allMixes = [
    ...MIXES,
    // Add more mixes here as you upload them to Mixcloud
  ];

  return (
    <section style={{ padding: isMobile ? "61px 24px" : "68px 48px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 25, letterSpacing: 4, color: "rgba(245,166,35,0.85)", marginBottom: 16 }}>LISTEN</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 12px" }}>Mixes</h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 48px", maxWidth: 560 }}>
            A selection of recorded sets — the best way to hear the sound before you book. More mixes available on Mixcloud.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.1)" }}>
          {allMixes.map((mix, i) => (
            <Reveal key={mix.id} delay={i * 0.1}>
              <div style={{ background: "#fff", padding: isMobile ? "24px 20px" : "32px 40px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 40, alignItems: isMobile ? "flex-start" : "center" }}>
                {/* Mix info */}
                <div style={{ flex: "0 0 auto", width: isMobile ? "100%" : 260 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, letterSpacing: 2, color: "rgba(245,166,35,0.85)", border: "1px solid rgba(245,166,35,0.25)", padding: "3px 10px", borderRadius: 1, display: "inline-block", marginBottom: 10 }}>{mix.tag}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#ffffff", margin: "0 0 6px", fontWeight: 400, lineHeight: 1.3 }}>{mix.title}</h3>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1, margin: 0 }}>{mix.subtitle}</p>
                </div>

                {/* Mixcloud player */}
                <div style={{ flex: 1, width: "100%", borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <iframe
                    width="100%"
                    height="120"
                    src={mix.src}
                    frameBorder="0"
                    allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                    title={mix.title}
                    style={{ display: "block", width: "100%" }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mixcloud CTA */}
        <Reveal delay={0.3}>
          <div style={{ marginTop: 40, textAlign: "center", padding: "40px 32px", background: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 3, color: "rgba(245,166,35,0.8)", marginBottom: 12 }}>MORE SETS</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#ffffff", margin: "0 0 10px", fontWeight: 400 }}>Find More on Mixcloud</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 24px" }}>Full archive of mixes, radio sets and live recordings available on the DJ Appz Mixcloud profile.</p>
            <a
              href="https://www.mixcloud.com/DJAppz/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.05)", padding: "12px 32px", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", borderRadius: 1 }}
            >
              Visit Mixcloud →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


// ─── CROWD SECTION ─────────────────────────────────────────────────────────
function CrowdSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ position: "relative", overflow: "hidden", height: isMobile ? 280 : 420 }}>
      <img
        src={crowdPhoto}
        alt="DJ Appz live"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
      />
      {/* Overlay with text */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(240,240,240,0.8) 0%, rgba(240,240,240,0.4) 55%, rgba(240,240,240,0.1) 100%)" }}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", padding: isMobile ? "0 24px" : "0 56px", boxSizing: "border-box", width: "100%", overflow: "hidden" }}>
          <div style={{ maxWidth: isMobile ? "100%" : 500 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, letterSpacing: 4, color: "rgba(245,166,35,0.9)", marginBottom: 14, textTransform: "uppercase" }}>Live Experience</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 24 : 38, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>
              Every Room.<br /><em>Every Crowd.</em>
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 12 : 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 380, margin: 0 }}>
              From intimate gatherings to packed floors — the energy is always right.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── VENUE LOGOS ───────────────────────────────────────────────────────────
function VenueLogosSection() {
  const logos = [
    { src: logoBoxpark, alt: "Boxpark" },
    { src: logoDirtyMartini, alt: "Dirty Martini" },
    { src: logoBelushis, alt: "Belushi's" },
    { src: logoJubel, alt: "Jubel" },
    { src: logoLightbox, alt: "Lightbox" },
    { src: logoSimmons, alt: "Simmons Bars" },
  ];

  // Duplicate for seamless loop
  const allLogos = [...logos, ...logos];

  return (
    <section style={{ padding: "59px 0", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 42 }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>As Seen At</div>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #f5f0e8, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #f5f0e8, transparent)", zIndex: 2, pointerEvents: "none" }} />
        {/* Marquee track */}
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
          {allLogos.map((logo, i) => (
            <div key={i} style={{ flexShrink: 0, width: 240, height: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px", marginRight: 24 }}>
              <img
                src={logo.src}
                alt={logo.alt}
                style={{ maxHeight: 84, maxWidth: 180, objectFit: "contain", filter: "invert(1) brightness(2)", opacity: 0.7, filter: "grayscale(100%)", transition: "opacity 0.3s, filter 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "grayscale(0%)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.filter = "grayscale(100%)"; }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
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
  const [showPrivacy, setShowPrivacy] = useState(false);
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
          background: linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 40%, #0d0d0d 70%, #16213e 100%);
          background-attachment: fixed;
          min-height: 100vh;
          color: #ffffff;
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.35); }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
        select option { background: #1a1a2e; color: #ffffff; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blink { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }
        @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(245,166,35,0.3); } 50% { box-shadow: 0 0 0 12px rgba(245,166,35,0); } }
        button:hover { opacity: 0.82; }
        html, body { overflow-x: hidden; max-width: 100%; }
        * { max-width: 100%; }
        img { max-width: 100%; height: auto; }
        input, select, textarea, button { max-width: 100%; }
        input:focus { border-bottom-color: rgba(245,166,35,0.6) !important; }
        textarea:focus { border-bottom-color: rgba(245,166,35,0.6) !important; outline: none; }
      `}</style>

      <div style={{ minHeight: "100vh" }}>
        <NavBar active={section} setActive={setSection} />

        {section === "home" && (
          <>
            <HeroSection onBook={() => goBook()} />
            <GenreBanner />
            <AboutSection />
            <QuickNavSection onBook={goBook} setSection={setSection} />
            <MixesSection />
            <TestimonialsSection />
            <CrowdSection />
            <VenueLogosSection />
            <FAQSection />
            <section style={{ padding: isMobile ? "61px 24px" : "68px 48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroPhoto})`, backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.05 }} />
              <Reveal>
                <div style={{ position: "relative" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#ffffff", margin: "0 0 14px" }}>Ready to <em>book?</em></h2>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 32px" }}>Let's talk about your event.</p>
                  <button onClick={() => goBook()} style={{ background: "transparent", color: "rgba(255,255,255,0.05)", border: "none", padding: "15px 48px", fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", borderRadius: 1, fontWeight: 500 }}>Get in Touch</button>
                </div>
              </Reveal>
            </section>
          </>
        )}

        {section === "about" && (<><div style={{ paddingTop: 80 }} /><AboutSection /></>)}
        {section === "services" && (<><div style={{ paddingTop: 80 }} /><ServicesSection onBook={goBook} /></>)}
        {section === "faq" && (<><div style={{ paddingTop: 80 }} /><FAQSection /></>)}
        {section === "book" && (<><div style={{ paddingTop: 80 }} />{submitted ? <SuccessSection form={submitted} /> : <BookingSection prefill={bookPrefill} onSuccess={setSubmitted} onPrivacyClick={() => setShowPrivacy(true)} />}</>)}
        {section === "privacy" && (<><div style={{ paddingTop: 80 }} /><PrivacyPolicy /></>)}
        {section === "mixes" && (<><div style={{ paddingTop: 80 }} /><MixesPage /></>)}

        <FooterBar onPrivacy={() => setShowPrivacy(true)} />
      </div>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
