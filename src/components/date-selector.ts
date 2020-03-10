import { LitElement, TemplateResult, html, CSSResult, css, property, customElement } from 'lit-element';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { repeat } from 'lit-html/directives/repeat';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';

@customElement('date-selector')
export class DateSelector extends LitElement {
    @property() markedItems: { [key: string]: Date[] } = {};
    @property() markers: { [key: string]: StyleInfo } = {};
    @property() set selected(value: Date | null) {
        this._selected = value;
        const date: Date = value ?? this._currentDate;
        if (!this.year) {
            this.year = date.getFullYear();
        }
        if (!this.month) {
            this.month = date.getMonth();
        }
        this.resetDatePointer();
    }
    get selected(): Date | null {
        return this._selected;
    }
    @property() set year(value: number) {
        this._year = value;
        this.updateCalendar();
    }
    get year(): number {
        return this._year;
    }
    @property() set month(value: number) {
        this._month = value;
        this.updateCalendar();
    }
    get month(): number {
        return this._month;
    }
    @property() private weeks = 0;
    @property() private datePointer = 0;
    @property() private header = '';

    private firstDay = 0;
    private lastDate = 0;
    private readonly weekDays: string[] = [];

    private _selected: Date | null = null;
    private _year = 0;
    private _month = 0;
    private readonly _currentDate: Date = new Date();

    constructor() {
        super();
        this.selected = null;
        this.weekDays = this.getWeekDays();
    }

    updateCalendar(): void {
        this.firstDay = new Date(this.year, this.month, 0).getDay();
        this.resetDatePointer();
        this.lastDate = new Date(this.year, this.month + 1, 0).getDate();
        this.weeks = Math.ceil((this.lastDate + this.firstDay - 7) / 7);
        this.header = new Date(this.year, this.month).toLocaleDateString(undefined, {
            month: 'short',
            year: 'numeric',
        });
    }

    resetDatePointer(): void {
        this.datePointer = 1 - this.firstDay;
    }

    protected getWeekDays(locale?: string): string[] {
        const weekDays: string[] = [];
        const date: Date = new Date(0, 0, 1);
        for (let i = 0; i < 7; i++) {
            weekDays.push(date.toLocaleDateString(locale, { weekday: 'short' }));
            date.setDate(date.getDate() + 1);
        }
        return weekDays;
    }

    protected fireDateChange(date: number): void {
        this.updateSelected(new Date(this.year, this.month, date));
        this.dispatchEvent(
            new CustomEvent<Date | null>('date-change', {
                detail: this.selected,
                bubbles: true,
                composed: true,
            }),
        );
    }

    protected updateSelected(date: Date): void {
        this.selected = date;
    }

    protected render(): TemplateResult {
        // language=HTML
        return html`
            <div class="month">${this.header}</div>
            ${this.renderDayNames()} ${this.renderMonth()}
        `;
    }

    protected renderDayNames(): TemplateResult {
        return html`
            <div class="day-names">
                ${repeat(this.weekDays, (dayName: string) => this.renderDayName(dayName))}
            </div>
        `;
    }

    protected renderDayName(name: string): TemplateResult {
        return html`
            <div class="day-name">${name}</div>
        `;
    }

    protected renderMonth(): TemplateResult[] {
        this.resetDatePointer();
        const weeks: TemplateResult[] = [];
        for (let i = 0; i <= this.weeks; i++) {
            weeks.push(this.renderWeek());
        }
        return weeks;
    }

    protected renderWeek(): TemplateResult {
        const days: TemplateResult[] = [];
        for (let day = 0; day < 7; day++) {
            days.push(this.renderDate(this.datePointer));
            this.datePointer++;
        }
        return html`
            <div class="week">${days}</div>
        `;
    }

    // language=HTML
    protected renderDate(date: number): TemplateResult {
        const dayInMonth: number = this.isCurrentMonth ? date : this.getDateInMonth(date);
        const d: Date = new Date(this.year, this.month, this.datePointer);
        const styleDate: StyleInfo = this.getStyleDate(d);
        const hasStyle: boolean = Object.entries(styleDate).length !== 0;
        const classes: ClassInfo = {
            'out-month': !this.isCurrentMonth,
            selected: this.isSelectedDate,
            current: this.isCurrentDate,
            busy: hasStyle,
        };
        return html`
            <div
                class="day ${classMap(classes)}"
                style="${styleMap(styleDate)}"
                @click="${() => (() => this.fireDateChange(date))()}"
            >
                ${dayInMonth}
            </div>
        `;
    }

    getStyleDate(date: Date): StyleInfo {
        const markerNames = Object.keys(this.markedItems);
        for (const markerName of markerNames) {
            const hasMarker = this.markedItems[markerName].find(markerDate => markerDate.getTime() === date.getTime());
            if (hasMarker) {
                return this.markers[markerName];
            }
        }
        return {};
    }

    get isSelectedDate(): boolean {
        const date: Date = new Date(this.year, this.month, this.datePointer);
        return date.getTime() === this.selected?.getTime();
    }

    get isCurrentDate(): boolean {
        const currentYear: number = this._currentDate.getFullYear();
        const currentMonth: number = this._currentDate.getMonth();
        const currentDate: number = this._currentDate.getDate();
        return this.year === currentYear && this.month === currentMonth && this.datePointer === currentDate;
    }

    get isCurrentMonth(): boolean {
        return this.datePointer >= 1 && this.datePointer <= this.lastDate;
    }

    protected getDateInMonth(date: number): number {
        return new Date(this.year, this.month, date).getDate();
    }

    static get styles(): CSSResult {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-flow: column;
                font-family: var(--font-main), sans-serif;
                font-size: 14px;
                font-weight: normal;
                color: var(--color-on-primary);
                background-color: var(--color-primary);
            }

            .week {
                display: flex;
                margin: 2px;
            }

            .day-names {
                display: flex;
                color: var(--color-on-primary);
            }

            .day-name {
                align-items: flex-end;
            }

            .day-name,
            .day {
                display: flex;
                justify-content: center;
                padding: 5px;
                width: 2em;
                height: 2em;
                cursor: pointer;
                border-radius: var(--border-radius);
            }

            .day {
                align-items: center;
                user-select: none;
                transition: box-shadow 0.3s, background-color 0.3s;
                box-shadow: 0 0 4px -2px var(--color-primary);
            }

            .day:hover {
                box-shadow: 0 0 4px -2px var(--color-on-primary);
            }

            .day.out-month {
                color: var(--color-on-secondary);
                pointer-events: none;
            }

            .day.current {
                font-weight: 700;
                color: var(--color-on-primary);
            }

            .day.selected {
                background-color: var(--color-secondary);
            }
            .day.busy {
            }

            .month {
                display: flex;
                justify-content: center;
                padding: 10px;
                font-size: 16px;
                color: var(--color-on-primary);
            }
        `;
    }
}
