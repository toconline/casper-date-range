import moment from 'moment/src/moment.js';

import '@cloudware-casper/casper-date-picker/casper-date-picker.js'
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperDateRange extends PolymerElement {

  static get properties () {
    return {
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
       * The start date picker's placeholder.
       *
       * @type {String}
       */
      startDatePlaceholder: {
        type: String,
        value: 'Data de ínicio'
      },
      /**
       * The range's value.
       *
       * @type {Object}
       */
      value: {
        type: Object,
        notify: true,
        observer: '__valueChanged'
      },
      /**
       * The end date picker's value.
       *
       * @type {String}
       */
      __endDate: {
        type: String,
        observer: '__endDateChanged'
      },
      /**
       * The start date picker's value.
       *
       * @type {String}
       */
      __startDate: {
        type: String,
        observer: '__startDateChanged'
      }
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

        #start {
          margin-right: 5px;
        }

        #end {
          margin-left: 5px;
        }
      </style>

      <casper-date-picker
        id="start"
        format="[[format]]"
        value="{{__startDate}}"
        maximum-date="[[__maximumStartDate]]"
        formatted-value="{{formattedStartDate}}"
        input-placeholder="[[startDatePlaceholder]]">
      </casper-date-picker>

      <casper-date-picker
        id="end"
        format="[[format]]"
        value="{{__endDate}}"
        minimum-date="[[__minimumEndDate]]"
        formatted-value="{{formattedEndDate}}"
        input-placeholder="[[endDatePlaceholder]]">
      </casper-date-picker>
    `;
  }

  ready () {
    super.ready();

    this.$.end.required = false;
    this.$.start.required = false;
    this.$.start.addEventListener('opened-changed', event => this.__startDateOpenedChanged(event));
  }

  get formattedValue () {
    return {
      start: this.$.start.formattedValue,
      end: this.$.end.formattedValue,
    }
  }

  /**
   * This method is invoked when the start date picker's value changes.
   *
   * @param {String} startDate The start date picker's value.
   */
  __startDateChanged (startDate) {
    !startDate
      ? this.__minimumEndDate = ''
      : this.__minimumEndDate = startDate;

    // If the __startDateLock property is true, it means the value property was changed outside.
    if (!this.__startDateLock) this.__setValue();
  }

  /**
   * This method is invoked when the end date picker's value changes.
   *
   * @param {String} endDate The end date picker's value.
   */
  __endDateChanged (endDate) {
    !endDate
      ? this.__maximumStartDate = ''
      : this.__maximumStartDate = endDate;

    // If the __endDateLock property is true, it means the value property was changed outside.
    if (!this.__endDateLock) this.__setValue();
  }

  /**
   * This method sets the public value property.
   */
  __setValue () {
    this.__internallyChangeProperty('value', {
      start: this.__startDate,
      end: this.__endDate
    });
  }

  /**
   * This method is invoked when the public property value changes.
   *
   * @param {String} value The current component's value.
   */
  __valueChanged (value) {
    // If the valueLock property is true, it means the value was changed due to a change in one of the pickers.
    if (this.valueLock) return;

    // If we get an empty / invalid value, just set both dates to empty.
    if (!value ||value.constructor !== Object || !value.hasOwnProperty('start') || !value.hasOwnProperty('end') || moment(value.start) > moment(value.end)) {
      this.value = { start: '', end: '' };
      return;
    }

    this.__internallyChangeProperty('__endDate', value.end);
    this.__internallyChangeProperty('__startDate', value.start);
  }

  /**
   * This method is invoked when the start date picker's is opened / closed.
   *
   * @param {Object} event The event's object.
   */
  __startDateOpenedChanged (event) {
    // This means the start date picker just closed.
    if (!event.detail.value) this.$.end.open();
  }

  /**
   * Changes a property and "locks" it in order to prevent infinite loops of observers.
   *
   * @param {String} propertyName The name of the property which will be changed.
   * @param {String} propertyValue The new value of the property.
   */
  __internallyChangeProperty (propertyName, propertyValue) {
    this[`${propertyName}Lock`] = true;
    this[propertyName] = propertyValue;
    this[`${propertyName}Lock`] = false;
  }
}

window.customElements.define('casper-date-range', CasperDateRange);
