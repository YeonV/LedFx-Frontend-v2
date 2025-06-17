// AnimatedNumber.tsx
import { useSpring, animated } from '@react-spring/web'

interface AnimatedNumberProps {
  value: number
  toFixed?: number // How many decimal places
}

const AnimatedNumber = ({ value, toFixed = 0 }: AnimatedNumberProps) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    delay: 100,
    config: { mass: 1, tension: 120, friction: 20 } // A nice, snappy spring
  })

  return <animated.span>{number.to((n) => n.toFixed(toFixed))}</animated.span>
}

export default AnimatedNumber
