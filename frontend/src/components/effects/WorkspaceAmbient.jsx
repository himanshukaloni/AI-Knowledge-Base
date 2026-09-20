import GhostFibers from "./GhostFibers";

export default function WorkspaceAmbient({ variant="blue" }) {
  const colors = variant === "violet"
    ? { line: "#7c3aed", glow: "#06b6d4" }
    : variant === "cyan"
    ? { line: "#2563eb", glow: "#06b6d4" }
    : { line: "#4f6cff", glow: "#00b8ff" };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05060a]">
      <div className="absolute inset-0 opacity-80">
        <GhostFibers lineColor={colors.line} glowColor={colors.glow} speed={0.16} scale={2.25} rotation={-114} rotationSpeed={0.11} layers={5} waveAmplitude={0.018} waveFrequency={3} waveSpeed={0.15} layerSpeed={0.07} twist={0.1} twistFrequency={5} twistSpeed={1.1} lineFrequency={5} lineSpacing={2} lineSharpness={16} glowFalloff={10} glowIntensity={1.6} brightness={1.8} blueBoost={1.3} vignette={0.72} grain={0.035} dpr={1} lightMode={false} fps={45} paused={false} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,.18),transparent_34%),radial-gradient(circle_at_85%_85%,rgba(124,58,237,.15),transparent_36%),linear-gradient(to_bottom,rgba(5,6,10,.30),rgba(5,6,10,.78))]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}
