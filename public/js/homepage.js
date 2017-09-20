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
