import { JSX } from 'react/jsx-runtime';
import { PersistOptions } from 'zustand/middleware';
import { StoreApi } from 'zustand';
import { Theme } from '@mui/material';
import { UseBoundStore } from 'zustand';

declare interface AstrofoxConfig {
    layers: AstrofoxLayer[];
    backgroundColor: string;
    width: number;
    height: number;
}

declare type AstrofoxLayer = BarSpectrumLayer | WaveSpectrumLayer | SoundWaveLayer | SoundWave2Layer | TextLayer | ImageLayer | Geometry3DLayer | GroupLayer;

declare interface AstrofoxLayerBase {
    id: string;
    type: AstrofoxLayerType;
    name: string;
    visible: boolean;
    opacity: number;
    blendMode: (typeof BLEND_MODES)[number];
    x: number;
    y: number;
    rotation: number;
    scale: number;
}

declare type AstrofoxLayerType = 'barSpectrum' | 'waveSpectrum' | 'soundWave' | 'soundWave2' | 'text' | 'image' | 'geometry3d' | 'group';

declare interface BadTVConfig {
    distortion?: number;
    distortion2?: number;
    speed?: number;
    rollSpeed?: number;
    scanlineIntensity?: number;
    scanlineCount?: number;
    staticNoise?: number;
    rgbSplit?: number;
}

declare interface BarSpectrumLayer extends AstrofoxLayerBase {
    type: 'barSpectrum';
    width: number;
    height: number;
    barWidth: number;
    barSpacing: number;
    barColor: string;
    barColorEnd: string;
    shadowHeight: number;
    shadowColor: string;
    minFrequency: number;
    maxFrequency: number;
    maxDecibels: number;
    smoothing: number;
    mirror: boolean;
}

/**
 * AstrofoxVisualiser - Layer-based audio visualizations inspired by Astrofox
 *
 * This component provides a layer-based composition system similar to Astrofox,
 * allowing users to stack multiple visual elements (text, spectrum bars, images, waveforms, 3D geometry)
 * with individual audio reactivity settings.
 *
 * Reference: https://github.com/astrofox-io/astrofox
 */
declare const BLEND_MODES: readonly ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"];

declare interface BloomConfig {
    threshold?: number;
    intensity?: number;
    radius?: number;
    blendMode?: 'add' | 'screen';
}

/**
 * ButterchurnVisualiser - Milkdrop-style visualizations using Butterchurn
 *
 * This component renders Milkdrop presets with automatic cycling and audio reactivity.
 * Based on https://butterchurnviz.com/ and https://github.com/jberg/butterchurn
 */
declare interface ButterchurnConfig {
    currentPresetName?: string;
    cycleInterval: number;
    blendTime: number;
    shufflePresets: boolean;
    currentPresetIndex: number;
    initialPresetName?: string;
    initialPresetIndex?: number;
}

/**
 * WebGL Visualizer Default Configurations (Auto-Generated from Backend)
 *
 * ⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: https://github.com/LedFx/LedFx/tree/main/ledfx/effects
 *
 * Effect names match backend Python filenames for consistency.
 * All Twod-based 2D matrix effects are auto-discovered.
 *
 * Run `pnpm generate:backend` to regenerate.
 */
export declare const DEFAULT_CONFIGS: Record<string, any>;

declare interface DotScreenConfig {
    centerX?: number;
    centerY?: number;
    angle?: number;
    scale?: number;
    grayscale?: boolean;
    cmyk?: boolean;
}

declare interface FilmGrainConfig {
    intensity?: number;
    grainSize?: number;
    luminanceAffect?: number;
    colored?: boolean;
    speed?: number;
}

declare interface Geometry3DLayer extends AstrofoxLayerBase {
    type: 'geometry3d';
    shape: (typeof GEOMETRY_SHAPES)[number];
    material: (typeof GEOMETRY_MATERIALS)[number];
    shading: (typeof SHADING_TYPES)[number];
    color: string;
    wireframe: boolean;
    edges: boolean;
    edgeColor: string;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    size: number;
    audioReactive: boolean;
}

declare const GEOMETRY_MATERIALS: readonly ["Standard", "Basic", "Lambert", "Phong", "Normal"];

declare const GEOMETRY_SHAPES: readonly ["Box", "Sphere", "Dodecahedron", "Icosahedron", "Octahedron", "Tetrahedron", "Torus", "Torus Knot"];

