"use client";

import dynamic from "next/dynamic";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => <div>Loading video...</div>,
});

export default MuxPlayer;
