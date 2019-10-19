import { LitElement, TemplateResult, html, customElement, CSSResultArray } from 'lit-element';
import { pageStyle } from './page-style';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
    static get styles(): CSSResultArray {
        return [pageStyle];
    }

    public render(): TemplateResult {
        // language=HTML
        return html`Панель управления`;
    }
}
