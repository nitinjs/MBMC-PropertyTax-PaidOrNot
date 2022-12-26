// Import stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import $ from 'jquery';

//console.log($);

// Write Javascript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>Check whether property tax paid?</h1>`;

var baseURL = 'https://pg.mbmc.gov.in';
var api_key = "b3ab4453be2c201cf3d5fb491f8647de4b93693f";
//https://stackoverflow.com/questions/4760538/using-only-javascript-to-shrink-urls-using-the-bit-ly-api
function get_short_url(long_url, func)
{
    $.getJSON(
        "http://api.bitly.com/v3/shorten?callback=?", 
        { 
            "format": "json",
            "apiKey": api_key,
            "login": "LOGIN_HERE",
            "longUrl": long_url
        },
        function(response)
        {
            func(response.data.url);
        }
    );
}

function addToBookMark(){
  get_short_url(window.location.href, function(shortURL){
      if (window.sidebar) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(shortURL,document.title,"");
    } else if(window.external) { // IE Favorite
      window.external.AddFavorite(shortURL,document.title); }
    else if(window.opera && window.print) { // Opera Hotlist
      this.title=document.title;
      return true;
    }
  });
}

function GetPropertyTax(propertyCode) {
  var result = '';
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
      $('.table tr').not('.loading, .head').remove();
      $('.table').show();
      var num = $('#txtPropCodes').val();
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
      $('.table').hide();
    }
  });

  $("#bookmarkme").click(function() {
    
  });
});
