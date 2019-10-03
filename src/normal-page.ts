import {LitElement, html, TemplateResult, customElement} from 'lit-element';
import './order-form';

@customElement('normal-page')
export class NormalPage extends LitElement {
    public render(): TemplateResult {
        // language=HTML
        return html`
            <style>
                :host {
                    display: flex;
                    flex: 1;
                }
            </style>
            <order-form></order-form>
        `;
    }
}