var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, LitElement, html, property, css, query } from 'lit-element';
let CounterInputComponent = class CounterInputComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.value = 1;
    }
    render() {
        // language=HTML
        return html `
            <button class="btn-right" @click="${() => this.decValue()}">-</button>
            <div class="input-container">
                <label>${this.label}</label>
                <input id="input" type="number" .value="${this.value}" @input="${() => this.inputValue()}">
            </div>
<!--            <div class="input">${this.label} ${this.value}</div>-->
            <button class="btn-left" @click="${() => this.incValue()}">+</button>
        `;
    }
    inputValue() {
        this.value = +this.inputElement.value;
        this.changeValue();
    }
    incValue() {
        this.value += 1;
        this.changeValue();
    }
    decValue() {
        if (this.value > 1) {
            this.value -= 1;
        }
        this.changeValue();
    }
    changeValue() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.value
            },
            bubbles: true,
            composed: true
        }));
    }
    static get styles() {
        // language=CSS
        return css `
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
                box-shadow: 1px 0 0 0 rgba(0, 0, 0, .1);
            }

            .btn-left {
                border-radius: 0 10px 10px 0;
                box-shadow: -1px 0 0 0 rgba(0, 0, 0, .1);
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
};
__decorate([
    property()
], CounterInputComponent.prototype, "label", void 0);
__decorate([
    property({ type: Number })
], CounterInputComponent.prototype, "value", void 0);
__decorate([
    query('#input')
], CounterInputComponent.prototype, "inputElement", void 0);
CounterInputComponent = __decorate([
    customElement('counter-input')
], CounterInputComponent);
export { CounterInputComponent };
