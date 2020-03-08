import { customElement, LitElement, TemplateResult, html, css, CSSResult, property, query } from 'lit-element';
import { installRouter } from './core/router';
import { installOfflineWatcher } from './core/network';

import { firebase } from './core/firebase';
import { notifications } from './core/notifications';
import './components/toggle-checkbox';

import { User } from 'firebase';
import IdTokenResult = firebase.auth.IdTokenResult;
import UserCredential = firebase.auth.UserCredential;
import { lazyLoad } from './core/lazy-load';
import { ifDefined } from 'lit-html/directives/if-defined';

const NORMAL = 'normal';
const WINDOWS = 'windows';
const DASHBOARD = 'dashboard';
const HELP = 'help';

const CODE_REGEXP = new RegExp(/[?&]oobCode=([^&#]*)/);

@customElement('app-component')
export class AppComponent extends LitElement {
    @property()
    public isOffline = false;

    @property()
    public active = false;

    @property()
    public isLoginFormOpened = false;

    @property()
    public notification: Notice | null = null;

    @property()
    public page!: string;

    @property()
    public isAdmin = false;

    @property()
    public user: User | null = null;

    @property()
    public isDark = false;

    @query('#email')
    public emailInput!: HTMLInputElement;

    @query('#password')
    public passwordInput!: HTMLInputElement;

    connectedCallback(): void {
        super.connectedCallback();
        installRouter((location: Location) => {
            const page = location.pathname.slice(1);
            lazyLoad(page);
            this.page = page;
        });
        installOfflineWatcher((offline: boolean) => (this.isOffline = offline));
        if (!this.page) {
            this.page = NORMAL;
            lazyLoad(NORMAL);
            window.history.replaceState({}, '', `/${NORMAL}`);
        }
        notifications().subscribe((notice: Notice) => {
            this.notification = notice;
            setTimeout(() => {
                this.notification = null;
            }, 3000);
        });

        firebase.auth().onAuthStateChanged((user: User | null): void => this.onAuthStateChanged(user));
        this.processCode();
        this.detectTheme();
    }

    public onAuthStateChanged(user: User | null): void {
        this.user = user;
        if (!user) {
            this.isAdmin = false;
            return;
        }
        user.getIdTokenResult().then((idToken: IdTokenResult) => {
            this.isAdmin = !!idToken.claims.admin;
        });
    }

    public processCode(): void {
        const param: RegExpExecArray | null = CODE_REGEXP.exec(window.location.search.slice(1));
        if (!param) {
            return;
        }
        const code: string = param[1];
        const auth: firebase.auth.Auth = firebase.auth();
        auth.checkActionCode(code)
            .then(() => {
                return auth.applyActionCode(code);
            })
            .catch(() => {
                notifications().notify({ text: 'Неверная ссылка проверки email', type: 'error' });
            });
    }

    public toggleMenu(): void {
        this.active = !this.active;
    }

    public loginFormToggle(e: MouseEvent): void {
        e.stopPropagation();
        if (!this.user) {
            this.isLoginFormOpened = !this.isLoginFormOpened;
        }
    }

    public signUp(): void {
        const email: string = this.emailInput.value;
        const password: string = this.passwordInput.value;
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(({ user }: UserCredential) => {
                this.isLoginFormOpened = false;
                if (user) {
                    return user.sendEmailVerification();
                }
            })
            .catch(() => {
                notifications().notify({ text: 'Неправильное имя пользователя или пароль', type: 'error' });
            });
    }

    public signIn(): void {
        const email: string = this.emailInput.value;
        const password: string = this.passwordInput.value;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                this.isLoginFormOpened = false;
            })
            .catch(() => {
                notifications().notify({ text: 'Неправильное имя пользователя или пароль', type: 'error' });
            });
    }

    public signOut(): void {
        firebase
            .auth()
            .signOut()
            .then(() => {
                this.user = null;
            });
    }

    // language=HTML
    public render(): TemplateResult {
        return html`
            <header>
                <div class="logo">
                    <div class="logo-title">Lotus</div>
                    <div>
                        ${this.user
                            ? html`
                                  <a class="link" @click="${(): void => this.signOut()}">Выйти</a>
                              `
                            : html`
                                  <a class="link" @click="${(e: MouseEvent): void => this.loginFormToggle(e)}">Войти</a>
                              `}
                    </div>
                </div>
                <!--        
                <picture @click="${(): void => this.toggleMenu()}">
                    <source srcset="./images/logo-full.svg" media="(min-width: 600px)">
                    <img src="./images/logo-short.svg" alt="Lotus">
                </picture>
                -->
                <nav ?active="${this.active}">
                    <ul class="menu">
                        ${this.isAdmin
                            ? html`
                                  <li class="menu-item" ?active="${this.page === DASHBOARD}">
                                      <a class="link" href="${DASHBOARD}" @click="${(): void => this.toggleMenu()}">
                                          Заказы
                                      </a>
                                  </li>
                              `
                            : ''}
                        <li class="menu-item" ?active="${this.page === NORMAL}">
                            <a class="link" href="${NORMAL}" @click="${(): void => this.toggleMenu()}">Обычная</a>
                        </li>
                        <li class="menu-item" ?active="${this.page === WINDOWS}">
                            <a class="link" href="${WINDOWS}" @click="${(): void => this.toggleMenu()}">Окна</a>
                        </li>
                        <li class="menu-item" ?active="${this.page === HELP}">
                            <a class="link" href="${HELP}" @click="${(): void => this.toggleMenu()}">Справка</a>
                        </li>
                    </ul>
                </nav>
                <!--        <address>-->
                <!--            <a class="link" href="tel:+375445846206">+375 (44) 584 62 06</a>-->
                <!--        </address>-->
                ${this.notification
                    ? html`
                          <div class="notification ${ifDefined(this.notification?.type)}">
                              <div class="">${this.notification?.text}</div>
                          </div>
                      `
                    : ''}
            </header>
            ${this.renderLoginForm()}
            ${this.isOffline
                ? html`
                      <div class="offline-indicator">Offline</div>
                  `
                : ''}
            ${this.renderPage()}
            <footer>
                <toggle-checkbox round .checked="${this.isDark}" @change="${() => this.switchTheme()}">
                    Dark Side
                </toggle-checkbox>
            </footer>
        `;
    }

    public detectTheme(): void {
        const isOsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isAppDark = localStorage.getItem('theme') === 'dark';
        const hasAppTheme = !!localStorage.getItem('theme');
        const theme = isAppDark || (isOsDark && !hasAppTheme) ? 'dark' : 'light';
        this.setTheme(theme);
    }

    public switchTheme() {
        const currentTheme = localStorage.getItem('theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        this.setTheme(nextTheme);
    }

    public setTheme(theme: 'dark' | 'light'): void {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.isDark = theme === 'dark';
    }

    public renderLoginForm(): TemplateResult | string {
        const loginFormHtml: TemplateResult = html`
            <form class="login-form" ?opened="${this.isLoginFormOpened}">
                <input id="email" type="text" placeholder="email" />
                <input id="password" type="password" placeholder="password" />
                <div class="buttons-container">
                    <button type="button" class="sign-in" @click="${(): void => this.signIn()}">Войти</button>
                    <button type="button" class="sign-up" @click="${(): void => this.signUp()}">
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        `;
        return !this.user ? loginFormHtml : '';
    }

    public renderPage(): TemplateResult | string {
        switch (this.page) {
            case NORMAL:
                return html`
                    <normal-page></normal-page>
                `;
            case WINDOWS:
                return html`
                    <windows-page></windows-page>
                `;
            case DASHBOARD:
                return html`
                    <dashboard-page></dashboard-page>
                `;
            case HELP:
                return html`
                    <help-page></help-page>
                `;
            default:
                return '';
        }
    }

    static get styles(): CSSResult {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-flow: column;
                justify-content: space-between;
                height: 100%;
                background: var(--color-primary);
            }

            header {
                position: relative;
                flex-wrap: wrap;
            }

            header,
            footer,
            nav,
            .menu {
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--color-primary);
                color: var(--color-on-primary);
            }

            picture,
            nav,
            address {
                display: flex;
                justify-content: center;
            }

            picture {
                margin: 1em;
                cursor: pointer;
                outline: none;
            }

            .logo {
                display: flex;
                justify-content: center;
                align-items: center;

                margin: 1em;
                cursor: pointer;
                outline: none;
            }
            .logo-title {
                font-size: 24px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                margin-right: 10px;
            }

            nav {
                flex-flow: row wrap;
            }

            .menu {
                flex-flow: row wrap;
                padding: 0;
                margin: 0;
                list-style-type: none;
            }

            .menu-item {
                padding: 10px;
            }

            .link {
                color: var(--color-on-primary);
                font-style: normal;
                text-decoration: none;
                white-space: nowrap;
                padding-bottom: 4px;
            }

            .login-form {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                position: absolute;
                top: 80px;
                left: calc(50% - 180px);
                width: 320px;
                height: 160px;
                box-shadow: 0 0 5px -3px var(--color-on-primary);
                padding: 20px;
                transform: translateY(calc(-100% - 90px));
                transition: 0.3s transform;
                background: var(--color-primary);
                z-index: 1;
            }

            .login-form[opened] {
                transform: none;
            }

            .login-form .buttons-container {
                margin: 10px;
            }

            .login-form input {
                margin: 10px;
                background: var(--color-primary);
                color: var(--color-on-primary);
                border: 0;
                padding: 8px 5px;
                box-shadow: 0 1px 0 0 var(--color-on-secondary);
                outline: none;
            }

            .login-form input:focus {
                box-shadow: 0 2px 0 0 var(--color-on-primary);
            }

            .sign-in,
            .sign-up,
            .sign-out {
                margin: 5px 12px;
                background: var(--color-primary);
                border: 0;
                border-radius: var(--border-radius);
                color: var(--color-on-primary);
                padding: 5px 10px;
                box-shadow: 0 0 1px 1px var(--color-on-primary);
                cursor: pointer;
                outline: none;
            }

            .sign-in:hover,
            .sign-up:hover,
            .sign-out:hover {
                box-shadow: 0 0 1px 2px var(--color-on-primary);
            }

            address {
                flex: 1;
                margin: 0.6em;
            }

            .link:hover,
            .menu-item[active] > a {
                padding-bottom: 4px;
                box-shadow: var(--color-on-primary) 0 2px 0 0;
                outline: none;
            }

            footer {
                padding: 5px;
            }

            .info {
                max-width: 400px;
                font-size: 12px;
                padding: 14px;
            }

            .offline-indicator {
                text-align: center;
                width: 100%;
                color: white;
                background-color: var(--color-alert-error);
            }

            .notification {
                position: absolute;
                top: calc(100% + 10px);
                right: 20px;
                left: 20px;
                padding: 15px;
                border-radius: var(--border-radius);
                color: hsl(0, 0%, 100%);
                user-select: none;
                display: block;
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

            .notification.show {
                display: block;
                animation: show 300ms;
            }

            @keyframes show {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            @media (min-width: 600px) {
                .notification {
                    left: auto;
                }

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
        `;
    }
}
