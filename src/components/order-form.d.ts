import { LitElement, TemplateResult, CSSResultArray } from 'lit-element';
import './date-selector';
import './counter-input';
import { CounterDetail } from './counter-input';
import { firebase } from '../core/firebase';
import { Observable } from '../core/observable';
import DocumentData = firebase.firestore.DocumentData;
export declare class OrderFormComponent extends LitElement {
    db: firebase.firestore.Firestore;
    price: number;
    rooms: number;
    bathrooms: number;
    date: Date;
    protected storeOrders: Observable<DocumentData>;
    rate: {
        rooms: number;
        bathrooms: number;
    };
    private busyOrders;
    constructor();
    calcPrice(): void;
    setRooms({ value }: CounterDetail): void;
    setBathRooms({ value }: CounterDetail): void;
    setDate(date: Date): void;
    validate(): boolean;
    requestOrder(): void;
    render(): TemplateResult;
    static get styles(): CSSResultArray;
}
//# sourceMappingURL=order-form.d.ts.map