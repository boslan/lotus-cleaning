import { firebase } from './core/firebase';
import { notifications } from './core/notifications';

let isOpened = false;

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.overlay');
    const authForm: HTMLElement | null = document.querySelector('.auth-form');
    if (!authForm || !overlay) return;
    const signInButton = authForm.querySelector('.sign-in');
    const signUpButton = authForm.querySelector('.sign-up');
    const emailInput: HTMLInputElement | null = authForm.querySelector('#email');
    const passwordInput: HTMLInputElement | null = authForm.querySelector('#password');

    const setAuthVisible = (opened: boolean): void => {
        isOpened = opened;
        if (opened) {
            authForm.style.display = 'flex';
            authForm.classList.add('opened');
            overlay.classList.add('opened');
        } else {
            authForm.classList.remove('opened');
            overlay.classList.remove('opened');
        }
    };

    if (!signInButton || !signUpButton || !authForm || !emailInput || !passwordInput) return;
    overlay.addEventListener('click', () => setAuthVisible(!isOpened));
    document.addEventListener('toggle-auth-form', () => setAuthVisible(!isOpened));
    authForm.addEventListener('transitionend', () => {
        if (!isOpened) {
            authForm.style.display = 'none';
        }
    });
    signInButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                setAuthVisible(false);
            })
            .catch(() => {
                notifications().notify({ text: 'Неправильное имя пользователя или пароль', type: 'error' });
            });
    });
    signUpButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
                setAuthVisible(false);
                if (user) {
                    return user.sendEmailVerification();
                }
            })
            .catch(() => {
                notifications().notify({ text: 'Неправильное имя пользователя или пароль', type: 'error' });
            });
    });
});
