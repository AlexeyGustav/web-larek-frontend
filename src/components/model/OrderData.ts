import { IEvents } from "../base/events";



export interface IOrderData {
  // TODO написать методы, когда закончу с формами

}


export type TFormErrors = {
  email?: string;
  phone?: string;
  address?: string;
  paymend?: string;
}


export class OrderData implements IOrderData {
  order: {
    email: string,
    phone: string,
    address: string,
    paymend: string,
};

formErrors: TFormErrors = {};

constructor(protected events: IEvents) {

}

// setOrderField(field: keyof TFormErrors, value: string) {
//   this.order[field] = value;
//   this.events.emit('order:changed');

//   if (this.validateOrder()) {
//       this.events.emit('order:changed', this.order);
//   }
// }

  setOrderFirst(field: keyof TFormErrors, value: string) {
    this.order[field] = value;
    this.events.emit('order:changed');

    if (this.validateOrder()) {
      this.events.emit('order:changed', this.order);
    }
  }








validateOrder(): TFormErrors {
  const errors: typeof this.formErrors = {};
  // if (!this.order.email) {
  //     errors.email = 'Необходимо указать email';
  // }
  // if (!this.order.phone) {
  //     errors.phone = 'Необходимо указать телефон';
  // }
  if (!this.order.paymend) {
      errors.paymend = 'Необходимо указать вид оплаты';
  }
  if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
  }
  this.formErrors = errors;
  this.events.emit('order:changed', this.formErrors);
  return errors
  // return Object.keys(errors).length === 0;
}



}