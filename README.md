# Vanilla JavaScript Currency Converter

Vanilla JavaScript (ES2015) currency converter widget using [Fixer](https://fixer.io/) data. 

## Demo

[**CURRENCY CONVERTER**](https://zoltantothcom.github.io/vanilla-js-currency-converter/)

## Usage

Copy the `dist/converter.js` file into your project and then:

    import CurrencyConverter from './converter';

    const converter = new CurrencyConverter({
        container: 'my-container-element',
        widgetTitle: 'ES2015 Currency Converter'
    });


## Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
container | string | converter | HTML _id_ of the converter container in the HTML markup.
widgetTitle | string | Currency Converter | The widget title to show on page.
showDisclaimer | boolean | true | Display the disclaimer section under the converter.
currencyList | array | ['USD',&nbsp;'EUR',&nbsp;'JPY',&nbsp;'GBP',&nbsp;'CHF'] | List of currencies for the widget. Possible values are: `AUD`, `BGN`, `BRL`, `CAD`, `CHF`, `CNY`, `CZK`, `DKK`, `EUR`, `GBP`, `HKD`, `HRK`, `HUF`, `IDR`, `ILS`, `INR`, `JPY`, `KRW`, `MXN`, `MYR`, `NOK`, `NZD`, `PHP`, `PLN`, `RON`, `RUB`, `SEK`, `SGD`, `THB`, `TRY`, `USD`, `ZAR`


## Running locally

1. Clone the project repository and install the dependencies

    ```sh
    $ git clone https://github.com/zoltantothcom/vanilla-js-currency-converter.git
    $ cd vanilla-js-currency-converter
    $ npm install
    ```

2. Start the development server, open `http://localhost:3000` and start fiddling around

    ```sh
    $ npm start
    ```

3. Done!
