import moment from 'moment/src/moment.js';

import '@cloudware-casper/casper-date-picker/casper-date-picker.js'
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperDateRange extends PolymerElement {

  static get properties () {
    return {
      /**
       * The end date picker's value.
       *
       * @type {String}
       */
      endDate: {
        type: String,
        notify: true,
        observer: '__endDateChanged'
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
       * Flag that states if the end date is required.
       *
       * @type {Boolean}
       */
      endDateRequired: {
        type: Boolean,
        value: true
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
       * The maximum date which can be selected.
       *
       * @type {String}
       */
      maximumDate: {
        type: String,
        observer: '__maximumDateChanged'
      },
      /**
       * The error that should appear when the maximum date is surpassed.
       *
       * @type {String}
       */
      maximumDateErrorMessage: {
        type: String
      },
      /**
       * The minimum date which can be selected.
       *
       * @type {String}
       */
      minimumDate: {
        type: String,
        observer: '__minimumDateChanged'
      },
      /**
       * The error that should appear when the minimum date is surpassed.
       *
       * @type {String}
       */
      minimumDateErrorMessage: {
        type: String
      },
      /**
       * The space between both pickers.
       *
       * @type {Number}
       */
      spaceBetweenPickers: {
        type: Number,
        value: 10,
        observer: '__spaceBetweenPickersChanged'
      },
      /**
       * The start date picker's value.
       *
       * @type {String}
       */
      startDate: {
        type: String,
        notify: true,
        observer: '__startDateChanged'
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
       * Flag that states if the start date is required.
       *
       * @type {Boolean}
       */
      startDateRequired: {
        type: Boolean,
        value: true
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
        required="[[startDateRequired]]"
        minimum-date="[[__minimumStartDate]]"
        maximum-date="[[__maximumStartDate]]"
        input-placeholder="[[startDatePlaceholder]]"
        required-error-message="[[requiredErrorMessage]]"
        minimum-date-error-message="[[minimumDateErrorMessage]]"
        maximum-date-error-message="[[maximumDateErrorMessage]]">
      </casper-date-picker>

      <casper-date-picker
        id="end"
        format="[[format]]"
        value="{{endDate}}"
        required="[[endDateRequired]]"
        minimum-date="[[__minimumEndDate]]"
        maximum-date="[[__maximumEndDate]]"
        input-placeholder="[[endDatePlaceholder]]"
        required-error-message="[[requiredErrorMessage]]"
        minimum-date-error-message="[[minimumDateErrorMessage]]"
        maximum-date-error-message="[[maximumDateErrorMessage]]">
      </casper-date-picker>
    `;
  }

  ready () {
    super.ready();
    window.range = this;
    this.$.start.addEventListener('opened-changed', event => this.__startDateOpenedChanged(event));
  }

  get formattedValue () {
    return {
      start: this.$.start.formattedValue,
      end: this.$.end.formattedValue,
    }
  }

  /**
   * This method is invoked when the mimum date changes.
   *
   * @param {String} minimumDate The range's minimum date.
   */
  __minimumDateChanged (minimumDate) {
    if (!this.__isDateAfterThanMinimum(this.endDate, minimumDate)) this.endDate = '';
    if (!this.__isDateAfterThanMinimum(this.startDate, minimumDate)) this.startDate = '';

    this.__minimumStartDate = minimumDate;
    this.__minimumEndDate = this.startDate || minimumDate;
  }

  /**
   * This method is invoked when the maximum date changes.
   *
   * @param {String} maximumdate The range's maximum date.
   */
  __maximumDateChanged (maximumDate) {
    if (!this.__isDateBeforeThanMaximum(this.endDate, maximumDate)) this.endDate = '';
    if (!this.__isDateBeforeThanMaximum(this.startDate, maximumDate)) this.startDate = '';

    this.__maximumEndDate = maximumDate;
    this.__maximumStartDate = this.endDate || maximumDate;
  }

  /**
   * This method is invoked when the start date changes.
   *
   * @param {String} startDate The current start date.
   */
  __startDateChanged (startDate) {
    startDate && this.__isDateBetweenLimits(startDate, this.minimumDate, this.maximumDate)
      ? this.__minimumEndDate = startDate
      : this.__minimumEndDate = this.minimumDate || '';
  }

  /**
  * This method is invoked when the end date changes.
  *
  * @param {String} endDate The current end date.
   */
  __endDateChanged (endDate) {
    endDate && this.__isDateBetweenLimits(endDate)
      ? this.__maximumStartDate = endDate
      : this.__maximumStartDate = this.maximumDate || '';
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
   * This method is invoked when the space between pickers property changes.
   *
   * @param {Number} spaceBetweenPickers The space between both pickers.
   */
  __spaceBetweenPickersChanged (spaceBetweenPickers) {
    const halfSpaceBetweenPickers = parseFloat(spaceBetweenPickers) / 2;

    this.$.end.style.marginLeft = `${halfSpaceBetweenPickers}px`;
    this.$.start.style.marginRight = `${halfSpaceBetweenPickers}px`;
  }

  /**
   * This method checks if the passed date is between the minimum and the maximum allowed ones.
   *
   * @param {String} date The date we're checking.
   * @param {String} minimumDate The minimum allowed date.
   * @param {String} maximumDate The maximum allowed date.
   */
  __isDateBetweenLimits (date, minimumDate, maximumDate) {
    return this.__isDateAfterThanMinimum(date, minimumDate) && this.__isDateBeforeThanMaximum(date, maximumDate);
  }

  /**
   * This method checks if the passed date is after the minimum date.
   *
   * @param {String} date The date we're checking.
   * @param {String} minimumDate The minimum allowed date.
   */
  __isDateAfterThanMinimum (date, minimumDate) {
    return !minimumDate || moment(date) >= moment(minimumDate);
  }

  /**
   * This method checks if the passed date is before the maximum date.
   *
   * @param {String} date The date we're checking.
   * @param {String} minimumDate The maximum allowed date.
   */
  __isDateBeforeThanMaximum (date, maximumDate) {
    return !maximumDate || moment(date) <= moment(maximumDate);
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
