import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "1rem",
        color: "#666",
      }}
    >
      <Loader2 className="animate-spin" size={32} />
      <h2>Loading...</h2>
    </div>
  );
} 