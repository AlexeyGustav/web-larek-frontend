import { Form } from "../../components/view/Form";
import { IEvents } from "../../components/base/events";
import { ensureElement } from "../../utils/utils";
import { IContacts } from "../../types/index";


export class Contacts extends Form<IContacts> {
  protected nextPage: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.nextPage = ensureElement<HTMLButtonElement>(".button", this.container);
  }

  get form() {
		return this.container
	}

  set disabled(isValid: boolean) {
    this.nextPage.classList.toggle('popup__button_disabled', !isValid);
    this.nextPage.disabled = !isValid;
  }
}