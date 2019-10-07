import { customElement, LitElement, html, TemplateResult, CSSResultArray } from 'lit-element';
import { pageStyle } from './page-style';

@customElement('order-form')
export class OrderFormComponent extends LitElement {
    static get styles(): CSSResultArray {
        return [pageStyle];
    }

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
