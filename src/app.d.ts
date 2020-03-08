import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import './components/toggle-checkbox';
import { User } from 'firebase';
export declare class AppComponent extends LitElement {
    isOffline: boolean;
    active: boolean;
    isLoginFormOpened: boolean;
    notification: string;
    page: string;
    isAdmin: boolean;
    user: User | null;
    isDark: boolean;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    connectedCallback(): void;
    onAuthStateChanged(user: User | null): void;
    processCode(): void;
    toggleMenu(): void;
    loginFormToggle(): void;
    signUp(): void;
    signIn(): void;
    signOut(): void;
    render(): TemplateResult;
    detectTheme(): void;
    switchTheme(): void;
    setTheme(theme: 'dark' | 'light'): void;
    renderLoginForm(): TemplateResult | string;
    renderPage(): TemplateResult | string;
    static get styles(): CSSResult;
}
//# sourceMappingURL=app.d.ts.map