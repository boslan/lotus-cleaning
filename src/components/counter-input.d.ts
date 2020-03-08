import { LitElement, TemplateResult, CSSResult } from 'lit-element';
export interface CounterDetail {
    value: number;
}
export declare class CounterInputComponent extends LitElement {
    label: string;
    focused: boolean;
    value: number;
    inputElement: HTMLInputElement;
    connectedCallback(): void;
    render(): TemplateResult;
    inputValue(): void;
    incValue(): void;
    decValue(): void;
    changeValue(): void;
    static get styles(): CSSResult;
}
//# sourceMappingURL=counter-input.d.ts.map