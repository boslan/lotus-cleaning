import { LitElement, html, TemplateResult, customElement, CSSResultArray } from 'lit-element';
import { pageStyle } from './page-style';

@customElement('help-page')
export class WindowsPage extends LitElement {
    static get styles(): CSSResultArray {
        return [pageStyle];
    }

    render(): TemplateResult {
        // language=HTML
        return html`
            Помощь
        `;
    }
}
