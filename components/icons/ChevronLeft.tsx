interface ChevronLeftSVGProps {
  size?: number;
  className?: string;
}

const ChevronLeftSVG: React.FC<ChevronLeftSVGProps> = ({ size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size}
    height={size}
    className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
  
  export default ChevronLeftSVG;