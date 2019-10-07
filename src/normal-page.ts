import { LitElement, html, TemplateResult, customElement, CSSResultArray } from 'lit-element';
import './order-form';
import { pageStyle } from './page-style';

@customElement('normal-page')
export class NormalPage extends LitElement {
    static get styles(): CSSResultArray {
        return [pageStyle];
    }

    public render(): TemplateResult {
        // language=HTML
        return html`<order-form></order-form>`;
    }
}
