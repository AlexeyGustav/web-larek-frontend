import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
    address?: string;
    paymend?: string;
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit('order:changed', {
                field,
                value
            });
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Валидация формы
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Показать ошибку
    protected showError(errorMessage: string) {
        this.setText(this._errors, errorMessage);
    };

    // Скрыть ошибку
    protected hideError() {
        this.setText(this._errors, '');
    };

    set errors(value: string) {
        value ? this.showError(value) : this.hideError();
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}