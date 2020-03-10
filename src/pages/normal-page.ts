import { css, CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';

import '../components/counter-input';
import '../components/orders-calendar';
import { CounterDetail } from '../components/counter-input';
import { notifications } from '../core/notifications';
import { firebase } from '../core/firebase';
import { User } from 'firebase';
import { getOrdersService, OrdersService } from '../services/orders-service';
import { sharedStyle } from './shared-style';
import { pageStyle } from './page-style';

@customElement('normal-page')
export class NormalPage extends LitElement {
    @property() price = 0;
    rooms = 1;
    bathrooms = 1;
    date!: Date;
    @property() protected user: User | null = null;
    private ordersService!: OrdersService;
    private rate: Rate;

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user: User | null): User | null => (this.user = user));
        this.ordersService = getOrdersService();
        this.rate = this.ordersService.getRate();
        this.calcPrice();
    }

    calcPrice(): void {
        const roomsCost = this.rate.room * this.rooms;
        const bathroomsCost = this.rate.bathroom * this.bathrooms;
        this.price = this.rate.base + roomsCost + bathroomsCost;
    }

    setRooms({ value }: CounterDetail): void {
        this.rooms = value || 0;
        this.calcPrice();
    }

    setBathRooms({ value }: CounterDetail): void {
        this.bathrooms = value || 0;
        this.calcPrice();
    }

    setDate(date: Date): void {
        this.date = date;
    }

    validate(): boolean {
        if (!this.user) {
            notifications().notify({ text: 'Войдти в свой аккаунт', type: 'error' });
            return false;
        }
        if (!this.date) {
            notifications().notify({ text: 'Дата не выбрана', type: 'error' });
            return false;
        }
        return true;
    }

    requestOrder(): void {
        if (!this.validate()) {
            return;
        }
        const order = {
            type: 'apartments',
            rooms: this.rooms,
            bathrooms: this.bathrooms,
            date: this.date,
        };
        this.ordersService.requestOrder(order);
    }

    render(): TemplateResult {
        // language=HTML
        return html`
            <form>
                <orders-calendar
                    @select-date="${({ detail }: CustomEvent<Date>) => this.setDate(detail)}"
                ></orders-calendar>

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
            pageStyle,
            sharedStyle,
            css`
                form {
                    display: flex;
                    flex-flow: column;
                    align-items: center;
                }

                counter-input {
                    margin: 10px;
                }

                .price {
                    padding: 10px;
                    color: var(--color-on-primary);
                }
            `,
        ];
    }
}
