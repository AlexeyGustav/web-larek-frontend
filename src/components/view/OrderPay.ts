import { Form } from "../../components/view/Form";
import { IEvents } from "../../components/base/events";
import {ensureElement, ensureAllElements} from "../../utils/utils";

// TODO написать что мы ожидаем получить, скорее всего в сеттерах
export interface IOrderPay {
  // paymentMethod: HTMLButtonElement;
  // deliveryAddress: HTMLInputElement;

  paymend: string;
  adress: string;


  valid: boolean;
  error: string;
}

export interface IPayActions {
  onClick: (event: MouseEvent) => void;
}

export class OrderPay extends Form<IOrderPay> {
  protected paymentMethod: HTMLButtonElement[];
  protected paymentMethodCard: HTMLButtonElement;
  protected paymentMethodCash: HTMLButtonElement;
  protected deliveryAddress: HTMLInputElement;
  protected nextMethodButton: HTMLButtonElement;
  protected _form: HTMLFormElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IPayActions) {
    super(container, events);

    this.paymentMethod = ensureAllElements('button[type=button]', this.container);
    this.paymentMethodCard = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
    this.paymentMethodCash = ensureElement<HTMLButtonElement>("button[name=cash]", this.container);
    this.deliveryAddress = ensureElement(".form__input", this.container) as HTMLInputElement;
    this._form = this.container.querySelector('.form');

    
    this.nextMethodButton = ensureElement(".order__button", this.container) as HTMLButtonElement;
    
    this.nextMethodButton.addEventListener('click', (evt) => {
			this.events.emit(`payment:submit`, {
				// submitCallback: this.handleSubmit,
			});
		});


    this.paymentMethod.forEach((item: HTMLButtonElement) => {
      item.addEventListener('click', (evt) => {
        if(evt.target === this.paymentMethodCard) {
          this.paymentMethodCard.classList.add("button_alt-active")
        } else {
          this.paymentMethodCard.classList.remove("button_alt-active")
        }

        if(evt.target === this.paymentMethodCash) {
          this.paymentMethodCash.classList.add("button_alt-active")
        } else {
          this.paymentMethodCash.classList.remove("button_alt-active")
        }

        this.events.emit('paymend:change', 
          { paymend: item.innerText }
        )
      });


    })
  }




  set valid(isValid: boolean) {
		this.nextMethodButton.classList.toggle('popup__button_disabled', !isValid);
		this.nextMethodButton.disabled = !isValid;
	}

  set error(data: { field: string; value: string; validInformation: string }) {
		if (data.validInformation) {
			// this.showInputError(data.field, data.validInformation);
		} else {
			// this.hideInputError(data.field);
		}
	}



  // close() {
	// 	super.close();
	// 	this._form.reset();
	// 	this.inputs.forEach((element) => {
	// 		this.hideInputError(element.name);
	// 	});
	// }



set adress(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
}

}


// export class Pay extends OrderPay {
//   constructor(container: HTMLFormElement, events: IEvents) {
//       super(container, events);
//   }

//   set phone(value: string) {
//       (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
//   }

//   set email(value: string) {
//       (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
//   }
// }