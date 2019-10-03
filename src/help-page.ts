import {LitElement, html, TemplateResult, customElement} from 'lit-element';
import './order-form';

@customElement('help-page')
export class WindowsPage extends LitElement {
    public render(): TemplateResult {
        // language=HTML
        return html`
            <style>
                :host {
                    display: flex;
                    flex: 1;
                }
            </style>
            Помощь
        `;
    }
}