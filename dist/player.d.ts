import { PlayerEvent } from "./eventTypes";
export interface Song {
    song_id: number;
    name: string;
    uploader: string;
    game_name: string;
    game_id: number;
}
export interface Options {
    loopType: LoopType;
    loopFor?: number;
    crossfade: boolean;
    mediaControls: boolean;
    song?: Song;
    volume?: number;
}
export type LoopType = "infinite" | "count" | "time" | "none";
export declare class BrstmPlayer {
    constructor();
    private _state;
    private _audio;
    sendEvent(type: PlayerEvent, payload?: object): void;
    sendUpdateStateEvent(): void;
    private getResampledSample;
    private loadSongLegacy;
    private loadSongStreaming;
    get totalSamples(): number;
    get sampleRate(): number;
    getSongLength(): number;
    crossfadeStep(): void;
    setVolume(level: number): void;
    incVolume(step: number): void;
    decVolume(step: number): void;
    seek(to: number): void;
    playPause(): void;
    setLoop(loopType: LoopType, loopFor?: number): void;
    stop(): void;
    shouldLoop(): boolean;
    restartState(volume?: number): void;
    play(url: string, options?: Options): Promise<void>;
    _setMediaSessionData(song?: Song): Promise<void>;
}
