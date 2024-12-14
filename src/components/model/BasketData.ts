import { IEvents } from "../base/events";
import { IBasketData, ICard, TBasket } from "../../types/index";


export class BasketData implements IBasketData {
    protected _cardsBasket: ICard[] = [];
    protected _total: number;


    constructor(protected events: IEvents) {

    }

    get cardsBasket() {
        return this._cardsBasket;
    }

    contains(id: string): boolean {
        return this._cardsBasket.some(item => item.id === id);
    };

    // Получить ID товара
    getIdBasketList(): string[] {
        return this._cardsBasket.map(card => card.id);
    };

    // Получить длинну массива товаров
    getBasketLength(): number {
        return this._cardsBasket.length ?? 0;
    };

    // Получение товаров в корзине и добавление индекса
    getBasketList(): TBasket[] {
        return this._cardsBasket.map((item, index) => {
            return {
                id: item.id,
                title: item.title,
                price: item.price,
                index: index + 1
            }
        })
    };

    // Добавить товар в корзину 
    add(card: ICard): void {
        if (!this.contains(card.id)) {
            this._cardsBasket.push(card);   // возвращает новую длину массива
            this.events.emit('basket:changed');
        }
    };

    // Удаляем карточку из корзины
    remove(id: string): void {
        if (this.contains(id)) {
            this._cardsBasket = this._cardsBasket.filter(item => item.id !== id);
            this.events.emit('basket:changed');
        }
    };

    // Общая сумма в корзине
    getTotal(): number {
        if (!this._cardsBasket.length) {
            return 0;
        } else {
            return this._cardsBasket.map((item) => item.price).reduce((a, b) => a + b);
        };
    };

    clear(): void {
        this._cardsBasket = [];
        this.events.emit('basket:changed');
    };

};