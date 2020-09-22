'use strict';

const apiKey = 'IsEd78G2ENjxkgImF6XbXQAMnjD7zGtZ2wk6ns8Y'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $('.results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    let parkInfo = `
      <ul class="items">
        <li>
          <h4>${responseJson.data[i].fullName}</h4>
          <p><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></p>
          <p>${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}</p>
          <p>${responseJson.data[i].description}</p>
          <hr>          
        </li>
      </ul>
        `
    $('.results-list').append(parkInfo);
    }
  $('.results-container').removeClass('hidden');
};

function getParks(searchTerm, maxResults=10) {
  console.log(searchTerm)
  const params = {
    stateCode: searchTerm,
    limit: maxResults,
    api_key: apiKey
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().split(",");
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
    console.log(searchTerm)
  });
}

$(watchForm);