if ($("body").attr("id") == "profile") {
  var profileID = window.location.pathname.split("/")[2];
  var profilePage = window.location.pathname.split("/")[3];

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

      if(profilePage == "stats") {
        $("#profile-stats").show();

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        $("#mixitup-container").remove();
        $("#loading").fadeOut();
      } else portfolio.load();
    },
    error: apiError
  });
}

function drawChart() {
  $.ajax({
    url: "https://www.behance.net/v2/users/" + profileID + "/projects/",
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var projectDatesArray = [];
      var projectDates = {
        "January": 0,
        "Febuary": 0,
        "March": 0,
        "April": 0,
        "May": 0,
        "June": 0,
        "July": 0,
        "August": 0,
        "September": 0,
        "October": 0,
        "November": 0,
        "December": 0
      };

      for (var i = 0; i < data.projects.length; i++) {
        var c_date = moment(data.projects[i].published_on * 1000).format('MMMM');

        projectDates[c_date]++;
      }

      for (var key in projectDates) {
        projectDatesArray.push({
          Month: key,
          Count: projectDates[key]
        });
      }

      console.log(projectDates);


      var dataTable = new google.visualization.DataTable();

      dataTable.addColumn('string', 'Month');
      dataTable.addColumn('number', 'Project Count');

      for (var l = 0; l < projectDatesArray.length; l++) {
        dataTable.addRow([projectDatesArray[l].month, projectDatesArray[l].Count]);
      }

      var options = {
        title: 'Number of Projects Posted by Month',
        width: "100%",
        height: "100%",
        legend: "none",
        vAxis: {
          title: 'Project Count',
          minValue : 10
        },
        hAxis: {
          title: 'Month',
          showTextEvery: 1,
          ticks: [{f:'Jan'},{f:'Feb'},{f:'Mar'},{f:'Apr'}]
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('history-chart'));
      chart.draw(dataTable, options);
    }
  });
}