declare interface GlitchConfig {
    amount?: number;
    speed?: number;
    seed?: number;
}

declare interface GodRaysConfig {
    lightX?: number;
    lightY?: number;
    exposure?: number;
    decay?: number;
    density?: number;
    weight?: number;
    intensity?: number;
    threshold?: number;
    rayColor?: [number, number, number];
    numSamples?: number;
}

declare interface GroupLayer extends AstrofoxLayerBase {
    type: 'group';
    mask: boolean;
    childIds: string[];
}

declare interface ImageLayer extends AstrofoxLayerBase {
    type: 'image';
    imageUrl: string;
    imageData: string;
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
    fixed: boolean;
}

export declare type IStore = typeof state;

declare interface KaleidoscopeConfig {
    sides?: number;
    angle?: number;
    rotationSpeed?: number;
    beatSync?: boolean;
    beatAmount?: number;
}

declare interface LEDConfig {
    spacing?: number;
    size?: number;
    blur?: number;
    brightness?: number;
    showGrid?: boolean;
}

declare interface MigrationState {
    [key: string]: any;
}

declare interface MirrorConfig {
    mode?: MirrorMode;
    position?: number;
    flip?: boolean;
}

declare type MirrorMode = 'horizontal' | 'vertical' | 'quadrant' | 'diagonal';

declare interface PixelateConfig {
    pixelSize?: number;
    roundPixels?: boolean;
}

declare interface PostProcessingConfig {
    bloom?: BloomConfig & {
        enabled?: boolean;
    };
    kaleidoscope?: KaleidoscopeConfig & {
        enabled?: boolean;
    };
    glitch?: GlitchConfig & {
        enabled?: boolean;
    };
    rgbShift?: RGBShiftConfig & {
        enabled?: boolean;
    };
    led?: LEDConfig & {
        enabled?: boolean;
    };
    vignette?: VignetteConfig & {
        enabled?: boolean;
    };
    filmGrain?: FilmGrainConfig & {
        enabled?: boolean;
    };
    godRays?: GodRaysConfig & {
        enabled?: boolean;
    };
    pixelate?: PixelateConfig & {
        enabled?: boolean;
    };
    mirror?: MirrorConfig & {
        enabled?: boolean;
    };
    dotScreen?: DotScreenConfig & {
        enabled?: boolean;
    };
    badTV?: BadTVConfig & {
        enabled?: boolean;
    };
}

/**
 * AUTO-GENERATED - DO NOT EDIT
 * Visualizer Registry
 * Run: pnpm generate
 */
declare interface RegistryEntry<T = any> {
    $id: string;
    displayName: string;
    configType: string;
    defaultConfig: T;
    getUISchema: (config?: Partial<T>) => any;
    metadata: Record<string, any>;
}

declare interface RGBShiftConfig {
    amount?: number;
    angle?: number;
    radial?: boolean;
}

declare const SHADING_TYPES: readonly ["Smooth", "Flat"];

declare interface SoundWave2Layer extends AstrofoxLayerBase {
    type: 'soundWave2';
    radius: number;
    lineWidth: number;
    lineColor: string;
    mode: 'circle' | 'line';
    sensitivity: number;
}

declare interface SoundWaveLayer extends AstrofoxLayerBase {
    type: 'soundWave';
    width: number;
    height: number;
    lineWidth: number;
    color: string;
    fillColor: string;
    useFill: boolean;
    wavelength: number;
    smooth: number;
}

