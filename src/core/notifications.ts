class Notifications {
    listeners: ((notice: Notice) => void)[] = [];
    subscribe(callback: (notice: Notice) => void): () => void {
        const listenerIndex: number = this.listeners.length;
        this.listeners.push(callback);
        return (): void => {
            this.listeners.splice(listenerIndex, 1);
        };
    }

    notify(notice: Notice): void {
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
