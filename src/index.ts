import './scss/styles.scss';

import { Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, settings } from "./utils/constants";
import { CoursesApi } from "./components/model/CoursesApi";
import { CardsData } from "./components/model/cardData";
import { Component, Card } from "./components/view/Card";
import { Page } from './components/view/Page';
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard, ICoursesApi } from "./types/index";
import { Modal } from "./components/view/Modal";



import { cardsData } from "./tempMokData";





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

// брокер событий
const events = new EventEmitter();
// Экземпляры классов
const baseApi: ICoursesApi = new Api(API_URL, settings);
const api = new CoursesApi(baseApi);
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

  // Модальное окно Preview
events.on('modalView:open', (data: { cardId: string }) => {
  const cardBasket = basketData.contains(data.cardId) // возвращает true или false
  const selectCard = cardData.getCard(data.cardId)
  const cardPreview = new Card(cardPreviewTemplate, events)

  cardData.setSelected(data.cardId);

  if (!cardBasket) {
      cardPreview.replaceTextBtn(false);
  } else {
      cardPreview.replaceTextBtn(true);
  }

  modal.render({
      modalContent: cardPreview.render({
          ...selectCard
      })
  });

  modal.openModal()
});




// Корзина
events.on('basket:open', () => {
  modal.render({
      modalContent: basket.render({
          total: basketData.getTotal(),
          items: basketData.getBasketList().map((item) => {
              const cardBasket = new Card(cardBasketTemplate, events);

              return cardBasket.render({
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  index: item.index
              })
          })
      })
  });

  modal.openModal();
});




// Фиксация модального окна
events.on('modal:open', () => {
  page.blockPageScroll(true)
})

events.on('modal:close', () => {
  page.blockPageScroll(false)
})