declare const state: Omit<{
    version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
    showCode: boolean;
    shaderCode: string;
    activeCustomShader: undefined;
    setShowCode: (show: boolean) => any;
    toggleShaderEditor: () => any;
    setShaderCode: (code: string) => any;
    setActiveCustomShader: (shader: string | undefined) => any;
    butterchurnConfig: ButterchurnConfig;
    butterchurnPresetNames: never[];
    astrofoxConfig: AstrofoxConfig;
    visualizerConfigs: Record<string, any>;
    astrofoxReady: boolean;
    setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
    updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
    setButterchurnPresetNames: (names: string[]) => any;
    setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
    updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
    setVisualizerConfig: (id: string, config: any) => any;
    updateVisualizerConfig: (id: string, partial: any) => any;
    setAstrofoxReady: (ready: boolean) => any;
    initializeConfigs: () => void;
    fxEnabled: boolean;
    ppConfig: PostProcessingConfig;
    glContext: WebGLRenderingContext | null;
    canvasSize: {
        width: number;
        height: number;
    };
    setFxEnabled: (enabled: boolean) => any;
    toggleFx: () => any;
    setPpConfig: (config: PostProcessingConfig) => any;
    updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
    setGlContext: (context: WebGLRenderingContext | null) => any;
    setCanvasSize: (size: {
        width: number;
        height: number;
    }) => any;
    showOverlays: boolean;
    fullScreen: boolean;
    showFxPanel: boolean;
    saveError: null;
    setShowOverlays: (show: boolean) => any;
    toggleOverlays: () => any;
    setFullScreen: (fullScreen: boolean) => any;
    setShowFxPanel: (show: boolean) => any;
    setSaveError: (error: string | null) => any;
    visualType: VisualisationType;
    audioSource: "backend" | "mic" | "system";
    autoChange: boolean;
    isPlaying: boolean;
    setVisualType: (type: VisualisationType) => any;
    setAudioSource: (source: "backend" | "mic" | "system") => any;
    setAutoChange: (enabled: boolean) => any;
    setIsPlaying: (playing: boolean) => any;
    togglePlay: () => any;
};

export declare interface StoreConfigsActions {
    setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => void;
    updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => void;
    setButterchurnPresetNames: (names: string[]) => void;
    setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => void;
    updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => void;
    setVisualizerConfig: (id: string, config: any) => void;
    updateVisualizerConfig: (id: string, partial: any) => void;
    setAstrofoxReady: (ready: boolean) => void;
    initializeConfigs: () => void;
}

export declare interface StoreConfigsState {
    butterchurnConfig: ButterchurnConfig;
    butterchurnPresetNames: string[];
    astrofoxConfig: AstrofoxConfig;
    visualizerConfigs: Record<string, any>;
    astrofoxReady: boolean;
}

export declare interface StorePostProcessingActions {
    setFxEnabled: (enabled: boolean) => void;
    toggleFx: () => void;
    setPpConfig: (config: PostProcessingConfig) => void;
    updatePpConfig: (partial: Partial<PostProcessingConfig>) => void;
    setGlContext: (context: WebGLRenderingContext | null) => void;
    setCanvasSize: (size: {
        width: number;
        height: number;
    }) => void;
}

export declare interface StorePostProcessingState {
    fxEnabled: boolean;
    ppConfig: PostProcessingConfig;
    glContext: WebGLRenderingContext | null;
    canvasSize: {
        width: number;
        height: number;
    };
}

export declare interface StoreShaderEditorActions {
    setShowCode: (show: boolean) => void;
    toggleShaderEditor: () => void;
    setShaderCode: (code: string) => void;
    setActiveCustomShader: (shader: string | undefined) => void;
}

export declare interface StoreShaderEditorState {
    showCode: boolean;
    shaderCode: string;
    activeCustomShader: string | undefined;
}

export declare interface StoreUIActions {
    setShowOverlays: (show: boolean) => void;
    toggleOverlays: () => void;
    setFullScreen: (fullScreen: boolean) => void;
    setShowFxPanel: (show: boolean) => void;
    setSaveError: (error: string | null) => void;
}

export declare interface StoreUIState {
    showOverlays: boolean;
    fullScreen: boolean;
    showFxPanel: boolean;
    saveError: string | null;
}

export declare interface StoreVisualizerActions {
    setVisualType: (type: VisualisationType) => void;
    setAudioSource: (source: 'backend' | 'mic' | 'system') => void;
    setAutoChange: (enabled: boolean) => void;
    setIsPlaying: (playing: boolean) => void;
    togglePlay: () => void;
}

export declare interface StoreVisualizerState {
    visualType: VisualisationType;
    audioSource: 'backend' | 'mic' | 'system';
    autoChange: boolean;
    isPlaying: boolean;
}

declare interface TextLayer extends AstrofoxLayerBase {
    type: 'text';
    text: string;
    font: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    audioReactive: boolean;
    reactiveScale: number;
}

