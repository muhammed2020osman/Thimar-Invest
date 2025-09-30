export function ThimarLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thimar Invest Logo"
      fill="none"
    >
        <path d="M20 85C25 75 30 70 40 65C50 60 60 60 70 65C80 70 85 75 90 85" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        <path d="M50 70V25C50 20 55 15 60 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        <path d="M40 35C40 30 45 25 50 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="45" cy="50" r="6" fill="currentColor"/>
        <circle cx="65"cy="50" r="6" fill="currentColor"/>
        <circle cx="55" cy="35" r="6" fill="currentColor"/>
    </svg>
  );
}
