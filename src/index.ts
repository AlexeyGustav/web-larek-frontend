import './scss/styles.scss';


import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { API_URL, CDN_URL } from "./utils/constants";
import { AuctionAPI } from "./components/model/ActionApi";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";

// const api = new Api(API_URL)
const api = new AuctionAPI(CDN_URL, API_URL)

// const apiData = api.get('/product/')
// console.log('api: ', apiData);
// apiData.then((data: unknown) => {console.log(data)})

// Отрисока
const container = document.querySelector(".gallery")


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


// Получаем лоты с сервера
api.getLotList()
  .then((data) => {console.log("data", data)})
  .catch(err => {
    console.error(err);
});


class Card {
  protected itemElement: HTMLElement;
  // protected _description?: HTMLElement;
  // protected _title: HTMLElement;
  // protected  _id: HTMLElement;
  // protected _image?: HTMLImageElement;
  // protected _button?: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    this.itemElement = template.content.firstElementChild.cloneNode(true) as HTMLElement;

  }

  render() {
    return this.itemElement
  }
}

const item = new Card(cardCatalogTemplate);
const renderItem = item.render()
container.append(renderItem)
