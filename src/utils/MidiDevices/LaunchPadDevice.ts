import { lpsColors } from './LaunchpadS/lpsColors';
import { lpColors } from './LaunchpadX/lpColors';

export interface LaunchpadXDevice {
    buttonNumbers: number[][];
    colors: Record<string, number>;
    commonColors: Record<string, number>;
    globalColors: {
        sceneActiveType: string;
        sceneActiveColor: string;
        sceneInactiveType: string;
        sceneInactiveColor: string;
        commandType: string;
        commandColor: string;
    };
    command: {
        programmer: number[];
        live: number[];
        standalone: number[];
        daw: number[];
        ledOn: (number | string)[];
        ledFlash: (number | string)[];
        ledPulse: (number | string)[];
        rgb: (number | string)[];
    };
    fn: {
        ledOff: (buttonNumber: number) => number[];
        ledOn: (buttonNumber: number, color: keyof typeof lpColors | number, mode?: 'solid' | 'flash' | 'pulse') => number[];
        ledSolid: (buttonNumber: number, color: keyof typeof lpColors | number) => number[];
        ledFlash: (buttonNumber: number, color: keyof typeof lpColors | number) => number[];
        ledPulse: (buttonNumber: number, color: keyof typeof lpColors | number) => number[];
        rgb: (buttonNumber: number, r: number, g: number, b: number) => number[];
    };
}

export interface LaunchpadSDevice {
    buttonNumbers: number[][];
    colors: Record<string, number>;
    commonColors: Record<string, number>;
    globalColors: {
        sceneActiveType: string;
        sceneActiveColor: string;
        sceneInactiveType: string;
        sceneInactiveColor: string;
        commandType: string;
        commandColor: string;
    };
    fn: {
        ledOff: (buttonNumber: number) => number[];
        ledOn: (buttonNumber: number, color: keyof typeof lpsColors | number) => number[];
    };
}

export interface LaunchpadMK2Device {
    buttonNumbers: number[][];
    colors: Record<string, number>;
    commonColors: Record<string, number>;
    globalColors: {
        sceneActiveType: string;
        sceneActiveColor: string;
        sceneInactiveType: string;
        sceneInactiveColor: string;
        commandType: string;
        commandColor: string;
    };
    command: {
        programmer: number[];
        live: number[];
        standalone: number[];
        daw: number[];
        ledOn: (number | string)[];
        ledFlash: (number | string)[];
        ledPulse: (number | string)[];
        rgb: (number | string)[];
    };
    fn: {
        ledOff: (buttonNumber: number) => number[];
        ledOn: (buttonNumber: number, color: keyof typeof lpColors | number, mode?: 'solid' | 'flash' | 'pulse') => number[];
        ledSolid: (buttonNumber: number, color: keyof typeof lpColors | number) => number[];
        ledFlash: (buttonNumber: number, color: keyof typeof lpColors | number) => number[];
        ledPulse: (buttonNumber: number, color: keyof typeof lpColors | number) => number[];
        rgb: (buttonNumber: number, r: number, g: number, b: number) => number[];
    };
}

export type LaunchpadDevice = LaunchpadXDevice | LaunchpadSDevice | LaunchpadMK2Device;
