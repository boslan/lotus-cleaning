export class Observable<T> {
    private data: T[] = [];
    private listeners: ((items: T[]) => void)[] = [];

    subscribe(callback: (items: T[]) => void): number {
        this.listeners.push(callback);
        return this.listeners.length;
    }

    unsubscribe(id: number): void {
        this.listeners.splice(id, 1);
    }

    emit(data: T[]): void {
        this.data = data;
        for (const callback of this.listeners) {
            callback(this.data);
        }
    }

    add(item: T): void {
        const items: T[] = [...this.data, item];
        this.emit(items);
    }
}
