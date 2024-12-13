import { IEvents } from "../base/events";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IForm, TPayment } from "../../types";
import { Form } from "./Form";

export class Payment extends Form<IForm> implements TPayment {
    protected deliveryAddress: HTMLInputElement;
    protected btnPayment: HTMLButtonElement[];


    constructor(protected container: HTMLTemplateElement, protected events: IEvents) {
        super(container, events);

        this.deliveryAddress = ensureElement('.address', this.container) as HTMLInputElement;
        this.btnPayment = ensureAllElements('button[type=button]', this.container);

        this.btnPayment?.forEach(button => {
            button.addEventListener('click', (evt) => {
                const currentButton = evt.target as HTMLButtonElement;

                this.payment = currentButton.name;
                this.events.emit('form:change', { 
                    field: 'payment', 
                    value: button.name 
                });
            });
        });
    };

    set payment(name: string) { 
        this.btnPayment.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === name);
        });
    };

    set address(value: string) {
        this.deliveryAddress.value = value;
    };
};