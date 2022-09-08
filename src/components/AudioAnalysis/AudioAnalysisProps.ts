export interface AudioAnalysisProps {
  segments: any;
  width: number;
  height: number;
  pitches: any;
//   pitches: typeof defaultPitches;
}

export const defaultPitches ={
     C: true,
        'C#': true,
        D: true,
        'D#': true,
        E: true,
        F: true,
        'F#': true,
        G: true,
        'G#': true,
        A: true,
        'A#': true,
        B: true,
}