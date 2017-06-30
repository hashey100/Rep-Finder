
  // This example adds a search box to a map, using the Google Place Autocomplete
  // feature. People can enter geographical searches. The search box will return a
  // pick list containing a mix of places and predicted search terms.

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


var locations = ["NW6", "NW2", "HA1", "TW9"];
var names =['Peter', 'David', 'Mark', 'James'];
var lat = [];
var lng = [];

// JavaScript
window.onload = function(){

    var f = (function(){
        var xhr = [];
        for (i = 0; i < locations.length; i++){
            (function (i){
                xhr[i] = new XMLHttpRequest();
                xhr[i].open("GET", "http://maps.googleapis.com/maps/api/geocode/json?address="+locations[i]+"&sensor=true", true);
                xhr[i].onreadystatechange = function () {
                    if (xhr[i].readyState == 4 && xhr[i].status == 200) {
                      var jsonResponse = JSON.parse(xhr[i].responseText);
                      lat1 = jsonResponse.results[0].geometry.location.lat;
                      lng1 = jsonResponse.results[0].geometry.location.lng;
                      lat.push(lat1)
                      lng.push(lng1)
                    }
                };
                xhr[i].send();
            })(i);
        }
    })();

};

function calcDistance (fromLat, fromLng, toLat, toLng) {
 return google.maps.geometry.spherical.computeDistanceBetween(
   new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
}

  function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    var button = document.getElementById('search');

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {

      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        var lat1 = place.geometry.location.lat();
        var lng1 = place.geometry.location.lng();
        var container = document.getElementById("contacts-data");
        container.innerHTML = "";

        var calcDist=[];
        for (i = 0; i < locations.length; i++){
          var calcdis = calcDistance(lat1,lng1,lat[i],lng[i]) * 0.000621371192;
          calcDist.push(calcdis);
          container.innerHTML += '<div class='+Math.round(calcdis*10)/10+'><span>'+ parseInt(i+1)+'</span><span>'+names[i]+'</span><span>'+Math.round(calcdis*10)/10+' Miles </span></div>';
        }

        var reference_array = ["2", "3", "7", "4", "3"];
        var array = ["bob", "dan", "steven", "corbin","test"];
        array.sort(function(a, b) {
          console.log(b);
        return reference_array.indexOf(a) - array.indexOf(b);
        });

        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }
