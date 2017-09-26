var mapReady = false;

function initMap() {
  $.getJSON("/js/markers.json", function(result) {
    var mapOptions = {
      center: new google.maps.LatLng(43, 10),
      zoom: 2,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      draggable: false,
      styles: [{
          "featureType": "all",
          "elementType": "labels",
          "stylers": [{
              "color": "#ff0000"
            },
            {
              "visibility": "off"
            }
          ]
        }, {
          "featureType": "all",
          "elementType": "labels.text",
          "stylers": [{
              "color": "#c4c4c4"
            },
            {
              "visibility": "off"
            }
          ]
        }, {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [{
              "color": "#c4c4c4"
            },
            {
              "visibility": "off"
            }
          ]
        }, {
          "featureType": "all",
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#b8b0b0"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#c4c4c4"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.province",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{
            "color": "#c3c3c3"
          }]
        }, {
          "featureType": "landscape.man_made",
          "elementType": "all",
          "stylers": [{
            "color": "#ff0000"
          }]
        }, {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{
              "visibility": "off"
            },
            {
              "color": "#c4c4c4"
            }
          ]
        }, {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#c4c4c4"
          }]
        }, {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{
              "saturation": -100
            },
            {
              "lightness": 45
            },
            {
              "color": "#c4c4c4"
            }
          ]
        }, {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{
            "visibility": "simplified"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{
              "visibility": "off"
            },
            {
              "color": "#c4c4c4"
            }
          ]
        }, {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{
              "color": "#ffffff"
            },
            {
              "visibility": "on"
            }
          ]
        }, {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text",
          "stylers": [{
            "color": "#c4c4c4"
          }]
        }
      ]
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    for (var i = 0; i < result.length; i++) {
      var marker = new google.maps.Marker({
        position: {
          lat: result[i].coords.lat,
          lng: result[i].coords.lng
        },
        map: map,
        icon: {
          url: "/img/marker.png"
        }
      });

      clickEvents();
    }

    mapReady = true;
    if (teamReady) $("#loading").fadeOut();

    function clickEvents() {
      google.maps.event.addListener(marker, "click", (function(marker, i) {
        return function() {
          infowindow.setContent("<div class='info-window-text'><h5><img class='inline-logo' src='img/marker.png' alt='Small logo' width='20'>" + result[i].country + "</h5><br>" + result[i].address + "<br>Phone: " + result[i].phone + "<br>Email: <a href='mailto:" + result[i].email + "'>" + result[i].email + "</a></div>");
          infowindow.open(map, marker);
        };
      })(marker, i));

      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
      });
    }
  });
}
