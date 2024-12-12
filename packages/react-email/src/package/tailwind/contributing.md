## Contributing notes

These are some things you will need to keep in mind if you are improving the Tailwind component
with things that might influence certain decisions we have made for better
email client support that have been made also in the past by other contributors but not documented
which ended up causing us to have these problems and need to rediscover the best decisions again.

### The inlining of all styles

This is one of the most important because this is not one of the use cases this is
the main focus point of using the Tailwind component. The support for defining styles with tags
and using [classes is not the best](https://www.caniemail.com/features/html-style/).

This though can't be used the same for media queries so we do append the media queries
and the class names associated with them on a `<style>` tag on the `<head>` element.

### The treatment for Tailwind's CSS variables

Emails don't really have great support for CSS variables,
so we needed to use a custom postcss plugin alongisde Tailwind to resolve
all of these variables. When the plugin finds a CSS Variable that it cannot resolve,
it leaves it without any changes.

### The treatment for media query class names

For media queries we have made more than one decision that are for the better. The first one
and most important is sanitizing the media query class names on the `<style>` tag to avoid
needing to escape the class names which does cause problems.

### RGB syntax color changes

For the best support two things were taken into account here. First thing is that
the syntax using spaces, which Tailwind generally uses, is not really supported,
neither for `rgb` nor for `rgba`, so we do a pass through Tailwind's generated
styles to change the syntax into using commas instead of spaces.

Second thing is that both `rgba` and using `/` for defining the color's opacity
are not very well supported, but passing in the opacity as a fourth parameter of `rgb()`
is what is mostly supported so we also account for that.

This has an effect like the following:

```CSS
rgb(255 255 255 / 1) -> rgb(255,255,255)
rgb(212 213 102 / 0.2) -> rgb(212,213,102,0.2)
```

### Defining the styles on the React `style` prop

This is something that comes a bit at the risk of performance but it is a safer way of doing this.
The reason this is safer is because certain components of ours or even custom ones may modify the
way styles are applied and defining it directly on the rendered HTML would cause unexpected behavior
on that.

