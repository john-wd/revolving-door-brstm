export interface Capabilities {
    sampleRate: boolean;
    streaming: boolean;
    mediaSession: boolean;
}
export declare function browserCapabilities(): Promise<Capabilities>;
