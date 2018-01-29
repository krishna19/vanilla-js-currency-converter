/**
* @fileOverview
* @author Zoltan Toth
* @version 1.0.0
*/

/**
* @description
* A vanilla JavaScript currency converter widget.
*
* @class
* @param {object} options - User defined settings for the converter.
* @param {string} options.container [options.container=converter] - The HTML id of the container 
* in the markup.
* @param {string} options.widgetTitle [options.widgetTitle=Currency Converter] - Widget title.
* @param {boolean} options.showDisclaimer [options.showDisclaimer=true] - Show disclaimer.
* @param {array} options.currencyList [options.currencyList=['USD', 'EUR', 'JPY', 'GBP', 'CHF']] - 
* List of currencies to convert between.
*/
export default class CurrencyConverter {
    constructor(options) {
        this.element = document.getElementById(options.container || 'converter');
        this.currencies = options.currencyList || ['USD', 'EUR', 'JPY', 'GBP', 'CHF'];
        const title = options.widgetTitle || 'Currency Converter';

        this.form = document.createElement('form');

        const fieldset = document.createElement('fieldset'),
            legend = document.createElement('legend'),

            rowOne = this.createFormFields('original'),
            rowTwo = this.createFormFields('converted'),

            descriptionOne = this.createDescriptionForRow('Type in amount and select currency:'),
            descriptionTwo = this.createDescriptionForRow('Converted amount:');

        // caching for the current day in local storage
        this.base = null;
        this.currencyRates = {};
        localStorage.setItem('currencyRates', JSON.stringify(this.currencyRates));

        // putting the markup together
        legend.innerText = title;

        fieldset.appendChild(legend);
        fieldset.appendChild(descriptionOne);
        fieldset.appendChild(rowOne);
        fieldset.appendChild(descriptionTwo);
        fieldset.appendChild(rowTwo);

        if (options.showDisclaimer) {
            const disclaimer = this.createDisclaimerSection();
            fieldset.appendChild(disclaimer);
        }

        this.form.appendChild(fieldset);
        this.form.className = 'converter';

        this.element.appendChild(this.form);

        this.checkRate = this.checkRate.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.createFormFields = this.createFormFields.bind(this);
        this.invalidAmountCheck = this.invalidAmountCheck.bind(this);
    }


    /**
    * Doing the conversion and updating the input field value.
    *
    */
    doConversion() {
        const currencyConverted = this.element.getElementsByClassName('converter__select')[1].value,
            amountConverted = this.element.getElementsByClassName('converter__input')[1],
            amountOriginal = this.element.getElementsByClassName('converter__input')[0].value;

        let storedRates = this.getCahedRates();

        if (this.base === currencyConverted) {
            amountConverted.value = amountOriginal;
        } else {
            amountConverted.value = 
                (amountOriginal * storedRates[this.base].rates[currencyConverted]).toFixed(2);
        }
    }


    /**
    * Checking if today's rate is present for the base currency.
    * If it is - cool, else reach out to API.
    *
    */
    checkRate() {
        if (this.invalidAmountCheck()) {
            this.manageWarning('Please enter a valid positive number.');
            return;
        }

        let storedRates = this.getCahedRates();

        // if rates not present or outdated - it's time to use https://api.fixer.io
        this.base = this.element.getElementsByClassName('converter__select')[0].value;

        if (!storedRates[this.base] || storedRates[this.base] && storedRates[this.base].date !== 
                new Date().toISOString().slice(0, 10)) {
            this.getRate(this.base).then(this.handleSuccess, this.handleError);
        } else {
            this.doConversion();
        }

        this.manageWarning();
    }


    /**
    * If the amount empty or NaN or negative - we don't need to do anything.
    *
    */
    invalidAmountCheck() {
        const val = this.element.getElementsByClassName('converter__input')[0].value;
        const regex = /[0-9]|\./;

        if (!val || !regex.test(val) || val < 0) {
            return true;
        }
    }


    /**
    * Get the cached rates from local storage.
    *
    */
    getCahedRates() {
        let storedRates = localStorage.getItem('currencyRates');
        return JSON.parse(storedRates);
    }


