// Import stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import $ from 'jquery';
import jQuery from 'jquery';

//console.log($);
(function ($) {
  $.QueryString = (function (paramsArray) {
    let params = {};

    for (let i = 0; i < paramsArray.length; ++i) {
      let param = paramsArray[i].split('=', 2);

      if (param.length !== 2) continue;

      params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, ' '));
    }

    return params;
  })(window.location.search.substr(1).split('&'));
})(jQuery);

// Write Javascript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>Check whether property tax paid?</h1>`;
var titleX = 'MBMC: Tax paid?';
var baseURL = 'https://pg.mbmc.gov.in';
var api_key = 'b3ab4453be2c201cf3d5fb491f8647de4b93693f';
//https://stackoverflow.com/questions/4760538/using-only-javascript-to-shrink-urls-using-the-bit-ly-api
function get_short_url(long_url, func) {
  $.ajax({
    url: 'https://api-ssl.bitly.com/v4/shorten',
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'application/json',
    data: JSON.stringify({
      long_url: long_url,
      domain: 'bit.ly',
      group_guid: 'Bb6r3AfKB9b',
    }),
    beforeSend: function (xhr) {
      //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.withCredentials = true;
      xhr.setRequestHeader('Authorization', 'Bearer ' + api_key);
    },
    success: function (response) {
      func(response.data.url);
    },
  });
}

function Preserve(num){
  localStorage.setItem('pCodes', num); // or  localStorage.value = document.getElementById("myData").value
}

//https://stackoverflow.com/a/23142165/223752
function Retrieve(){
  var val = localStorage.getItem('pCodes'); // or localStorage.value

  if(val == null)
    val = "";

  return val;
  //document.getElementById("txtPropCodes").value = val;
}

function addToBookMark() {
  var curURL =
    'https://js-at9lbb.stackblitz.io?propertyCodes=' + $('#txtPropCodes').val();
  get_short_url(window.location.href, function (shortURL) {
    if (window.sidebar) {
      // Mozilla Firefox Bookmark
      window.sidebar.addPanel(shortURL, titleX, '');
    } else if (window.external) {
      // IE Favorite
      window.external.AddFavorite(shortURL, titleX);
    } else if (window.opera && window.print) {
      // Opera Hotlist
      this.title = titleX;
      return true;
    }
  });
}

function GetPropertyTax(propertyCode) {
  var result = '';
  var data = { channel: 0, code: propertyCode };
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    async: false,
    url: baseURL + '/merchantpg/api/getBill',
    data: JSON.stringify(data),
    dataType: 'json',
    success: function (res) {
      result = res;
      //if (responseText.responseStatus == 300) {
      //}
    },
  });
  console.log(result);
  return result;
}

$(document).ready(function () {
  this.title = titleX;
  if ($.QueryString.propertyCodes) {
    $('.invalid-feedback, .valid-feedback').hide();
    $('#txtPropCodes')
      .val($.QueryString.propertyCodes)
      .addClass('is-valid')
      .removeClass('is-invalid');
    $('.valid-feedback').show();
    $('#btnSumbit').click();
  }else{
    var val = Retrieve();
    $('#txtPropCodes')
      .val(val)
      .addClass('is-valid')
      .removeClass('is-invalid');
    $('.valid-feedback').show();
    $('#btnSumbit').click();
  }

  $('#txtPropCodes').on('change', function (evt) {
    console.log($(this).val());
    $('.invalid-feedback, .valid-feedback').hide();
    if ($('#txtPropCodes').val() != '') {
      $('#txtPropCodes').addClass('is-valid').removeClass('is-invalid');
      $('.valid-feedback').show();
    } else {
      $('#txtPropCodes').addClass('is-invalid').removeClass('is-valid');
      $('.invalid-feedback').show();
    }
  });
  $('#btnSumbit').on('click', function () {
    if ($('#txtPropCodes').hasClass('is-valid')) {
      $('.tblResult tr').not('.loading, .head').remove();
      $('.tblResult').show();
      var num = $('#txtPropCodes').val();
      Preserve(num);
      var arr = num.split(',');
      console.log(arr);
      $.each(arr, function (i, e) {
        var json = GetPropertyTax(e);
        var html = $('<tr></tr>');
        html.append($('<td>' + json.bill_details.propertyCode + '</td>'));
        html.append($('<td>' + json.bill_details.ownerName + '</td>'));
        html.append($('<td>₹' + json.bill_details.billAmount + '</td>'));
        if (json.bill_details.billAmount == 0) {
          html.append(
            $('<td><span class="alert alert-success">✔️</span></td>')
          );
        } else {
          html.append($('<td><span class="alert alert-danger">❌</span></td>'));
        }
        $('#tblResult').append(html);
      });
      $('.table tr.loading').hide();
    } else {
      $('.tblResult').hide();
    }
  });

  $('#bookmarkme').click(function () {
    if ($('#txtPropCodes').hasClass('is-valid')) {
      addToBookMark();
    } else {
      alert('please enter property code(s).');
    }
  });
});
