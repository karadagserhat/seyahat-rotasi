import { API_URL, RES_PER_PAGE } from '../config';
import { getJSON } from '../helpers/getJSON';

export const state = {
  location: {},
  search: {
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadLocation = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { location } = data.data;

    state.location = {
      id: location._id,
      address: location.address,
      cityName: location.cityName,
      coordinates: location.coordinates,
      detailsUrl: location.details_url,
      description: location.locDescription,
      name: location.name,
      image: location.images[0],
    };

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) state.location.bookmarked = true;
    else state.location.bookmarked = false;
  } catch (error) {
    // console.error(`${error} 🧨🧨🧨`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    query = query.toLocaleLowerCase('tr-TR');

    const data = await getJSON(`${API_URL}?cityName=${query}`);

    state.search.results = data.data.location.map((location) => {
      return {
        id: location._id,
        cityName: location.cityName,
        name: location.name,
        image: location.images[0],
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

export const addBookmark = function (location) {
  // Add bookmark
  state.bookmarks.push(location);

  // Mark current location as bookmarked
  if (location.id === state.location.id) state.location.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current location as NOT bookmarked
  if (id === state.location.id) state.location.bookmarked = false;

  persistBookmarks();
};

// export function initializingMap() {
//   // call this method before you initialize your map.
//   const container = L.DomUtil.get('map');
//   if (container != null) {
//     container._leaflet_id = null;
//   }
// }

export const mapLocation = function () {
  const map = L.map('map', { dragging: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 14,
    maxZoom: 14,
  }).addTo(map);

  const points = [];
  points.push([state.location.coordinates[1], state.location.coordinates[0]]);

  L.marker([state.location.coordinates[1], state.location.coordinates[0]])
    .addTo(map)
    .bindPopup(state.location.name, {
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
