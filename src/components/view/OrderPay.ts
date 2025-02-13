import { Form } from "../../components/view/Form";
import { IEvents } from "../../components/base/events";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IOrderPay } from "../../types/index";


export class OrderPay extends Form<IOrderPay> {
  protected paymentMethod: HTMLButtonElement[];
  protected paymentMethodCard: HTMLButtonElement;
  protected paymentMethodCash: HTMLButtonElement;
  protected nextPage: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentMethod = ensureAllElements('button[type=button]', this.container);
    this.paymentMethodCard = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
    this.paymentMethodCash = ensureElement<HTMLButtonElement>("button[name=cash]", this.container);
    this.nextPage = ensureElement(".order__button", this.container) as HTMLButtonElement;


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
  };

  set valid(isValid: boolean) {
    this.nextPage.classList.toggle('popup__button_disabled', !isValid);
    this.nextPage.disabled = !isValid;
  };

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  };

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  };

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  };

  get form() {
		return this.container
	}
};