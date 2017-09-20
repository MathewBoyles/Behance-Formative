// Source: script.js
var config = {
  user_id: "Lightfarm",
  client_id: "THVb3iZMcUlK7Qzh2qgcbCcxk0seZlpV"
};

// 8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g

function numberFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

// Source: homepage.js
var homepageData = {
  categories: [],
  categoriesCount: {},
  mixer: null,
  page: 0
};

function loadHomepage() {
  homepageData.page++;
  $("#mixitup-loadmore").remove();
  $.ajax({
    url: "http://www.behance.net/v2/users/" + config.user_id + "/projects",
    data: {
      client_id: config.client_id,
      per_page: 12,
      page: homepageData.page
    },
    dataType: "jsonp",
    success: function(data) {
      for (var i = 0; i < data.projects.length; i++) {
        for (var i_i = 0; i_i < data.projects[i].fields.length; i_i++) {
          var c_name = data.projects[i].fields[i_i];
          if (homepageData.categories.indexOf(c_name) == -1) homepageData.categories.push(c_name);
          homepageData.categoriesCount[c_name] = homepageData.categoriesCount[c_name] ? (Number(homepageData.categoriesCount[c_name]) + 1) : 1;
        }
        $el = $("<div />");
        for (var i_tag = 0; i_tag < data.projects[i].fields.length; i_tag++) $el.addClass("tag-" + (data.projects[i].fields[i_tag].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase()));
        $el
          .addClass("portfolio-item")
          .addClass("col-md-3")
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

      var categoriesSorted = Object.keys(homepageData.categoriesCount).sort(function(a, b) {
        return homepageData.categoriesCount[a] - homepageData.categoriesCount[b];
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
        if (j > 3) $el.addClass("hide");
        $("#mixitup-container .filters").append($el);

        if (j == (categoriesSorted.length - 1) && categoriesSorted.length > 4) {
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
          .click(loadHomepage);
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

      if (homepageData.mixer) homepageData.mixer.destroy();
      homepageData.mixer = mixitup($("#mixitup-container"), {
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

if ($("body").attr("id") == "homepage") loadHomepage(1);

// Source: items.js
function showItem(item) {
  $("#loading").fadeIn();

  if(isNaN(item)) item = $(this).data("projectData").id;

  $.ajax({
    url: "http://www.behance.net/v2/projects/" + item,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var context = data.project;

      $.ajax({
        url: "http://www.behance.net/v2/projects/" + item + "/comments",
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

// Source: team.js
if ($("body").attr("id") == "about") {
  $.getJSON("/js/team.json", function(team) {
    var template = $("#teamRows").html();
    var compiledTemplate = Template7.compile(template);

    var teamItems = [];
    for (var i = 0; i < team.length; i++) {
      var teamItem = team[i];
      teamItem.lineBr = ((i+1) % 4) == 0;
      teamItems.push(teamItem);
    }

    var context = {
        team: teamItems
    };
    var html = compiledTemplate(context);
    $("#teamRows").after(html);

    $("#loading").fadeOut();
  });
}
