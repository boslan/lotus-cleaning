var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, LitElement, html, css, property } from 'lit-element';
import './counter-input';
import './day-selector';
import { notifications } from '../utils/notifications';
import { firebase } from '../utils/firebase';
let OrderFormComponent = class OrderFormComponent extends LitElement {
    constructor() {
        super();
        this.db = firebase.firestore();
        this.price = 0;
        this.rooms = 1;
        this.bathrooms = 1;
        this.rate = {
            rooms: 10,
            bathrooms: 10
        };
        this.calcPrice();
    }
    calcPrice() {
        const roomsCost = this.rate.rooms * this.rooms;
        const bathroomsCost = this.rate.bathrooms * this.bathrooms;
        this.price = 30 + roomsCost + bathroomsCost;
    }
    setRooms({ value }) {
        this.rooms = value || 0;
        this.calcPrice();
    }
    setBathRooms({ value }) {
        this.bathrooms = value || 0;
        this.calcPrice();
    }
    setDate({ value }) {
        this.date = value;
    }
    validate() {
        if (!this.date) {
            notifications().notify('Дата не выбрана');
            return false;
        }
        return true;
    }
    requestOrder() {
        if (!this.validate()) {
            return;
        }
        const order = {
            rooms: this.rooms,
            bathrooms: this.bathrooms,
            date: this.date
        };
        this.db.collection('orders').add(order)
            .then(() => {
            notifications().notify('Заказ добавлен');
        })
            .catch(() => {
            notifications().notify('Ошибка при добавлении заказа. Проверьте интернет соединение.');
        });
    }
    render() {
        // language=HTML
        return html `
        <form>
            <day-selector @date-change="${(e) => this.setDate(e.detail)}"></day-selector>
            <counter-input label="Комнат" @change="${(e) => this.setRooms(e.detail)}"></counter-input>
            <counter-input label="Санузлов" @change="${(e) => this.setBathRooms(e.detail)}"></counter-input>
            <div class="price">Стоимость: ${this.price} BYN</div>
            <button type="button" @click="${() => this.requestOrder()}">Заказать</button>
        </form>
        `;
    }
    // language=CSS
    static get styles() {
        return [css `
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
        `];
    }
};
__decorate([
    property()
], OrderFormComponent.prototype, "price", void 0);
OrderFormComponent = __decorate([
    customElement('order-form')
], OrderFormComponent);
export { OrderFormComponent };
