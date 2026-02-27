import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "BookYourHotel - Search over 2 million hotels worldwide. Simple booking, perfect stays.";
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
          background:
            "linear-gradient(135deg, #00332E 0%, #001a18 50%, #00261f 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(62,206,173,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(62,206,173,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "white",
            fontFamily: "serif",
            letterSpacing: "-1px",
            marginBottom: "8px",
            display: "flex",
          }}
        >
          Book
          <span style={{ color: "#3ECEAD" }}>Your</span>
          Hotel
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.8)",
            fontWeight: 400,
            marginBottom: "48px",
            display: "flex",
          }}
        >
          Simple Booking, Perfect Stays.
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {["2.6M+ Hotels", "Best Price Guarantee", "Free Cancellation"].map(
            (text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "100px",
                  padding: "12px 24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#3ECEAD",
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {text}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: 16,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "3px",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          bookyourhotel.online
        </div>
      </div>
    ),
    { ...size },
  );
}
