import {customElement, LitElement, TemplateResult, html, css, CSSResult, property} from 'lit-element'
import {installRouter} from './utils/router'
import {installOfflineWatcher} from './utils/network'

@customElement('app-component')
export class AppComponent extends LitElement {
    @property()
    public isOffline = false;

    @property()
    public active = false;

    @property()
    public path!: string;

    static get styles(): CSSResult {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-flow: column;
                justify-content: space-between;
                height: 100%;
            }

            section {
                display: flex;
                flex: 1;
                padding: 10px;
            }

            .offline-indicator {
                text-align: center;
                width: 100%;
                color: white;
                background-color: #930000;
            }

            header {
                position: relative;
            }

            header,
            footer,
            nav,
            .menu {
                display: flex;
                align-items: center;
                background: #000;
                color: white;
            }

            picture {
                margin: 1em;
                cursor: pointer;
                outline: none;
            }

            picture,
            nav,
            address {
                display: flex;
                justify-content: center;
            }

            nav {
                flex: 2;
                align-items: flex-start;
                position: absolute;
                left: 0;
                top: 100%;
                height: calc(100vh - 100%);
                width: 160px;
                transform: translateX(-100%);
                transition: transform .3s;
                transform-origin: left;
            }

            nav[active] {
                transform: none;
                box-shadow: 0 5px 10px 0px #171717;
                border-right: 1px #1c1c1c solid;
            }

            .menu {
                padding: 0;
                margin: 0;
                list-style-type: none;
                flex-flow: column;
            }

            .menu-item {
                cursor: pointer;
                padding: 10px;
            }

            .link {
                color: white;
                font-style: normal;
                text-decoration: none;
                font-weight: bold;
                font-size: 20px;
                text-transform: capitalize;
                white-space: nowrap;
            }

            address {
                flex: 1;
                margin: 0.6em;
            }

            .link:hover,
            .menu-item:hover,
            .menu-item[active] > a {
                color: #E1BE3F;
                outline: none;
            }

            footer {
                justify-content: flex-end;
            }

            .info {
                max-width: 400px;
                font-size: 12px;
                padding: 14px;
            }

            @media (min-width: 600px) {
                picture {
                    flex: 1;
                }

                nav[active],
                nav {
                    align-items: center;
                    position: static;
                    height: auto;
                    width: auto;
                    transform: none;
                    box-shadow: none;
                    border: none;
                }

                .menu {
                    flex-flow: row;
                }

                .menu-item {
                    padding: 0 40px;
                }
            }
        `
    }

    connectedCallback(): void {
        super.connectedCallback()
        installRouter((location: Location) => {
            this.path = location.pathname
        })
        installOfflineWatcher((offline: boolean) => (this.isOffline = offline))
        window.history.replaceState({}, '', '/default')
        this.path = '/default'
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
      <header>
        <picture @click="${() => this.toggleMenu()}">
            <source srcset="./images/logo-full.svg" media="(min-width: 600px)">
            <img src="./images/logo-short.svg" alt="Lotus">
        </picture>
        <nav ?active="${this.active}">
          <ul class="menu">
            <li class="menu-item" ?active="${this.path === '/default'}" @click="${() => this.toggleMenu()}"><a class="link" href="default">Обычная</a></li>
            <li class="menu-item" ?active="${this.path === '/windows'}" @click="${() => this.toggleMenu()}"><a class="link" href="windows"">Окна</a></li>
            <li class="menu-item" ?active="${this.path === '/help'}" @click="${() => this.toggleMenu()}"><a class="link" href="help">Справка</a></li>
          </ul>
        </nav>
        <address>
            <a class="link" href="tel:+375445846206">+375 (44) 584 62 06</a>
        </address>
      </header>
      ${this.isOffline ? html`<div class="offline-indicator">Offline</div>` : ''}
      
      
      ${this.path === '/default' ? html`
      <section>
        Обычная уборка
      </section>
      ` : ''}
      
      ${this.path === '/windows' ? html`
      <section>
        Окна
      </section>
      ` : ''}
      
      ${this.path === '/help' ? html`
      <section>
        Справка
      </section>
      ` : ''}
      
      <footer>
        <div class="info">УНП 192692068, свидетельство выдано минским горисполкомом 17 августа 2016. Юридический адрес: Республика Беларусь, г. Минск, ул. Октябрьская 21-111. Режим работы: 8:00 - 23:00 Почта для связи: kittcleaning@gmail.com</div>
      </footer>
      `
    }

    public goTo(view: string): void {
        window.location.href = view
    }

    public toggleMenu(): void {
        this.active = !this.active
    }
}
