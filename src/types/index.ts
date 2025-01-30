// export type LotStatus = 'wait' | 'active' | 'closed';


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
  cards: ICard[] | HTMLElement[];
  total: number;
  // addCard(card: ICard): void;
  // deleteCard(cardId: string): void;
  // getCard(cardId: string): ICard;
  // getBasketLength(): number;
  // getTotal(): number;
  // getIdBasketList(): string[];
  // contains(id: string): boolean;
  // clear(): void;

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
