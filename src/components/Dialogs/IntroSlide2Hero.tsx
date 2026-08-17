import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import wledLogo from '../../icons/png/wled.png'

/**
 * Slide 2's hero, mobile portrait only (rendered when xsmall && activeStep
 * === 1) - same treatment as IntroSlide1Hero (ambient wash, pulsing themed
 * glow, promoted title spacing), kept as its own component for the same
 * reason: no xsmall ternaries inside IntroDialog's shared step markup.
 */
const IntroSlide2Hero = ({ title }: { title: string }) => (
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
          '@keyframes ledfxFadeIn': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
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
          component="img"
          width={128}
          height="auto"
          src={wledLogo}
          alt="WLED"
          sx={{ position: 'relative', animation: 'ledfxFadeIn 0.6s ease-out' }}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 7 }}>
        {title}
      </Typography>
    </Box>
  </>
)

export default IntroSlide2Hero
