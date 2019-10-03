import {customElement, LitElement, html, TemplateResult} from 'lit-element';

@customElement('order-form')
export class OrderFormComponent extends LitElement {
    public render(): TemplateResult {
        // language=HTML
        return html`
        <form>
            <label>Комнат: <input type="number"></label>
            <label>Окон: <input type="number"></label>
        </form>
        `;
    }
}