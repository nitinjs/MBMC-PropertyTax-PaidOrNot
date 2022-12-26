// Import stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import $ from 'jquery';

//console.log($);

// Write Javascript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>Check whether property tax paid?</h1>`;

var baseURL = 'https://pg.mbmc.gov.in';
function GetPropertyTax(propertyCode){
  var result="";
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    async: false, 
    url: baseURL + '/merchantpg/api/getBill',
    data: JSON.stringify(data),
    dataType: 'json',
    success: function (res) {
      //console.log(res);
      result = res; 
      //if (responseText.responseStatus == 300) {
      //}
    },
  });
  return result;
}
var data = { channel: 0, code: 'K040032082039' };
$(document).ready(function () {
  $("#txtPropCodes").on("keypress", function(evt){
    
  });
});
