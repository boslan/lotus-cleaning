import { css, CSSResult, customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

@customElement('toggle-checkbox')
export class ToggleCheckbox extends LitElement {
    @property({ type: Boolean, reflect: true }) round = true;
    @property({ type: Boolean, reflect: true }) checked = false;

    @query('slot') slotElement!: HTMLSlotElement;

    firstUpdated(): void {
        console.log(this.slotElement);
    }

    protected render(): TemplateResult {
        return html`
            <label class="switch">
                <slot></slot>
                <input type="checkbox" .checked="${this.checked}" @change="${() => this.onChange()}" />
                <span class="slider"></span>
            </label>
        `;
    }

    //language=CSS
    static get styles(): CSSResult {
        return css`
            :host {
                display: flex;
                align-items: center;
                position: relative;
            }

            label {
                display: inline-flex;
                line-height: 22px;
                cursor: pointer;
                white-space: nowrap;
            }

            .switch input {
                position: absolute;
                visibility: hidden;
            }

            .slider {
                position: relative;
                display: flex;
                height: 20px;
                cursor: pointer;
                background-color: var(--color-on-secondary);
                transition: 0.4s;
                width: 36px;
                margin-left: 6px;
            }

            .slider:before {
                position: absolute;
                content: '';
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: var(--color-primary);
                transition: 0.4s;
            }

            input:checked + .slider {
                background-color: var(--color-orange);
            }

            input:checked + .slider:before {
                transform: translateX(16px);
            }

            :host([round]) .slider {
                border-radius: 16px;
            }

            :host([round]) .slider:before {
                border-radius: 50%;
            }
        `;
    }

    private onChange() {
        this.checked = !this.checked;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: this.checked,
                composed: true,
                bubbles: true,
            }),
        );
    }
}
