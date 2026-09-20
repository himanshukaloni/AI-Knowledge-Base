import { useEffect, useState } from "react";

export default function AnimatedPage({ children, className = "" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={[
        "relative z-10 min-h-full transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
