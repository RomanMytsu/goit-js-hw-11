import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchCard } from './js/pixabay-api';
import { refs } from './js/refs';
import { createMarkup } from './js/createMarkup';

const { searchForm, gallery, button } = refs;

let searchValue = '';
let page = 1;
let lightbox = {};

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handlerObserver, options);
const target = document.querySelector('#target');

searchForm.addEventListener('submit', handlerSubmit);

async function handlerSubmit(e) {
  e.preventDefault();
  searchValue = e.currentTarget.elements.searchQuery.value;
  page = 1;
  if (searchValue.trim() === '') {
    Notiflix.Notify.info('Enter text');
    return;
  }
  try {
    const cardData = await fetchCard(searchValue, page);
    if (cardData.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
      return;
    }
    gallery.innerHTML = createMarkup(cardData.hits);
    Notiflix.Notify.info(`Hooray! We found ${cardData.totalHits} images.`);
    observer.observe(target);
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

async function handlerObserver(entries, observer) {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) {
      return;
    }
    page += 1;
    try {
      const cardData = await fetchCard(searchValue, page);
      gallery.insertAdjacentHTML('beforeend', createMarkup(cardData.hits));
      if (page * cardData.hits.length >= cardData.totalHits) {
        observer.unobserve(target);
      }
    } catch {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    lightbox.refresh();
  });
}
