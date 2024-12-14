
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { TBingo } from "../../types";
import { Component } from "../../components/view/Card";


export class Bingo extends Component<TBingo> {
    protected statusBingo: HTMLElement;
    protected buttonBingo: HTMLButtonElement;


    constructor(protected container: HTMLTemplateElement, protected events: IEvents) {
        super(container);

        this.statusBingo = ensureElement('.order-success__description', this.container);
        this.buttonBingo = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        this.buttonBingo.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    // Сеттер который отображает сумму заказа
    set total(value: number) {
        this.setText(this.statusBingo, `Списано ${value} синапсов`);
    }
}