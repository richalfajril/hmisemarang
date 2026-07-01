"use client";

import { useEffect } from "react";

type ModelViewerProps = {
  src: string;
  alt?: string;
  "auto-rotate"?: boolean;
  "camera-controls"?: boolean;
  "disable-zoom"?: boolean;
  "rotation-per-second"?: string;
  "shadow-intensity"?: string;
  "interaction-prompt"?: string;
  "environment-image"?: string;
  "tone-mapping"?: string;
  "camera-orbit"?: string;
  "field-of-view"?: string;
  "min-field-of-view"?: string;
  "max-field-of-view"?: string;
  exposure?: string;
  "touch-action"?: string;
  style?: React.CSSProperties;
};

// `model-viewer` adalah custom element (web component) — cast string ke FC agar
// ter-tipe rapi tanpa augmentasi global JSX.
const ModelViewer = "model-viewer" as unknown as React.FC<ModelViewerProps>;

/** Render logo 3D (.glb) berputar otomatis. Client-only (WebGL). */
export function Logo3D() {
  useEffect(() => {
    // Daftarkan custom element di sisi klien saja.
    import("@google/model-viewer");
  }, []);

  return (
    <ModelViewer
      src="/models/logo-hmsmg3d.glb"
      alt="Logo 3D HMI Cabang Semarang"
      auto-rotate
      camera-controls
      disable-zoom
      rotation-per-second="14deg"
      interaction-prompt="none"
      environment-image="neutral"
      tone-mapping="neutral"
      camera-orbit="20deg 78deg auto"
      field-of-view="24deg"
      min-field-of-view="24deg"
      max-field-of-view="24deg"
      shadow-intensity="1"
      exposure="1.3"
      touch-action="pan-y"
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
    />
  );
}
