export function CarnationFlower() {
  return (
    <svg width="60" height="90" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path 
        d="M30 90 Q28 70 30 55 Q32 45 30 35" 
        stroke="#4a7c59" 
        strokeWidth="2" 
        fill="none"
      />
      {/* Leaves */}
      <path 
        d="M30 65 Q20 60 15 70 Q22 65 30 65" 
        fill="#5a8c69" 
      />
      <path 
        d="M30 55 Q40 50 45 58 Q38 52 30 55" 
        fill="#5a8c69" 
      />
      
      {/* Flower base/calyx */}
      <ellipse cx="30" cy="35" rx="6" ry="4" fill="#4a7c59"/>
      
      {/* Carnation petals - layered */}
      <g transform="translate(30, 25)">
        {/* Outer petals */}
        <path d="M0 0 Q-12 -8 -8 -18 Q-4 -12 0 -10 Q4 -12 8 -18 Q12 -8 0 0" fill="#e85a71"/>
        <path d="M0 0 Q-15 -5 -15 -15 Q-8 -10 0 -8 Q8 -10 15 -15 Q15 -5 0 0" fill="#e85a71"/>
        <path d="M0 0 Q-10 -12 -5 -20 Q-2 -14 0 -12 Q2 -14 5 -20 Q10 -12 0 0" fill="#d64a61"/>
        
        {/* Middle petals */}
        <path d="M0 -2 Q-8 -10 -6 -16 Q-3 -11 0 -9 Q3 -11 6 -16 Q8 -10 0 -2" fill="#d64a61"/>
        <path d="M0 -2 Q-10 -8 -8 -14 Q-4 -10 0 -8 Q4 -10 8 -14 Q10 -8 0 -2" fill="#c43a51"/>
        
        {/* Inner petals */}
        <path d="M0 -4 Q-5 -10 -3 -13 Q-1 -9 0 -8 Q1 -9 3 -13 Q5 -10 0 -4" fill="#c43a51"/>
        <circle cx="0" cy="-8" r="3" fill="#b42a41"/>
      </g>
    </svg>
  )
}
