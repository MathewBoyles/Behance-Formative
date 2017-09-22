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
