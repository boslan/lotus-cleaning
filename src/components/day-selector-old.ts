import { customElement, LitElement, html, TemplateResult, property, CSSResult, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { firebase } from '../utils/firebase';

import DocumentData = firebase.firestore.DocumentData;
import { getStore } from '../services/data-service';
import { Observable } from '../core/observable';
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

@customElement('day-selector-old')
export class DaySelectorOld extends LitElement {
    public db = firebase.firestore();
    @property() public orders: DocumentData[] = [];
    @property({ type: Array }) public days: Date[] = [];

    @property() public week = 0;

    public today: Date = new Date();

    @property({ type: Object }) public selectedDay?: Date;

    @property() protected storeOrders!: Observable<DocumentData>;

    constructor() {
        super();
        this.showDays();
        this.storeOrders = getStore<DocumentData>('orders');
        this.storeOrders.subscribe((items: DocumentData[]) => {
            this.orders = items;
        });
        this.db.collection('orders').onSnapshot((snapshot: QuerySnapshot) => {
            this.orders = [];
            const docs = snapshot.docs;
            docs.forEach((doc: QueryDocumentSnapshot) => {
                const data = doc.data();
                this.orders.push(data);
            });
            this.storeOrders.emit(this.orders);
        });
    }

    public showDays(week = 0): void {
        const offset = week * 7;
        this.days = [];
        const date = this.today.getDate();
        for (let i = 0; i < 7; i++) {
            const day = new Date(this.today);
            day.setDate(date + i + offset);
            this.days.push(day);
        }
    }

    public onSelectDay(date: Date): void {
        this.selectedDay = date;
        this.dispatchEvent(
            new CustomEvent<Date>('date-change', {
                detail: date,
                bubbles: true,
                composed: true,
            }),
        );
    }

    public getBusyDayClass(day: Date, orders: DocumentData[]): string {
        if (!day) {
            return '';
        }
        const currentDate = day.setHours(0, 0, 0, 0);
        const isBusy = !!orders.find((order: DocumentData) => {
            const date = new Date(order.date.toDate()).setHours(0, 0, 0, 0);
            return currentDate === date;
        });
        return isBusy ? 'busy' : '';
    }

    public getSelectedDayClass(day: Date): string {
        if (!day || !this.selectedDay) {
            return '';
        }
        return day.getTime() === this.selectedDay.getTime() ? 'selected' : '';
    }

    public prevWeek(): void {
        if (this.week > 0) {
            this.week--;
            this.showDays(this.week);
        }
    }

    public nextWeek(): void {
        this.week++;
        this.showDays(this.week);
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
            <div class="week">
                <button class="button-week" type="button" @click="${() => this.prevWeek()}"><</button>
                ${repeat(
                    this.days,
                    (day: Date) => html`
                        <div
                            class="day ${this.getSelectedDayClass(day)} ${this.getBusyDayClass(day, this.orders)}"
                            @click="${(): void => this.onSelectDay(day)}"
                        >
                            ${day.getDate()}
                        </div>
                    `,
                )}
                <button class="button-week" type="button" @click="${() => this.nextWeek()}">></button>
            </div>
        `;
    }

    public static get styles(): CSSResult {
        // language=CSS
        return css`
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
                transition: 0.3s transform ease-out;
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
}
