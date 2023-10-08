$(document).ready(function () {
  const amenities = {};
  const states = {};
  const cities = {};

  $('.amenity-checkbox').change(function () {
    const amenityName = $(this).parent().data('name');
    const amenityId = $(this).parent().data('id');
    if ($(this).is(':checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    let amenitiesH4 = '';
    for (const key in amenities) {
      if (!amenities.hasOwnProperty(key)) continue;
      if (amenitiesH4 === '') {
        amenitiesH4 += amenities[key];
      } else {
        amenitiesH4 += ', ' + amenities[key];
      }
    }
    $('.amenities h4').text(amenitiesH4);
  });

  $('.state-checkbox').change(function () {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');
    console.log(`state name = ${stateName}\nstate id = ${stateId}`);
    if ($(this).is(':checked')) {
      states[stateId] = stateName;
    } else {
      delete states[stateId];
    }

    citiesAndStates = [...Object.values(states), ...Object.values(cities)];
    $('#selected-states').text(citiesAndStates.join(', '));
  });

  $('.city-checkbox').change(function () {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');
    if ($(this).is(':checked')) {
      cities[cityId] = cityName;
    } else {
      delete cities[cityId];
    }
    citiesAndStates = [...Object.values(states), ...Object.values(cities)];
    $('#selected-states').text(citiesAndStates.join(', '));
  });

  $.ajax({
    url: 'http://localhost:5001/api/v1/status/',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    },
    error: function (hxr, status, error) {
      $('div#api_status').removeClass('available');
    }
  });

  function populatePlaces (data) {
    console.log('populating places');
    const placesList = $('section.places');
    data.forEach(function (place) {
      const articleTag = $('<article>');

      const titleBox = $('<div class="title_box">');
      titleBox.append($('<h2>').text(place.name));
      titleBox.append($('<div class="price_by_night">').text('$' + place.price_by_night));

      const information = $('<div class="information">');
      information.append($('<div class="max_guest">').text(place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '')));
      information.append($('<div class="number_rooms">').text(place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '')));
      information.append($('<div class="number_bathrooms">').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '')));

      const description = $('<div class="description">').text(place.description);

      articleTag.append(titleBox, information, description);
      placesList.append(articleTag);
    });
  }

  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    method: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json',
    success: populatePlaces
  });

  $('button#search').click(function () {
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenities),
        states: Objects.keys(states),
        cities: Object.keys(cities)
      }),
      dataType: 'json'
    });
  });
});
