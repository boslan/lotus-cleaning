import { css } from 'lit-element';

// language=CSS
export const sharedStyle = css`
    button {
        border-radius: var(--border-radius);
        background-color: var(--color-orange);
        color: white;
        border: 0;
        text-transform: uppercase;
        letter-spacing: 3px;
        padding: 16px 25px;
        font-size: 20px;
        cursor: pointer;
        outline: none;
        transition: box-shadow 0.3s;
    }

    button:hover {
        box-shadow: 0 0 10px 0 var(--color-orange);
    }
`;
