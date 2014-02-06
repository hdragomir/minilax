(function ($) {
  "use strict";
  var lastOrientation = {},
    stopped = true,
    arrayForEach = [].forEach;

  function normaliseOrientation(orientation) {
    var normalised = { x: 0, y: 0 },
      tampered = {
        gamma: orientation.gamma / 180,
        beta: orientation.beta / 180
      };

    switch (window.orientation) {
      //landscape
      case 90: case -90:
        normalised.x = tampered.beta * window.orientation / 90;
        normalised.y = tampered.gamma * window.orientation / -90;
        break;
      //portrait
      default:
        //orientation is 180 for upside down
        var factor = (window.orientation === 0 ? 1 : -1);
        normalised.x = tampered.gamma * factor;
        normalised.y = tampered.beta * factor;
    }
    // if you'r rather use percentages
    normalised.px = normalised.x * 200;
    normalised.py = normalised.y * 200;

    return normalised;
  }

  function adjustTransform(orientation) {
    return function (o, e) {
      e.style.webkitTransform = e.style.mozTransform = e.style.msTransform = e.style.transform =
      'translate3d(' + o.x * 2 + 'em, ' + o.y + 'em, 0)';
    }.bind(null, normaliseOrientation(orientation));
  }

  function getLaxables () {
    return document.getElementsByClassName('minilax-target');
  }

  function onDeviceOrientationChange (ev) {
    lastOrientation.gamma = ev.gamma;
    lastOrientation.beta = ev.beta;
  }

  function render() {
    if ( typeof lastOrientation.gamma !== 'undefined') {
      arrayForEach.call(getLaxables(), adjustTransform(lastOrientation));
    }
  }

  function start () {
    stopped = false;
    window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
    var looper = function(timestamp) {
      render();
      if (!stopped) {
        requestAnimationFrame(looper);
      }
    }
    requestAnimationFrame(looper);
  }

  function stop () {
    stopped = true;
    lastOrientation = {};
  }

  $.start = start;
  $.stop = stop;

} (window.minilax = {}));
