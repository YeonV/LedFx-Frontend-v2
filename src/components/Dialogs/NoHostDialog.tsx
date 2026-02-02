import { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
  // Box,
} from '@mui/material'
import { Add, Delete, ExpandMore, QrCodeScanner, Save } from '@mui/icons-material'
import isElectron from 'is-electron'
import useStore from '../../store/useStore'
import mixedContent1 from '../../assets/mixedContent1.jpeg'
import mixedContent2 from '../../assets/mixedContent2.jpeg'
import QrScanner from '../QrScanner/QrScanner'
import { getBaseUrl } from '../../utils/getBaseUrl'
// import Instances from './Instances';

export default function NoHostDialog() {
  const dialogOpen = useStore((state) => state.dialogs.nohost?.open || false)
  const dialogQrOpen = useStore((state) => state.dialogs.qrConnector?.open)
  const [add, setAdd] = useState(false)
  const [mixedContent, setMixedContent] = useState(false)
  const [isLedFxStream, setIsLedFxStream] = useState(false)
  const edit = useStore((state) => state.dialogs.nohost?.edit || false)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const setDisconnected = useStore((state) => state.setDisconnected)
  // const coreParams = useStore((state) => state.coreParams);
  const setHost = useStore((state) => state.setHost)
  const storedURL = window.localStorage.getItem('ledfx-host')
  const sslEnabled = window.localStorage.getItem('ledfx-ssl-enabled') === 'true'

  const defaultHosts = sslEnabled
    ? ['https://localhost:8889', 'http://localhost:8888']
    : ['http://localhost:8888']

  const storedURLs = JSON.parse(
    window.localStorage.getItem('ledfx-hosts') || JSON.stringify(defaultHosts)
  )
  const [hosts, setHosts] = useState(defaultHosts)
  const [hostvalue, setHostvalue] = useState(defaultHosts[0])
  const [qrScannerOpen, setQrScannerOpen] = useState(false)

  const cc = isElectron() && window.process?.argv.indexOf('integratedCore') !== -1

  const handleClose = () => {
    setDialogOpen(false)
    setAdd(false)
  }

  const handleSave = (ho: string) => {
    setHost(ho)
    if (!hosts.some((h) => h === ho)) {
      window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts, ho]))
    } else {
      window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts]))
    }
    setDialogOpen(false)
    setDisconnected(false)
    window.location.reload()
  }

  const handleDelete = (e: any, title: string) => {
    e.stopPropagation()
    window.localStorage.setItem('ledfx-hosts', JSON.stringify(hosts.filter((h) => h !== title)))
    setHosts(hosts.filter((h) => h !== title))
  }

  const handleScanSuccess = (scannedHost: string) => {
    console.log('Scanned host:', scannedHost)
    // Basic validation (you might want more robust validation)
    if (scannedHost.startsWith('http://') || scannedHost.startsWith('https://')) {
      setHostvalue(scannedHost.replace(/\/+$/, '')) // Set for the TextField, remove trailing slashes
      setAdd(true) // Show the add section if it's not already visible
      // Optionally, directly add to hosts list or even save
      if (!hosts.some((h) => h === scannedHost)) {
        setHosts((prevHosts) => [...prevHosts, scannedHost])
      }
      handleSave(scannedHost) // Or let user click save
    } else {
      // Handle invalid QR code content, e.g., show a snackbar or alert
      alert(
        `Invalid QR code content: "${scannedHost}". Expected a URL starting with http:// or https://`
      )
    }
    // setQrScannerOpen(false) // Close the scanner dialog
  }

  useEffect(() => {
    if (storedURL) setHostvalue(storedURL)
    if (storedURLs) setHosts(storedURLs)
    if (
      window.location.protocol === 'https:' &&
      (storedURLs.some(
        (u: string) => u.split(':')[0] === 'http' && !u.startsWith('http://localhost')
      ) ||
        (storedURL?.split(':')[0] === 'http' && !storedURL.startsWith('http://localhost')))
    ) {
      setMixedContent(true)
    }
    if (window.location.origin === 'https://ledfx.stream') {
      setIsLedFxStream(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedURL, setHosts, JSON.stringify(storedURLs)])

  useEffect(() => {
    // Add HTTPS host if SSL is enabled and it's not already in the list
    if (sslEnabled && !hosts.includes('https://localhost:8889')) {
      const updatedHosts = ['https://localhost:8889', ...hosts]
      setHosts(updatedHosts)
      window.localStorage.setItem('ledfx-hosts', JSON.stringify(updatedHosts))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sslEnabled])

  useEffect(() => {
    if (!storedURL) {
      const defaultHost = sslEnabled ? 'https://localhost:8889' : 'http://localhost:8888'
      const baseHost = getBaseUrl(window.location.href)
      const newHost = isElectron()
        ? defaultHost
        : baseHost === 'http://localhost:3000'
          ? defaultHost
          : baseHost || defaultHost
      setHost(newHost)
      setHostvalue(newHost)
      window.localStorage.setItem('ledfx-host', newHost)
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div key="nohost-dialog">
      <Dialog
        open={dialogOpen && !dialogQrOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {edit ? 'LedFx-Core Host' : !cc ? 'No LedFx-Core found' : 'LedFx-Core not ready'}
          {!edit && cc && (
            <CircularProgress
              size={20}
              sx={{
                marginLeft: '1rem',
                color: 'primary.main'
              }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {mixedContent && (
            <>
              <Alert severity="warning">
                Chrome will protect you from using insecure content.
                <br /> You need to allow insecure content in your browser's site settings.
                <Accordion sx={{ bgcolor: 'transparent' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">Show How-To</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <img src={mixedContent2} alt="mixedContent2" />
                    <br />
                    <br />
                    <img src={mixedContent1} alt="mixedContent1" />
                  </AccordionDetails>
                </Accordion>
              </Alert>
            </>
          )}
          <DialogContentText mb={1}>Known Hosts: (click to connect)</DialogContentText>
          <div>
            {hosts.map((h) => (
              <div key={h}>
                <div style={{ display: 'flex' }}>
                  <Button
                    size="medium"
                    sx={{ textTransform: 'none' }}
                    fullWidth
                    aria-label="connect"
                    onClick={() => {
                      setHostvalue(h)
                      handleSave(h)
                    }}
                  >
                    {h}
                  </Button>
                  <Button aria-label="delete" onClick={(e) => h && handleDelete(e, h)}>
                    <Delete />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {add ? (
            <>
              {!edit ? (
                <DialogContentText>You can change the host if you want:</DialogContentText>
              ) : (
                <DialogContentText mt={3}>Add new host:</DialogContentText>
              )}
              <div style={{ display: 'flex', marginTop: '0.5rem' }}>
                <TextField
                  label="IP:Port"
                  variant="outlined"
                  value={hostvalue}
                  onKeyDown={(e) => e.key === 'Enter' && setHosts([...hosts, hostvalue])}
                  onChange={(e) => setHostvalue(e.target.value)}
                />
                <Button
                  aria-label="add"
                  onClick={() => {
                    setHosts([...hosts, hostvalue.replace(/\/+$/, '')])
                    setAdd(false)
                  }}
                >
                  <Save />
                </Button>
              </div>
            </>
          ) : (
            <Box textAlign={'center'} mt={2}>
              <Button
                sx={{ mt: 2, ml: 'auto', mr: 'auto' }}
                aria-label="add"
                onClick={() => setAdd(true)}
              >
                <Add />
              </Button>
              <Button
                sx={{ mt: 2, ml: 'auto', mr: 'auto' }}
                aria-label="add"
                onClick={() => setQrScannerOpen(true)}
              >
                <QrCodeScanner />
              </Button>
              <QrScanner
                onClose={() => setQrScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
                open={qrScannerOpen}
              />
            </Box>
          )}
          {isLedFxStream && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              You don't have LedFx yet?
              <br />
              <a
                href="https://get.ledfx.stream"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <img
                  src="https://img.shields.io/badge/Get-LedFx-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAACAdJREFUeF7tnTvIHVUQx///+EYTRWIMooKiKAHfgo2ClqJdJIXa+EAkhRYiapMmTQSxUEQUjYVaqOmEtCKKCBJQUSIRQVCRGIMajW8zsmG/j+9xd3f27szZPd+Z297ZOfP43ZnZc8/eS8Sr6AiwaO/DeQQAhUMQAAQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAhUegcPejAgQAyyMgIg8UHpMm9z8g+dlYsfHIC8kXV1UAEbkVwN6xHJ34uutISmobRWQPgK3G675C8t6ZLUBE3gNwo/GCa0HdvyRPSumIiFwP4CPjNY+SPKPS2TgDiMh/ANYZL7wW1O0leVsqR0TEvOKQXMx7GwAnAvgnlaOZrXMTyfe9bRaRPwGcYrzOFpL7F3S23gXEPNAaetd5wLPvL/Wq8zYw5oFGCNzmAe++3wuASjjmgUYIXOYB774/DwAxDzR3A9N5IEXf7w1AXQVif6AZApN5IFXfnwuAGoLYH5gNweB5IGXfnxuAmAda7woGzQMp+/5QAGIeMJ4HUvf9QQDEPNC5LdNrHhij7w8GoIbgTQAXd4Zj+gLXGZuongfG6vsmABgHbTR1IvIcgO3GBqjmgbH6fgCwItsi8jOAM40haN0fGLPvBwAzMu3xaay+TZ11fmDsvh8AzAbgEgBfGleBVfPAFPp+ANCQ5RTzgEelWfr9fl+AO78N7Kswd3nPeWAqfd+1AojIqT0hOK2nfJd40/pHSB7turi+xTU/hQPgHQC3aNbvIbOb5H095FeJmlcAEakcvXmIUV7XakuliHjMA9ZuLZ7rG6LYHID6EzTV84R/k1QdsXKaB4bkatm1Wpi7FvQCYMrfF7xLUlWhnOaBrpxo3l92rk9zQZOMCwB1FbgdwNtDjHO8dhvJtzT6PaZ2zbotMsfP8w/UsXi5GwA1BB8CuMHKWGM9G0j+2qVzYvOASd9f6rMrADUEx9qeP+hKgOf72j46lXlAa2+fmKUA4GQAf/UxKqHsQZKbNetNYB4w6/tJK0BdBe4AoOq5mmQYyzxL8iGNzhHnAdO+nxyAGoJ9AK7VBHoEmWtIfty17kjzgHnfHwWAGgKPHbauvGnfV53kST0PePT9MQGotn1/12Yksdwxkido1kw4D7j0/dEAqKvALgCPaQI9gsw+ktXj2J2vBPPA4H3+TidS356JSLUNWz3xOuXX/SRf7jLQeR5w7fujVYAEn5quvGnfP4fkj13CIvIagLu65Pq+7933RwFARDzuAp4i+WjfAFvJO32/X5ln+rxhm7/uG0F1398G4A2rwNd6DpPcaKxTrc7pXN/S9VV3JWqDGwTdAagPiPwx1NCV16cskyvXdjrXt3IZ9fMFQ2KbAgCPe/8LSH47xPEh1yacZVTPFwzxxRUAEal2164aYuCMa3eRfMJYp1qdY99vssF1HnADQETuBPC6OrI6wUMkN+lE7aUS9P0mo93mARcARMRlx6+Avt8EgNs84AWAR98/j+T39p9rncaEfb/JIJd5wBwAEfkEwJW6sKqldpLcoZY2Fhyh7yebB0wBEJFqV6zaHbN8/UDyXEuFfXSN2PeTzANmAETf74PVIFnTecASAI++v5nkwUHhGnDxBPq++zxgAoCIfArgigGxnnXpDpI7jXWq1U2o77vOA4MBEJG7AbyqjqxO8DuS5+tE7aUm2Pfd5oFBAIjI6QB+s07BGrzfrx5KvTrF7w/0zcVQADz6/iaSh/o6YiXv0fcXgHY6Tzhof2BuAETkcwBbrAJf63mc5JPGOtXqnPr+snN9TucJ5/6+YC4AROQeALvVkdUJfkPyQp2ovZRT3595nt+jyjT9HlFXpHoDEH2/K6SL7zee63M6TzjX/sA8AHj0/Y0kD6tDayzo8YnsGmSnMg/0AkBEqv+audw4/o+QfNpYp1pdir7fZMwU5gE1ACJS/RbNS+rI6gS/JnmRTtReyqnv9zrP71F9+swDKgCi76vh632ef+x5QAuAR98/m+RP6tAaC3p88rr6fksrGO33ijsBEJEvAFxmHP+HST5jrFOtbsy+P7V5oBWA+g+LX1BHVif4FcnqZ9hGeTn1fZPn9z2qUtc80AiAiKwHcMQ6S/OWSQs7nM7z9+77LVXA4/cJW/cH2gDw6PtnkfzFIpnz6PD4hFkDnXp/YCYAInIAwKXzBLnlmu0knzfWqVY3xb4/hXlgFQAi8iAA60QdIGk9SPZJ/h4AW9UX6ARN+n4LBB4VeNXzBcsAiL6vyzwAs74/9jywEgAP6taTND80ok1VDn1/zP2BRQBEpPq3DOvbM9WvbWiT2Vcup74/1jxwHAARqf41q9qNsnztJ2l9YERt35Tv99VO1IIeVWxhf4AisgGA+a2Z9e1Rn6BN/X6/jy/1B9Rtf6BzK7ivsSGfVwQCgLzyZW5tAGAe0rwUBgB55cvc2gDAPKR5KQwA8sqXubUBgHlI81IYAOSVL3NrAwDzkOalMADIK1/m1gYA5iHNS2EAkFe+zK0NAMxDmpfCACCvfJlbGwCYhzQvhQFAXvkytzYAMA9pXgoDgLzyZW5tAGAe0rwUBgB55cvc2gDAPKR5KQwA8sqXubUBgHlI81IYAOSVL3NrAwDzkOalMADIK1/m1gYA5iHNS2EAkFe+zK0NAMxDmpfC/wGlVxOu/6/T0QAAAABJRU5ErkJggg==&logoColor=white"
                  alt="LedFx"
                />
              </a>
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
