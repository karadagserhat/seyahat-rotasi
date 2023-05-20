import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'Henüz herhangi bir yeri favorilere eklemedin. Arama sonuçlarından sonra yer işaretleri ikonuna tıklayarak favorilere ekleyebilirsin.';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map((bookmark) => previewView.render(bookmark, false)).join('');
  }
}

export default new BookmarksView();
