import { PlayerEvent } from "./eventTypes";
export interface Song {
    song_id: number;
    name: string;
    uploader: string;
    game_name: string;
}
export declare class BrstmPlayer {
    constructor(apiURL?: string);
    private getBrstmUrl;
    private _state;
    private _audio;
    private _apiURL;
    private _currentSong;
    private _currentIndex;
    private _playlist;
    private _idsInPlaylist;
    sendEvent(type: PlayerEvent, payload?: object): void;
    sendUpdateStateEvent(): void;
    private getResampledSample;
    private loadSongLegacy;
    private loadSongStreaming;
    get totalSamples(): number;
    get sampleRate(): number;
    getSongLength(): number;
    playAtIndex(idx: number): void;
    setVolume(level: number): void;
    incVolume(step: number): void;
    decVolume(step: number): void;
    seek(to: number): void;
    next(): void;
    previous(): void;
    private movePlaylist;
    playPause(): void;
    setLoop(enable: boolean): void;
    stop(): void;
    get currentSong(): Song;
    get currentIndex(): number;
    get playlist(): Song[];
    addToPlaylist(song: Song): void;
    removeFromPlaylist(songId: number): void;
    clearPlaylist(): void;
    play(song: Song): Promise<void>;
    _setMediaSessionData(song: Song): Promise<void>;
}
