class Notifications {
    public listeners = [];
    public subscribe(callback: (message: string) => void): () => void {
        const listenerIndex: number = this.listeners.length;
        this.listeners.push(callback);
        return (): void => { this.listeners.splice(listenerIndex, 1) };
    }

    public notify(message: string): void {
        this.listeners.forEach((listener: (message: string) => void) => {
            listener(message);
        })
    }
}

let _notifications: Notifications;

export const notifications = (): Notifications => {
    if (!_notifications) {
        _notifications = new Notifications();
    }
    return _notifications;
};