// Source: script.js
var cookies = {};
var cookiesTEMP = document.cookie.split(";");

for (var i = 0; i < cookiesTEMP.length; i++) {
  var cookieTHIS = cookiesTEMP[i].split("=");
  cookies[cookieTHIS[0]] = cookieTHIS[1];
}

var config = {
  user_id: "lightfarm",
  client_id: cookies.CLIENT_ID ? cookies.CLIENT_ID : "8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g"
};

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

function apiError() {
  $("#loading").hide();
  $("#apiError").remove();
  $el = $("<div />");
  $el
    .attr("id", "apiError")
    .addClass("popup")
    .addClass("popup-auto")
    .append("<div />")
    .find("div:last")
    .addClass("popup-backdrop")
    .parent()
    .append("<div />")
    .find("div:last")
    .addClass("popup-container")
    .addClass("row")
    .append("<div />")
    .find("div:last")
    .addClass("popup-content")
    .addClass("col-12")
    .append("<div />")
    .find("div:last")
    .append("<h5 />")
    .find("h5:last")
    .text("Oops, something has gone wrong!")
    .parent()
    .append("<p />")
    .find("p:last")
    .html("It appears your connection to the Behance database has been lost. Please reload and try again.");
  $("body").append($el);
  $("#apiError").popup("show", {
    click: false,
    keyboard: false
  });
}

function matureFilter(link) {
  $("#loading").hide();
  $("#matureFilter").remove();
  $el = $("<div />");
  $el
    .attr("id", "matureFilter")
    .addClass("popup")
    .addClass("popup-auto")
    .append("<div />")
    .find("div:last")
    .addClass("popup-backdrop")
    .parent()
    .append("<div />")
    .find("div:last")
    .addClass("popup-container")
    .addClass("row")
    .append("<div />")
    .find("div:last")
    .addClass("popup-content")
    .addClass("col-12")
    .append("<div />")
    .find("div:last")
    .append("<h5 />")
    .find("h5:last")
    .text("Mature Content Blocked")
    .parent()
    .append("<p />")
    .find("p:last")
    .html("Sorry, this project contains mature content which may not be displayed here. However, you may view this project on <a href='" + link + "' target='_blank'>Behance <small><i class='fa fa-external-link' aria-hidden='true'></i></a></small>.");
  $("body").append($el);
  $("#matureFilter").popup();
}

loadTmpl("popup");

// Source: items.js
var pauseHash = false;

function showItem(item) {
  $("#loading").fadeIn();

  if (isNaN(item)) item = $(this).data("projectData").id;

  $.ajax({
    url: "https://www.behance.net/v2/projects/" + item,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      if(data.project.mature_content) {
        matureFilter(data.project.url);
        return false;
      }

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
          var popupPreviousTitle = document.title;

          document.title = context.name;
          pauseHash = true;
          window.location.hash = "view=" + context.id;

          context.comments = data.comments;

          var template = $("#portfolioPopup").html();
          template = template.replace(/<!--b-->/g, "");
          var compiledTemplate = Template7.compile(template);
          var html = compiledTemplate(context);

          $("#portfolioPopupModal").remove();
          $("body").append(html);
          $("#portfolioPopupModal").popup().bind("closed", function() {
            document.title = popupPreviousTitle;
            window.history.pushState({}, document.title, window.location.href.split("#")[0]);
            $("#portfolioPopupModal").remove();
          });
          $("#loading").hide();
        },
        error: apiError
      });
    },
    error: apiError
  });
}

$(window).on("hashchange", function() {
  if (pauseHash) pauseHash = false;
  else if (window.location.hash.substr(0, 6) == "#view=" && !isNaN(window.location.hash.substr(6))) showItem(window.location.hash.substr(6));
  else if ($("#portfolioPopupModal").is(":visible")) $("#portfolioPopupModal").popup("hide");
}).trigger("hashchange");

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
    this.trigger("close");
    this.find(".popup-container")
      .animate({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      }, 500, function() {
        $(this).trigger("closed");
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
      }, 500, function() {
        $(this).trigger("opened");
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
  imgReady: function() {
    $(this).parent().find(".portfolio-load").fadeOut(500);
    $(this).parent().find(".portfolio-image-load").remove();
    $(this)
      .removeClass("portfolio-image-loading")
      .attr("alt", $(this).attr("data-alt"))
      .removeAttr("data-alt");
  },
  load: function() {
    if ($(this).attr("id") == "mixitup-loadmore") {
      if ($(this).find(".bouncer").is(":visible")) return false;

      $(this).find("span").hide();
      $(this).find(".bouncer").show();
    }

    portfolio.page++;

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
            .append("<div />")
            .find("div:last")
            .addClass("portfolio-load")
            .append("<div />")
            .find("div:last")
            .addClass("bouncer")
            .append("<div />")
            .find("div:last")
            .addClass("bounce1")
            .parent()
            .append("<div />")
            .find("div:last")
            .addClass("bounce2")
            .parent()
            .append("<div />")
            .find("div:last")
            .addClass("bounce3")
            .parent()
            .parent()
            .parent()
            .append("<img />")
            .find("img:last")
            .addClass("portfolio-image")
            .addClass("portfolio-image-loading")
            .attr("src", data.projects[i].covers[404])
            .attr("data-alt", data.projects[i].name)
            .on("load", portfolio.imgReady)
            .parent()
            .append("<img />")
            .find("img:last")
            .addClass("portfolio-image")
            .addClass("portfolio-image-load")
            .attr("src", "/img/aRation.png")
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

        $("#mixitup-container .portfolio-item:not(.faded-done)").hide().addClass("faded-done").fadeIn(500);

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
            $("#mixitup-container .filters").append("<button class='btn showmore btn-invert' type='button'>Show more...</button>");
            $("#mixitup-container .filters").append("<a id='mixitup-showless' class='btn btn-invert'>Show less</a>");
          }
        }

        $("#mixitup-loadmore").remove();

        if (data.projects.length == 12) {
          $el = $("<button />");
          $el
            .addClass("btn")
            .attr("id", "mixitup-loadmore")
            .click(portfolio.load)
            .append("<span />")
            .find("span:last")
            .text("Load more...")
            .parent()
            .append("<div />")
            .find("div:last")
            .addClass("bouncer")
            .hide()
            .append("<div />")
            .find("div:last")
            .addClass("bounce1")
            .parent()
            .append("<div />")
            .find("div:last")
            .addClass("bounce2")
            .parent()
            .append("<div />")
            .find("div:last")
            .addClass("bounce3");
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
        portfolio.mixer = mixitup("#mixitup-container", {
          selectors: {
            target: ".portfolio-item"
          },
          animation: {
            duration: 300
          }
        });

        $("#loading").fadeOut();
      },
      error: apiError
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
    url: "https://www.behance.net/v2/users/" + profileID,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      document.title = data.user.display_name + " | " + document.title;

      var template = $("#profileData").html();
      var compiledTemplate = Template7.compile(template);

      var html = compiledTemplate(data.user);
      $("#profile-sidebar").html(html);

      $("#profile-sidebar > *").hide().fadeIn(500);

      portfolio.load();
    },
    error: apiError
  });
}

// Source: team.js
var teamReady = false;

if ($("body").attr("id") == "about") {
  $.getJSON("/js/team.json", function(data) {
    var template = $("#teamRows").html();
    var compiledTemplate = Template7.compile(template);

    var context = {
      team: data
    };
    var html = compiledTemplate(context);
    $("#teamRows").after(html);

    teamReady = true;
    if (mapReady) $("#loading").fadeOut();
  });
}
