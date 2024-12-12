import { IEvents } from "../base/events";
import { Component } from "../../components/view/Card";

export class Form<T> extends Component<T> {
    protected formInput: HTMLInputElement;
    protected errorText: HTMLElement;
    protected submitBtn: HTMLButtonElement;


    constructor(protected container: HTMLTemplateElement, protected events: IEvents) {
        super(container);

        this.formInput = this.container.querySelector('.form__input');
        this.errorText = this.container.querySelector('.form__errors');
        this.submitBtn = this.container.querySelector('button[type=submit]');
        // Поля формы
        this.container.addEventListener('input', (evt) => {
            const currentElement = evt.target as HTMLInputElement;
            const field = currentElement.name;
            const value = currentElement.value;
            this.events.emit('form:change', { field, value });
        });

        // Отправить форму
        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    };

    // Валидация формы
    set valid(isValid: boolean) {
        this.setDisabled(this.submitBtn, !isValid);
    };

    // Показать ошибку
    protected showInputError(errorMessage: string) {
        this.setText(this.errorText, errorMessage);
    };

    // Скрыть ошибку
    protected hideInputError() {
        this.setText(this.errorText, '');
    };

    set error(error: string) {
        if (error) {
            this.showInputError(error);
        } else {
            this.hideInputError();
        };
    };
};