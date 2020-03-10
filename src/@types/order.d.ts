type OrderType = 'apartments' | 'windows';

interface BaseOrder {
    type: OrderType;
    date: Date;
}

interface NormalOrder extends BaseOrder {
    rooms: number;
    bathrooms: number;
}

interface WindowOrder extends BaseOrder {
    windows: number;
}

interface Rate {
    base: number;
    window: number;
    room: number;
    bathroom: number;
}
