class Notifications {
    public listeners: ((notice: Notice) => void)[] = [];
    public subscribe(callback: (notice: Notice) => void): () => void {
        const listenerIndex: number = this.listeners.length;
        this.listeners.push(callback);
        return (): void => {
            this.listeners.splice(listenerIndex, 1);
        };
    }

    public notify(notice: Notice): void {
        this.listeners.forEach((listener: (notice: Notice) => void) => {
            listener(notice);
        });
    }
}

let _notifications: Notifications;

export const notifications = (): Notifications => {
    if (!_notifications) {
        _notifications = new Notifications();
    }
    return _notifications;
};
