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
// import { ModalCardPreview } from "./components/view/CardPreview";



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
      const card = new Card(cloneTemplate(cardCatalogTemplate), events);
      card.setData(item);
      return card.render();
    })

    cardContainer.render({ catalog: renderCards });
});

const modal = new Modal(modalContainer, events);
console.log('modal: ', modal);

const modalCardPreview = new ModalCardPreview(modalContainer, cardPreviewTemplate, events);

events.on('cardPreview:open', () => {
  // const a = modalCardPreview.setData(mokData[1])
	// modalCardPreview.render();
  modal.open();
  // modalContent.append(modalCardPreview.render())
  // console.log('modalCardPreview: ', modalCardPreview.render());



console.log('modalCardPreview: ', modalCardPreview.render());
  
modal.render({data: modalCardPreview.render()})
})