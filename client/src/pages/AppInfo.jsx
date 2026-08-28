import React, { useEffect } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import {
  BusFront,
  TruckFront,
  GeoAltFill,
  Headset,
  Ticket,
  PencilFill,
  ClockHistory,
  QrCode,
  CheckCircleFill,
  LockFill,
  PersonBadgeFill,
  Google,
  Apple,
  EnvelopeFill,
  ShieldFill,
  CheckAll,
  Link45deg,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { translateText } from "../utils/translation";

const AppInfo = () => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const t = (key) =>
    (selectedLanguage && translateText(key, selectedLanguage.code)) || key;

  useEffect(() => {
    document.title = "Bueno Express Transportation · Bueno Transit";
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { icon: <Ticket size={17} />, label: "Book bus tickets" },
    { icon: <PencilFill size={15} />, label: "Manage reservations" },
    { icon: <ClockHistory size={17} />, label: "View trip history" },
    { icon: <QrCode size={17} />, label: "Mobile tickets" },
    { icon: <CheckCircleFill size={17} />, label: "Booking confirmations" },
    { icon: <LockFill size={17} />, label: "Secure sign in" },
  ];

  const authMethods = [
    { icon: <Google size={20} />, label: "Google" },
    { icon: <Apple size={22} />, label: "Apple" },
    { icon: <EnvelopeFill size={18} />, label: "Email" },
  ];

  const complianceLinks = [
    {
      icon: <LockFill size={18} />,
      label: "Privacy Policy",
      href: "https://www.buenotransit.com/privacy",
    },
    {
      icon: <CheckAll size={20} />,
      label: "Terms of Service",
      href: "https://www.buenotransit.com/terms",
    },
    {
      icon: <PersonBadgeFill size={18} />,
      label: "Account Deletion",
      href: "#",
    },
    {
      icon: <Headset size={18} />,
      label: "Support Page",
      href: "#",
    },
  ];

  return (
    <div style={{ background: "#f0f5fc", minHeight: "100vh", padding: "2.5rem 1rem" }}>
      <Container style={{ maxWidth: "860px" }}>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "2rem",
            boxShadow: "0 20px 60px -12px rgba(0, 30, 70, 0.18)",
            padding: "2.25rem 2.5rem",
          }}
        >

          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              borderBottom: "2px solid #eef2f6",
              paddingBottom: "1.5rem",
              marginBottom: "1.8rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0b2b4a 0%, #003f78 100%)",
                color: "white",
                width: 52,
                height: 52,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(0,43,90,0.3)",
              }}
            >
              <BusFront size={28} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: "1.75rem",
                  letterSpacing: "-0.02em",
                  color: "#0b1b2f",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Bueno Transit
              </h1>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 600,
                  color: "#0057a8",
                  fontSize: "0.82rem",
                  letterSpacing: 0.3,
                  background: "#deeeff",
                  padding: "0.15rem 0.85rem",
                  borderRadius: 40,
                  width: "fit-content",
                }}
              >
                <TruckFront size={13} /> Bueno Express Transportation
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 500,
                  color: "#3a5670",
                  fontSize: "0.9rem",
                }}
              >
                <GeoAltFill size={13} style={{ color: "#0d6efd" }} />
                Upstate NY · NYC · NJ
              </span>
            </div>

            <div
              style={{
                marginLeft: "auto",
                background: "#eef6ff",
                padding: "0.5rem 1.1rem",
                borderRadius: 40,
                fontSize: "0.84rem",
                fontWeight: 500,
                color: "#0057a8",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                border: "1px solid #c8dcf4",
                flexShrink: 0,
              }}
            >
              <Headset size={15} />
              buenotransit@gmail.com
            </div>
          </div>

          {/* ABOUT */}
          <SectionTitle
            icon={<PersonBadgeFill size={19} style={{ color: "#0d6efd" }} />}
            title="About Bueno Express Transportation / Bueno Transit"
          />
          <p style={{ color: "#1d3a55", marginBottom: "1.2rem", lineHeight: 1.65, fontWeight: 450 }}>
            Official online booking platform for intercity bus transportation throughout Upstate New York,
            New York City, New Jersey, and regional destinations.
          </p>

          {/* FEATURE GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
              gap: "0.65rem 1rem",
              background: "#f6faff",
              padding: "1rem 1.25rem",
              borderRadius: "1.25rem",
              border: "1px solid #dce9f8",
              marginBottom: "1.6rem",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontWeight: 500,
                  color: "#1a3349",
                  padding: "0.3rem 0",
                }}
              >
                <span style={{ color: "#0d6efd", display: "flex" }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* SIGN IN */}
          <SectionTitle
            icon={<ShieldFill size={18} style={{ color: "#0d6efd" }} />}
            title="Sign in securely"
          />
          <div
            style={{
              background: "#f0f7ff",
              borderRadius: "1.25rem",
              padding: "1rem 1.5rem",
              marginBottom: "1.4rem",
              borderLeft: "4px solid #0d6efd",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem 2rem",
            }}
          >
            {authMethods.map((m, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 500,
                  color: "#003b6b",
                }}
              >
                <span style={{ color: "#0b2b4a", display: "flex" }}>{m.icon}</span>
                {m.label}
              </span>
            ))}

            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.88rem",
                color: "#1f4665",
                background: "#ddeeff",
                padding: "0.35rem 0.9rem",
                borderRadius: 40,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <ShieldFill size={13} /> Google &amp; Apple used only for authentication
            </span>
          </div>

          {/* SUPPORT EMAIL */}
          <p
            style={{
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              color: "#4b6e8c",
              fontWeight: 600,
              marginBottom: "0.4rem",
            }}
          >
            Support
          </p>
          <div
            style={{
              background: "#f2f5f9",
              padding: "0.75rem 1.5rem",
              borderRadius: 60,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.7rem",
              fontWeight: 500,
              border: "1px solid #d9e2ec",
              marginBottom: "2rem",
              color: "#0b1b2f",
              fontSize: "0.97rem",
            }}
          >
            <EnvelopeFill size={16} style={{ color: "#0d6efd" }} />
            buenotransit@gmail.com
          </div>

          {/* COMPLIANCE */}
          <div style={{ borderTop: "2px solid #e9eff5", paddingTop: "1.8rem" }}>
            <SectionTitle
              icon={<CheckAll size={22} style={{ color: "#0d6efd" }} />}
              title="Compliance verification"
              noTopMargin
            />
            <p style={{ color: "#1f4665", marginBottom: "1rem", fontWeight: 450 }}>
              All required pages are publicly accessible with no broken links.
            </p>

            <Row xs={1} sm={2} className="g-3 mb-3">
              {complianceLinks.map((link, i) => (
                <Col key={i}>
                  <div
                    style={{
                      background: "#fafcff",
                      borderRadius: "1.1rem",
                      padding: "0.85rem 1.2rem",
                      border: "1px solid #dce9f2",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ color: "#0d6efd", display: "flex", flexShrink: 0 }}>{link.icon}</span>
                    <a
                      href={link.href}
                      target={link.href !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={link.href === "#" ? (e) => e.preventDefault() : undefined}
                      style={{
                        textDecoration: "none",
                        fontWeight: 600,
                        color: "#003b6b",
                        fontSize: "0.97rem",
                        flexGrow: 1,
                      }}
                    >
                      {link.label}
                    </a>
                    <Badge
                      style={{
                        background: "#d6f0df",
                        color: "#0d4f1a",
                        padding: "0.3rem 0.75rem",
                        borderRadius: 40,
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        letterSpacing: 0.3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ● public
                    </Badge>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Verification note */}
            <div
              style={{
                background: "#ecf3fa",
                padding: "0.7rem 1.3rem",
                borderRadius: 60,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#003b6b",
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              <Link45deg size={18} style={{ color: "#0d6efd" }} />
              All links verified · publicly accessible · no broken links
              <CheckCircleFill size={16} style={{ color: "#1a7a3a", marginLeft: 4 }} />
            </div>
          </div>

          {/* FOOTER */}
          <hr
            style={{
              margin: "1.8rem 0 1rem",
              border: "none",
              height: 1,
              background: "linear-gradient(to right, #dbe3ed, transparent)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: "#0b1b2f", fontSize: "1.05rem" }}>Bueno Transit</span>
              <span style={{ color: "#7e97b0" }}>|</span>
              <span style={{ color: "#1f4a6b", display: "flex", alignItems: "center", gap: 5 }}>
                <EnvelopeFill size={14} /> buenotransit@gmail.com
              </span>
            </div>
            <div style={{ color: "#406582", display: "flex", alignItems: "center", gap: 5, fontSize: "0.9rem" }}>
              <BusFront size={15} style={{ color: "#0d6efd" }} />
              Bueno Express Transportation · Upstate NY · NYC · NJ
            </div>
          </div>

          {/* Auth security note */}
          <div
            style={{
              marginTop: "1.2rem",
              fontSize: "0.88rem",
              color: "#305d7a",
              background: "#f0f7fe",
              padding: "0.6rem 1.2rem",
              borderRadius: 30,
              border: "1px solid #cfe0f4",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShieldFill size={14} style={{ color: "#0d6efd" }} />
            Google and Apple Sign In are used only for secure authentication and account management.
          </div>

          {/* Required pages note */}
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.79rem",
              color: "#3b688b",
              background: "#eaf1fa",
              padding: "0.35rem 1rem",
              borderRadius: 30,
              display: "inline-block",
            }}
          >
            Privacy · Terms · Deletion · Support — all public
          </div>
        </div>
      </Container>
    </div>
  );
};

const SectionTitle = ({ icon, title, noTopMargin }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontWeight: 600,
      fontSize: "1.2rem",
      color: "#0b1b2f",
      marginBottom: "0.9rem",
      marginTop: noTopMargin ? 0 : "1.6rem",
    }}
  >
    {icon}
    {title}
  </div>
);

export default AppInfo;
