import { IEvents } from "../components/base/events"

export type LotStatus = 'wait' | 'active' | 'closed';

export interface IModal {
  modalContent: HTMLElement;
}

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image: string;
  category: string;
}

export interface IDataCard {
  cards: ICard[];
  preview: string | null;
  selectСard?(item: ICard): void;
}

// export type TCard = Pick<ICard, "id" | "price">

export interface IBasketOrdered {
  items: string[];
  email: string;
  payment: string;
  address: string;
  phone: string;
  total: number;
}

export interface IBasket {
  productsList: ICard[];
  payment: string;
  getSumProductsList: () => number;
  setToSelectСard(data: ICard): void;
  getToCounterCards: () => number;
  delToSelectСard(item: ICard): void;
  clearBasket(): void
}

export interface IOrder {
  _id: string;
  total: number;
}

export interface IForm {
  address: string;
  telephone: string;
  email: string;
  payment: string;
  total: number;
  items: string[];
  toCheckValidateBasket(): boolean;
  toCheckValidateUser(): boolean;
}

export interface IOrder extends IForm {
  error: string;
}

export interface IPage {
  gallery: HTMLElement[];
  counterBasket: number;
}