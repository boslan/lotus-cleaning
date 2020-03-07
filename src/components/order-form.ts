import { customElement, LitElement, html, TemplateResult, CSSResultArray, css, property } from 'lit-element';

import './date-selector';
import './counter-input';
import { CounterDetail } from './counter-input';
import { notifications } from '../core/notifications';
import { firebase } from '../core/firebase';
import { Observable } from '../core/observable';
import DocumentData = firebase.firestore.DocumentData;
import { getStore } from '../services/data-service';
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import QuerySnapshot = firebase.firestore.QuerySnapshot;

@customElement('order-form')
export class OrderFormComponent extends LitElement {
    public db = firebase.firestore();
    @property() public price = 0;
    public rooms = 1;
    public bathrooms = 1;
    public date!: Date;
    @property() protected storeOrders!: Observable<DocumentData>;

    public rate = {
        rooms: 10,
        bathrooms: 10,
    };
    @property() private busyOrders: Date[] = [];

    constructor() {
        super();
        this.calcPrice();
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

    public calcPrice(): void {
        const roomsCost = this.rate.rooms * this.rooms;
        const bathroomsCost = this.rate.bathrooms * this.bathrooms;
        this.price = 30 + roomsCost + bathroomsCost;
    }

    public setRooms({ value }: CounterDetail): void {
        this.rooms = value || 0;
        this.calcPrice();
    }

    public setBathRooms({ value }: CounterDetail): void {
        this.bathrooms = value || 0;
        this.calcPrice();
    }

    public setDate(date: Date): void {
        this.date = date;
    }

    public validate(): boolean {
        if (!this.date) {
            notifications().notify('Дата не выбрана');
            return false;
        }
        return true;
    }

    public requestOrder(): void {
        if (!this.validate()) {
            return;
        }
        const order = {
            rooms: this.rooms,
            bathrooms: this.bathrooms,
            date: this.date,
        };
        this.db
            .collection('orders')
            .add(order)
            .then((docRef: DocumentReference) => {
                notifications().notify('Заказ добавлен');
                return docRef.get();
            })
            .then((docSnapshot: DocumentSnapshot) => {
                const order: DocumentData | undefined = docSnapshot.data();
                if (order) {
                    this.storeOrders.add(order);
                }
            })
            .catch(() => {
                notifications().notify('Ошибка при добавлении заказа. Проверьте интернет соединение.');
            });
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
            <form>
                <date-selector
                    .markers="${{ busy: { color: 'red' } }}"
                    .markedItems="${{ busy: this.busyOrders }}"
                    @date-change="${({ detail }: CustomEvent<Date>): void => this.setDate(detail)}"
                ></date-selector>

                <counter-input
                    label="Комнат"
                    @change="${(e: CustomEvent<CounterDetail>): void => this.setRooms(e.detail)}"
                ></counter-input>
                <counter-input
                    label="Санузлов"
                    @change="${(e: CustomEvent<CounterDetail>): void => this.setBathRooms(e.detail)}"
                ></counter-input>

                <div class="price">Стоимость: ${this.price} BYN</div>
                <button type="button" @click="${(): void => this.requestOrder()}">Заказать</button>
            </form>
        `;
    }

    // language=CSS
    static get styles(): CSSResultArray {
        return [
            css`
                form {
                    display: flex;
                    flex-flow: column;
                    align-items: center;
                }

                .rooms {
                    display: flex;
                    flex-flow: column;
                    align-items: center;
                }

                counter-input {
                    margin: 10px;
                }

                button {
                    border-radius: var(--border-radius);
                    background-color: var(--color-orange);
                    color: white;
                    border: 0;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    padding: 16px 25px;
                    font-size: 20px;
                    cursor: pointer;
                    outline: none;
                    transition: box-shadow 0.3s;
                }

                button:hover {
                    box-shadow: 0 0 10px 0 var(--color-orange);
                }

                .price {
                    padding: 10px;
                    color: var(--color-on-primary);
                }
            `,
        ];
    }
}
