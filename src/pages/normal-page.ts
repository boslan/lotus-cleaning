import {LitElement, html, TemplateResult, customElement, CSSResultArray, css} from 'lit-element';
import '../components/order-form';
import { pageStyle } from './page-style';

@customElement('normal-page')
export class NormalPage extends LitElement {
    // language=CSS
    static get styles(): CSSResultArray {
        return [pageStyle, css`            
            :host {
                justify-content: center;
            }
        `];
    }

    public render(): TemplateResult {
        // language=HTML
        return html`<order-form></order-form>`;
    }
}
