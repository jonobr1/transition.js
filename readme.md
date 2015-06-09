# Transition.js

A class to create staggered transitions on DOM elements with CSS programmatically through JavaScript.

## Usage
Download the [minified library](https://raw.github.com/jonobr1/transition.js/master/build/transition.min.js) and include it in your html.

```html
<script src="build/transition.min.js"></script>
```

Here is boilerplate html in order to transition a DOM element on and off the screen via the `window` `click` event:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="build/transition.min.js"></script>
  </head>
  <body>
    <div id="box" style="position: absolute; top: 50%; left: 50%; margin-top: -50px; margin-left: -50px; width: 100px; height: 100px; background: rgb(255, 100, 100);"></div>
    <script>

      var elem = document.querySelector('#box');
      var transition = new Transition(elem);

      window.addEventListener('click', function(e) {
        transition[transition.type === Transition.Types.in ? Transition.Events[Transition.Types.out] : Transition.Events[Transition.Types.in]]();
      }, false);

      var loop = function() {
        requestAnimationFrame(loop);
        Transition.update();
      };
      loop();

    </script>
  </body>
</html>
```