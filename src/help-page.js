var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement } from 'lit-element';
import './order-form';
import { pageStyle } from './page-style';
let WindowsPage = class WindowsPage extends LitElement {
    static get styles() {
        return [pageStyle];
    }
    render() {
        // language=HTML
        return html `Помощь`;
    }
};
WindowsPage = __decorate([
    customElement('help-page')
], WindowsPage);
export { WindowsPage };
