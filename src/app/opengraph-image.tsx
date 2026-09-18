import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Notflix";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "#141414",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 800,
            color: "#E50914",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Notflix
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 36,
            color: "#A3A3A3",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          A plataforma onde você nunca assiste nada.
        </div>
      </div>
    ),
    { ...size }
  );
}
