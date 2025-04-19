//У файлі main.js напиши всю логіку роботи додатка. Виклики нотифікацій iziToast, усі перевірки на довжину масиву в отриманій відповіді та логіку прокручування сторінки (scroll) робимо саме в цьому файлі. Імпортуй в нього функції із файлів pixabay-api.js та render-functions.js та викликай їх у відповідний момент.

import { getImagesByQuery } from './js/pixabay-api';
import {
  clearGallery,
  createGallery,
  hideLoader,
  hideLoadMoreButton,
  showLoader,
  showLoadMoreButton,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');
let inputValue = null;
let page = null;

form.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  inputValue = form.elements['search-text'].value;
  clearGallery();
  if (inputValue === '') {
    iziToast.error({
      message: 'Please enter a search inputValue!',
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }
  showLoader();
  const data = getImagesByQuery(inputValue, page);
  // const totalPages = await countTotalPages(data);
  // console.log('total pages', totalPages);
  // if (page === totalPages) {
  //   hideLoadMoreButton();
  // }
  // console.log('DATA', await data);
  data
    .then(response => {
      // console.log('response!!!', response);
      if (response.data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search inputValue. Please try again!',
          position: 'topRight',
          timeout: 2000,
        });
        return;
      }
      // console.log('response_main', response);
      createGallery(response);
      showLoadMoreButton();
    })
    .catch(() => {
      iziToast.error({
        message: 'Error fetching data from Pixabay',
        position: 'topCenter',
        timeout: 3000,
      });
    })
    .finally(() => {
      hideLoader();
    });
  form.reset();
  
});

loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onLoadMoreBtnClick() {
  page += 1;
  // console.log('click');
  const galery_item = document.querySelector('.gallery-item');
  const galery_item_height = galery_item.getBoundingClientRect().height;
  // console.log('galery_item_height', galery_item_height);
  
  // Перемещаем loader-wraper после галереи
  const loaderWrapper = document.querySelector('.loader-wraper');
  const gallery = document.querySelector('.gallery');
  gallery.insertAdjacentElement('afterend', loaderWrapper);

  showLoader();
  try {
    const data = await getImagesByQuery(inputValue, page);
    createGallery(data);

    requestAnimationFrame(() => {
      const galery_item = document.querySelector('.gallery-item');
      const galery_item_height = galery_item.getBoundingClientRect().height;

      window.scrollBy({
        left: 0,
        top: galery_item_height * 2,
        behavior: 'smooth',
      });
    });
    
  } catch (error) {
    iziToast.error({
      message: 'Error fetching data from Pixabay',
      position: 'topCenter',
      timeout: 3000,
    });
  } finally {
    hideLoader();
   
  }
}