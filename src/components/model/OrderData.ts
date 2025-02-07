import { IEvents } from "../base/events";



export interface IOrderData {
// TODO написать методы, когда закончу с формами
}

export interface IOrder {
  email: string;
  phone: string;
  address: string;
  paymend: string;
}

export type TFormErrors = {
  email?: string;
  phone?: string;
  address?: string;
  paymend?: string;
}


export class OrderData implements IOrderData {
  order: IOrder = {
    email: '',
    phone: '',
    address: '',
    paymend: '',
};

protected events: IEvents;
formErrors: TFormErrors = {};

constructor(events: IEvents){

}

setOrderField(field: keyof IOrder, value: string) {
  this.order[field] = value;

  if (this.validateOrder()) {
      this.events.emit('order:changed', this.order);
  }
}

validateOrder(): TFormErrors {
  const errors: typeof this.formErrors = {};
  if (!this.order.email) {
      errors.email = 'Необходимо указать email';
  }
  if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
  }
  this.formErrors = errors;
  this.events.emit('formErrors:change', this.formErrors);
  return errors
  // return Object.keys(errors).length === 0;
}



}