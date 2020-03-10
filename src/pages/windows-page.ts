import { LitElement, html, TemplateResult, customElement, CSSResultArray, property, css } from 'lit-element';
import { pageStyle } from './page-style';
import '../components/orders-calendar';
import '../components/counter-input';
import { CounterDetail } from '../components/counter-input';
import { notifications } from '../core/notifications';
import { firebase } from '../core/firebase';
import { User } from 'firebase';
import { getOrdersService, OrdersService } from '../services/orders-service';
import { sharedStyle } from './shared-style';

@customElement('windows-page')
export class WindowsPage extends LitElement {
    date!: Date;
    @property() price = 0;
    windowsSize = 1;

    private ordersService: OrdersService;
    private rate: Rate;
    private user: firebase.User | null = null;

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user: User | null): User | null => (this.user = user));
        this.ordersService = getOrdersService();
        this.rate = this.ordersService.getRate();
        this.calcPrice();
    }

    calcPrice(): void {
        const windowsCost = this.rate.window * this.windowsSize;
        this.price = 20 + windowsCost;
    }

    setDate(date: Date): void {
        this.date = date;
    }

    setWindowsSize({ value }: CounterDetail): void {
        this.windowsSize = value;
        this.calcPrice();
    }

    render(): TemplateResult {
        // language=HTML
        return html`
            <form>
                <orders-calendar
                    @select-date="${({ detail }: CustomEvent<Date>) => this.setDate(detail)}"
                ></orders-calendar>
                <counter-input
                    label="Окон"
                    @change="${({ detail }: CustomEvent<CounterDetail>): void => this.setWindowsSize(detail)}"
                ></counter-input>

                <div class="price">Стоимость: ${this.price} BYN</div>
                <button type="button" @click="${(): void => this.requestOrder()}">Заказать</button>
            </form>
        `;
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

    private requestOrder(): void {
        if (!this.validate()) {
            return;
        }
        const order = {
            type: 'windows',
            windows: this.windowsSize,
            date: this.date,
        };
        this.ordersService.requestOrder(order);
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
