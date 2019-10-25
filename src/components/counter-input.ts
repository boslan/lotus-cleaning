import { customElement, LitElement, TemplateResult, html, property, CSSResult, css, query } from 'lit-element';

export interface CounterDetail {
    value: number;
}

@customElement('counter-input')
export class CounterInputComponent extends LitElement {
    @property()
    public label!: string;

    @property({ type: Number })
    public value = 1;

    @query('#input')
    public inputElement!: HTMLInputElement;

    public render(): TemplateResult {
        // language=HTML
        return html`
            <button class="btn-right" @click="${(): void => this.decValue()}">-</button>
            <div class="input-container">
                <label>${this.label}</label>
                <input id="input" type="number" .value="${this.value}" @input="${(): void => this.inputValue()}" />
            </div>
            <!--<div class="input">${this.label} ${this.value}</div>-->
            <button class="btn-left" @click="${(): void => this.incValue()}">+</button>
        `;
    }

    public inputValue(): void {
        this.value = +this.inputElement.value;
        this.changeValue();
    }

    public incValue(): void {
        this.value += 1;
        this.changeValue();
    }

    public decValue(): void {
        if (this.value > 1) {
            this.value -= 1;
        }
        this.changeValue();
    }

    public changeValue(): void {
        this.dispatchEvent(
            new CustomEvent<CounterDetail>('change', {
                detail: {
                    value: this.value,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    public static get styles(): CSSResult {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-flow: row;
                box-shadow: 0 0 4px -3px black;
                border-radius: 10px;
                color: #4a4a4a;
            }

            button {
                border: none;
                padding: 10px;
                background-color: white;
                outline: none;
                cursor: pointer;
                position: relative;
                color: #4a4a4a;
            }

            .btn-right {
                border-radius: 10px 0 0 10px;
                box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.1);
            }

            .btn-left {
                border-radius: 0 10px 10px 0;
                box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.1);
            }

            label {
                position: absolute;
                padding: 0 10px;
            }

            .input-container {
                display: flex;
                align-items: center;
            }

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }

            input {
                background-color: white;
                border: none;
                padding: 10px;
                text-align: right;
                outline: none;
                color: #4a4a4a;
                -webkit-appearance: none;
                -moz-appearance: textfield;
            }
        `;
    }
}
