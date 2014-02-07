(function ($) {
  "use strict";
  var lastOrientation = {},
    stopped = true,
    arrayForEach = [].forEach;

  function normaliseOrientation(orientation) {
    var normalised = { x: 0, y: 0 },
      tampered = {
        gamma:
         (Math.abs(orientation.gamma) > 90 ?
          ((180 - Math.abs(orientation.gamma)) * (orientation.gamma > 0 ? 1 : -1))
          : orientation.gamma)
         / 180,
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

    return normalised;
  }

  function adjustTransform(orientation) {
    return function (o, e) {
      e.style.webkitTransform = e.style.mozTransform = e.style.msTransform = e.style.transform =
      'translate3d(' + o.x + 'em, ' + o.y + 'em, 0)';
    }.bind(null, orientation);
  }

  function onDeviceOrientationChange (ev) {
    lastOrientation.gamma = ev.gamma;
    lastOrientation.beta = ev.beta;
  }

  function start () {
    stopped = false;
    window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
    var looper = function(timestamp) {
      if (typeof lastOrientation.gamma !== 'undefined') {
        arrayForEach.call(document.getElementsByClassName('minilax-target'),
          adjustTransform(normaliseOrientation(lastOrientation)));
      }
      if (!stopped) {
        requestAnimationFrame(looper);
      }
    }
    requestAnimationFrame(looper);
  }

  function stop () {
    stopped = true;
    lastOrientation = {};
    window.removeEventListener('deviceorientation', onDeviceOrientationChange, false);
  }

  $.start = start;
  $.stop = stop;

} (window.minilax = {}));
