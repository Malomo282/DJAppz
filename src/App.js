/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { HERO_IMAGE_CONFIG } from "./heroImageConfig";
import logo from "./Assets/djappz-logo.png";
import heroPhoto from "./Assets/djappz-bio.jpeg";
import showreel from "./Assets/showreel-djappz.mp4";
import mixerPhoto from "./Assets/djappz-photo.jpg";
import heroImage from "./Assets/djappz-hero.jpeg";
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
  { name: "Ryan", quote: "Brings great vibes to any party — a wide range of music to suit everyone's tastes." },
  { name: "Josh", quote: "He brings the vibes and has a huge passion for tunes." },
  { name: "Aleks", quote: "A fantastic performer — worked brilliantly across genres, keeping the whole audience involved." },
  { name: "Mawuli Amber", quote: "Proactively filled the dance floor, with original remixes to match the mood." },
  { name: "Uti David", quote: "Knows exactly how to give a crowd what they need — his technical skills are fantastic." },
  { name: "Isaac", quote: "Deep knowledge of old-school and new-school music, backed by real technical skill." },
  { name: "Nathaniel Crossdale", quote: "An amazing DJ who consistently delivers excellent performances." },
  { name: "Ebbie", quote: "Passion and energy that never let up — the vibes were non-stop." },
  { name: "Anisa", quote: "My No. 1 DJ — professional, friendly, and brilliant every time." },
  { name: "Cooperation Town", quote: "Brought his own equipment, competitive pricing, and always follows the brief." },
  { name: "Emmanuel", quote: "Love the creative remixes — he always puts his own spin on the music." },
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
      <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none" }}>
        <img src={logo} alt="DJ Appz" style={{ height: 28, objectFit: "contain" }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#000", letterSpacing: 1 }}>DJ APPZ</span>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <a href="#contact" style={{ fontSize: 13, color: "#000", textDecoration: "none", fontWeight: 500, letterSpacing: 0.5 }}>Contact</a>
        <a href="https://instagram.com/djappz" target="_blank" rel="noopener noreferrer" style={{ fontSize: 18, color: "#000", textDecoration: "none" }}>↗</a>
      </div>
    </nav>
  );
}

