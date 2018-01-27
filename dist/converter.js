!function e(t,n,r){function a(s,c){if(!n[s]){if(!t[s]){var l="function"==typeof require&&require;if(!c&&l)return l(s,!0);if(i)return i(s,!0);var o=new Error("Cannot find module '"+s+"'");throw o.code="MODULE_NOT_FOUND",o}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return a(n||e)},u,u.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)a(r[s]);return a}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var a=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.element=document.getElementById(t.container||"converter"),this.currencies=t.currencyList||["CAD","USD","EUR"];var n=t.widgetTitle||"Currency Converter";this.form=document.createElement("form");var r=document.createElement("fieldset"),a=document.createElement("legend"),i=this.createFormFields("original"),s=this.createFormFields("converted"),c=this.createDescriptionForRow("Type in amount and select currency:"),l=this.createDescriptionForRow("Converted amount:"),o=this.createDisclaimerSection();this.base=null,this.currencyRates={},localStorage.setItem("currencyRates",JSON.stringify(this.currencyRates)),a.innerText=n,r.appendChild(a),r.appendChild(c),r.appendChild(i),r.appendChild(l),r.appendChild(s),r.appendChild(o),this.form.appendChild(r),this.form.className="converter",this.element.appendChild(this.form),this.checkRate=this.checkRate.bind(this),this.handleError=this.handleError.bind(this),this.handleSuccess=this.handleSuccess.bind(this),this.createFormFields=this.createFormFields.bind(this),this.invalidAmountCheck=this.invalidAmountCheck.bind(this)}return r(e,[{key:"doConversion",value:function(){var e=this.element.getElementsByClassName("converter__select")[1].value,t=this.element.getElementsByClassName("converter__input")[1],n=this.element.getElementsByClassName("converter__input")[0].value,r=this.getCahedRates();this.base===e?t.value=n:t.value=(n*r[this.base].rates[e]).toFixed(2)}},{key:"checkRate",value:function(){if(this.invalidAmountCheck())this.manageWarning("Please enter a valid positive number.");else{var e=this.getCahedRates();this.base=this.element.getElementsByClassName("converter__select")[0].value,!e[this.base]||e[this.base]&&e[this.base].date!==(new Date).toISOString().slice(0,10)?this.getRate(this.base).then(this.handleSuccess,this.handleError):this.doConversion(),this.manageWarning()}}},{key:"invalidAmountCheck",value:function(){var e=this.element.getElementsByClassName("converter__input")[0].value;if(!e||!/[0-9]|\./.test(e)||e<0)return!0}},{key:"getCahedRates",value:function(){var e=localStorage.getItem("currencyRates");return JSON.parse(e)}},{key:"createFormFields",value:function(e){var t=this,n=document.createElement("div");n.className="converter__row";var r=document.createElement("input");r.type="number",r.placeholder="0.00",r.classList.add("converter__input"),r.id="amount_"+e,"original"!==e&&(r.disabled=!0),r.addEventListener("input",function(e){return t.checkRate(e)},!1);var a=document.createElement("label");a.htmlFor="amount_"+e,a.innerText="Type in amount:";var i=document.createElement("select");i.classList.add("converter__select"),i.id="currency_"+e;var s=document.createElement("label");s.htmlFor="currency_"+e,s.innerText="Select currency:";for(var c=0;c<this.currencies.length;c++){var l=document.createElement("option");l.value=this.currencies[c],l.text=this.currencies[c],i.appendChild(l)}return i.addEventListener("change",function(e){return t.checkRate(e)},!1),n.appendChild(a),n.appendChild(r),n.appendChild(s),n.appendChild(i),n}},{key:"createDescriptionForRow",value:function(e){var t=document.createElement("p");return t.className="converter__row-description",t.innerText=e,t}},{key:"createDisclaimerSection",value:function(){var e=this,t=document.createElement("div"),n=document.createElement("button"),r=document.createElement("p");return t.className="disclaimer",n.innerText="Disclaimer",n.className="disclaimer__button",n.addEventListener("click",function(t){t.preventDefault(),e.element.getElementsByClassName("disclaimer__text")[0].classList.toggle("disclaimer__text--hidden")},!1),r.innerText="Use at your own risk.",r.className="disclaimer__text disclaimer__text--hidden",t.appendChild(n),t.appendChild(r),t}},{key:"getRate",value:function(e){return new Promise(function(t,n){var r=new XMLHttpRequest;r.open("GET","https://api.fixer.io/latest?base="+e,!0),r.send(),r.onreadystatechange=function(){if(4===r.readyState)if(200===r.status){var e=JSON.parse(r.responseText);t(e)}else n(r.status)}})}},{key:"handleSuccess",value:function(e){this.currencyRates[this.base]=e,localStorage.setItem("currencyRates",JSON.stringify(this.currencyRates)),this.doConversion()}},{key:"handleError",value:function(){this.manageWarning("An unexpected API error occured. Please try again later.")}},{key:"manageWarning",value:function(e){var t=this.element.getElementsByClassName("converter__error")[0];if(t&&t.parentNode.removeChild(t),e){var n=document.createElement("p");n.className="converter__error",n.innerText=e,this.form.getElementsByTagName("fieldset")[0].prepend(n)}}}]),e}();n.default=a},{}]},{},[1]);