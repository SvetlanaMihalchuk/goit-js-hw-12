import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './js/pixabay-api';
import { createGalleryMarkup } from './js/render-functions';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');
const loadMoreBtn = document.getElementById('load-more');

let query = '';
let page = 1;
const perPage = 15;

iziToast.settings({
  timeout: 1000,
  color: '#EF4040',
  position: 'topRight',
  titleColor: '#fff',
  messageColor: '#fff',
  imageWidth: 24,
  iconColor: '#fff',
});

const lightbox = new SimpleLightbox('.gallery a');

function showLoader() {
  loader.style.display = 'block';
}
function hideLoader() {
  loader.style.display = 'none';
}
function clearGallery() {
  gallery.innerHTML = '';
}
function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}
function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}
hideLoadMoreBtn();
searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Empty Field',
      message: 'Please enter a search query.',
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const { hits, totalHits } = await fetchImages(query, page, perPage);
    hideLoader();

    if (hits.length > 0) {
      gallery.innerHTML = createGalleryMarkup(hits);
      lightbox.refresh();
      if (totalHits > perPage) {
        showLoadMoreBtn();
      }
    } else {
      iziToast.info({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query.',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }

  searchForm.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const { hits, totalHits } = await fetchImages(query, page, perPage);
    hideLoader();

    if (hits.length > 0) {
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
      lightbox.refresh();

      const loadedImages = page * perPage;
      if (loadedImages >= totalHits) {
        hideLoadMoreBtn();
        iziToast.info({
          title: 'End of Results',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }

      // Scroll page
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }
});