    /**
    * Creating the _amount input_ and _currency select_ pairs.
    *
    * @param {string} id - an identifier for original and converted amounts.
    */
    createFormFields(id) {
        const container = document.createElement('div');
        container.className = 'converter__row';

        // amount input
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '0.00';
        input.classList.add('converter__input');
        input.id = `amount_${id}`;

        if (id !== 'original') {
            input.disabled = true;
        }

        input.addEventListener('input', (e) => this.checkRate(e), false);

        const inputLabel = document.createElement('label');
        inputLabel.htmlFor = `amount_${id}`;
        inputLabel.innerText = 'Type in amount:';

        // currency select
        const select = document.createElement('select');

        select.classList.add('converter__select');
        select.id = `currency_${id}`;

        const selectLabel = document.createElement('label');
        selectLabel.htmlFor = `currency_${id}`;
        selectLabel.innerText = 'Select currency:';

        for (let i = 0; i < this.currencies.length; i++) {
            const option = document.createElement('option');
            option.value = this.currencies[i];
            option.text = this.currencies[i];
            select.appendChild(option);
        }

        select.addEventListener('change', (e) => this.checkRate(e), false);

        // appending all the elements
        container.appendChild(inputLabel);
        container.appendChild(input);
        container.appendChild(selectLabel);
        container.appendChild(select);

        return container;
    }


    /**
    * Creating description for input rows.
    *
    * @param {string} text - description for input/select pair.
    */
    createDescriptionForRow(text) {
        let description = document.createElement('p');
        description.className = 'converter__row-description';
        description.innerText = text;

        return description;
    }


    /**
    * Creating the disclaimer section.
    *
    */
    createDisclaimerSection() {
        let disclaimer = document.createElement('div'),
            disclaimerButton = document.createElement('button'),
            disclaimerText = document.createElement('p');

        disclaimer.className = 'disclaimer';

        disclaimerButton.innerText = 'Disclaimer';
        disclaimerButton.className = 'disclaimer__button';
        disclaimerButton.addEventListener('click', (e) => {
            e.preventDefault();

            this.element.getElementsByClassName('disclaimer__text')[0]
                .classList.toggle('disclaimer__text--hidden');
        }, false);

        disclaimerText.innerText = 'Use at your own risk.';
        disclaimerText.className = 'disclaimer__text disclaimer__text--hidden';

        disclaimer.appendChild(disclaimerButton);
        disclaimer.appendChild(disclaimerText);

        return disclaimer;
    }


    /**
    * Reaching out to API.
    *
    * @param {string} currency - base currency selection.
    */
    getRate(currency) {
        let promiseObj = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.fixer.io/latest?base=${currency}`, true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // console.log("xhr done successfully");
                        const respJSON = JSON.parse(xhr.responseText);
                        resolve(respJSON);
                    } else {
                        // console.log("xhr failed");
                        reject(xhr.status);
                    }
                } else {
                    // console.log("xhr processing going on");
                }
            };
            // console.log("request sent succesfully");
        });

        return promiseObj;
    }


    /**
    * Upon a successful API call let's update the local storage.
    *
    * @param {object} res - the API response in JSON format.
    *
    */
    handleSuccess(res) {
        this.currencyRates[this.base] = res;
        localStorage.setItem('currencyRates', JSON.stringify(this.currencyRates));

        this.doConversion();
    }


    /**
    * If the API call fails we might want to notify the user.
    *
    */
    handleError() {
        this.manageWarning('An unexpected API error occured. Please try again later.');
    }


    /**
    * Show or hide warnings as needed.
    *
    * @param {string} error - Error message to show.
    *
    */
    manageWarning(error) {
        // remove present warning, if any
        const elem = this.element.getElementsByClassName('converter__error')[0];
        if (elem) {
            elem.parentNode.removeChild(elem);
        }

        // create the new warning, if any
        if (error) {
            let warning = document.createElement('p');
            warning.className = 'converter__error';
            warning.innerText = error;

            this.form.getElementsByTagName('fieldset')[0].prepend(warning);
        }
    }
}