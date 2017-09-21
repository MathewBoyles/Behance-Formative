// Source: script.js
var config = {
  user_id: "lightfarm",
  client_id: "THVb3iZMcUlK7Qzh2qgcbCcxk0seZlpV"
};

// 8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g

function numberFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function breakLines(str) {
  return str.replace(/(?:\r\n|\r|\n)/g, "<br />");
}

function loadTmpl(tmpl) {
  $.ajax({
    url: "/tmpl/" + tmpl + ".html",
    success: function(data) {
      $("body").append(data);
    }
  });
}

loadTmpl("popup");

// Source: items.js
function showItem(item) {
  $("#loading").fadeIn();

  if(isNaN(item)) item = $(this).data("projectData").id;

  $.ajax({
    url: "https://www.behance.net/v2/projects/" + item,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var context = data.project;

      $.ajax({
        url: "https://www.behance.net/v2/projects/" + item + "/comments",
        data: {
          client_id: config.client_id,
          per_page: 20,
          page: 1
        },
        dataType: "jsonp",
        success: function(data) {
          context.comments = data.comments;

          var template = $("#portfolioPopup").html();
          var compiledTemplate = Template7.compile(template);
          var html = compiledTemplate(context);

          $("#portfolioPopupModal").remove();
          $("body").append(html);
          $("#portfolioPopupModal").popup();
          $("#loading").hide();
        }
      });
    }
  });
}

// Source: map.js
var mapReady = false;

function initMap() {
  $.getJSON("/js/markers.json", function(result) {
    var mapOptions = {
      center: new google.maps.LatLng(35, 10),
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
          "color": "#c4c4c4"
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
          "color": "#ffffff"
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
      }]
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < result.length; i++) {
      var marker = new google.maps.Marker({
        position: {
          lat: result[i].coords.lat,
          lng: result[i].coords.lng
        },
        map: map
      });

      clickEvent();
    }

    mapReady = true;
    if (teamReady) $("#loading").fadeOut();

    function clickEvent() {
      google.maps.event.addListener(marker, "click", (function(marker, i) {
        return function() {
          infowindow.setContent("<div class='infoWindowText'><h5>" + result[i].country + "</h5><br>" + result[i].address + "<br>Phone: " + result[i].phone + "<br>Email: <a href='mailto:" + result[i].email + "'>" + result[i].email + "</a></div>");
          infowindow.open(map, marker);
        };
      })(marker, i));
    }
  });
}

// Source: popup.js
$.fn.popup = function(fun, options) {
  var defaults = {
    backdrop: true,
    click: true,
    keyboard: true
  };
  var settings = $.extend({}, defaults, options);

  if (fun == "toggle") {
    this.popup((this.is(":visible") ? "hide" : "show"), options);
    return this;
  }

  this.data({
    "popupSettings": settings
  });

  this.find(".popup-backdrop")
    .filter(function() {
      return !$(this).data("popupInit");
    })
    .data({
      "popupInit": 1
    })
    .click(function() {
      if ($(this).parent().data("popupSettings").click) $(this).parent().popup("hide");
    });

  if (fun == "hide") {
    $("body").css("overflow", "auto");
    this.find(".popup-container")
      .animate({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      });
    this.find(".popup-backdrop")
      .fadeOut(500, function() {
        $(this).parent().hide();
      });
  } else if (fun == "show" || !fun) {
    $("body").css("overflow", "hidden");
    this.find(".popup-backdrop,.popup-container").hide();
    this.show();
    this.find(".popup-container")
      .css({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      })
      .show()
      .animate({
        "top": "50%"
      });
    if (this.data("popupSettings").backdrop) this.find(".popup-backdrop").fadeIn(500);
    else this.find(".popup-backdrop").css({
      "opacity": 0
    }).show();
  }

  return this;
};

$(document).keyup(function(e) {
  if (e.keyCode == 27 && $(".popup:visible").length) {
    $(".popup:visible").filter(function() {
      return $(this).data("popupSettings").keyboard;
    }).popup("hide");
  }
});

