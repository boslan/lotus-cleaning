import { customElement, LitElement, TemplateResult, html, property, CSSResult, css, query } from 'lit-element';

export interface CounterDetail {
    value: number;
}

@customElement('counter-input')
export class CounterInputComponent extends LitElement {
    @property()
    label!: string;

    @property({ type: Boolean, reflect: true })
    focused = false;

    @property({ type: Number })
    value = 1;

    @query('#input')
    inputElement!: HTMLInputElement;

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('focus', () => (this.focused = true));
        this.addEventListener('blur', () => (this.focused = false));
    }

    render(): TemplateResult {
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

    inputValue(): void {
        this.value = +this.inputElement.value;
        this.changeValue();
    }

    incValue(): void {
        this.value += 1;
        this.changeValue();
    }

    decValue(): void {
        if (this.value > 1) {
            this.value -= 1;
        }
        this.changeValue();
    }

    changeValue(): void {
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

    static get styles(): CSSResult {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-flow: row;
                box-shadow: 0 0 5px -2px var(--color-on-primary);
                border-radius: var(--border-radius);
                color: var(--color-on-primary);
                user-select: none;
                transition: box-shadow 0.3s;
            }

            :host([focused]) {
                box-shadow: 0 0 5px -1px var(--color-on-primary);
            }

            button {
                border: 0;
                padding: 0;
                width: 30px;
                background-color: var(--color-primary);
                outline: none;
                cursor: pointer;
                position: relative;
                color: var(--color-on-primary);
                box-sizing: border-box;
                transition: box-shadow 0.3s;
                box-shadow: 0 0 4px -2px var(--color-primary);
            }

            button:hover {
                box-shadow: 0 0 4px -2px var(--color-on-primary);
            }

            button::-moz-focus-inner {
                border: 0;
            }

            .btn-right {
                border-radius: var(--border-radius) 0 0 var(--border-radius);
            }

            .btn-left {
                border-radius: 0 var(--border-radius) var(--border-radius) 0;
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
                background: var(--color-primary);
                color: var(--color-on-primary);
                -webkit-appearance: none;
                -moz-appearance: textfield;
            }
        `;
    }
}
