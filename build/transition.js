/**
 * transition.js
 * A class to create staggered transitions on DOM elements with CSS
 * programmatically through JavaScript.
 *
 * Copyright (c) 2015 jonobr1 / http://jonobr1.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {

  var root = this;
  var previousTransition = root.Transition || {};

  var Transition = root.Transition = function(elem) {

    this.elem = elem;
    this.elem.classList.add(Transition.className);

    setDuration(elem);
    Transition.instances.push(this);

  };

  Transition.className = 'transition';

  Transition.Clock = ( !!window && !!window.performance
    && !!window.performance.now
    ? window.performance : Date );

  Transition.Events = ['stasis', 'in', 'out'];
  Transition.Types = {};

  for (var i = 0; i < Transition.Events.length; i++) {
    Transition.Types[Transition.Events[i]] = i;
  }

  Transition.transitions = [];
  Transition.instances = [];
  Transition._duration = 350;
  Transition.stagger = 150;
  Transition.lastTransition = Transition.Clock.now();

  /**
   * Change the duration of the transitions.
   */
  Object.defineProperty(Transition, 'duration', {

    get: function() {
      return Transition._duration;
    },

    set: function(v) {
      Transition._duration = v;
      for (var i = 0; i < Transition.instances.length; i++) {
        var transition = Transition.instances[i];
        setDuration(transition.elem);
      }
    }

  });

  Transition.useDefaultStyles = function() {
    if (/\$1/i.test(Transition.DefaultStyles)) {
      return Transition;
    }
    var elem = document.createElement('style');
    elem.innerHTML = Transition.DefaultStyles;
    document.getElementsByTagName('head')[0].appendChild(elem);
    return Transition;
  };

  /**
   * Callback function to be triggered when a series of transitions have
   * completed.
   */
  Transition.onComplete = function(func) {
    Transition._onComplete = func;
    return Transition;
  };

  /**
   * Update `Transition` required on `requestAnimationFrame`.
   */
  Transition.update = function() {

    var now = Transition.Clock.now();

    if (Transition.transitions.length > 0
      && now - Transition.lastTransition >= Transition.stagger) {
      Transition.trigger(Transition.transitions.splice(0, 1)[0]);
      Transition.lastTransition = now;
    }

    return Transition;

  };

  /**
   * Trigger a transition.
   */
  Transition.trigger = function(transition) {

    var cl = transition.elem.classList;

    for (var type in Transition.Types) {
      var v = Transition.Types[type];
      cl[transition.type === v ? 'add' : 'remove'](type);
    }

    if (transition.type === Transition.Types.out) {
      setTimeout(Transition.reset, Transition.duration, transition);
    }

    if (transition._options && transition._options.callback) {
      setTimeout(transition._options.callback, Transition.duration);
    }

    if (Transition.transitions.length <= 0 && Transition._onComplete) {
      setTimeout(Transition._onComplete, Transition.duration);
    }

    return Transition;

  };

  /**
   * Remove all `Transition` related CSS class styles.
   */
  Transition.reset = function(transition) {

    var cl = transition.elem.classList;

    for (var type in Transition.Types) {
      var v = Transition.Types[type];
      cl.remove(type);
    }

  };

  Transition.prototype.type = Transition.Types.stasis;

  /**
   * Transition an element to the `in` state.
   */
  Transition.prototype.in = function(options) {

    this.type = Transition.Types.in;
    this._options = options;
    Transition.transitions.push(this);

    return this;

  };

  /**
   * Transition an element to the `out` state.
   */
  Transition.prototype.out = function(options) {

    this.type = Transition.Types.out;
    this._options = options;
    Transition.transitions.push(this);

    return this;

  };

  /**
   * Stop an animation in its tracks.
   */
  Transition.prototype.stop = function(options) {

    this.type = Transition.Types.stasis;
    this._options = options;

    var index = Transition.transitions.indexOf(this);
    if (index < 0) {
      return this;
    }

    Transition.transitions.splice(index, 1);

    return this;

  };

  function setDuration(elem) {
    elem.style['-webkit-transition-duration'] = Transition._duration / 1000 + 's';
    elem.style['-moz-transition-duration'] = Transition._duration / 1000 + 's';
    elem.style['transition-duration'] = Transition._duration / 1000 + 's';
  }

  // Injection point for build script.
  Transition.DefaultStyles = '.transition{-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;-o-transform-style:preserve-3d;transform-style:preserve-3d;-webkit-transform-origin:center center;-moz-transform-origin:center center;-ms-transform-origin:center center;-o-transform-origin:center center;transform-origin:center center;-webkit-transition-property:-webkit-transform,opacity;-moz-transition-property:-moz-transform,opacity;transition-property:transform,opacity;-webkit-transition-timing-function:cubic-bezier(.785,.135,.15,.86);-moz-transition-timing-function:cubic-bezier(.785,.135,.15,.86);transition-timing-function:cubic-bezier(.785,.135,.15,.86);-webkit-transform:translateY(-50px);-moz-transform:translateY(-50px);-ms-transform:translateY(-50px);-o-transform:translateY(-50px);transform:translateY(-50px);pointer-events:none;opacity:0}.transition.in{-webkit-transform:translateY(0);-moz-transform:translateY(0);-ms-transform:translateY(0);-o-transform:translateY(0);transform:translateY(0);pointer-events:auto;opacity:1}.transition.out{-webkit-transform:translateY(50px);-moz-transform:translateY(50px);-ms-transform:translateY(50px);-o-transform:translateY(50px);transform:translateY(50px);pointer-events:none;opacity:0}';
  Transition.useDefaultStyles();

})();