import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { notifications } from '../core/notifications';

@customElement('notice-box')
export class NoticeBox extends LitElement {
    @property()
    notification: Notice | null = null;

    protected render(): TemplateResult {
        return html`
            ${this.notification
                ? html`
                      <div class="notification ${ifDefined(this.notification?.type)}">
                          <div class="">${this.notification?.text}</div>
                      </div>
                  `
                : ''}
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();
        notifications().subscribe((notice: Notice) => {
            this.notification = notice;
            setTimeout(() => {
                this.notification = null;
            }, 4000);
        });
    }

    static get styles(): CSSResult {
        //language=CSS
        return css`
            :host {
                display: flex;
                justify-content: center;
                position: absolute;
                white-space: nowrap;
            }
            .notification {
                flex: none;
                padding: 15px;
                border-radius: var(--border-radius);
                color: hsl(0, 0%, 100%);
                user-select: none;
                box-shadow: 0 0 5px 0 var(--color-alert-info);
                background-color: var(--color-alert-info);
            }
            .notification.info {
                box-shadow: 0 0 5px 0 var(--color-alert-info);
                background-color: var(--color-alert-info);
            }
            .notification.error {
                box-shadow: 0 0 5px 0 var(--color-alert-error);
                background-color: var(--color-alert-error);
            }
            .notification.success {
                box-shadow: 0 0 5px 0 var(--color-alert-success);
                background-color: var(--color-alert-success);
            }
            .notification.warning {
                box-shadow: 0 0 5px 0 var(--color-alert-warning);
                background-color: var(--color-alert-warning);
            }

            @keyframes show {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `;
    }
}
