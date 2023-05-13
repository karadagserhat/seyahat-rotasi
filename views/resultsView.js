import View from './View';
import previewView from './previewView';


class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Böyle bir şehir bulamadık. Lütfen tekrar deneyiniz!';
  _message = '';

  _generateMarkup() {
    return this._data.map((result) => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