// Source: portfolio.js
var portfolio = {
  categories: [],
  categoriesCount: {},
  mixer: null,
  user: config.user_id,
  page: 0,
  maxFilters: 4,
  grid: 3,
  load: function() {
    portfolio.page++;
    $("#mixitup-loadmore").remove();
    $.ajax({
      url: "https://www.behance.net/v2/users/" + portfolio.user + "/projects",
      data: {
        client_id: config.client_id,
        per_page: 12,
        page: portfolio.page
      },
      dataType: "jsonp",
      success: function(data) {
        for (var i = 0; i < data.projects.length; i++) {
          for (var i_i = 0; i_i < data.projects[i].fields.length; i_i++) {
            var c_name = data.projects[i].fields[i_i];
            if (portfolio.categories.indexOf(c_name) == -1) portfolio.categories.push(c_name);
            portfolio.categoriesCount[c_name] = portfolio.categoriesCount[c_name] ? (Number(portfolio.categoriesCount[c_name]) + 1) : 1;
          }
          $el = $("<div />");
          for (var i_tag = 0; i_tag < data.projects[i].fields.length; i_tag++) $el.addClass("tag-" + (data.projects[i].fields[i_tag].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase()));
          $el
            .addClass("portfolio-item")
            .addClass("col-md-" + portfolio.grid)
            .data("projectData", data.projects[i])
            .append("<img />")
            .find("img:last")
            .addClass("portfolio-image")
            .attr("src", data.projects[i].covers[404])
            .attr("alt", data.projects[i].name)
            .parent()
            .append("<div />")
            .find("div:last")
            .addClass("portfolio-title")
            .text(data.projects[i].name)
            .parent()
            .click(showItem);
          $("#mixitup-container .row").append($el);
        }

        var categoriesSorted = Object.keys(portfolio.categoriesCount).sort(function(a, b) {
          return portfolio.categoriesCount[a] - portfolio.categoriesCount[b];
        });
        categoriesSorted.reverse();

        $("#mixitup-container .filters .btn:not(:eq(0))").remove();

        for (var j = 0; j < categoriesSorted.length; j++) {
          $el = $("<button />");
          $el
            .addClass("btn")
            .attr("type", "button")
            .attr("data-filter", (".tag-" + categoriesSorted[j].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase()))
            .text(categoriesSorted[j]);
          if (j > (portfolio.maxFilters - 1)) $el.addClass("hide");
          $("#mixitup-container .filters").append($el);

          if (j == (categoriesSorted.length - 1) && categoriesSorted.length > portfolio.maxFilters) {
            $("#mixitup-container .filters .btn.showmore, #mixitup-container .filters #mixitup-showless").remove();
            $("#mixitup-container .filters").append("<button class='btn showmore' type='button'>Show more...</button>");
            $("#mixitup-container .filters").append("<a id='mixitup-showless'>Show less</a>");
          }
        }

        if (data.projects.length == 12) {
          $el = $("<button />");
          $el
            .addClass("btn")
            .attr("type", "button")
            .attr("id", "mixitup-loadmore")
            .text("Load more...")
            .click(portfolio.load);
          $("#mixitup-container").append($el);
        }

        $("#mixitup-container .filters .btn.showmore").click(function() {
          $("#mixitup-container .filters").addClass("show");
          return false;
        });

        $("#mixitup-showless").click(function() {
          $("#mixitup-container .filters").removeClass("show");
          return false;
        });

        if (portfolio.mixer) portfolio.mixer.destroy();
        portfolio.mixer = mixitup($("#mixitup-container"), {
          selectors: {
            target: ".portfolio-item"
          },
          animation: {
            duration: 300
          }
        });

        $("#loading").fadeOut();
      },
      error: function() {
        console.log("something went wrong.");
      }
    });
  }
};

if ($("body").attr("id") == "homepage") portfolio.load();

// Source: profile.js
if ($("body").attr("id") == "profile") {
  var profileID = window.location.pathname.split("/")[2];

  portfolio.maxFilters = 2;
  portfolio.grid = 4;
  portfolio.user = profileID;

  $.ajax({
    url: "http://www.behance.net/v2/users/" + profileID,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var template = $("#profileData").html();
      var compiledTemplate = Template7.compile(template);

      var html = compiledTemplate(data.user);
      $("#profile-sidebar").html(html);

      portfolio.load();
    }
  });
}

// Source: team.js
var teamReady = false;

if ($("body").attr("id") == "about") {
  $.getJSON("/js/team.json", function(team) {
    var template = $("#teamRows").html();
    var compiledTemplate = Template7.compile(template);

    var teamItems = [];
    for (var i = 0; i < team.length; i++) {
      var teamItem = team[i];
      teamItem.lineBr = ((i + 1) % 4) == 0;
      teamItems.push(teamItem);
    }

    var context = {
      team: teamItems
    };
    var html = compiledTemplate(context);
    $("#teamRows").after(html);

    teamReady = true;
    if (mapReady) $("#loading").fadeOut();
  });
}
