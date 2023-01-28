import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryInfoEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  let name = e.target.value.trim();
  if (!name) {
    clearCountry();
    return;
  }
  fetchCountries(name)
    .then(data => {
      clearCountry();
      if (data.length === 1) {
        renderCountry(data);
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountriesList(data);
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      clearCountry();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountry(country) {
  const markup = country
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        let languagesString = Object.values(languages).join(', ');
        return `<img src="${svg}" alt="flag" width="50"/>
          <h2>${official}</h2>
          <p><b>Capital: </b>${capital}</p>
          <p><b>Population: </b>${population}</p>
          <p><b>Languages: </b>${languagesString}</p>`;
      }
    )
    .join('');
  countryInfoEl.insertAdjacentHTML('beforeend', markup);
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class=country-item>
          <img src="${svg}" alt="flag" width="30"/>
          <p>${official}</p>
        </li>`;
    })
    .join('');
  countryListEl.insertAdjacentHTML('beforeend', markup);
}

function clearCountry() {
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
}
