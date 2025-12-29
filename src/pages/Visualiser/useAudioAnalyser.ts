/**
 * Audio Analyser Hook
 *
 * Provides real-time audio analysis from browser microphone including:
 * - FFT frequency data
 * - Beat detection
 * - BPM calculation
 * - Energy levels (bass, mid, high)
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Meyda from 'meyda'

export interface AudioAnalyserData {
  // Frequency data (0-255 values for each frequency bin)
  frequencyData: number[]
  // Normalized frequency data (0-1)
  normalizedFrequency: number[]
  // Time domain waveform data
  waveformData: number[]
  // Energy levels
  bass: number // 20-250 Hz
  mid: number // 250-4000 Hz
  high: number // 4000-20000 Hz
  overall: number // Overall energy (RMS)
  // Beat detection
  isBeat: boolean
  beatIntensity: number
  // BPM
  bpm: number
  confidence: number
  // Peak detection
  isPeak: boolean
  peakIntensity: number
  // Advanced Features (Meyda)
  spectralCentroid: number // Brightness
  spectralFlatness: number // Noisiness
  // Build-up Detection
  isBuildUp: boolean
  buildUpConfidence: number
}

export interface AudioAnalyserConfig {
  fftSize?: number
  smoothingTimeConstant?: number
  minDecibels?: number
  maxDecibels?: number
  beatThreshold?: number
  beatDecay?: number
  bpmMin?: number
  bpmMax?: number
}

const DEFAULT_CONFIG: Required<AudioAnalyserConfig> = {
  fftSize: 2048,
  smoothingTimeConstant: 0.4,
  minDecibels: -90,
  maxDecibels: -10,
  beatThreshold: 1.15,
  beatDecay: 0.95,
  bpmMin: 60,
  bpmMax: 200
}

// Circular buffer for BPM detection
class BeatHistory {
  private buffer: number[] = []
  private times: number[] = []
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  add(time: number) {
    this.times.push(time)
    if (this.times.length > this.maxSize) {
      this.times.shift()
    }
  }

  getBPM(): { bpm: number; confidence: number } {
    if (this.times.length < 4) return { bpm: 0, confidence: 0 }

    // Calculate intervals between beats
    const intervals: number[] = []
    for (let i = 1; i < this.times.length; i++) {
      const interval = this.times[i] - this.times[i - 1]
      // Only consider reasonable intervals (30-200 BPM range = 300-2000ms)
      if (interval > 300 && interval < 2000) {
        intervals.push(interval)
      }
    }

    if (intervals.length < 3) return { bpm: 0, confidence: 0 }

    // Find the most common interval using histogram
    const histogram = new Map<number, number>()
    const binSize = 50 // 50ms bins

    intervals.forEach((interval) => {
      const bin = Math.round(interval / binSize) * binSize
      histogram.set(bin, (histogram.get(bin) || 0) + 1)
    })

    // Find the most common bin
    let maxCount = 0
    let mostCommonInterval = 0

    histogram.forEach((count, interval) => {
      if (count > maxCount) {
        maxCount = count
        mostCommonInterval = interval
      }
    })

    if (mostCommonInterval === 0) return { bpm: 0, confidence: 0 }

    // Calculate BPM from interval
    let bpm = Math.round(60000 / mostCommonInterval)

    // Simple harmonic correction: prefer 90-180 range
    if (bpm < 90 && bpm > 0) bpm *= 2

    const confidence = Math.min(maxCount / intervals.length, 1)

    return { bpm, confidence }
  }

  clear() {
    this.times = []
  }
}

export function useAudioAnalyser(config: AudioAnalyserConfig = {}) {
  const cfg = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])

  const [isInitialized, setIsInitialized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AudioAnalyserData>({
    frequencyData: [],
    normalizedFrequency: [],
    waveformData: [],
    bass: 0,
    mid: 0,
    high: 0,
    overall: 0,
    isBeat: false,
    beatIntensity: 0,
    bpm: 0,
    confidence: 0,
    isPeak: false,
    peakIntensity: 0,
    spectralCentroid: 0,
    spectralFlatness: 0,
    isBuildUp: false,
    buildUpConfidence: 0
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const processAudioRef = useRef<() => void>(() => {})

  // Beat detection state
  const energyHistoryRef = useRef<number[]>([])
  const beatHistoryRef = useRef<BeatHistory>(new BeatHistory())
  const lastBeatTimeRef = useRef<number>(0)
  const beatThresholdRef = useRef<number>(0)
  const peakEnergyRef = useRef<number>(0)

  // Build-up detection state
  const buildUpHistoryRef = useRef<{ rms: number; centroid: number }[]>([])

  useEffect(() => {
    processAudioRef.current = () => {
      const analyser = analyserRef.current
      if (!analyser) return

      const bufferLength = analyser.frequencyBinCount
      const frequencyData = new Uint8Array(bufferLength)
      const waveformData = new Uint8Array(bufferLength)

      analyser.getByteFrequencyData(frequencyData)
      analyser.getByteTimeDomainData(waveformData)

      // Convert to arrays and normalize
      const freqArray = Array.from(frequencyData)
      const normalizedFreq = freqArray.map((v) => v / 255)
      // Waveform -1 to 1 for Meyda
      const waveArray = Array.from(waveformData).map((v) => (v - 128) / 128)

      // Calculate frequency bins for bass, mid, high
      const binWidth = 44100 / cfg.fftSize
      const bassEnd = Math.floor(250 / binWidth)
      const midEnd = Math.floor(4000 / binWidth)

      // Calculate energy levels manually (still useful for bands)
      let bassSum = 0
      let midSum = 0
      let highSum = 0
      for (let i = 0; i < bufferLength; i++) {
        const value = normalizedFreq[i]
        if (i < bassEnd) {
          bassSum += value
        } else if (i < midEnd) {
          midSum += value
        } else {
          highSum += value
        }
      }

      const bass = bassEnd > 0 ? bassSum / bassEnd : 0
      const mid = midEnd - bassEnd > 0 ? midSum / (midEnd - bassEnd) : 0
      const high = bufferLength - midEnd > 0 ? highSum / (bufferLength - midEnd) : 0

      // Extract Meyda features (RMS, Centroid, etc.)
      let spectralCentroid = 0
      let spectralFlatness = 0
      let rms = 0

      try {
        // Note: Meyda expects a power of 2 buffer size.
        // We requested fftSize (2048), so frequencyBinCount is 1024.
        // TimeDomainData is fftSize (2048).
        // So we can pass waveArray (length 2048) to Meyda.
        const features = Meyda.extract(
          ['rms', 'spectralCentroid', 'spectralFlatness'],
          waveArray as any
        )
        if (features) {
          rms = features.rms || 0
          spectralCentroid = features.spectralCentroid || 0
          spectralFlatness = features.spectralFlatness || 0
        }
      } catch {
        // console.warn('Meyda error')
      }

      const overall = rms > 0 ? rms * 2 : (bass * 2 + mid + high * 0.5) / 3.5

      // Beat detection using energy comparison
      const energyHistory = energyHistoryRef.current
      energyHistory.push(bass)
      if (energyHistory.length > 43) {
        // ~1 second at 43fps
        energyHistory.shift()
      }

      // Calculate average energy
      const avgEnergy = energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length
      const now = performance.now()

      // Dynamic threshold
      if (overall > peakEnergyRef.current) {
        peakEnergyRef.current = overall
      }
      peakEnergyRef.current *= 0.999 // Slow decay

      // Beat detection
      const beatThreshold = avgEnergy * cfg.beatThreshold
      const isBeat = bass > beatThreshold && bass > 0.2 && now - lastBeatTimeRef.current > 200 // Minimum 200ms between beats

      if (isBeat) {
        lastBeatTimeRef.current = now
        beatHistoryRef.current.add(now)
        beatThresholdRef.current = 1
      }

      // Beat intensity decay
      beatThresholdRef.current *= cfg.beatDecay
      const beatIntensity = beatThresholdRef.current

      // Get BPM
      const { bpm, confidence } = beatHistoryRef.current.getBPM()

      // Peak detection (for visual effects)
      const isPeak = overall > peakEnergyRef.current * 0.9
      const peakIntensity = isPeak ? overall / Math.max(peakEnergyRef.current, 0.01) : 0

      // Build-up Detection
      const buildUpHistory = buildUpHistoryRef.current
      buildUpHistory.push({ rms: overall, centroid: spectralCentroid })
      if (buildUpHistory.length > 200) buildUpHistory.shift()

      let isBuildUp = false
      let buildUpConfidence = 0

      if (buildUpHistory.length > 100) {
        const start = buildUpHistory.slice(0, 20)
        const end = buildUpHistory.slice(-20)

        const startRms = start.reduce((a, b) => a + b.rms, 0) / 20
        const endRms = end.reduce((a, b) => a + b.rms, 0) / 20

        const startCentroid = start.reduce((a, b) => a + b.centroid, 0) / 20
        const endCentroid = end.reduce((a, b) => a + b.centroid, 0) / 20

        const rmsSlope = endRms - startRms
        const centroidSlope = endCentroid - startCentroid

        // Thresholds: RMS increase > 0.05, Centroid increase > 2
        if (rmsSlope > 0.05 && centroidSlope > 2) {
          isBuildUp = true
          buildUpConfidence = Math.min(rmsSlope * 5 + centroidSlope * 0.1, 1)
        }
      }

      setData({
        frequencyData: freqArray,
        normalizedFrequency: normalizedFreq,
        waveformData: waveArray,
        bass,
        mid,
        high,
        overall,
        isBeat,
        beatIntensity,
        bpm,
        confidence,
        isPeak,
        peakIntensity,
        spectralCentroid,
        spectralFlatness,
        isBuildUp,
        buildUpConfidence
      })

      animationRef.current = requestAnimationFrame(processAudioRef.current)
    }
  }, [cfg.fftSize, cfg.beatThreshold, cfg.beatDecay])

  const startListening = useCallback(async () => {
    try {
      setError(null)

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      })

      streamRef.current = stream

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Create analyser node
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = cfg.fftSize
      analyser.smoothingTimeConstant = cfg.smoothingTimeConstant
      analyser.minDecibels = cfg.minDecibels
      analyser.maxDecibels = cfg.maxDecibels
      analyserRef.current = analyser

      // Connect source to analyser
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      sourceRef.current = source

      // Start processing
      setIsInitialized(true)
      setIsListening(true)
      processAudioRef.current()
    } catch (err: any) {
      console.error('Failed to start audio analyser:', err)
      setError(err.message || 'Failed to access microphone')
    }
  }, [cfg])

  const stopListening = useCallback(() => {
    // Stop animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Disconnect source
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    // Stop stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsListening(false)

    // Reset beat history
    beatHistoryRef.current.clear()
    energyHistoryRef.current = []
    lastBeatTimeRef.current = 0
    beatThresholdRef.current = 0
    peakEnergyRef.current = 0
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  return {
    data,
    isInitialized,
    isListening,
    error,
    startListening,
    stopListening
  }
}

export default useAudioAnalyser
