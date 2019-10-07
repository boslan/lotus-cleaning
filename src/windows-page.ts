import { LitElement, html, TemplateResult, customElement, CSSResultArray, CSSResult, css } from 'lit-element';
import './order-form';
import { pageStyle } from './page-style';

@customElement('windows-page')
export class WindowsPage extends LitElement {
    static get styles(): CSSResultArray {
        return [pageStyle];
    }

    public render(): TemplateResult {
        // language=HTML
        return html`Окна`;
    }
}
