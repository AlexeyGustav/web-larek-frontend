import { Form } from "../../components/view/Form";
import { IEvents } from "../../components/base/events";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IOrderPay, IActions } from "../../types/index";




export class OrderPay extends Form<IOrderPay> {
  // protected inputAddress: HTMLInputElement;
  protected paymentMethod: HTMLButtonElement[];
  protected paymentMethodCard: HTMLButtonElement;
  protected paymentMethodCash: HTMLButtonElement;
  protected nextMethodButton: HTMLButtonElement;
  // protected _form: HTMLFormElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    // this.inputAddress = this.container.querySelector('.address') as HTMLInputElement;
    this.paymentMethod = ensureAllElements('button[type=button]', this.container);
    this.paymentMethodCard = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
    this.paymentMethodCash = ensureElement<HTMLButtonElement>("button[name=cash]", this.container);
    // this._form = this.container.querySelector('.form');

    this.nextMethodButton = ensureElement(".order__button", this.container) as HTMLButtonElement;

    if (actions?.onClick) {
      if (this.nextMethodButton) {
        this.nextMethodButton.addEventListener('click', actions.onClick);
      };
    };

    this.paymentMethod.forEach((item: HTMLButtonElement) => {
      item.addEventListener('click', (evt) => {
        const target = evt.target as HTMLButtonElement;

        // Обновляем состояние кнопок
        this.paymentMethodCard.classList.toggle("button_alt-active", target === this.paymentMethodCard);
        this.paymentMethodCash.classList.toggle("button_alt-active", target === this.paymentMethodCash);

        // Эмитим событие изменения paymend
        this.events.emit('paymend:change', { field: 'payment', value: target.innerText });
      });
    });
  }

  set valid(isValid: boolean) {
    this.nextMethodButton.classList.toggle('popup__button_disabled', !isValid);
    this.nextMethodButton.disabled = !isValid;
  }

  // set address(value: string) {
  //   (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  // }
}