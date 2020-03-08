export declare class Observable<T> {
    private data;
    private listeners;
    subscribeWithEmit(callback: (items: T[]) => void): number;
    subscribe(callback: (items: T[]) => void): number;
    unsubscribe(id: number): void;
    emit(data?: T[]): void;
    add(item: T): void;
}
//# sourceMappingURL=observable.d.ts.map