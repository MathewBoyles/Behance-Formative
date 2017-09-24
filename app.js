var express = require("express");
var cookieParser = require("cookie-parser");
var path = require("path");
var fs = require("fs");
var app = express();

var clientIDs = [
  "IHZDwpDiX7dL7aVrC3Vl5DLOtZUYcxOK",
  "EcV4LA4DoqZf9K5EaM5t8ZRxVYKdZDCj",
  "FMJrg8WPFAmL9XqysU3BCqg6LT9ZIKLC"
];
var clientID = 0;

app.use(function(request, reponse, next) {
  console.log(`${request.method} request for ${request.url}`);
  next();
});

app.use(cookieParser());

app.use(function(request, reponse, next) {
  var pageName = request.url.split("?")[0];
  if (pageName == "/home") pageName = "/index";
  else if (pageName.substr(0, 9) == "/profile/") pageName = "/profile";

  var fullLink = path.join(__dirname, "public", pageName + ".html");
  if (fs.existsSync(fullLink) || pageName == "/") {
    reponse.cookie("CLIENT_ID", clientIDs[clientID], {
      maxAge: 1000 * 60 * 10
    });

    clientID++;
    if (clientID >= clientIDs.length) clientID = 0;

    if(pageName != "/") {
      reponse.header({
        "Content-Type": "text/html"
      });
      reponse.send(fs.readFileSync(fullLink));
    }
  }

  next();
});

app.use(express.static("./public"));

app.use("/packages", express.static(path.join(__dirname, "node_modules/")));

app.listen(3000);

console.log("Server running on port 3000");
