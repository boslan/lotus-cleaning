declare class Notifications {
    listeners: ((message: string) => void)[];
    subscribe(callback: (message: string) => void): () => void;
    notify(message: string): void;
}
export declare const notifications: () => Notifications;
export {};
//# sourceMappingURL=notifications.d.ts.map