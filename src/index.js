import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchCard } from './js/pixabay';
import { refs } from './js/refs';
import { createMarkup } from './js/createMarkup';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMore);
refs.loadMore.style.display = 'none';

const simplelightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuery = '';
let scrollDistance = 0;

async function onFormSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  try {
    const formElement = e.currentTarget.elements;
    searchQuery = formElement.searchQuery.value.trim();

    if (!searchQuery.length) {
      refs.loadMore.classList.add('visually-hidden');
      refs.loadMore.style.display = 'none';
      Notify.warning('Please fill out the search field!');
      return;
    }
    page = 1;
    const { hits, totalHits } = await fetchCard(searchQuery, page);

    if (hits.length === 0) {
      refs.gallery.innerHTML = '';
      refs.loadMore.classList.add('visually-hidden');
      refs.loadMore.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    createMarkup(hits);
    Notify.success(`Hooray! We found ${totalHits} images`);
      simplelightbox.refresh();
      
  } catch {}
}
