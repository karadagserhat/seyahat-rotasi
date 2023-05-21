import View from './View';

import icons from 'url:../src/img/icons.svg';

class tourView extends View {
  _parentElement = document.querySelector('.tour');
  _errorMessage = 'Böyle bir yer bulamadık. Lütfen tekrar deneyiniz!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach((ev) => window.addEventListener(ev, handler));
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="tour__fig">
    <img crossorigin="anonymous" src="${this._data.image}" alt="${
      this._data.name
    }" class="tour__img" />
    <h1 class="tour__title">
      <span>${this._data.name}</span>
    </h1>
  </figure>

  <div class="tour__details">
    <div class="tour__info">
      <p>${this._data.description}</p>
    </div>
 
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
      </svg>
    </button>
  </div>

  <div id='map'></div>

  <div class="tour__directions">
    <h2 class="heading--2">Adres</h2>
    <p class="tour__directions-text">
    ${this._data.address.split('/').join(' / ')}
    </p>
    <a class="btn--small tour__btn" href="${this._data.detailsUrl}" target="_blank">
      <span>Detaylı Bilgi</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>
    `;
  }
}

export default new tourView();
