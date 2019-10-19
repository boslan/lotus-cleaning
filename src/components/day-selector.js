var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, LitElement, html, property, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { firebase } from '../utils/firebase';
let DaySelector = class DaySelector extends LitElement {
    constructor() {
        super();
        this.db = firebase.firestore();
        this.orders = [];
        this.days = [];
        this.week = 0;
        this.today = new Date();
        this.showDays();
        this.db.collection('orders').get().then((querySnapshot) => {
            this.orders = [];
            querySnapshot.forEach((doc) => this.orders.push(doc.data()));
        });
    }
    showDays(week = 0) {
        const offset = week * 7;
        this.days = [];
        const date = this.today.getDate();
        for (let i = 0; i < 7; i++) {
            const day = new Date(this.today);
            day.setDate(date + i + offset);
            this.days.push(day);
        }
    }
    onSelectDay(day) {
        this.selectedDay = day;
        this.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                value: day
            },
            bubbles: true,
            composed: true
        }));
    }
    getBusyDayClass(day, orders) {
        if (!day) {
            return '';
        }
        const currentDate = day.setHours(0, 0, 0, 0);
        const isBusy = !!orders.find((order) => {
            const date = new Date(order.date.toDate()).setHours(0, 0, 0, 0);
            return currentDate === date;
        });
        return isBusy ? 'busy' : '';
    }
    getSelectedDayClass(day) {
        if (!day || !this.selectedDay) {
            return '';
        }
        return day.getTime() === this.selectedDay.getTime() ? 'selected' : '';
    }
    prevWeek() {
        if (this.week > 0) {
            this.week--;
            this.showDays(this.week);
        }
    }
    nextWeek() {
        this.week++;
        this.showDays(this.week);
    }
    render() {
        // language=HTML
        return html `
            <div class="week">
            <button class="button-week" type="button" @click="${() => this.prevWeek()}"><</button>
            ${repeat(this.days, (day) => html `
                <div class="day ${this.getSelectedDayClass(day)} ${this.getBusyDayClass(day, this.orders)}"
                     @click="${() => this.onSelectDay(day)}">${day.getDate()}</div>
            `)}
            <button class="button-week" type="button" @click="${() => this.nextWeek()}">></button>
            </div>
        `;
    }
    static get styles() {
        // language=CSS
        return css `
            .week {
                display: flex;
            }
            .button-week,
            .day {
                border: 0;
                background-color: white;
                padding: 8px;
                color: #4a4a4a;
                box-shadow: 0 0 4px -3px black;
                margin: 4px;
                line-height: 1;
                border-radius: 5px;
                cursor: pointer;
                transition: .3s transform ease-out;
            }
            .button-week:hover,
            .day:hover {
                box-shadow: 0 0 6px -3px black;
                transform: scale(1.1);
            }
            .day.busy {
                color: red;
                pointer-events: none;
                transition: none;
            }
            .day.selected {
                color: orange;
            }
            .day.accepted {
                color: green;
            }
        `;
    }
};
__decorate([
    property()
], DaySelector.prototype, "orders", void 0);
__decorate([
    property({ type: Array })
], DaySelector.prototype, "days", void 0);
__decorate([
    property()
], DaySelector.prototype, "week", void 0);
__decorate([
    property({ type: Object })
], DaySelector.prototype, "selectedDay", void 0);
DaySelector = __decorate([
    customElement('day-selector')
], DaySelector);
export { DaySelector };
