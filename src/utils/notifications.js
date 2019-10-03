class Notifications {
    constructor() {
        this.listeners = [];
    }
    subscribe(callback) {
        const listenerIndex = this.listeners.length;
        this.listeners.push(callback);
        return () => { this.listeners.splice(listenerIndex, 1); };
    }
    notify(message) {
        this.listeners.forEach((listener) => {
            listener(message);
        });
    }
}
let _notifications;
export const notifications = () => {
    if (!_notifications) {
        _notifications = new Notifications();
    }
    return _notifications;
};
