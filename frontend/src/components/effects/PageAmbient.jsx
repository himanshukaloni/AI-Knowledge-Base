import GhostFibers from "./GhostFibers";

export default function PageAmbient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-40 dark:opacity-55">
        <GhostFibers
          lineColor="#647cff"
          glowColor="#12b5cb"
          speed={0.16}
          scale={2.4}
          rotation={-24}
          rotationSpeed={0.08}
          layers={4}
          waveAmplitude={0.012}
          waveFrequency={3}
          waveSpeed={0.12}
          layerSpeed={0.06}
          twist={0.08}
          twistFrequency={5}
          twistSpeed={0.8}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={18}
          glowFalloff={11}
          glowIntensity={1.2}
          brightness={1.5}
          blueBoost={1.15}
          vignette={0.92}
          grain={0.025}
          dpr={1}
          lightMode={false}
          fps={30}
          paused={false}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(72,100,255,.18),transparent_38%),radial-gradient(circle_at_90%_70%,rgba(124,58,237,.14),transparent_42%),linear-gradient(to_bottom,rgba(5,8,18,.50),rgba(5,8,18,.84))]" />
    </div>
  );
}
