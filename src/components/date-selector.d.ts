import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { StyleInfo } from 'lit-html/directives/style-map';
export declare class DateSelector extends LitElement {
    markedItems: {
        [key: string]: Date[];
    };
    markers: {
        [key: string]: StyleInfo;
    };
    set selected(value: Date | null);
    get selected(): Date | null;
    set year(value: number);
    get year(): number;
    set month(value: number);
    get month(): number;
    private weeks;
    private datePointer;
    private header;
    private firstDay;
    private lastDate;
    private readonly weekDays;
    private _selected;
    private _year;
    private _month;
    private readonly _currentDate;
    constructor();
    updateCalendar(): void;
    resetDatePointer(): void;
    protected getWeekDays(locale?: string): string[];
    protected fireDateChange(date: number): void;
    protected updateSelected(date: Date): void;
    protected render(): TemplateResult;
    protected renderDayNames(): TemplateResult;
    protected renderDayName(name: string): TemplateResult;
    protected renderMonth(): TemplateResult[];
    protected renderWeek(): TemplateResult;
    protected renderDate(date: number): TemplateResult;
    getStyleDate(date: Date): StyleInfo;
    get isSelectedDate(): boolean;
    get isCurrentDate(): boolean;
    get isCurrentMonth(): boolean;
    protected getDateInMonth(date: number): number;
    static get styles(): CSSResult;
}
//# sourceMappingURL=date-selector.d.ts.map