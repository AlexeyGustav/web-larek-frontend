import { ICard } from "../../types/index";
import { IEvents } from "../base/events";

interface ICardsData {
	cards: ICard[];
	addCard(card: ICard): void;
	deleteCard(cardId: string): void;
	getCard(cardId: string): ICard;
    setSelected(item: string): void;
}
// export interface ICardData {
//     cards: ICard[];
//     getCard(cardId:string): ICard;
//     getSelected(): void;
//     setSelected(cardId:string): void;
// }
export class CardData implements ICardsData {
    protected _cards: ICard[];
    protected events: IEvents;
    protected _selectCardId: string | null;

    constructor(events: IEvents) {
        this.events = events;
    }
    
    set cards(cards:ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed')
    }

    get cards() {
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

    // Получить карточки Selected
    getSelected(): ICard {
        return this._cards.find(card => card.id === this._selectCardId)!;
    };

    // Передать карточки Selected
    // setSelected(cardId: string): void {
    //     this._selectCardId = cardId;
    // };

    setSelected(item: string): void {
        this._selectCardId = item;
        // this.emitChanges('preview:changed', item);
    }

}