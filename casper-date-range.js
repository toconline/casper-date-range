import '@cloudware-casper/casper-date-picker/casper-date-picker.js'
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperDateRange extends PolymerElement {

  static get template() {
    return html`
      <casper-date-picker></casper-date-picker>
      <casper-date-picker></casper-date-picker>
    `;
  }
}

window.customElements.define('casper-date-range', CasperDateRange);
