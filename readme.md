# Transition.js

A class to create staggered transitions on DOM elements with CSS programmatically through JavaScript. With thanks to [Vrse](http://vrse.com).

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

You can change the quality of the animation by editing the `./styles/transition.scss` file. Currently depends on [Bourbon](http://bourbon.io) for cross browser css functionality.

You can also change the stagger rate and the duration of the animation like so:

```javascript
var a = document.querySelector('#box');
a.transition = new Transition(a);

Transition.stagger = 50; // in milliseconds
Transition.duration = 1000; // in milliseconds

var b = document.querySelector('#circle');
b.transition = new Transition(b);
```

Changing the singleton properties will propagate through all instances and all future instances. For even more goodies check out the code!

## Custom Build
Transition.js uses [nodejs](http://nodejs.org/) in order to build source files. You'll first want to install that. Then you can nab all the dependencies with `npm`:

```
cd transition.js
npm install
```

After you've edited the source or styles then you can build running this command from the root of the project:

```
node ./utils/build
```

This will create all the files in the `./build/` folder.