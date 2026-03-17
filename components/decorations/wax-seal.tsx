interface WaxSealProps {
  initials?: string;
}

export function WaxSeal({ initials = "M&L" }: WaxSealProps) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="20" cy="22" rx="16" ry="14" fill="rgba(0,0,0,0.15)"/>
      
      {/* Main seal body with wavy edges */}
      <circle cx="20" cy="20" r="15" fill="#c9888e"/>
      
      {/* Irregular edges */}
      <circle cx="6" cy="18" r="3" fill="#c9888e"/>
      <circle cx="8" cy="28" r="2.5" fill="#c9888e"/>
      <circle cx="14" cy="33" r="2.5" fill="#c9888e"/>
      <circle cx="26" cy="33" r="2.5" fill="#c9888e"/>
      <circle cx="32" cy="28" r="2.5" fill="#c9888e"/>
      <circle cx="34" cy="18" r="3" fill="#c9888e"/>
      <circle cx="32" cy="10" r="2.5" fill="#c9888e"/>
      <circle cx="24" cy="6" r="2.5" fill="#c9888e"/>
      <circle cx="16" cy="6" r="2.5" fill="#c9888e"/>
      <circle cx="8" cy="10" r="2.5" fill="#c9888e"/>
      
      {/* Highlight */}
      <ellipse cx="15" cy="15" rx="6" ry="4" fill="#d9989e" opacity="0.6"/>
      
      {/* Inner circle */}
      <circle cx="20" cy="20" r="10" fill="none" stroke="#b07078" strokeWidth="0.5"/>
      
      {/* Initials - từ props hoặc mặc định M&L */}
      <text 
        x="20" 
        y="24" 
        textAnchor="middle" 
        fill="#fff"
        fontSize="10"
        fontFamily="serif"
        fontStyle="italic"
      >
        {initials}
      </text>
    </svg>
  )
}
