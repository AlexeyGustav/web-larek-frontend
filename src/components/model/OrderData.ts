import { IInfoOrder, IOrderData, TErrorOrder } from "../../types";
import { IEvents } from "../base/events";

export class OrderData implements IOrderData {
    protected _order: IInfoOrder = {
        payment: '',
        email: '',
        address: '',
        phone: ''
    };


    constructor(protected events: IEvents) {

    }

    // Запись в поля формы
    setField(field: keyof IInfoOrder, value: string) {
        this._order[field] = value;
        this.events.emit('order:changed');
    };

    // Значение заказа
    getOrder() {
        const order = {
            ...this._order
        }
        return Object.freeze(order);
    };

};