export declare const useStore: UseBoundStore<Omit<Omit<StoreApi<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}>, "setState" | "devtools"> & {
setState(partial: (Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) | Partial<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}> | ((state: Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) => (Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) | Partial<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}>), replace?: false | undefined, action?: (string | {
[x: string]: unknown;
[x: number]: unknown;
[x: symbol]: unknown;
type: string;
}) | undefined): void;
setState(state: (Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) | ((state: Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) => Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}), replace: true, action?: (string | {
[x: string]: unknown;
[x: number]: unknown;
[x: symbol]: unknown;
type: string;
}) | undefined): void;
devtools: {
cleanup: () => void;
};
}, "setState" | "persist"> & {
setState(partial: (Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) | Partial<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}> | ((state: Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) => (Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) | Partial<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}>), replace?: false | undefined, action?: (string | {
[x: string]: unknown;
[x: number]: unknown;
[x: symbol]: unknown;
type: string;
}) | undefined): unknown;
setState(state: (Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) | ((state: Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) => Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}), replace: true, action?: (string | {
[x: string]: unknown;
[x: number]: unknown;
[x: symbol]: unknown;
type: string;
}) | undefined): unknown;
persist: {
setOptions: (options: Partial<PersistOptions<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}, MigrationState, unknown>>) => void;
clearStorage: () => void;
rehydrate: () => Promise<void> | void;
hasHydrated: () => boolean;
onHydrate: (fn: (state: Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) => void) => () => void;
onFinishHydration: (fn: (state: Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}) => void) => () => void;
getOptions: () => Partial<PersistOptions<Omit<{
version: number;
}, "isPlaying" | "visualType" | "showCode" | "shaderCode" | "activeCustomShader" | "setShowCode" | "toggleShaderEditor" | "setShaderCode" | "setActiveCustomShader" | "butterchurnConfig" | "butterchurnPresetNames" | "astrofoxConfig" | "visualizerConfigs" | "astrofoxReady" | "setButterchurnConfig" | "updateButterchurnConfig" | "setButterchurnPresetNames" | "setAstrofoxConfig" | "updateAstrofoxConfig" | "setVisualizerConfig" | "updateVisualizerConfig" | "setAstrofoxReady" | "initializeConfigs" | "fxEnabled" | "ppConfig" | "glContext" | "canvasSize" | "setFxEnabled" | "toggleFx" | "setPpConfig" | "updatePpConfig" | "setGlContext" | "setCanvasSize" | "showOverlays" | "fullScreen" | "showFxPanel" | "saveError" | "setShowOverlays" | "toggleOverlays" | "setFullScreen" | "setShowFxPanel" | "setSaveError" | "audioSource" | "autoChange" | "setVisualType" | "setAudioSource" | "setAutoChange" | "setIsPlaying" | "togglePlay"> & {
showCode: boolean;
shaderCode: string;
activeCustomShader: undefined;
setShowCode: (show: boolean) => any;
toggleShaderEditor: () => any;
setShaderCode: (code: string) => any;
setActiveCustomShader: (shader: string | undefined) => any;
butterchurnConfig: ButterchurnConfig;
butterchurnPresetNames: never[];
astrofoxConfig: AstrofoxConfig;
visualizerConfigs: Record<string, any>;
astrofoxReady: boolean;
setButterchurnConfig: (config: ButterchurnConfig | ((prev: ButterchurnConfig) => ButterchurnConfig)) => any;
updateButterchurnConfig: (partial: Partial<ButterchurnConfig>) => any;
setButterchurnPresetNames: (names: string[]) => any;
setAstrofoxConfig: (config: AstrofoxConfig | ((prev: AstrofoxConfig) => AstrofoxConfig)) => any;
updateAstrofoxConfig: (partial: Partial<AstrofoxConfig>) => any;
setVisualizerConfig: (id: string, config: any) => any;
updateVisualizerConfig: (id: string, partial: any) => any;
setAstrofoxReady: (ready: boolean) => any;
initializeConfigs: () => void;
fxEnabled: boolean;
ppConfig: PostProcessingConfig;
glContext: WebGLRenderingContext | null;
canvasSize: {
width: number;
height: number;
};
setFxEnabled: (enabled: boolean) => any;
toggleFx: () => any;
setPpConfig: (config: PostProcessingConfig) => any;
updatePpConfig: (partial: Partial<PostProcessingConfig>) => any;
setGlContext: (context: WebGLRenderingContext | null) => any;
setCanvasSize: (size: {
width: number;
height: number;
}) => any;
showOverlays: boolean;
fullScreen: boolean;
showFxPanel: boolean;
saveError: null;
setShowOverlays: (show: boolean) => any;
toggleOverlays: () => any;
setFullScreen: (fullScreen: boolean) => any;
setShowFxPanel: (show: boolean) => any;
setSaveError: (error: string | null) => any;
visualType: VisualisationType;
audioSource: "backend" | "mic" | "system";
autoChange: boolean;
isPlaying: boolean;
setVisualType: (type: VisualisationType) => any;
setAudioSource: (source: "backend" | "mic" | "system") => any;
setAutoChange: (enabled: boolean) => any;
setIsPlaying: (playing: boolean) => any;
togglePlay: () => any;
}, MigrationState, unknown>>;
};
}>;

