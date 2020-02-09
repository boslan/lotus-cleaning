import { customElement, LitElement, html, TemplateResult, CSSResultArray, css, property } from 'lit-element';

import './date-selector';
import './counter-input';
import './day-selector-old';
import { CounterDetail } from './counter-input';
import { notifications } from '../utils/notifications';
import { firebase } from '../utils/firebase';
import { Observable } from '../core/observable';
import DocumentData = firebase.firestore.DocumentData;
import { getStore } from '../services/data-service';
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

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

    constructor() {
        super();
        this.calcPrice();
        this.storeOrders = getStore<DocumentData>('orders');
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
                <cl-calendar
                    @date-change="${({ detail }: CustomEvent<Date>): void => this.setDate(detail)}"
                ></cl-calendar>
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

                counter-input {
                    margin: 10px;
                }

                button {
                    border-radius: 10px;
                    background-color: #ff950c;
                    color: white;
                    border: 0;
                    text-transform: uppercase;
                    padding: 16px 25px;
                    font-size: 20px;
                    cursor: pointer;
                    outline: none;
                }
                button:hover {
                    box-shadow: 0 0 10px 0 #ff950c;
                }

                .price {
                    padding: 10px;
                }
            `,
        ];
    }
}
