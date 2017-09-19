if ($("#teamRows").is("*")) {
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
    console.log(context);
  });
}
