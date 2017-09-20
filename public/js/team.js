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
