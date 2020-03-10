import { LitElement, TemplateResult, html, customElement, CSSResultArray, property, css } from 'lit-element';
import { pageStyle } from './page-style';
import '../components/orders-calendar';
import DocumentData = firebase.firestore.DocumentData;
import { getOrdersService, OrdersService } from '../services/orders-service';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
    @property() order?: DocumentData;
    @property() private busyOrders: Date[] = [];
    private ordersService: OrdersService;
    private rate: Rate;

    constructor() {
        super();
        this.ordersService = getOrdersService();
        this.rate = this.ordersService.getRate();
    }

    setDate(date: Date): void {
        this.order = this.ordersService.getOrder(date);
    }

    render(): TemplateResult {
        // language=HTML
        return html`
            <div>
                <orders-calendar
                    @select-date="${({ detail }: CustomEvent<Date>) => this.setDate(detail)}"
                ></orders-calendar>
                ${this.order ? this.renderOrder(this.order as BaseOrder) : ''}
            </div>
        `;
    }

    renderOrder(order: BaseOrder): TemplateResult | '' {
        const type = order.type;
        if (type === 'windows') {
            return this.renderWindowOrder(order as WindowOrder);
        } else if (type === 'apartments') {
            return this.renderNormalOrder(order as NormalOrder);
        } else {
            return '';
        }
    }

    renderNormalOrder(order: NormalOrder): TemplateResult {
        const price: number = this.rate.base + order.rooms * this.rate.room + order.bathrooms * this.rate.bathroom;
        return html`
            <div class="order">
                <div class="field">Тип уборки: обычная</div>
                <div class="field">Комнат: ${order.rooms}</div>
                <div class="field">Комнат: ${order.bathrooms}</div>
                <div class="field">Цена: ${price}</div>
            </div>
        `;
    }

    renderWindowOrder(order: WindowOrder): TemplateResult {
        const price: number = this.rate.base + order.windows * this.rate.window;
        return html`
            <div class="order">
                <div class="field">Тип уборки: окна</div>
                <div class="field">Окон: ${order.windows}</div>
                <div class="field">Цена: ${price}</div>
            </div>
        `;
    }

    // language=CSS
    static get styles(): CSSResultArray {
        return [
            pageStyle,
            css`
                .order {
                    display: flex;
                    flex-flow: column;
                    justify-content: center;
                }
                .field {
                    padding: 10px;
                }
            `,
        ];
    }
}
