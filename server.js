// Load all our needed modules.
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

// Initialize our application object.
var app = express();

/*****************************
 * Express provides the app.use() method to allow us to mount middleware
 * to handle incoming requests before they hit our route callback functions below
 *****************************/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This callback function is called when a GET request hits the /favorites path.
// This simply reads the data.json file, and sends it back as a JSON response
app.get('/favorites', function(request, response) {
  var data = fs.readFileSync('data.json');
  response.setHeader('Content-Type', 'application/json');
  response.send(data);
});

// This callback function is called when a POST request hits the /favorites path.
// This adds a new favorite to the data.json file, and sends the new list.
app.post('/favorites', function(request, response) {
  if(!request.body.name || !request.body.imdbID) {
    response.send('Error: A name and an imdbID are required.');
    return;
  }

  // Note: A good next step here would be to compare the imdbID
  // of the new favorite movie to the ids that are already saved
  // in the data.json file to make sure you don't save duplicates
  var data = JSON.parse(fs.readFileSync('data.json'));
  data.push(request.body);
  fs.writeFile('data.json', JSON.stringify(data));
  response.setHeader('Content-Type', 'application/json');
  response.send(data);
});

// This starts the server and has it listen on port 3000
// You can now go to http://localhost:3000 in a browser window to hit this server
app.listen(3000, function() {
  console.log('Listening on port 3000');
});
