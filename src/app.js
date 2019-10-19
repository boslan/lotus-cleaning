var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, LitElement, html, css, property, query } from 'lit-element';
import { installRouter } from './utils/router';
import { installOfflineWatcher } from './utils/network';
import { firebase } from './utils/firebase';
import { notifications } from './utils/notifications';
import { lazyLoad } from "./utils/lazy-load";
const NORMAL = 'normal';
const WINDOWS = 'windows';
const DASHBOARD = 'dashboard';
const HELP = 'help';
const CODE_REGEXP = new RegExp(/[?&]oobCode=([^&#]*)/);
let AppComponent = class AppComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.isOffline = false;
        this.active = false;
        this.isLoginFormOpened = false;
        this.isAdmin = true;
    }
    connectedCallback() {
        super.connectedCallback();
        installRouter((location) => {
            const page = location.pathname.slice(1);
            lazyLoad(page);
            this.page = page;
        });
        installOfflineWatcher((offline) => (this.isOffline = offline));
        if (!this.page) {
            this.page = NORMAL;
            lazyLoad(NORMAL);
            window.history.replaceState({}, '', `/${NORMAL}`);
        }
        notifications().subscribe((message) => {
            this.notification = message;
            setTimeout(() => {
                this.notification = null;
            }, 3000);
        });
        firebase.auth().onAuthStateChanged((user) => this.onAuthStateChanged(user));
        this.processCode();
    }
    onAuthStateChanged(user) {
        this.user = user;
        if (!user) {
            this.isAdmin = false;
            return;
        }
        this.user.getIdTokenResult()
            .then((idToken) => {
            this.isAdmin = !!idToken.claims.admin;
        });
    }
    processCode() {
        const param = CODE_REGEXP.exec(window.location.search.slice(1));
        if (!param) {
            return;
        }
        const code = param[1];
        const auth = firebase.auth();
        auth.checkActionCode(code)
            .then(() => {
            return auth.applyActionCode(code);
        })
            .catch(() => {
            notifications().notify('Bad email verification link');
        });
    }
    toggleMenu() {
        this.active = !this.active;
    }
    loginFormToggle() {
        if (!this.user) {
            this.isLoginFormOpened = !this.isLoginFormOpened;
        }
    }
    signUp() {
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
            this.isLoginFormOpened = false;
            return userCredential.user.sendEmailVerification();
        })
            .catch(() => {
            notifications().notify(`Неправильное имя пользователя или пароль`);
        });
    }
    signIn() {
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
            this.isLoginFormOpened = false;
        })
            .catch(() => {
            notifications().notify(`Неправильное имя пользователя или пароль`);
        });
    }
    signOut() {
        firebase.auth().signOut().then(() => {
            this.user = null;
        });
    }
    render() {
        // language=HTML
        return html `
        <header>
        <div class="logo" @click="${() => this.loginFormToggle()}">Lotus</div>
        <!--        
        <picture @click="${() => this.toggleMenu()}">
            <source srcset="./images/logo-full.svg" media="(min-width: 600px)">
            <img src="./images/logo-short.svg" alt="Lotus">
        </picture>
        -->
        <nav ?active="${this.active}">
            <ul class="menu">
                ${this.isAdmin ? html `
                <li class="menu-item" ?active="${this.page === DASHBOARD}">
                    <a class="link" href="${DASHBOARD}" @click="${() => this.toggleMenu()}">Заказы</a>
                </li>` : ''}
                <li class="menu-item" ?active="${this.page === NORMAL}" >
                    <a class="link" href="${NORMAL}" @click="${() => this.toggleMenu()}">Обычная</a>
                </li>
                <li class="menu-item" ?active="${this.page === WINDOWS}">
                    <a class="link" href="${WINDOWS}" @click="${() => this.toggleMenu()}">Окна</a>
                </li>
                <li class="menu-item" ?active="${this.page === HELP}">
                    <a class="link" href="${HELP}" @click="${() => this.toggleMenu()}">Справка</a>
                </li>
            </ul>
            ${this.user ? html `<button class="sign-out" @click="${() => this.signOut()}">Выйти</button>` : ''}
        </nav>
        <!--        <address>-->
        <!--            <a class="link" href="tel:+375445846206">+375 (44) 584 62 06</a>-->
        <!--        </address>-->
        ${this.notification ? html `<div class="notification">${this.notification}</div>` : ''}
        </header>
        ${!this.user ? html `
        <form class="login-form" ?opened="${this.isLoginFormOpened}">
            <input id="email" type="text" placeholder="email">
            <input id="password" type="password" placeholder="password">
            <div class="buttons-container">
                <button type="button" class="sign-in" @click="${() => this.signIn()}">Войти</button>
                <button type="button" class="sign-up" @click="${() => this.signUp()}">Зарегистрироваться</button>
            </div>
        </form>` : ''}
        
        ${this.isOffline ? html `<div class="offline-indicator">Offline</div>` : ''}
        
        ${this.page === NORMAL ? html `<normal-page></normal-page>` : ''}
        ${this.page === WINDOWS ? html `<windows-page></windows-page>` : ''}
        ${this.page === DASHBOARD ? html `<dashboard-page></dashboard-page>` : ''}
        ${this.page === HELP ? html `<help-page></help-page>` : ''}
        
        <footer>
        <div class="info">УНП 500563252</div>
        </footer>
        `;
    }
    static get styles() {
        // language=CSS
        return css `
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
                top: 80px;
                left: calc(50% - 180px);
                width: 320px;
                height: 160px;
                box-shadow: 0 0 5px -3px #000;
                padding: 20px;
                transform: translateY(calc(-100% - 90px));
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
        `;
    }
};
__decorate([
    property()
], AppComponent.prototype, "isOffline", void 0);
__decorate([
    property()
], AppComponent.prototype, "active", void 0);
__decorate([
    property()
], AppComponent.prototype, "isLoginFormOpened", void 0);
__decorate([
    property()
], AppComponent.prototype, "notification", void 0);
__decorate([
    property()
], AppComponent.prototype, "page", void 0);
__decorate([
    property()
], AppComponent.prototype, "isAdmin", void 0);
__decorate([
    property()
], AppComponent.prototype, "user", void 0);
__decorate([
    query('#email')
], AppComponent.prototype, "emailInput", void 0);
__decorate([
    query('#password')
], AppComponent.prototype, "passwordInput", void 0);
AppComponent = __decorate([
    customElement('app-component')
], AppComponent);
export { AppComponent };
