import './scss/styles.scss';


import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL } from "./utils/constants";
import { AuctionAPI } from "./components/model/ActionApi";
import { Card } from "./components/view/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard } from "./types/index";



import { cardsData } from "./tempMokData";

// const api = new Api(API_URL)
const api = new AuctionAPI(CDN_URL, API_URL)

// const apiData = api.get('/product/')
// console.log('api: ', apiData);
// apiData.then((data: unknown) => {console.log(data)})

const events: IEvents = new EventEmitter();

// Отрисовка
const container = document.querySelector(".gallery")


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// events.onAll((event) => {
//   console.log(event.eventName, event.data);
// })

// Получаем лоты с сервера
api.getLotList()
  .then((data) => {console.log("data", data)})
  .catch(err => {
    console.error(err);
});




const card = new Card(cardCatalogTemplate, events)
card.setData(cardsData[2])

container.append(card.render())