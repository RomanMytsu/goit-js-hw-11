import axios from 'axios';

const API_KEY = '39956230-b6ed4b572e8f9767a784696ef';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchCard(query, page) {
  const params = new URLSearchParams({
    keys: API_KEY,
    q: query,
    image_type: photo,
    orientation: horizontal,
    safesearch: true,
    per_page: 40,
    page,
  });
  const resp = await axios.get(`${BASE_URL}?${params}`);
  return resp.data;
}
