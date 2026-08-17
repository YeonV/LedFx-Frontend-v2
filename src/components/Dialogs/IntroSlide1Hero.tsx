import { Chip, Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { CheckCircleOutlineOutlined } from '@mui/icons-material'
import logoCircle from '../../icons/png/128x128.png'

/**
 * Slide 1's hero, mobile portrait only (rendered when xsmall). Logo, ambient
 * wash and copy live together as one centred cluster, with the step
 * question given real room below the badges - the fullscreen Android dialog
 * has the vertical space to spend on it. Kept as its own component instead
 * of more xsmall ternaries inside IntroDialog's shared step JSX: that's how
 * the wash and the extra bottom spacing here leaked onto the desktop dialog
 * unnoticed the first time round. Always mobile (xsmall implies small), so
 * no small/xsmall branching is needed inside.
 */
const IntroSlide1Hero = ({ title }: { title: string }) => (
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
        {/* Theme-driven glow, not a fixed colour - reads as cyan on today's
            default (DarkBlue) and would read as a clean white glow on a
            monochrome theme, no rework needed either way. */}
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
          src={logoCircle}
          alt="LedFx"
          sx={{ position: 'relative', animation: 'ledfxFadeIn 0.6s ease-out' }}
        />
      </Box>
      <Typography
        variant="h4"
        sx={(theme) => ({ fontWeight: 800, color: theme.palette.primary.main, lineHeight: 1.1 })}
      >
        LedFx
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380 }}>
        A Networked LED Effect Controller
      </Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="center" gap="8px" sx={{ mt: 1 }}>
        {['Free', 'OpenSource', 'CrossPlatform'].map((label) => (
          <Chip
            key={label}
            sx={{ px: 1 }}
            icon={
              <CheckCircleOutlineOutlined
                sx={(theme) => ({ color: `${theme.palette.primary.main} !important` })}
              />
            }
            label={label}
            variant="filled"
          />
        ))}
      </Stack>
      <Typography variant="h6" sx={{ mt: 7 }}>
        {title}
      </Typography>
    </Box>
  </>
)

export default IntroSlide1Hero
