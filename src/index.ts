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
import { Modal } from "./components/view/Modal";



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
const page = new Page(pageContainer, events);
const modal = new Modal(modalContainer, events);

const cardItems = new CardsData(events) 


// Получаем карточки с сервера
events.onAll((event) => {
  console.log(event.eventName, event.data);
});

// Получаем карточки с сервера и загружаем в галерею
api.getListCards()
  .then((items) => {
      cardData.cards = items

      page.render({
          gallery: cardData.cards.map(item => {
              const card = new Card(cardCatalogTemplate, events);
              return card.render({
                  ...item
              })
          })
      })
  }).catch(console.error)

// Фиксация модального окна
events.on('modal:open', () => {
  page.blockPageScroll(true)
})

events.on('modal:close', () => {
  page.blockPageScroll(false)
})