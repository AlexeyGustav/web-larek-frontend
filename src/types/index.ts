// Pick даёт возможность выбрать из большого объекта только нужные поля, а не все
// Partial делает все поля в объекте необязательными
export interface ICoursesAPI {
  cdn: string;
  getLotList: () => Promise<ICard[]>;
}

export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
}; 

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string;
}

export interface ICardsData {
  cards: ICard[];
  getCard(cardId: string): ICard;
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

export interface IBasket {
  items: HTMLElement[];
  totalPrice: number;
}

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export interface IOrderPay  {
  paymend: string;
  adress: string;
}

export interface IContacts {
  email: string;
  phone: string;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IOrderDataAll {
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

export interface IOrderData {
  setOrder(field: keyof TFormErrors, value: string): void;
  updatePaymentMethod(method: string): void;
  validateOrder(): boolean;
}

export interface ITotalData extends IOrderDataAll {
  cards: ICard[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}