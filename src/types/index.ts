// Pick даёт возможность выбрать из большого объекта только нужные поля, а не все
// Partial делает все поля в объекте необязательными

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string;
}

export interface IModalData {
  content: HTMLElement | HTMLElement[];
}

export interface ICardsContainer {
  catalog: HTMLElement[] | HTMLElement;
}

export interface IBasketData {
  cards: ICard[] | ICard;
  total: number;
  addCard(card: ICard): void;
  deleteCard(cardId: string): void;
  getBasketLength(): number;
  getTotal(): number;
  contains(id: string): boolean;
  clear(): void;
}

export type CardInfo = Pick<ICard & {index: number}, 'index'|'id'|'price'|'title'>;

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export interface IForm {
  valid: boolean;
  errors: string[];
}

export interface IOrderPay extends IForm {
  paymend: string;
  adress: string;
}

export interface IContacts extends IForm {
  email: string;
  telephone: string;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}









// export interface IDataCard {
//   items: ICard[];
//   previewCard: ICard;
//   selectСard(item: ICard): void;
// }

// export type TCard = Pick<ICard, "id" | "price">

export interface IBasketOrdered {
  items: string[];
  email: string;
  payment: string;
  address: string;
  phone: string;
  total: number;
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
