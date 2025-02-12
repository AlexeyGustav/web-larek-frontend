import { Form } from "../../components/view/Form";
import { IEvents } from "../../components/base/events";
import { ensureElement } from "../../utils/utils";
import { IOrderPay, IActions } from "../../types/index";



export class Contacts extends Form<IOrderPay> {
  protected paymentMethodCard: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);
    // this.paymentMethodCard = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
  }

  // set valid(isValid: boolean) {
  //   this.paymentMethodCard.classList.toggle('popup__button_disabled', !isValid);
  //   this.paymentMethodCard.disabled = !isValid;
  // }
}