const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//needed for heroku, see variables with 'env', defaults to 3000 if PORT env is not present.
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//site maintenance - stops app and hands back a maintenance page
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome, to the hypnos paradise!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Super Duper Projects Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: true,
    errorMessage: 'There was a critical failure, you shall now be terminated!'
  })
});

app.listen(port, () => {
  console.log(`Server is now up on port ${port}`);
});
