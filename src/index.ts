import './scss/styles.scss';

import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL } from "./utils/constants";
import { AuctionAPI } from "./components/model/ActionApi";
import { CardsData } from "./components/model/cardData";
import { Component, Card } from "./components/view/Card";
import { Page } from './components/view/Page';
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard, IDataCard } from "./types/index";



import { cardsData } from "./tempMokData";

const api = new AuctionAPI(CDN_URL, API_URL)

// const api = new Api(API_URL)
// const apiData = api.get('/product/')
// console.log('api: ', apiData);
// apiData.then((data: unknown) => {console.log(data)})

// брокер событий
const events: IEvents = new EventEmitter();

// Контейнеры
const pageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLElement>('#modal-container');


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Экземпляры классов
const page = new Page(pageContainer, events)





// показать карточку товара на странице

// const card = new Card(cardCatalogTemplate, events)
// console.log('card: ', card);

// card.setData(cardsData[2])
// container.append(card.render())

// // показать карточку товара на странице
// const itemTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement

// const card1 = new Card(cloneTemplate(itemTemplate), events)
// console.log('card1: ', card1);
//  // изменяет текст
// card1.name = `100000000`
// // частично меняем поля
// const obj1 = {
//   title: "+7 к мане",
//   price: 5,
//   description: "описание +10 к мане за респект",
// }
// container.append(card1.render(obj1))



// проверка экземпляра класса Card

// const cardItems = new CardsData(events) 
// cardItems.cards = cardsData;
// console.log('list2', cardItems.getCard("854cef69-976d-4c2a-a18c-2aa45046c390"));
// cardItems.deleteCard("854cef69-976d-4c2a-a18c-2aa45046c390");
// console.log("deleteCard", cardItems);
// const getCards = cardItems.cards
// console.log('getCards: ', getCards);
// set
// cardItems.preview = "854cef69-976d-4c2a-a18c-2aa45046c390";
// get
// console.log('previewCard: ', cardItems.preview);


const cardItems = new CardsData(events) 


// Получаем карточки с сервера
api.getLotList()
  .then((data) => {
    cardItems.cards = data;

    page.render({
      gallery: cardItems.cards.map(item => {
        const card = new Card(cardCatalogTemplate, events);
        return card.render({
            ...item
        })
    })
    })
  })
  .catch(err => {
    console.error(err);
});


