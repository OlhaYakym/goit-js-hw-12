import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMore = document.querySelector('.load-more');

// 💡 Инициализация lightbox ДО createGallery
const lightbox = new SimpleLightbox('.gallery a', {});

export async function createGallery(imagesPromise) {
  try {
    const items = await imagesPromise;

    const markup = items.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<li class="gallery-item">
                  <a href="${largeImageURL}">
                    <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
                    <div class='item-footer'>
                      <p><b>likes</b> ${likes}</p>
                      <p><b>views</b> ${views}</p>
                      <p><b>comments</b> ${comments}</p>
                      <p><b>downloads</b> ${downloads}</p>
                    </div>
                  </a>
                </li>`;
        }
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', markup);

    // Обновление lightbox после вставки разметки
    lightbox.refresh();

    if (items.page === items.totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 2000,
      });
    }
  } catch (error) {
    console.error('Error creating gallery:', error);
    iziToast.error({
      message: 'Something went wrong while creating the gallery.',
      position: 'topRight',
      timeout: 3000,
    });
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('hidden-loader');
}
export function hideLoader() {
  loader.classList.add('hidden-loader');
}
export function showLoadMoreButton() {
  loadMore.classList.remove('load-more-hidden');
}
export function hideLoadMoreButton() {
  loadMore.classList.add('load-more-hidden');
}
