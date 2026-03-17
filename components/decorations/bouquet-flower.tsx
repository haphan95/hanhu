export function BouquetFlower() {
  return (
    <svg width="55" height="60" viewBox="0 0 55 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wrapper/Paper */}
      <path 
        d="M15 25 L5 55 Q27.5 60 50 55 L40 25 Q27.5 30 15 25" 
        fill="#f5e6e8"
        stroke="#e8d0d4"
        strokeWidth="1"
      />
      <path 
        d="M15 25 Q27.5 32 40 25" 
        stroke="#e8d0d4"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Ribbon/bow */}
      <path 
        d="M22 40 Q18 38 16 42 Q20 40 22 40" 
        fill="#d98a94"
      />
      <path 
        d="M33 40 Q37 38 39 42 Q35 40 33 40" 
        fill="#d98a94"
      />
      <ellipse cx="27.5" cy="40" rx="3" ry="2" fill="#c4707a"/>
      
      {/* Flowers */}
      {/* Blue flower */}
      <g transform="translate(20, 18)">
        <circle cx="0" cy="0" r="4" fill="#7eb5d6"/>
        <circle cx="-3" cy="-3" r="3" fill="#7eb5d6"/>
        <circle cx="3" cy="-3" r="3" fill="#7eb5d6"/>
        <circle cx="-3" cy="2" r="3" fill="#7eb5d6"/>
        <circle cx="3" cy="2" r="3" fill="#7eb5d6"/>
        <circle cx="0" cy="0" r="2" fill="#f0e68c"/>
      </g>
      
      {/* Pink flower */}
      <g transform="translate(35, 15)">
        <circle cx="0" cy="0" r="3" fill="#e8a0a8"/>
        <circle cx="-2.5" cy="-2.5" r="2.5" fill="#e8a0a8"/>
        <circle cx="2.5" cy="-2.5" r="2.5" fill="#e8a0a8"/>
        <circle cx="-2.5" cy="1.5" r="2.5" fill="#e8a0a8"/>
        <circle cx="2.5" cy="1.5" r="2.5" fill="#e8a0a8"/>
        <circle cx="0" cy="0" r="1.5" fill="#f0e68c"/>
      </g>
      
      {/* Purple/Lavender flower */}
      <g transform="translate(27, 10)">
        <circle cx="0" cy="0" r="2.5" fill="#b494c7"/>
        <circle cx="-2" cy="-2" r="2" fill="#b494c7"/>
        <circle cx="2" cy="-2" r="2" fill="#b494c7"/>
        <circle cx="-2" cy="1.5" r="2" fill="#b494c7"/>
        <circle cx="2" cy="1.5" r="2" fill="#b494c7"/>
        <circle cx="0" cy="0" r="1" fill="#f0e68c"/>
      </g>
      
      {/* Leaves/Greenery */}
      <path d="M18 22 Q14 18 15 12 Q17 17 20 20" fill="#5a8c69"/>
      <path d="M37 20 Q40 15 42 10 Q39 14 36 18" fill="#5a8c69"/>
      <path d="M25 8 Q27 3 30 5 Q27 6 26 10" fill="#5a8c69"/>
      
      {/* Small decorative dots */}
      <circle cx="15" cy="15" r="1" fill="#c4707a"/>
      <circle cx="40" cy="12" r="1" fill="#c4707a"/>
      
      {/* Heart decoration */}
      <path 
        d="M42 5 Q42 2 44 2 Q46 2 46 5 Q46 7 44 9 Q42 7 42 5" 
        fill="#c4707a"
      />
    </svg>
  )
}
