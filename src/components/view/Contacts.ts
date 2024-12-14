import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IForm, TInfoBuyer, } from "../../types";
import { Form } from "./Form";

export class Contacts extends Form<IForm> implements TInfoBuyer {
    protected clientPhone: HTMLInputElement;
    protected clientEmail: HTMLInputElement;


    constructor(protected container: HTMLTemplateElement, protected events: IEvents) {
        super(container, events);

        this.clientPhone = ensureElement('.phone', this.container) as HTMLInputElement;
        this.clientEmail = ensureElement('.email', this.container) as HTMLInputElement;
    }

    set phone(value: string) {
        this.clientPhone.value = value;
    };

    set email(value: string) {
        this.clientEmail.value = value;
    };
};