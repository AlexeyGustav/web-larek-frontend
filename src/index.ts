import './scss/styles.scss';


import { CardData } from "./components/model/CardData";
import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { CoursesAPI } from "./components/model/ActionApi";
import { Card, ModalCardPreview, ModalCardBasket } from "./components/view/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard } from "./types/index";
import { CardsContainer } from "./components/view/CardsContainer";
import { Modal } from "./components/view/Modal";
import { Page } from "./components/view/Page";
import { BasketData } from "./components/model/BasketData";
import { Basket } from "./components/view/Basket";


import { mokData } from "./tempMokData";


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const modalContent = ensureElement<HTMLDivElement>('.modal__content');

// Контейнер
const pageContainer = ensureElement<HTMLElement>('.page');

// Все экзампляры
const api = new CoursesAPI(CDN_URL, API_URL)
// const events: IEvents = new EventEmitter();
const events = new EventEmitter();
const cardContainer = new CardsContainer(document.querySelector(".gallery"));
const cardData = new CardData(events);

const basketData = new BasketData(events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const basketCard = new ModalCardBasket(cloneTemplate(cardBasketTemplate), events)



const modal = new Modal(modalContainer, events);
const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events); 

const page = new Page(pageContainer, events)


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
      { onClick: () => events.emit('card:select', item) }
    );

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
events.on('card:select', (item: ICard) => {

  events.on('modalCard:changed', () => {
    const cardBasket = basketData.contains(item.id);

    if (!cardBasket) {
      basketData.addCard(item)
    }

    modal.close()
  });

  modal.render({
    content: modalCardPreview.render(
      item
    )
  });

  modalCardPreview.getDisabled(item)
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});








basketData.addCard(mokData[0])
basketData.addCard(mokData[1])
basketData.addCard(mokData[3])
// console.log('basketData: ', basketData);
// basketData.deleteCard(mokData[0].id)
// console.log('basketData: ', basketData.getBasketLength());
// console.log('getIdBasketList: ', basketData.getIdBasketList());
// console.log('getIdBasketList: ', basketData.contains("854cef69-976d-4c2a-a18c-2aa45046c390"));
// console.log(basketData.getCard("854cef69-976d-4c2a-a18c-2aa45046c390"));
// console.log('basketData: ', basketData.clear());
// console.log('getTotal: ', basketData.getTotal());
// console.log('11111111111: ', basketView);



// Корзина



// Изменения в корзине
events.on('basket:changed', () => {

  basketView.render({
    items: basketData.getIdBasketList().map((card) => {
      return basketCard.render(card)
    }),
    totalPrice: basketData.getTotal()
  })

  page.render({
    counter: basketData.getBasketLength()
  })
})



// Открыть корзину
events.on('basket:open', () => {
  

  modal.render({

    content:  basketView.render()
    // content: basketView.render({
    //   items: basketData.getIdBasketList().map((card) => {
    //     return basketCard.render(card)
    //   }),
    //   total: basketData.getTotal()
    // })

  })
});