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
* @param {string} options.elem [options.elem=converter] - The HTML id of the converter container.
* @param {string} options.title [options.title=Currency Converter] - Widget title.
*/
export default (options) => {
    const element = document.getElementById(options.elem || 'converter'),
        title = options.title || 'Currency Converter',

        form = document.createElement('form'),
        fieldset = document.createElement('fieldset'),
        legend = document.createElement('legend'),

        rowOne = createFormFields('original'),
        rowTwo = createFormFields('converted'),

        descriptionOne = createDescriptionForRow('Type in amount and select currency:'),
        descriptionTwo = createDescriptionForRow('Converted amount:'),

        disclaimer = createDisclaimerSection();

    // caching for the current day in local storage
    let base,
        currencyRates = {
            'CAD': null,
            'USD': null,
            'EURO': null
        };
    localStorage.setItem('currencyRates', JSON.stringify(currencyRates));

    // putting the markup together
    legend.innerText = title;

    fieldset.appendChild(legend);
    fieldset.appendChild(descriptionOne);
    fieldset.appendChild(rowOne);
    fieldset.appendChild(descriptionTwo);   
    fieldset.appendChild(rowTwo);
    fieldset.appendChild(disclaimer);

    form.appendChild(fieldset);
    form.className = 'converter';

    element.appendChild(form);


    /**
    * Doing the conversion and updating the input field value.
    *
    */
    function doConversion() {
        const currencyConverted = element.getElementsByClassName('converter__select')[1].value,
            amountConverted = element.getElementsByClassName('converter__input')[1],
            amountOriginal = element.getElementsByClassName('converter__input')[0].value;

        let storedRates = getCahedRates();

        if (base === currencyConverted) {
            amountConverted.value = amountOriginal;
        } else {
            amountConverted.value = (amountOriginal * storedRates[base]['rates'][currencyConverted]).toFixed(2);
        }
    }


    /**
    * Checking if today's rate is present for the base currency.
    * If it is - cool, else reach out to API.
    *
    */
    function checkRate() {
        if (invalidAmountCheck()) return;

        let storedRates = getCahedRates();

        // if rates not present or outdated - it's time to use https://api.fixer.io
        base = element.getElementsByClassName('converter__select')[0].value;

        if (!storedRates[base] || storedRates[base] && storedRates[base]['date'] !== new Date().toISOString().slice(0, 10)) {
            getRate(base).then(handleSuccess, handleError);
        } else {
            doConversion();
        }
    }


    /**
    * If the amount empty or NaN - we don't need to do anything.
    *
    */
    function invalidAmountCheck() {
        const val = element.getElementsByClassName('converter__input')[0].value;
        const regex = /[0-9]|\./;

        if (!val || !regex.test(val) || val < 0) {
            return true;
        }
    }


    /**
    * Get the cached rates from local storage.
    *
    */
    function getCahedRates() {
        let storedRates = localStorage.getItem('currencyRates');
        return JSON.parse(storedRates);
    }


    /**
    * Creating the _amount input_ and _currency select_ pairs.
    *
    * @param {string} id - an identifier for original and converted amounts.
    */
    function createFormFields(id) {
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

        input.addEventListener('input', checkRate, false);

        const inputLabel = document.createElement('label');
        inputLabel.htmlFor = `amount_${id}`;
        inputLabel.innerText = 'Type in amount:';

        // currency select
        const select = document.createElement('select'),
            currencies = ['CAD', 'USD', 'EUR'];

        select.classList.add('converter__select');
        select.id = `currency_${id}`;

        const selectLabel = document.createElement('label');
        selectLabel.htmlFor = `currency_${id}`;
        selectLabel.innerText = 'Select currency:';

        for (let i = 0; i < currencies.length; i++) {
            const option = document.createElement('option');
            option.value = currencies[i];
            option.text = currencies[i];
            select.appendChild(option);
        }

        select.addEventListener('change', checkRate, false);

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
    function createDescriptionForRow(text) {
        let description = document.createElement('p');
        description.className = 'converter__row-description';
        description.innerText = text;

        return description;
    }


    /**
    * Creating the disclaimer section.
    *
    */
    function createDisclaimerSection() {
        let disclaimer = document.createElement('div'),
            disclaimerButton = document.createElement('button'),
            disclaimerText = document.createElement('p');

        disclaimer.className = 'disclaimer';

        disclaimerButton.innerText = 'Disclaimer';
        disclaimerButton.className = 'disclaimer__button';
        disclaimerButton.addEventListener('click', (e) => {
            e.preventDefault();

            element.getElementsByClassName('disclaimer__text')[0]
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
    function getRate(currency) {
        let promiseObj = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.fixer.io/latest?base=${currency}`, true);
            xhr.send();
            xhr.onreadystatechange = function () {
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
            }
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
    function handleSuccess(res) {
        currencyRates[base] = res;
        localStorage.setItem('currencyRates', JSON.stringify(currencyRates));

        doConversion();
    }


    /**
    * If the API call fails we might want to notify the user.
    *
    */
    function handleError() {
        let warning = document.createElement('p');
        warning.innerText = 'An unexpected error occured. Please try again later.';

        form.prepend(warning);
    }
}
