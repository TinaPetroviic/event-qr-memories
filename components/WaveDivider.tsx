// Reusable curved section divider used to break up the straight edges between
// landing-page sections (matches the app's soft, elegant visual rhythm).
// It renders as a normal in-flow block, not absolutely positioned, so it can
// never overlap neighbouring content - just sandwich it between two sections.
//
// `backdropClassName` should be a background utility matching the section
// ABOVE the divider (so the flat top of the shape blends into it).
// `fill` should be the hex color of the section BELOW the divider (the wave
// curve itself), so the curve blends into what comes next.
// `flip` mirrors the curve vertically/horizontally for the reverse transition.
export function WaveDivider({
  fill,
  backdropClassName = "",
  flip = false,
  className = "",
}: {
  fill: string;
  backdropClassName?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={`w-full overflow-hidden ${backdropClassName} ${className}`}>
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={`block h-14 w-full sm:h-20 ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,32 C240,90 480,90 720,50 C960,10 1200,10 1440,55 L1440,100 L0,100 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
