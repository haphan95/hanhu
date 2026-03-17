"use client"

export function CherryBlossomPetals() {
  const petals = [
    { top: '5%', left: '20%', rotate: 15, size: 8, opacity: 0.7 },
    { top: '8%', left: '75%', rotate: -20, size: 6, opacity: 0.5 },
    { top: '15%', left: '10%', rotate: 45, size: 10, opacity: 0.6 },
    { top: '12%', left: '85%', rotate: -35, size: 7, opacity: 0.8 },
    { top: '20%', left: '50%', rotate: 60, size: 5, opacity: 0.4 },
    { top: '25%', left: '30%', rotate: -10, size: 9, opacity: 0.6 },
    { top: '30%', left: '70%', rotate: 25, size: 6, opacity: 0.5 },
    { top: '35%', left: '15%', rotate: -45, size: 8, opacity: 0.7 },
    { top: '40%', left: '90%', rotate: 30, size: 7, opacity: 0.6 },
    { top: '55%', left: '5%', rotate: -15, size: 6, opacity: 0.5 },
    { top: '65%', left: '95%', rotate: 40, size: 8, opacity: 0.7 },
    { top: '75%', left: '8%', rotate: -30, size: 5, opacity: 0.4 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((petal, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: petal.top,
            left: petal.left,
            transform: `rotate(${petal.rotate}deg)`,
            opacity: petal.opacity,
          }}
        >
          <svg 
            width={petal.size * 2} 
            height={petal.size * 3} 
            viewBox="0 0 10 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 0 Q10 5 8 10 Q5 15 5 15 Q5 15 2 10 Q0 5 5 0" 
              fill="#f5c6cb"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
