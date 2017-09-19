// Get Lightfarm Studio Data
$.ajax({
  url: "http://www.behance.net/v2/projects?client_id=8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g",
  dataType: "jsonp",
  success: function(data){
    var categories = [];
    for (var i = 0; i < data.projects.length; i++) {
      for (var i_i = 0; i_i < data.projects[i].fields.length; i_i++) {
        if(categories.indexOf(data.projects[i].fields[i_i]) == -1) categories.push(data.projects[i].fields[i_i]);
      }
      var tagLine = "";
      for (var i_tag = 0; i_tag < data.projects[i].fields.length; i_tag++) {
        tagLine += " tag-" + (data.projects[i].fields[i_tag].replace(/ /g,"").toLowerCase());
      }
      $("#mixitup-container .container").append("<div class='portfolio-item col-md-3" + tagLine + "' data-id='" + data.projects[i].id + "'> " +
        "<img class='portfolio-image' src='" + data.projects[i].covers[404] + "' alt='" + data.projects[i].name.replace(/'/g,"") + "'>" +
      "</div>");
    }
    $("#mixitup-container .container .portfolio-item").click(function(){
      console.log($(this));

    });
    console.log(data.projects);
    for (var j = 0; j < categories.length; j++) {
      $("#mixitup-container .filters").append("<button class='btn' type='button' data-filter='.tag-" + categories[j].replace(/ /g,"").toLowerCase() + "'>" + categories[j] + "</button>");
    }

    var mixer = mixitup($("#mixitup-container"), {
        selectors: {
            target: '.portfolio-item'
        },
        animation: {
            duration: 300
        }
    });
  },
  error: function(){
    console.log("something went wrong.");
  }
});
