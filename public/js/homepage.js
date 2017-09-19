// Get Lightfarm Studio Data
if ($("body").attr("id") == "homepage") {
  $.ajax({
    url: "http://www.behance.net/v2/projects",
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var categories = [];
      var categoriesCount = {};

      for (var i = 0; i < data.projects.length; i++) {
        for (var i_i = 0; i_i < data.projects[i].fields.length; i_i++) {
          var c_name = data.projects[i].fields[i_i];
          if (categories.indexOf(c_name) == -1) categories.push(c_name);
          categoriesCount[c_name] = categoriesCount[c_name] ? (Number(categoriesCount[c_name]) + 1) : 1;
        }
        var tagLine = "";
        for (var i_tag = 0; i_tag < data.projects[i].fields.length; i_tag++) {
          tagLine += " tag-" + (data.projects[i].fields[i_tag].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase());
        }
        $("#mixitup-container .row").append("<div class='portfolio-item col-md-3" + tagLine + "' data-id='" + data.projects[i].id + "'> " +
          "<img class='portfolio-image' src='" + data.projects[i].covers[404] + "' alt='" + data.projects[i].name.replace(/'/g, "") + "'>" +
          "</div>");
      }
      $("#mixitup-container .row .portfolio-item").click(function() {
        console.log($(this));

      });

      var categoriesSorted = Object.keys(categoriesCount).sort(function(a, b) {
        return categoriesCount[a] - categoriesCount[b];
      });
      categoriesSorted.reverse();

      for (var j = 0; j < categoriesSorted.length; j++) {
        var isHidden = j > 3;
        $("#mixitup-container .filters").append("<button class='btn" + (isHidden ? " hide" : "") + "' type='button' data-filter='.tag-" + categoriesSorted[j].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase() + "'>" + categoriesSorted[j] + "</button>");

        if (j == (categoriesSorted.length - 1) && categoriesSorted.length > 4) {
          $("#mixitup-container .filters").append("<button class='btn showmore' type='button'>Show more...</button>");
          $("#mixitup-container .filters").append("<a id='mixitup-showless'>Show less</a>");
        }
      }

      $("#mixitup-container .filters .btn.showmore").click(function() {
        $(this).hide();
        $("#mixitup-container .filters .btn.hide").show();
        $("#mixitup-showless").css("display", "block");
        return false;
      });

      $("#mixitup-showless").click(function() {
        $(this).hide();
        $("#mixitup-container .filters .btn.hide:not(.mixitup-control-active)").hide();
        $("#mixitup-container .filters .btn.showmore").show();
      });

      var mixer = mixitup($("#mixitup-container"), {
        selectors: {
          target: ".portfolio-item"
        },
        animation: {
          duration: 300
        }
      });
    },
    error: function() {
      console.log("something went wrong.");
    }
  });
}
