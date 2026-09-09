/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { HERO_IMAGE_CONFIG } from "./heroImageConfig";
import logo from "./Assets/djappz-logo.png";
import heroPhoto from "./Assets/djappz-bio.jpeg";
import showreel from "./Assets/showreel-djappz.mp4";
import mixerPhoto from "./Assets/djappz-photo.jpg";
import streetPhoto from "./Assets/djappz-private.jpeg";
import weddingPhoto2 from "./Assets/djappz-wedding2.jpg";
import weddingDance2 from "./Assets/WeddingDance2 (2).jpg";
import privateEventsPhoto from "./Assets/djappz-private.jpeg";
import crowdPhoto from "./Assets/djappz - Crowd Shot.png";
import logoDirtyMartini from "./Assets/brand-dirtymartini.png";
import logoBelushis from "./Assets/brand-belushis.png";
import logoBoxpark from "./Assets/brand-boxpark.png";
import logoJubel from "./Assets/brand-jubel.png";
import logoLightbox from "./Assets/brand-lightbox.png";
import logoSimmons from "./Assets/brand-simmons.png";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const EMAILJS = {
  serviceId: "service_fo4lzwj",
  templateNotify: "template_nahefvm",
  templateReply: "template_y2wlqdg",
  publicKey: "8AHoqz3PXtnNjss0c",
};

const DJ = {
  name: "DJ Appz",
  tagline: "R&B · Hip-Hop · Soul",
  bio: "DJ Appz is a London-based DJ, entertainer, and former professional dancer with 5 years of experience behind the decks. Specialising in R&B, Hip-Hop, Soul, Afrobeats and Dancehall, he brings a performer's instinct to every set — reading the crowd, building energy, and keeping the floor moving from first track to last. He has played at some of London's most respected venues including Boxpark, Dirty Martini, All Bar One, Lightbox Vauxhall, Simmons Bars, and Proper Snacks, as well as a growing portfolio of private events, weddings, and corporate functions across the UK.",
  email: "dj-appz@outlook.com",
  location: "London, UK",
  instagram: "@djappz",
};

const SERVICES = [
  {
    id: "private",
    title: "Private Events",
    desc: "Birthdays, house parties, celebrations. From intimate gatherings to milestone celebrations, I create the perfect soundtrack for your special moments.",
    price: "From £350"
  },
  {
    id: "wedding",
    title: "Weddings",
    desc: "Your wedding deserves a DJ who understands the importance of every moment. From ceremony to the final dance, I deliver seamlessly.",
    price: "Enquire for pricing"
  },
  {
    id: "corporate",
    title: "Corporate Events",
    desc: "Brand launches, company parties, industry events. I understand how to create atmosphere whilst maintaining professionalism.",
    price: "From £600"
  },
  {
    id: "guest",
    title: "Guest Sets & Residencies",
    desc: "Guest sets at London's most prestigious venues and international bookings. I bring precision, artistry, and energy to every performance.",
    price: "Enquire"
  },
];

