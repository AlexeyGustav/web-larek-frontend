import './scss/styles.scss';


import { CardData } from "./components/model/CardData";
import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { CoursesAPI } from "./components/model/ActionApi";
import { Card, ModalCardPreview, ModalCardBasket } from "./components/view/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard, IBasketData } from "./types/index";
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
  
    });

    cardContainer.render({ catalog: renderCards });
  })
  .catch(err => {
    console.error(err);
});


// Открыть модальное окно с карточкой товара
events.on('card:select', (item: ICard) => {
  const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events, { onClick: () => events.emit('modalCard:changed', item) });

  modal.render({
    content: modalCardPreview.render(
      item
    )
  });

  modalCardPreview.getDisabled(item)

});

events.on('modalCard:changed', (item: ICard) => {
  const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events)


  const selectCard = cardData.getCard(item.id);
  const cardBasket = basketData.contains(item.id)
  console.log('cardBasket: ', cardBasket);

  if (!cardBasket) {
    basketData.addCard(selectCard)
    modalCardPreview.replaceTextBtn(true);
    console.log("ADDCard!!!!!!!!!!!!!!!!!!!", );
  } else {
    console.log("deleteCard!!!!!!!!!!!!!!!!!!!", );
    basketData.deleteCard(item.id)
    modalCardPreview.replaceTextBtn(false);
  }

  page.render({
    counter: basketData.getBasketLength()
  })

  // modal.render({
  //   content: modalCardPreview.render(
  //     item
  //   )
  // });

});





// Корзина
// Изменения в корзине
events.on('basket:changed', () => {
  const itemsContent = basketData.cards.map((card, index) => {
    console.log(`Rendering card ${index}:`, card);
    const cardBasket = new ModalCardBasket(cloneTemplate(cardBasketTemplate), events, { onClick: () => events.emit('delete:card', card) });
    console.log('cardBasket: ', cardBasket);
    return cardBasket.render({
      id: card.id,
      title: card.title,
      price: card.price,
        // basketIndex: index + 1,
    });
  })
  console.log("Items Content:", itemsContent);

  // modal.render({
  //   content: basketView.render({
  //     items: itemsContent,
  //     totalPrice: basketData.total,
  //   })
  // })

})


// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basketView.render()
  })

  // console.log("ВНИМАТЕЛЬНО", basketData);
  // const itemsContent = basketData.cards.map((card, index) => {
  //   console.log(`Rendering card ${index}:`, card);
  //   const cardBasket = new ModalCardBasket(cloneTemplate(cardBasketTemplate), events);
  //   console.log('cardBasket: ', cardBasket);
  //   return cardBasket.render({
  //     id: card.id,
  //     title: card.title,
  //     price: card.price,
  //       // basketIndex: index + 1,
  //   });
  // })
  // console.log("Items Content:", itemsContent);

  // modal.render({
  //   content: basketView.render({
  //     items: itemsContent,
  //     totalPrice: basketData.total,
  //   })
  // })
});

// Удалить товар из корзины
events.on('delete:card', (item: ICard) => {
  basketData.deleteCard(item.id)

  page.render({
    counter: basketData.getBasketLength()
  })
});




// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