// ─── HERO IMAGE ADJUSTER ──────────────────────────────────────────────────
// ─── HERO SECTION ──────────────────────────────────────────────────────────
function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      marginTop: 60,
      width: "100%",
      height: "72vh",
      overflow: "hidden",
      background: "#000000",
    }}>
      <img
        src={heroImage}
        alt="DJ Appz"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${HERO_IMAGE_CONFIG.x}% ${HERO_IMAGE_CONFIG.y}%`,
          transform: `scale(${HERO_IMAGE_CONFIG.scale})`,
          display: "block",
        }}
      />
    </section>
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
            marginTop: 0,
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
              href="https://www.youtube.com/@djappz121"
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
      padding: isMobile ? "60px 24px" : "60px 60px",
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

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 30 : 60 }}>
            <Reveal delay={0.1}>
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 500,
                  marginBottom: 12,
                  color: "#000000",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Retune Episode 3
                </h3>
                <div style={{ marginBottom: 16, borderRadius: 4, overflow: "hidden" }}>
                  <iframe
                    width="100%"
                    height="220"
                    src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2FDJAppz%2Fretune-episode-3-rnb-hip-hop-90s-2000s%2F"
                    frameBorder="0"
                    style={{ display: "block" }}
                  />
                </div>
                <p style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  marginBottom: 8,
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
                  marginBottom: 12,
                  color: "#000000",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Retune — Brixton Radio
                </h3>
                <div style={{ marginBottom: 16, borderRadius: 4, overflow: "hidden" }}>
                  <iframe
                    width="100%"
                    height="220"
                    src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fbrixtonradiolive%2Fretune-271225%2F"
                    frameBorder="0"
                    style={{ display: "block" }}
                  />
                </div>
                <p style={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.6)",
                  marginBottom: 8,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 1 : 2;
  const maxIndex = Math.ceil(TESTIMONIALS.length / itemsPerPage) - 1;

  const handlePrev = () => setCurrentIndex(prev => prev === 0 ? maxIndex : prev - 1);
  const handleNext = () => setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);

  const visibleTestimonials = TESTIMONIALS.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section style={{
      padding: isMobile ? "80px 24px" : "120px 60px",
      background: "#ffffff",
      color: "#000000",
      position: "relative",
      overflow: "hidden",
    }}>
      <Reveal>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: isMobile ? 50 : 70, textAlign: "center" }}>
            <h2 style={{
              fontSize: isMobile ? 32 : 52,
              fontWeight: 400,
              letterSpacing: 2,
              color: "#000000",
              fontFamily: "'Playfair Display', serif",
              marginBottom: 12,
            }}>
              Word on the Street
            </h2>
            <div style={{
              width: 60,
              height: 2,
              background: "#000000",
              margin: "0 auto",
              borderRadius: 1,
            }} />
          </div>

          {/* Carousel Container */}
          <div style={{
            position: "relative",
            minHeight: isMobile ? 280 : 320,
          }}>
            {/* Testimonial Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: isMobile ? 30 : 60,
              width: "100%",
            }}>
              {visibleTestimonials.map((testimonial, i) => (
                <div
                  key={currentIndex * itemsPerPage + i}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    padding: isMobile ? 30 : 40,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "100%",
                    transition: "all 0.3s ease",
                    animation: "fadeIn 0.5s ease",
                  }}
                >
                  {/* Opening Quote */}
                  <div style={{
                    fontSize: isMobile ? 48 : 56,
                    color: "#000000",
                    marginBottom: 16,
                    lineHeight: 0.8,
                    opacity: 0.3,
                  }}>
                    "
                  </div>

                  {/* Quote Text */}
                  <p style={{
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.7,
                    color: "#000000",
                    marginBottom: 24,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 400,
                    flex: 1,
                  }}>
                    {testimonial.quote}
                  </p>

                  {/* Attribution */}
                  <div style={{
                    paddingTop: 20,
                    borderTop: "1px solid #e0e0e0",
                  }}>
                    <p style={{
                      fontSize: 14,
                      color: "#666666",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500,
                      letterSpacing: 0.5,
                      margin: 0,
                    }}>
                      — {testimonial.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginTop: isMobile ? 50 : 60,
          }}>
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "2px solid #000000",
                background: "transparent",
                color: "#000000",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#000000";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#000000";
              }}
            >
              ←
            </button>

            {/* Indicator Dots */}
            <div style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: currentIndex === i ? 24 : 10,
                    height: 10,
                    borderRadius: 5,
                    border: "none",
                    background: currentIndex === i ? "#000000" : "#d0d0d0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "2px solid #000000",
                background: "transparent",
                color: "#000000",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#000000";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#000000";
              }}
            >
              →
            </button>
          </div>

          {/* Quote Counter */}
          <div style={{
            textAlign: "center",
            marginTop: 30,
            fontSize: 13,
            color: "#999999",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: 1,
          }}>
            {currentIndex * itemsPerPage + 1} — {Math.min((currentIndex + 1) * itemsPerPage, TESTIMONIALS.length)} of {TESTIMONIALS.length}
          </div>
        </div>
      </Reveal>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

// ─── CONTACT SECTION ───────────────────────────────────────────────────────
function CustomDropdown({ value, onChange, options, placeholder, name }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px 16px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          color: value ? "#ffffff" : "rgba(255,255,255,0.5)",
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{value || placeholder}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.2)",
          borderTop: "none",
          zIndex: 9999,
          maxHeight: "200px",
          overflowY: "auto",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          pointerEvents: "auto",
          opacity: 1,
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange({ target: { name, value: opt.value } }); setOpen(false); }}
              style={{
                padding: "12px 16px",
                color: "#000000",
                cursor: "pointer",
                backgroundColor: value === opt.value ? "#e8e8e8" : "transparent",
                transition: "backgroundColor 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? "#e8e8e8" : "transparent"}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DatePicker({ value, onChange, name }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    if (value) {
      const [day, m, year] = value.split("/");
      return new Date(year, parseInt(m) - 1);
    }
    return new Date();
  });
  const dateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateSelect = (day) => {
    const year = month.getFullYear();
    const m = String(month.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange({ target: { name, value: `${d}/${m}/${year}` } });
    setOpen(false);
  };

  const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(month);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthName = month.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div ref={dateRef} style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        placeholder="dd/mm/yyyy"
        readOnly
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px 16px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          color: "#ffffff",
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.2)",
          borderTop: "none",
          zIndex: 1000,
          padding: "16px",
          marginTop: "2px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>◀</button>
            <span style={{ color: "#000", fontSize: "14px", fontWeight: "600" }}>{monthName}</span>
            <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>▶</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <div key={d} style={{ textAlign: "center", color: "#999", fontSize: "12px", fontWeight: "600", padding: "4px" }}>{d}</div>
            ))}
            {blanks.map(i => <div key={`blank-${i}`} style={{ padding: "4px" }}></div>)}
            {days.map(day => (
              <button
                key={day}
                onClick={() => handleDateSelect(day)}
                style={{
                  padding: "8px",
                  border: value && value.startsWith(String(day).padStart(2, "0")) ? "2px solid #00ABE4" : "1px solid #ddd",
                  background: value && value.startsWith(String(day).padStart(2, "0")) ? "#e8f5ff" : "#fff",
                  color: "#000",
                  cursor: "pointer",
                  fontSize: "12px",
                  borderRadius: "4px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.background = "#f0f0f0"}
                onMouseLeave={(e) => e.target.style.background = value && value.startsWith(String(day).padStart(2, "0")) ? "#e8f5ff" : "#fff"}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
            <CustomDropdown
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="Event Type"
              options={[
                { value: "Private Event", label: "Private Event" },
                { value: "Wedding", label: "Wedding" },
                { value: "Corporate", label: "Corporate" },
                { value: "Guest Set", label: "Guest Set" },
              ]}
            />
            <DatePicker
              name="date"
              value={formData.date}
              onChange={handleChange}
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
      <p style={{ margin: 0 }}>Est. 2021 DJ Appz. Based in London. Available UK-wide.</p>
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
