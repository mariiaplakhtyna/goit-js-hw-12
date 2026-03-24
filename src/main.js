import './css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', async event => {
  event.preventDefault();

  searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) return;

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);

    if (data.hits.length === 0) {
      iziToast.warning({
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page >= totalPages) {
      hideLoadMoreBtn();

      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);

    createGallery(data.hits);

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page >= totalPages) {
      hideLoadMoreBtn();

      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    const cardHeight = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});