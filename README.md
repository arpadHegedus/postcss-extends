A [PostCSS] plugin to extend simple rules

[PostCSS]: https://github.com/postcss/postcss
[Gulp]: https://github.com/gulpjs/gulp

## Installation

```js
npm install postcss-extends
```

## Example

```css
a { color: blue }
a:hover { color: red }
div { extends: a }
```

will produce

```css
a { color: blue }
a:hover { color: red }
div { color: blue }
div:hover { color: red }
```

## Usage

Using [Gulp].

```js
var gulp            = require('gulp'),
    postcss         = require('gulp-postcss'),
    extends        = require('postcss-extends');

gulp.task('css', function() {
    gulp.src('path/to/dev/css').
        .pipe(postcss({
            // use it after nesting plugins
            extends
        }))
        .pipe(gulp.dest('path/to/build/css'));
});

// rest of the gulp file
```
