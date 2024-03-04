import { PlayerEvent } from "./eventTypes";
export interface Song {
    song_id: number;
    name: string;
    uploader: string;
    game_name: string;
    game_id: number;
}
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
    setVolume(level: number): void;
    incVolume(step: number): void;
    decVolume(step: number): void;
    seek(to: number): void;
    playPause(): void;
    setLoop(enable: boolean): void;
    stop(): void;
    play(url: string, song?: Song): Promise<void>;
    _setMediaSessionData(song?: Song): Promise<void>;
}
