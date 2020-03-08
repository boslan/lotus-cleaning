import { CSSResult, LitElement, TemplateResult } from 'lit-element';
export declare class ToggleCheckbox extends LitElement {
    round: boolean;
    checked: boolean;
    slotElement: HTMLSlotElement;
    firstUpdated(): void;
    protected render(): TemplateResult;
    static get styles(): CSSResult;
    private onChange;
}
//# sourceMappingURL=toggle-checkbox.d.ts.map