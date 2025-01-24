import './scss/styles.scss';


import { CardData } from "./components/model/CardData";
import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { AuctionAPI } from "./components/model/ActionApi";
import { Card, ModalCardPreview } from "./components/view/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard } from "./types/index";
import { CardsContainer } from "./components/view/CardsContainer";
import { Modal } from "./components/view/Modal";
import { Component } from "./components/base/Component";



import { mokData } from "./tempMokData";



// Отрисовка
// const container = document.querySelector(".gallery")


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const modalContent = ensureElement<HTMLDivElement>('.modal__content');
console.log('modalContainer: ', modalContent);

// Все экзампляры
const api = new AuctionAPI(CDN_URL, API_URL)
// const events: IEvents = new EventEmitter();
const events = new EventEmitter();
const cardContainer = new CardsContainer(document.querySelector(".gallery"));

const cardData = new CardData(events)


events.onAll((event) => {
  console.log(event.eventName, event.data)
})

// Получаем лоты с сервера
api.getLotList()
  .then((data) => {
    cardData.cards = data;
    events.emit("initialData:loaded");
  })
  .catch(err => {
    console.error(err);
});

events.on("initialData:loaded", () => {
      const renderCards = cardData.cards.map((item) => {
      const card = new Card(cloneTemplate(cardCatalogTemplate), events,
      {onClick: () => events.emit('card:select', item)}
    );

      // card.title = item.title;
      // card.category = item.category;
      // card.price= item.price;
      // card.image = item.image;
      // card.setData(item);
      return card.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price
      });
    })

    cardContainer.render({ catalog: renderCards });
});





// Открыть модальное окно с карточкой товара

const modal = new Modal(modalContainer, events);

// events.on('cardPreview:open',  () => {
//   const modalCardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

//   modal.open();

//  const modalContainer = document.querySelector(".modal__container")

//  modalContainer.append(
//     modalCardPreview.render({
//                description: "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
//       image: "https://larek-api.nomoreparties.co/content/weblarek/Shell.svg",
//       title: "HEX-леденец",
//       category: "другое",
//       price: 1450
//     })
//   )

// });


// events.on('card:select', (data: { cardId: string }) => {
//   const modalCardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

//   const selectCard = cardData.getCard(data.cardId)
// console.log(selectCard);


// modal.render({
//   content: modalCardPreview.render({
//     ...selectCard
//   })
// });


 
// });

const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events, {}); 

events.on('card:select', (item: ICard) => {
  modalCardPreview.setPreview(item);
  console.log("007", item);
});