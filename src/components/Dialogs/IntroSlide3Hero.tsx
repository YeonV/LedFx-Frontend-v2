import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { YZLogo2 } from '../Icons/YZ-Logo2'

/**
 * Slide 3's hero, mobile portrait only (rendered when xsmall && activeStep
 * === 2) - same ambient wash / pulsing glow / promoted title treatment as
 * IntroSlide1Hero and IntroSlide2Hero.
 *
 * Renders YZLogo2 directly instead of going through BladeIcon's `intro`
 * mode: that mode does `transform: scale(0.05)` on a SVG whose own
 * intrinsic box is a fixed 594mm x 420mm (an A4 sheet) anchored
 * transform-origin: top left, inside a tiny overflow: hidden Icon span -
 * so it only ever showed the sheet's top-left sliver. Fixing that is scoped
 * to this dialog's own usage rather than BladeIcon.tsx (which card/scene/
 * list rendering elsewhere in the app also depends on and where this same
 * logo renders correctly today) - sizing the SVG itself to 100%/100% here
 * lets its viewBox handle proportional, centred, uncropped scaling with no
 * transform needed at all.
 */
const IntroSlide3Hero = ({ title }: { title: string }) => (
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
          sx={{
            position: 'relative',
            width: 128,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'ledfxFadeIn 0.6s ease-out',
            color: 'text.primary'
          }}
        >
          <YZLogo2 style={{ width: '100%', height: '100%', marginTop: 0 }} />
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mt: 7 }}>
        {title}
      </Typography>
    </Box>
  </>
)

export default IntroSlide3Hero
