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

// const apiData = api.get('/product/')
// console.log('api: ', apiData);
// apiData.then((data: unknown) => {console.log(data)})


// Отрисовка
const container = document.querySelector(".gallery")


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const api = new AuctionAPI(CDN_URL, API_URL)
const events: IEvents = new EventEmitter();
const card = new Card(cardCatalogTemplate, events);


// events.onAll((event) => {
//   console.log(event.eventName, event.data);
// })

// Получаем лоты с сервера
api.getLotList()
  .then((data) => {
    console.log("data", data);
    

    
    // data.forEach(cards => {
    //   let arrayCards = [cards]
    //   console.log('arrayCards: ', arrayCards);
    //   card.setData(cards);

    //   container.append(card.render())
    // });




  })
  .catch(err => {
    console.error(err);
});




// cardsData.forEach(cards => {
  
//   card.setData(cards);
//   const cardsList = card.render();
//   console.log('cardsList: ', cardsList);
//   container.append(cardsList)
// });
container.append(card.render())