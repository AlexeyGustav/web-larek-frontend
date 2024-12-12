import { IEvents } from "../base/events";
import { IBasket } from "../../types";
import { Component } from "../../components/view/Card";
import { cloneTemplate, ensureElement } from "../../utils/utils";


export class Basket extends Component<IBasket> {

    protected basketList: HTMLElement;
    protected basketIndex: HTMLSpanElement;
    protected basketTotal: HTMLElement;
    protected basketBtn: HTMLButtonElement;
    protected basketElement: HTMLElement;


    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        super(template);

        this.basketElement = cloneTemplate(template);
        this.basketList = ensureElement('.basket__list', this.basketElement);
        this.basketIndex = this.basketElement.querySelector('.basket__item-index');
        this.basketTotal = ensureElement('.basket__price', this.basketElement);
        this.basketBtn = ensureElement('.basket__button', this.basketElement) as HTMLButtonElement;

        // Cлушатель закрытьия корзины
        this.basketBtn.addEventListener('click', () => {
            this.events.emit('basket:submit')
        });
    }

    // Заполнение коорзины карточками
    set items(cards: HTMLElement[]) {
        this.basketList.replaceChildren(...cards);
    };

    // Общая сумма заказа
    set total(value: number) {
        if (value) {
            this.setText(this.basketTotal, `${value} синапсов`)
            this.toggleButton(false);
        } else {
            this.setText(this.basketTotal, `0 синапсов`)
            this.toggleButton(true);
        }
    };


    
    render(data?: IBasket): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.basketElement;
    };
};