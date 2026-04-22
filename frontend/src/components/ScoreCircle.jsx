import { useEffect, useRef } from "react";

export default function ScoreCircle({ score, label }) {
  const circleRef = useRef(null);

  const getScoreColor = (score) => {
    if (score >= 65) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  useEffect(() => {
    if (!circleRef.current) return;
    const circle = circleRef.current.querySelector("circle:last-child");
    if (!circle) return;

    const color = getScoreColor(score);

    circle.style.transition = "none";
    circle.style.strokeDasharray = "0 100";
    void circle.offsetWidth;
    circle.style.transition = "stroke-dasharray 1.8s ease-in-out";
    circle.style.strokeDasharray = `${score} 100`;
    circle.setAttribute("stroke", color);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44" ref={circleRef}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15"
            fill="none"
            stroke="#27272a"
            strokeWidth="6"
          />
          <circle
            cx="21"
            cy="21"
            r="15"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="0 100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-5xl font-bold"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </div>
        </div>
      </div>
      <p className="mt-6 text-xl font-medium text-white">{label}</p>
    </div>
  );
}