const TESTIMONIALS = [
  { name: "Marcus & Jade", event: "Wedding Reception", quote: "From the first song to the last, it was perfect. He read the room better than anyone we've seen. Our guests are still talking about it." },
  { name: "Simone T.", event: "30th Birthday, London", quote: "Appz had everyone on the floor all night. Knew exactly when to switch up the energy. Best party we've ever thrown." },
  { name: "Nadia K.", event: "Corporate Launch, Shoreditch", quote: "Professional, punctual, and the set was immaculate. Every colleague asked who the DJ was. Already booked him again." },
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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease` }}>
      {children}
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function NavBar() {
  const isMobile = useIsMobile();
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: "20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#ffffff",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src={logo} alt="DJ Appz" style={{ height: 28, objectFit: "contain" }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#000", letterSpacing: 1 }}>DJ APPZ</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <a href="#contact" style={{ fontSize: 13, color: "#000", textDecoration: "none", fontWeight: 500, letterSpacing: 0.5 }}>Contact</a>
        <a href="https://instagram.com/djappz" target="_blank" rel="noopener noreferrer" style={{ fontSize: 18, color: "#000", textDecoration: "none" }}>↗</a>
      </div>
    </nav>
  );
}

// ─── HERO IMAGE ADJUSTER ──────────────────────────────────────────────────
function HeroImageAdjuster({ config, setConfig, isMobile }) {
  const [showConfig, setShowConfig] = useState(false);

  if (isMobile) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      zIndex: 50,
      background: "#ffffff",
      border: "1px solid rgba(0,0,0,0.2)",
      borderRadius: 8,
      padding: 16,
      maxWidth: 300,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
    }}>
      <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Hero Adjuster</h4>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 500 }}>
          X Position: {Math.round(config.x)}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={config.x}
          onChange={(e) => setConfig({ ...config, x: parseFloat(e.target.value) })}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 500 }}>
          Y Position: {Math.round(config.y)}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={config.y}
          onChange={(e) => setConfig({ ...config, y: parseFloat(e.target.value) })}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 500 }}>
          Zoom: {(config.scale * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={config.scale}
          onChange={(e) => setConfig({ ...config, scale: parseFloat(e.target.value) })}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            padding: "8px 12px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {showConfig ? "Hide" : "Show"}
        </button>
        <button
          onClick={() => {
            const configText = `export const HERO_IMAGE_CONFIG = {\n  x: ${config.x},\n  y: ${config.y},\n  scale: ${config.scale},\n};`;
            navigator.clipboard.writeText(configText);
            alert("Config copied to clipboard!");
          }}
          style={{
            padding: "8px 12px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          Copy
        </button>
      </div>

      {showConfig && (
        <div style={{
          marginTop: 12,
          padding: 10,
          background: "#f5f5f5",
          borderRadius: 4,
          fontSize: 10,
          fontFamily: "'Monaco', monospace",
          color: "#000",
          overflow: "auto",
          maxHeight: 120,
        }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
{`export const HERO_IMAGE_CONFIG = {
  x: ${config.x},
  y: ${config.y},
  scale: ${config.scale},
};`}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── HERO SECTION ──────────────────────────────────────────────────────────
function HeroSection() {
  const [heroConfig, setHeroConfig] = useState(HERO_IMAGE_CONFIG);
  const isMobile = useIsMobile();

  return (
    <>
      <section style={{
        marginTop: 60,
        width: "100%",
        height: "90vh",
        overflow: "hidden",
        background: "#000000",
      }}>
        <img
          src={streetPhoto}
          alt="DJ Appz"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />
      </section>
      <HeroImageAdjuster config={heroConfig} setConfig={setHeroConfig} isMobile={isMobile} />
    </>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────
function AboutSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 24px" : "100px 60px",
      background: "#000000",
      color: "#ffffff",
    }}>
      <Reveal>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 42,
            fontWeight: 400,
            letterSpacing: 1.5,
            marginBottom: 30,
            fontFamily: "'Playfair Display', serif",
          }}>
            About DJ Appz
          </h2>
          <p style={{
            fontSize: isMobile ? 15 : 18,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 20,
            fontFamily: "'Inter', sans-serif",
          }}>
            {DJ.bio}
          </p>
          <p style={{
            fontSize: isMobile ? 13 : 16,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Inter', sans-serif",
          }}>
            From Ibiza to UK venues including Boxpark, Dirty Martini, and Lightbox Vauxhall, DJ Appz brings infectious energy and professional expertise to every gig. Whether it's a private celebration, corporate event, wedding, or international guest set — the mission is always the same: read the room, build the atmosphere, deliver the vibe.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

// ─── SERVICES SECTION ─────────────────────────────────────────────────────
function ServicesSection() {
  const isMobile = useIsMobile();
  const serviceImages = {
    private: privateEventsPhoto,
    wedding: weddingPhoto2,
    corporate: mixerPhoto,
    guest: crowdPhoto,
  };

  return (
    <section style={{
      padding: isMobile ? "60px 24px" : "100px 60px",
      background: "#ffffff",
    }}>
      <Reveal>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 42,
            fontWeight: 400,
            letterSpacing: 1.5,
            marginBottom: 50,
            color: "#000000",
            fontFamily: "'Playfair Display', serif",
          }}>
            What are you after?
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 60 }}>
            {SERVICES.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginBottom: 30,
                    border: "2px solid rgba(0,171,228,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                  }}>
                    <img
                      src={serviceImages[service.id]}
                      alt={service.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <h3 style={{
                    fontSize: isMobile ? 18 : 22,
                    fontWeight: 500,
                    marginBottom: 12,
                    color: "#000000",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: 0.5,
                    textAlign: "center",
                  }}>
                    {service.title}
                  </h3>
                  <p style={{
                    fontSize: isMobile ? 14 : 16,
                    lineHeight: 1.7,
                    color: "rgba(0,0,0,0.7)",
                    marginBottom: 16,
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "center",
                  }}>
                    {service.desc}
                  </p>
                  <p style={{
                    fontSize: 14,
                    color: "rgba(0,0,0,0.5)",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: 0.5,
                    textAlign: "center",
                  }}>
                    {service.price}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── CAMPAIGNS & PROMOS SECTION ───────────────────────────────────────────
function CampaignsSection() {
  const isMobile = useIsMobile();
  const videos = [
    { id: "C8qxf_vxz8A", title: "Promo 1", type: "short" },
    { id: "OOB4K2lTrxQ", title: "Promo 2", type: "short" },
    { id: "tcQXc_Lp8yE", title: "Full Performance", type: "video" },
  ];

  return (
    <section style={{
      padding: isMobile ? "60px 24px" : "100px 60px",
      background: "#f9f9f9",
    }}>
      <Reveal>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 42,
            fontWeight: 400,
            letterSpacing: 1.5,
            marginBottom: 50,
            color: "#000000",
            fontFamily: "'Playfair Display', serif",
          }}>
            Campaigns & Promos
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 20 : 30 }}>
            {videos.map((video, i) => (
              <Reveal key={video.id} delay={i * 0.1}>
                <div style={{ position: "relative", paddingBottom: "100%", height: 0, overflow: "hidden", borderRadius: 4, background: "#000" }}>
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: 4,
                    }}
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  marginTop: 12,
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "center",
                }}>
                  {video.title}
                </p>
              </Reveal>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <a
              href="https://www.youtube.com/@DJAppz"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                fontSize: 14,
                color: "#000000",
                textDecoration: "none",
                borderBottom: "1px solid #000000",
                paddingBottom: 4,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 0.5,
                fontWeight: 500,
              }}
            >
              Subscribe on YouTube →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── FEATURED PROJECTS SECTION ────────────────────────────────────────────
function FeaturedSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 24px" : "100px 60px",
      background: "#f9f9f9",
    }}>
      <Reveal>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 42,
            fontWeight: 400,
            letterSpacing: 1.5,
            marginBottom: 50,
            color: "#000000",
            fontFamily: "'Playfair Display', serif",
          }}>
            Featured Mixes
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 40 }}>
            <Reveal delay={0.1}>
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: "#000000",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Retune Episode 3
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  marginBottom: 16,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  R&B · Hip-Hop · 90s & 2000s
                </p>
                <p style={{
                  fontSize: 13,
                  color: "rgba(0,0,0,0.5)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  High-energy mix blending classic R&B and Hip-Hop with 90s and 2000s nostalgia.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: "#000000",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Retune — Brixton Radio
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  marginBottom: 16,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Dancehall · Hip-Hop
                </p>
                <p style={{
                  fontSize: 13,
                  color: "rgba(0,0,0,0.5)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Dynamic mix showcasing the energy and rhythm of Dancehall and Hip-Hop culture.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div>
                <div style={{ position: "relative", paddingBottom: "100%", height: 0, overflow: "hidden", borderRadius: 4, background: "#000", marginBottom: 16 }}>
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: 4,
                    }}
                    src="https://www.youtube.com/embed/NSBkVLI4-n4"
                    title="DJ Appz Mix"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: "#000000",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  DJ Appz - YouTube Mix
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  marginBottom: 16,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Full Mix Set
                </p>
                <p style={{
                  fontSize: 13,
                  color: "rgba(0,0,0,0.5)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  High-energy performance showcasing the versatility and artistry of DJ Appz.
                </p>
              </div>
            </Reveal>
          </div>

          <a
            href="https://www.mixcloud.com/DJAppz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 40,
              fontSize: 14,
              color: "#000000",
              textDecoration: "none",
              borderBottom: "1px solid #000000",
              paddingBottom: 4,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: 0.5,
              fontWeight: 500,
            }}
          >
            Listen on Mixcloud →
          </a>
        </div>
      </Reveal>
    </section>
  );
}

// ─── TESTIMONIALS SECTION ─────────────────────────────────────────────────
function TestimonialsSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 24px" : "100px 60px",
      background: "#ffffff",
    }}>
      <Reveal>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 42,
            fontWeight: 400,
            letterSpacing: 1.5,
            marginBottom: 50,
            color: "#000000",
            fontFamily: "'Playfair Display', serif",
          }}>
            Word on the Street
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 50 }}>
            {TESTIMONIALS.map((testimonial, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div>
                  <p style={{
                    fontSize: isMobile ? 15 : 17,
                    lineHeight: 1.8,
                    color: "#000000",
                    marginBottom: 20,
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: "italic",
                  }}>
                    "{testimonial.quote}"
                  </p>
                  <p style={{
                    fontSize: 14,
                    color: "rgba(0,0,0,0.6)",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}>
                    {testimonial.name} • {testimonial.event}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── CONTACT SECTION ───────────────────────────────────────────────────────
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", eventType: "", date: "", venue: "", guests: "", budget: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitEnquiry(formData);
    if (success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", eventType: "", date: "", venue: "", guests: "", budget: "", notes: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section id="contact" style={{
      padding: isMobile ? "60px 24px" : "100px 60px",
      background: "#000000",
      color: "#ffffff",
    }}>
      <Reveal>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 42,
            fontWeight: 400,
            letterSpacing: 1.5,
            marginBottom: 30,
            fontFamily: "'Playfair Display', serif",
          }}>
            Get in Touch
          </h2>

          {submitted && (
            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 30, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Thanks for reaching out! I'll be in touch soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: formData.eventType ? "#ffffff" : "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <option value="">Event Type</option>
              <option value="Private Event">Private Event</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Guest Set">Guest Set</option>
            </select>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <textarea
              name="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              style={{
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "14px 24px",
                background: "#ffffff",
                color: "#000000",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 0.5,
              }}
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: "40px 60px",
      background: "#1a1a1a",
      color: "rgba(255,255,255,0.6)",
      fontSize: 13,
      textAlign: "center",
      fontFamily: "'Inter', sans-serif",
      letterSpacing: 0.5,
    }}>
      <p style={{ margin: 0 }}>© 2026 DJ Appz. Based in London. Available UK-wide.</p>
    </footer>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: "#ffffff", color: "#000000" }}>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CampaignsSection />
      <FeaturedSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
