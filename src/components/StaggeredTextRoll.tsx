interface StaggeredTextRollProps {
  text: string
}

export default function StaggeredTextRoll({ text }: StaggeredTextRollProps) {
  return (
    <span className="staggered-roll-container">
      {text.split('').map((char, index) => (
        <span
          key={index}
          data-letter={char === ' ' ? '\u00A0' : char}
          className="staggered-roll-letter"
          style={{
            transitionDelay: `${index * 20}ms`
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
