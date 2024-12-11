import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '47496497-c7088e577ab65ea786e483a4c';

export async function fetchImages(query, page, perPage) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching images from API');
  }
}
