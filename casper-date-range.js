import moment from 'moment/src/moment.js';

import '@cloudware-casper/casper-date-picker/casper-date-picker.js'
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperDateRange extends PolymerElement {

  static get properties () {
    return {
      /**
       * The range's end date.
       *
       * @type {String}
       */
      endDate: {
        type: String,
        notify: true
      },
      /**
       * The end date picker's placeholder.
       *
       * @type {String}
       */
      endDatePlaceholder: {
        type: String,
        value: 'Data de fim'
      },
      /**
       * The format in which the dates should appear.
       *
       * @type {String}
       */
      format: {
        type: String,
      },
      /**
       * The range's end date in the specified format
       *
       * @type {String}
       */
      formattedEndDate: {
        type: String,
        notify: true,
      },
      /**
       * The range's start date in the specified format
       *
       * @type {String}
       */
      formattedStartDate: {
        type: String,
        notify: true,
      },
      /**
       * The range's start date.
       *
       * @type {String}
       */
      startDate: {
        type: String,
        notify: true
      },
      /**
       * The start date picker's placeholder.
       *
       * @type {String}
       */
      startDatePlaceholder: {
        type: String,
        value: 'Data de ínicio'
      },

    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          width: 100%;
        }

        casper-date-picker {
          flex: 1;
        }
      </style>

      <casper-date-picker
        id="start"
        format="[[format]]"
        value="{{startDate}}"
        formatted-value="{{formattedStartDate}}"
        input-placeholder="[[startDatePlaceholder]]">
      </casper-date-picker>

      <casper-date-picker
        id="end"
        format="[[format]]"
        value="{{endDate}}"
        formatted-value="{{formattedEndDate}}"
        input-placeholder="[[endDatePlaceholder]]">
      </casper-date-picker>
    `;
  }

  ready () {
    super.ready();
    window.range = this;

    this.$.end.required = false;
    this.$.start.required = false;

    this.$.start.addEventListener('opened-changed', event => {
      // This means the start date picker just opened.
      if (event.detail.value) return;

      // Handle the case where user selects a start date which is "bigger" than the end one.
      if (this.startDate && this.endDate && moment(this.startDate) > moment(this.endDate)) {
        this.endDate = '';
      }

      this.$.end.minimumDate = this.$.start.value;
      this.$.end.open();
    });
  }
}

window.customElements.define('casper-date-range', CasperDateRange);
