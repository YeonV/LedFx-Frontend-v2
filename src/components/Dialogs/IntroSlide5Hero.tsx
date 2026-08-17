import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'

/**
 * Slide 5's hero, mobile portrait only (rendered when xsmall && step key
 * === 'tour') - the closing screen, so it gets its own bigger statement
 * (bookending slide 1's branded headline) rather than the plain icon+title
 * template the middle slides share: a pop-in checkmark instead of a plain
 * fade, and a bold "All Set!" headline above the step's own completion
 * text. Same ambient wash/glow as the rest, same theme.palette.primary.main
 * - only rule, no fixed colours.
 */
const IntroSlide5Hero = ({ title }: { title: string }) => (
  <>
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}22 0%, transparent 70%)`,
          filter: 'blur(50px)'
        })}
      />
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
        px: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          '@keyframes ledfxPulse': {
            '0%, 100%': { opacity: 0.35, transform: 'scale(1)' },
            '50%': { opacity: 0.6, transform: 'scale(1.08)' }
          },
          '@keyframes ledfxPop': {
            '0%': { opacity: 0, transform: 'scale(0.5)' },
            '60%': { opacity: 1, transform: 'scale(1.15)' },
            '100%': { opacity: 1, transform: 'scale(1)' }
          }
        }}
      >
        <Box
          sx={(theme) => ({
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main}59 0%, transparent 72%)`,
            filter: 'blur(18px)',
            animation: 'ledfxPulse 3.5s ease-in-out infinite'
          })}
        />
        <Box
          sx={(theme) => ({
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.primary.main,
            animation: 'ledfxPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both'
          })}
        >
          <BladeIcon intro name="checkCircleOutlined" style={{ fontSize: 104 }} />
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={(theme) => ({
          fontWeight: 800,
          color: theme.palette.primary.main,
          lineHeight: 1.1
        })}
      >
        All Set!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380, mt: 0.5 }}>
        {title}
      </Typography>
    </Box>
  </>
)

export default IntroSlide5Hero
