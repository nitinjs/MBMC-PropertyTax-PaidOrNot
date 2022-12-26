// Import stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import $ from 'jquery';

//console.log($);

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>Check whether property tax paid?</h1>`;

var baseURL = 'https://pg.mbmc.gov.in';
var data = { channel: 0, code: 'K040032082039' };
$(document).ready(function () {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: baseURL + '/merchantpg/api/getBill',
    data: JSON.stringify(data),
    dataType: 'json',
    success: function (responseText) {
      console.log(responseText);

      if (responseText.responseStatus == 300) {
      }
    },
  });
});
