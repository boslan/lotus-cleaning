import { css, CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';

import './date-selector';
import './counter-input';
import { firebase } from '../core/firebase';
import { Observable } from '../core/observable';
import { getStore } from '../services/data-service';
import DocumentData = firebase.firestore.DocumentData;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import { User } from 'firebase';

@customElement('orders-calendar')
export class OrdersCalendar extends LitElement {
    db = firebase.firestore();
    @property() protected user: User | null = null;
    @property() protected storeOrders!: Observable<DocumentData>;
    @property() private busyOrders: Date[] = [];

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user: User | null): User | null => (this.user = user));
        this.storeOrders = getStore<DocumentData>('orders');
        this.storeOrders.subscribe((items: DocumentData[]) => {
            this.busyOrders = items.map(item => {
                const date = new Date(item.date.toDate());
                date.setHours(0, 0, 0, 0);
                return date;
            });
        });
        this.db.collection('orders').onSnapshot((snapshot: QuerySnapshot) => {
            const orders: DocumentData[] = [];
            const docs = snapshot.docs;
            docs.forEach((doc: QueryDocumentSnapshot) => {
                const data = doc.data();
                orders.push(data);
            });
            this.storeOrders.emit(orders);
        });
    }

    fireChangeDate(e: CustomEvent<Date>): void {
        e.stopPropagation();
        const { detail } = e;
        this.dispatchEvent(
            new CustomEvent('select-date', {
                detail,
                composed: true,
                bubbles: true,
            }),
        );
    }

    render(): TemplateResult {
        // language=HTML
        return html`
            <date-selector
                .markers="${{ busy: { color: 'red' } }}"
                .markedItems="${{ busy: this.busyOrders }}"
                @date-change="${(e: CustomEvent<Date>): void => this.fireChangeDate(e)}"
            ></date-selector>
        `;
    }

    // language=CSS
    static get styles(): CSSResultArray {
        return [css``];
    }
}
