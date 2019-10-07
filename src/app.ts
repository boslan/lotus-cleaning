import { customElement, LitElement, TemplateResult, html, css, CSSResult, property, query } from 'lit-element'
import { installRouter } from './utils/router'
import { installOfflineWatcher } from './utils/network'

import { firebase } from './utils/firebase';
import { notifications } from './utils/notifications';
import { UserCredential } from '@firebase/auth-types';

import './normal-page';
import './windows-page';
import './dashboard-page';
import './help-page';

const NORMAL = 'normal';
const WINDOWS = 'windows';
const DASHBOARD = 'dashboard';
const HELP = 'help';

@customElement('app-component')
export class AppComponent extends LitElement {
    @property()
    public isOffline = false;

    @property()
    public active = false;

    @property()
    public isLoginFormOpened = false;

    @property()
    public notification!: string;

    @property()
    public path!: string;

    @property()
    public isAdmin = true;

    @property()
    public user;

    @query('#email')
    public emailInput!: HTMLInputElement;

    @query('#password')
    public passwordInput!: HTMLInputElement;

    connectedCallback(): void {
        super.connectedCallback();
        installRouter((location: Location) => {
            this.path = location.pathname
        });
        installOfflineWatcher((offline: boolean) => (this.isOffline = offline));
        if (!this.path.slice(1)) {
            this.path = `/${NORMAL}`;
            window.history.replaceState({}, '', `/${NORMAL}`);
        }
        notifications().subscribe((message: string) => {
            this.notification = message;
            setTimeout(() => {
                this.notification = null
            }, 3000);
        });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
            }
        });
        const actionCode: RegExpExecArray = new RegExp(/[?&]oobCode=([^&#]*)/)
            .exec(window.location.search.slice(1));
        if (actionCode) {
            firebase.auth().applyActionCode(actionCode[1])
        }
    }

    public toggleMenu(): void {
        this.active = !this.active
    }

    public loginFormToggle(): void {
        this.isLoginFormOpened = !this.isLoginFormOpened;
    }

    public signUp(): void {
        const email: string = this.emailInput.value;
        const password: string = this.passwordInput.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential: UserCredential) => {
                this.isLoginFormOpened = false;
                return userCredential.user.sendEmailVerification();
            })
            .catch(() => {
                notifications().notify(`Неправильное имя пользователя или пароль`)
            });
    }

    public signIn(): void {
        const email: string = this.emailInput.value;
        const password: string = this.passwordInput.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.isLoginFormOpened = false;
            })
            .catch(() => {
                notifications().notify(`Неправильное имя пользователя или пароль`)
            });
    }

    public signOut(): void {
        firebase.auth().signOut().then(() => {
            this.user = null;
        });
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
        <header>
        <div class="logo" @click="${() => this.loginFormToggle()}">Lotus</div>
        <!--        <picture @click="${(): void => this.toggleMenu()}">
            <source srcset="./images/logo-full.svg" media="(min-width: 600px)">
            <img src="./images/logo-short.svg" alt="Lotus">
        </picture> -->
        <nav ?active="${this.active}">
          <ul class="menu">
            ${this.isAdmin ? html`
            <li class="menu-item" ?active="${this.path === `/${DASHBOARD}`}">
                <a class="link" href="${DASHBOARD}" @click="${(): void => this.toggleMenu()}">Заказы</a>
            </li>` : ''}
            <li class="menu-item" ?active="${this.path === `/${NORMAL}`}" >
                <a class="link" href="${NORMAL}" @click="${(): void => this.toggleMenu()}">Обычная</a>
            </li>
            <li class="menu-item" ?active="${this.path === `/${WINDOWS}`}">
                <a class="link" href="${WINDOWS}" @click="${(): void => this.toggleMenu()}">Окна</a>
            </li>
            <li class="menu-item" ?active="${this.path === `/${HELP}`}">
                <a class="link" href="${HELP}" @click="${(): void => this.toggleMenu()}">Справка</a>
            </li>
          </ul>
        </nav>
        <!--        <address>-->
        <!--            <a class="link" href="tel:+375445846206">+375 (44) 584 62 06</a>-->
        <!--        </address>-->
        ${!this.user ? html`
        <form class="login-form" ?opened="${this.isLoginFormOpened}">
            <input id="email" type="text" placeholder="email">
            <input id="password" type="password" placeholder="password">
            <div class="buttons-container">
                <button type="button" class="sign-in" @click="${(): void => this.signIn()}">Войти</button>
                <button type="button" class="sign-up" @click="${(): void => this.signUp()}">Зарегистрироваться</button>
            </div>
        </form>` : html`
        <button class="sign-out" @click="${(): void => this.signOut()}">Выйти</button>
        `}
        ${this.notification ? html`<div class="notification">${this.notification}</div>` : ''}
        </header>
        ${this.isOffline ? html`<div class="offline-indicator">Offline</div>` : ''}
        
        ${this.path === `/${NORMAL}` ? html`<normal-page></normal-page>` : ''}
        ${this.path === `/${WINDOWS}` ? html`<windows-page></windows-page>` : ''}
        ${this.path === `/${DASHBOARD}` ? html`<dashboard-page></dashboard-page>` : ''}
        ${this.path === `/${HELP}` ? html`<help-page></help-page>` : ''}
        
        <footer>
        <div class="info">УНП 500563252</div>
        </footer>
        `
    }

    static get styles(): CSSResult {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-flow: column;
                justify-content: space-between;
                height: 100%;
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
                background: #fff;
                color: #000;
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
                flex: 1;
                justify-content: center;
                
                font-size: 24px;
                text-transform: uppercase;

                margin: 1em;
                cursor: pointer;
                outline: none;
            }

            nav {
                flex: 2;
                align-items: flex-start;
            }

            .menu {
                padding: 0;
                margin: 0;
                list-style-type: none;
            }

            .menu-item {
                cursor: pointer;
                padding: 10px;
            }

            .link {
                color: #000;
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
                left: 20px;
                right: 20px;
                box-shadow: 0 0 5px -3px #000;
                padding: 20px;
                transform: translateX(calc(-100% - 25px));
                transition: .3s transform;
                background: #fff;
            }
            
            .login-form[opened] {
                transform: none;
            }

            .login-form .buttons-container {
                margin: 10px;
            }

            .login-form input {
                margin: 10px;
                background: #fff;
                color: #000;
                border: 0;
                padding: 8px 5px;
                box-shadow: 0 1px 0 0 #000;
                outline: none;
            }

            .login-form input:focus {
                box-shadow: 0 2px 0 0 #000;
            }

            .sign-in,
            .sign-up,
            .sign-out {
                margin: 5px;
                background: #fff;
                border: 0;
                border-radius: 5px;
                color: #000;
                padding: 5px 10px;
                box-shadow: 0 0 0 1px #000;
                cursor: pointer;
                outline: none;
            }

            .sign-in:hover,
            .sign-up:hover,
            .sign-out:hover {
                box-shadow: 0 0 0 2px #000;
            }

            address {
                flex: 1;
                margin: 0.6em;
            }

            .link:hover,
            .menu-item:hover a,
            .menu-item[active] > a {
                padding-bottom: 4px;
                box-shadow: rgb(0, 0, 0) 0 2px 0 0;
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

            .offline-indicator {
                text-align: center;
                width: 100%;
                color: white;
                background-color: #930000;
            }

            .notification {
                position: absolute;
                top: calc(100% + 10px);
                right: 20px;
                left: 20px;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 0 5px 0 #930000;
                color: white;
                background-color: #930000;
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
        `
    }
}
