import GhostFibers from "./GhostFibers";

export default function AppAmbient({ intensity = "normal" }) {
  return (
    <div className="app-ambient" aria-hidden="true">
      <div className={`app-ambient__fibers app-ambient__fibers--${intensity}`}>
        <GhostFibers
          lineColor="#5f78ff"
          glowColor="#12c8e8"
          speed={0.18}
          scale={2.35}
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
          glowIntensity={1.25}
          brightness={1.55}
          blueBoost={1.15}
          vignette={0.92}
          grain={0.025}
          dpr={1}
          lightMode={false}
          fps={30}
          paused={false}
        />
      </div>
      <div className="app-ambient__wash" />
      <div className="app-ambient__grid" />
    </div>
  );
}
