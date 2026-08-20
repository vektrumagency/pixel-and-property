import { ImageResponse } from "next/og";

export const alt = "Pixel & Property";
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
          background: "#0a0a08",
          color: "#f5f2ec",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#b89c6e",
            marginBottom: 28,
          }}
        >
          Estoril, Portugal
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          Pixel &nbsp;
          <span style={{ color: "#b89c6e" }}>&amp;</span>
          &nbsp; Property
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 26,
            color: "rgba(245,242,236,0.55)",
          }}
        >
          The Full Real Estate Ecosystem
        </div>
      </div>
    ),
    { ...size },
  );
}
