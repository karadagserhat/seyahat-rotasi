import { API_URL, RES_PER_PAGE } from '../config';
import { getJSON } from '../helpers/getJSON';

export const state = {
  tour: {},
  search: {
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadTour = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { tour } = data.data;

    state.tour = {
      id: tour._id,
      address: tour.address,
      cityName: tour.cityName,
      coordinates: tour.coordinates,
      detailsUrl: tour.details_url,
      description: tour.locDescription,
      name: tour.name,
      image: tour.images[0],
    };

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) state.tour.bookmarked = true;
    else state.tour.bookmarked = false;
  } catch (error) {
    // console.error(`${error} 🧨🧨🧨`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    query = query.trim().toLocaleLowerCase('tr-TR');

    const data = await getJSON(`${API_URL}?cityName=${query}`);

    state.search.results = data.data.tour.map((tour) => {
      return {
        id: tour._id,
        cityName: tour.cityName,
        name: tour.name,
        image: tour.images[0],
      };
    });
  } catch (error) {
    // console.error(`${error} 🧨🧨🧨`);
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (tour) {
  // Add bookmark
  state.bookmarks.push(tour);

  // Mark current tour as bookmarked
  if (tour.id === state.tour.id) state.tour.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current tour as NOT bookmarked
  if (id === state.tour.id) state.tour.bookmarked = false;

  persistBookmarks();
};

// export function initializingMap() {
//   // call this method before you initialize your map.
//   const container = L.DomUtil.get('map');
//   if (container != null) {
//     container._leaflet_id = null;
//   }
// }

export const mapTour = function () {
  const map = L.map('map', { dragging: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 14,
    maxZoom: 14,
  }).addTo(map);

  const points = [];
  points.push([state.tour.coordinates[1], state.tour.coordinates[0]]);

  L.marker([state.tour.coordinates[1], state.tour.coordinates[0]])
    .addTo(map)
    .bindPopup(state.tour.name, {
      className: 'custom-popup',
      autoClose: false,
      closeOnClick: false,
    })
    .openPopup();

  const bounds = L.latLngBounds(points).pad(0.1);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
