$(document).ready(function () {
  const amenities = {};

  $('.amenity-checkbox').change(function () {
    const amenityName = $(this).parent().data('name');
    const amenityId = $(this).parent().data('id');
    if ($(this).is(':checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    let amenitiesH4 = '';

    console.log(`Amenities checked: ${amenities}`);
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

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
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
});
