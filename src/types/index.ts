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

export interface IForm extends IInfoOrder {
  valid: boolean;
  error: string;
}

export interface IInfoOrder {                 
  payment: string;                     
  address: string;
  phone: string;
  email: string;                        
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

export type TBasket = Pick<ICard & {index: number}, 'index'|'id'|'price'|'title'>;