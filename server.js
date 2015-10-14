var browserify = require('browserify-middleware')
var express = require('express')
var http = require('http')

var fetch = require('node-fetch')
var DOMParser = require('xmldom').DOMParser

var app = express()
var server = require('http').createServer(app)

app.use(express.static(__dirname + '/public'))
app.use('/js/app.js', browserify(__dirname + '/src/js/app.js'))

app.get('/', function (_, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/data/:user', function (req, res) {
  getCalendar(req.params.user)
    .then(function (data) { res.send(data) })
    .catch(function (err) {
      res.send({
        status: 'error',
        message: `Could not get calendar data for ${req.params.user}`,
        detail: err.message
      })
    })
})

function getCalendar(user) {
  return fetch(`https://github.com/users/${user}/contributions`)
    .then(function (res) { return res.text() })
    .then(function (svg) {
      var doc = new DOMParser().parseFromString(svg, 'application/xml')
      var days = doc.getElementsByTagName('rect')
      days = Array.prototype.map.call(days, function (day) {
        var transform = day.parentNode.attributes.getNamedItem('transform').value
        var x = transform.match(/translate\((\d+)/)[1]
        return {
          date: day.attributes.getNamedItem('data-date').value,
          count: day.attributes.getNamedItem('data-count').value,
          x: Number(x),
          y: Number(day.attributes.getNamedItem('y').value)
        }
      })
      var xs = Array.from(days.reduce(function (set, dat) {
        set.add(dat.x)
        return set
      }, (new Set()))).sort()
      var ys = Array.from(days.reduce(function (set, dat) {
        set.add(dat.y)
        return set
      }, (new Set()))).sort()

      return days
        .map(function (d) {
          return {
            date: d.date,
            count: d.count,
            x: xs.indexOf(d.x),
            y: ys.indexOf(d.y)
          }
        })
        .reduce(function (a, b) {
          // ooohhhhh yeah writing code at 1am
          if (!a[b.x]) a[b.x] = []
          a[b.x][b.y] = b
          return a
        }, [])
    })
}

var PORT = process.env.PORT || 7000
app.listen(PORT, function () {
  console.log('App listening on port %s', PORT)
})
