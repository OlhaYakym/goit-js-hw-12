import axios from 'axios';
const PIXABAY_API_KEY = '49764635-55321af1e157f58385cb56e9b';
const PIXABAY_API_URL = 'https://pixabay.com/api/';
const PIXABAY_PARAMS = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 15,
};

export async function getImagesByQuery(query, page) {
  try {
    const response = await axios.get(`${PIXABAY_API_URL}`, {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        image_type: PIXABAY_PARAMS.image_type,
        orientation: PIXABAY_PARAMS.orientation,
        safesearch: PIXABAY_PARAMS.safesearch,
        page: page,
        per_page: PIXABAY_PARAMS.per_page,
      },
    });

    return {
      data: response.data,
      hits: response.data.hits,
      totalPages: countTotalPagesTest(response),
      page: response.config.params.page,
    };
  } catch (error) {
    console.error('Error fetching data from Pixabay:', error);
  } finally {
  }
}

function countTotalPagesTest(data) {
  const totalPages = Math.ceil(
    data.data.totalHits / data.config.params.per_page
  );
  return totalPages;
}
