import {LitElement, TemplateResult, html, customElement} from 'lit-element';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
    public render(): TemplateResult {
        return html`
            <style>
                :host {
                    display: flex;
                    flex: 1;
                }
            </style>
            Dashboard`;
    }
}