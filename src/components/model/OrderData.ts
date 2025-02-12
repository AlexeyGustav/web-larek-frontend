import { IEvents } from "../base/events";



export interface IOrderDataAll {
  email: string;
  phone: string;
  address: string;
  paymend: string;
}
export interface IOrderData {
  // TODO написать методы, когда закончу с формами
  setOrder(field: keyof TFormErrors, value: string): void;
  // validateOrder(): boolean;
}


export type TFormErrors = {
  email?: string;
  phone?: string;
  address?: string;
  paymend?: string;
}

export type IOrder = {
  email: "";
  phone: "";
  address: "";
  paymend: "";
}








export class OrderData implements IOrderData {
   order: IOrderDataAll = {
    email: '',
    phone: '',
    address: '',
    paymend: '',
  };
  formErrors: TFormErrors = {};

  constructor(protected events: IEvents) { }


  // getOrder() {
  //   const order = {
  //     ...this.order
  //   }
  //   return Object.freeze(order);
  // };

  setOrder(field: keyof TFormErrors, value: string) {
    this.order[field] = value;
    if (this.validateOrder()) {
      this.events.emit('order:change', this.order);
    }
  }

  updatePaymentMethod(method: string) {
    this.order.paymend = method;
    if (this.validateOrder()) {
      this.events.emit('order:change', this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.paymend) {
      errors.paymend = 'Необходимо указать вид оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('order:changed', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}