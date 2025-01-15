 import './scss/styles.scss';


import { CardData } from "./components/model/CardData";
import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { AuctionAPI } from "./components/model/ActionApi";
import { Card } from "./components/view/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard } from "./types/index";
import { CardsContainer } from "./components/view/CardsContainer";



import { mokData } from "./tempMokData";

// const api = new Api(API_URL)

// const apiData = api.get('/product/')
// console.log('api: ', apiData);
// apiData.then((data: unknown) => {console.log(data)})


// Отрисовка
// const container = document.querySelector(".gallery")


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Все экзампляры
const api = new AuctionAPI(CDN_URL, API_URL)
const events: IEvents = new EventEmitter();
const cardContainer = new CardsContainer(document.querySelector(".gallery"));

const cardData = new CardData(events)

// events.onAll((event) => {
//   console.log(event.eventName, event.data);
// })

// Получаем лоты с сервера
api.getLotList()
  .then((data) => {
    cardData.cards = data;
    events.emit("initialData:loaded");
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
// container.append(card.render())

// cardContainer.render(cardsData[0])

// card.setData(cardsData[0])
// card1.setData(cardsData[1])


// const cardArray = [];
// cardArray.push(card.render(), card1.render());


// cardContainer.render({ catalog: cardArray })

events.on("initialData:loaded", () => {
      const renderCards = cardData.cards.map(item => {
      const card = new Card(cardCatalogTemplate, events);
      card.setData(item);
      return card.render();
    })

    cardContainer.render({ catalog: renderCards });
})