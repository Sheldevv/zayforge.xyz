import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ZayForge — 2D Survival RPG";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,107,53,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(circle, rgba(255,107,53,0.2), transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(255,152,0,0.15), transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Icon */}
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          ⚒️
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "80px",
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-2px",
            margin: "0 0 10px 0",
            textShadow: "0 0 60px rgba(255,107,53,0.4)",
          }}
        >
          Zay<span style={{ color: "#ff6b35" }}>Forge</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "32px",
            color: "#a0a0b0",
            fontFamily: "system-ui, sans-serif",
            margin: "0 0 40px 0",
            fontWeight: 400,
          }}
        >
          A 2D Survival RPG — Forge Your Destiny
        </p>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 28px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,107,53,0.3)",
          }}
        >
          <span style={{ fontSize: "20px" }}>⊞</span>
          <span style={{ fontSize: "22px", color: "#d0d0e0", fontFamily: "system-ui, sans-serif" }}>
            Windows
          </span>
          <span style={{ fontSize: "20px", color: "#ff6b35" }}>·</span>
          <span style={{ fontSize: "20px" }}>🐧</span>
          <span style={{ fontSize: "22px", color: "#d0d0e0", fontFamily: "system-ui, sans-serif" }}>
            Linux
          </span>
          <span style={{ fontSize: "20px", color: "#ff6b35" }}>·</span>
          <span style={{ fontSize: "22px", color: "#ff6b35", fontFamily: "system-ui, sans-serif" }}>
            Free
          </span>
        </div>

        {/* URL */}
        <p
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "monospace",
          }}
        >
          zayforge.xyz
        </p>
      </div>
    ),
    { ...size },
  );
}
