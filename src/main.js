import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createGalleryMarkup } from './js/render-functions';
import { fetchImages } from './js/pixabay-api';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');

function showLoader() {
  loader.style.display = 'block';
}
function hideLoader() {
  loader.style.display = 'none';
}
clearGallery();
showLoader();

function clearGallery() {
  gallery.innerHTML = '';
}

searchForm.addEventListener('submit', handlesForm);

function handlesForm(event) {
  event.preventDefault();

  const query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Empty Field',
      message: 'Please enter a search query.',
    });
    return;
  }

  fetchImages(query).then(images => {
    hideLoader();
    if (images.length > 0) {
      gallery.innerHTML = createGalleryMarkup(images);
      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    }
    searchForm.reset();
  });
}