declare interface VignetteConfig {
    radius?: number;
    softness?: number;
    intensity?: number;
    color?: [number, number, number];
    centerX?: number;
    centerY?: number;
}

/**
 * WebGL to Backend Effect Mapping (Auto-Generated)
 *
 * ⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: https://github.com/LedFx/LedFx/tree/main/ledfx/effects
 *
 * This is now a 1:1 mapping since frontend effect names match backend filenames.
 * Effect names are preserved exactly as they appear in the backend (e.g., game_of_life, flame2d).
 *
 * Run `pnpm generate:backend` to regenerate.
 */
export declare const VISUAL_TO_BACKEND_EFFECT: Record<string, string>;

declare type VisualisationType = WebGLVisualisationType | Extract<keyof typeof VISUALIZER_REGISTRY, string>;

/**
 * WebGL Visualizer UI Schemas (Auto-Generated from Backend)
 *
 * ⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: https://github.com/LedFx/LedFx/tree/main/ledfx/effects
 *
 * Effect names match backend Python filenames for consistency.
 * All Twod-based 2D matrix effects are auto-discovered.
 *
 * Run `pnpm generate:backend` to regenerate.
 */
export declare const VISUALISER_SCHEMAS: Record<string, any[]>;

declare const VisualiserIso: {
    (props: VisualiserIsoProps): JSX.Element;
    displayName: string;
};
export { VisualiserIso as AudioVisualiser }
export { VisualiserIso }
export default VisualiserIso;

declare interface VisualiserIsoProps {
    theme: Theme;
    effects?: any;
    backendAudioData?: number[];
    ConfigFormComponent?: React.ComponentType<any>;
    configData?: any;
    onClose?: () => void;
}

/**
 * Public API exposed via window.visualiserApi for imperative control
 * Methods that require component internals (refs, fullscreen handle) or static registry data
 *
 * Note: Most state/actions are now available via window.YzAudioVisualiser.useStore
 * This API is kept minimal for methods that need internal component access
 */
export declare interface VisualiserWindowApi {
    loadPreset: (index: number) => void;
    loadPresetByName: (name: string) => void;
    getCurrentPreset: () => {
        name: string;
        index: number;
    };
    getPresetNames: () => string[];
    toggleFullscreen: () => void;
    getVisualizerIds: () => string[];
    getVisualizerMetadata: (id: string) => any;
    getVisualizerRegistry: () => any;
}

declare const VISUALIZER_REGISTRY: VisualizerRegistry;

declare interface VisualizerRegistry {
    [key: string]: RegistryEntry;
}

declare interface WaveSpectrumLayer extends AstrofoxLayerBase {
    type: 'waveSpectrum';
    width: number;
    height: number;
    lineWidth: number;
    lineColor: string;
    fill: boolean;
    fillColor: string;
    minFrequency: number;
    maxFrequency: number;
    smoothing: number;
}

export declare type WebGLVisualisationType = WebGLVisualiserId;

/**
 * AUTO-GENERATED - DO NOT EDIT
 * Run: pnpm generate:webgl
 */
/**
 * WebGL Visualizer Type
 * All available frontend-only GLSL shader visualizers
 */
declare type WebGLVisualiserId = 'gif' | 'matrix' | 'terrain' | 'geometric' | 'concentric' | 'particles' | 'bars3d' | 'radial3d' | 'waveform3d' | 'bleep' | 'bands' | 'bandsmatrix' | 'blocks' | 'equalizer2d' | 'blender' | 'clone' | 'digitalrain' | 'flame' | 'gameoflife' | 'image' | 'keybeat2d' | 'noise2d' | 'plasma2d' | 'plasmawled2d' | 'radial' | 'soap' | 'texter' | 'waterfall';

export { }
