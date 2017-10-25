# rotateBoxShadow

Automatically adjust the CSS box-shadow to keep it in the same place regardless of an element's rotation.

You set the box shadow as you would like it to appear if the element were not rotated. 
**e.g.**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        body {
            padding: 20%;
        }
        .item {
            box-shadow: 0 20px 10px -3px rgba(0,0,0, 0.5);
            transform: rotate(33deg);
            display: inline-block;
            border: 1px solid red;
            padding: 0.5em;
        }
    </style>
</head>
<body>
    <div class="item">This is rotated, but box shadow is always below</div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="dist/rotatedBoxShadow.jquery.min.js"></script>
    <script>
        $(document).ready(function() {
            $('.item').rotateBoxShadow();
        });
    </script>
</body>
</html>
```

## Use without jQuery

Include the file `dist/rotatedBoxShadow.min.js`, and use the object interface.

```js
var rotated = new RotatedBoxShadow(document.querySelector('.item'));
```

The object interface has methods to force reparsing the CSS if, for example, your box shadow CSS has change and you want to adjust a new box shadow.

These methods are also available as jquery plugin actions: (e.g. `$('.item').rotatedBoxShadow('reloadCSS'); `)

```
rotated.reloadCSS();
```

You can also manually re-apply the box shadow rotation as needed.

```
rotated.apply();
```


## Mutation Listener

By default this class listens for changes to the element's style or class attributes and re-adjusts the box shadow if the rotation has changed.