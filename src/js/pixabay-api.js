import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '47496497-c7088e577ab65ea786e483a4c';

iziToast.settings({
  timeout: 1000,
  color: '#EF4040',
  position: 'topRight',
  titleColor: '#fff',
  messageColor: '#fff',
  imageWidth: 24,
  iconColor: '#fff',
});

export function fetchImages(query) {
  const searchParams = new URLSearchParams({
    key: `${API_KEY}`,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const url = `${BASE_URL}?${searchParams}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Host: 'http://localhost:5173',
      Origin: 'https://pixabay.com/api',
    },
  };

  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.info({
          title: 'No Results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        return [];
      }
      return data.hits;
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
      });
      return [];
    });
}
