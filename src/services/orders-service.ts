import * as firebase from 'firebase';
import { notifications } from '../core/notifications';
import { getStore } from './data-service';
import { Observable } from '../core/observable';
import DocumentData = firebase.firestore.DocumentData;
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export class OrdersService {
    private rate: Rate = {
        base: 30,
        window: 10,
        room: 10,
        bathroom: 10,
    };
    protected storeOrders!: Observable<DocumentData>;
    db = firebase.firestore();

    constructor() {
        this.storeOrders = getStore<DocumentData>('orders');
    }

    requestOrder<T>(order: T) {
        this.db
            .collection('orders')
            .add(order)
            .then((docRef: DocumentReference) => {
                notifications().notify({ text: 'Заказ добавлен', type: 'success' });
                return docRef.get();
            })
            .then((docSnapshot: DocumentSnapshot) => {
                const order: DocumentData | undefined = docSnapshot.data();
                if (order) {
                    this.storeOrders.add(order);
                }
            })
            .catch(() => {
                notifications().notify({
                    text: 'Ошибка при добавлении заказа.',
                    type: 'error',
                });
            });
    }

    getOrder(date: Date): DocumentData | undefined {
        return this.storeOrders.getItems().find(item => {
            const itemDate = new Date(item.date.toDate());
            itemDate.setHours(0, 0, 0, 0);
            date.setHours(0, 0, 0, 0);
            return itemDate.getTime() === date.getTime();
        });
    }

    getRate(): Rate {
        return this.rate;
    }
}

let service: OrdersService | null = null;

export const getOrdersService = (): OrdersService => {
    if (!service) {
        service = new OrdersService();
    }
    return service;
};
