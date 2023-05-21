import * as model from '../models/model';
import tourView from '../views/tourView';
import searchView from '../views/searchView';
import resultsView from '../views/resultsView';
import paginationView from '../views/paginationView';
import bookmarksView from '../views/bookmarksView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlTours = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    tourView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading tour
    await model.loadTour(id);

    // 3) Rendering tour
    tourView.render(model.state.tour);

    model.mapTour();
  } catch (error) {
    tourView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage(1));

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(
      'İşlem çok uzun sürdü. İnternet bağlantısında sorun olabilir. Lütfen tekrar deneyiniz!'
    );
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // 1) Add / Remove bookmark
  if (!model.state.tour.bookmarked) model.addBookmark(model.state.tour);
  else model.deleteBookmark(model.state.tour.id);

  // 2) Update tour view
  tourView.update(model.state.tour);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);

  const container = L.DomUtil.get('map');
  if (container != null) {
    container._leaflet_id = null;
  }

  model.mapTour();
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  tourView.addHandlerRender(controlTours);
  tourView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
