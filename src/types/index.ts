import { IEvents } from "../components/base/events"

export type ApiMethods = 'POST' | 'PUT' | 'DELETE';

export type TDataOrder = Partial<IInfoOrder & IBasketData>;

export type TBingo = Pick<IBasket, 'total'>;

export type ApiListResponse = {
  items: ICard[];
  total: number;
};

export interface IModal {
  modalContent: HTMLElement;
}

export interface ICoursesApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiMethods):Promise<T>;
}

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image: string;
  category: string;
  index?: number;
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

export interface IInfoOrder {                 
  payment: string;                     
  address: string;
  phone: string;
  email: string;                        
}

export interface IForm extends IInfoOrder {
  valid: boolean;
  error: string;
}

export interface IBasketData {
  cardsBasket: ICard[];
  getTotal(): number;
  add(card: ICard): void;
  contains(id: string): boolean;
  getBasketList(): void;
  remove(id: string): void;
  getIdBasketList(): string[];
  getBasketLength():number;
  clear(): void;
}