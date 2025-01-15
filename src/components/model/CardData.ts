import { ICard } from "../../types/index";
import { IEvents } from "../base/events";

interface ICardsData {
	cards: ICard[];
	addCard(card: ICard): void;
	deleteCard(cardId: string): void;
	getCard(cardId: string): ICard;
}

export class CardData implements ICardsData {
    protected _cards: ICard[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
    
    set cards(cards:ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed')
    }

    get cards () {
        return this._cards;
    }

    addCard(card: ICard) {
        this._cards = [card, ...this._cards]
        this.events.emit('cards:changed')
    }

    deleteCard(cardId: string) {
        this._cards = this._cards.filter(card => card.id !== cardId);

    }

    getCard(cardId: string) {
        return this._cards.find((item) => item.id === cardId)
    }

}