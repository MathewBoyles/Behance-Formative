var portfolio = {
  chart: false,
  categories: [],
  categoriesCount: {},
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

          projectDates = projectDatesOR;
          if (portfolio.chart) projectDates[moment(data.projects[i].published_on * 1000).format("MMMM")]++;

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

        if ($("#mixitup-container").data("mixInit")) $("#mixitup-container").mixItUp("destroy");

        $("#mixitup-container").data("mixInit", true).mixItUp({
          selectors: {
            filter: "#mixitup-container .filters [data-filter]",
            target: ".portfolio-item"
          },
          animation: {
            duration: 300
          }
        });

        if (portfolio.chart) drawChart();

        $("#loading").fadeOut();
      },
      error: apiError
    });
  }
};

if ($("body").attr("id") == "homepage") portfolio.load();
