# capquadrat
Toolkit for writing responsive CSS styles in a concise, convenient manner. Aimed at being used in combination with CSS as Javascript libraries, such as Emotion or styled-components.

## Requirements
This library requires ES6 and support for private class properties and methods.

## Usage

### Defining breakpoints
First, you must define the breakpoint sizes that make sense for your application. You do so by creating an instance of the `Media` class:
```jsx
import {Media} from "capquadrat";

const media = new Media({
    breakpoints: [
        {name: "XS"},
        {name: "S", minWidth: 600},
        {name: "M", minWidth: 900},
        {name: "L", minWidth: 1200},
        {name: "XL", minWidth: 1500},
    ],
});

export default media;
```

### Initializing the document
The second step is to include the necessary global CSS declarations in your document:
```jsx
// Example using Emotion's GlobalStyles component; include something like this in your root component
<GlobalStyles styles={
[
    {}, // Other application styles
    media.globalStyles()
]/>
```

The `globalStyles()` method will generate the following CSS variables:

- `--cq-min-width`: The minimum width in pixels of the active breakpoint
- `--cq-max-width`: The maximum width in pixels of the active breakpoint
- `--cq-min-margin`: The horizontal margin applied to the main content of the document, so that content does not reach the edges of the viewport.
  Note that the size of this margin can be configured via the `minMargin` parameter for the `Media` constructor (or disabled, by setting it to `0`).
- `--cq-content-width`: The minimum width in pixels of the active breakpoint, accounting for the minimum margin described above

### Writing responsive styles
Finally, you can now make use of your defined breakpoints to write your responsive styles for different breakpoints:

```jsx
// Example using emotion's `css` property and object notation
<div
    css={media
        .any({
            display: "grid",
            gridTemplateColumns: "repeat(var(--columns), 1fr)",
            gap: "1em",
        })
        .gt("L", {"--columns": 5})
        .is("L", {"--columns": 4})
        .lt("L", {"--columns": 3})}>
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
  <div>E</div>
</div>
```

As showcased in the above example, `Media` offers a set of methods to generate media queries based on the previously defined endpoints:

- `any(breakpoint)`: Applies the given properties to all breakpoints.
- `is(breakpoint)`: Apply the given properties only to the given breakpoint
- `is(Array<breakpoint>)`: As above, but with an array of multiple breakpoints; applies the given properties to all of the breakpoints included in the array
- `not(breakpoint)`: Apply the given properties to all the breakpoints except for the given one
- `gt(breakpoint)`: Apply the given properties only to breakpoints bigger than the given breakpoint
- `ge(breakpoint)`: Apply the given properties only to the indicated breakpoint and any bigger breakpoints
- `lt(breakpoint)`: Apply the given properties only to breakpoints smaller than the given breakpoint
- `le(breakpoint)`: Apply the given properties only to the indicated breakpoint and any smaller breakpoints
- `inRange(start, end)`: Apply the given properties to all the breakpoints contained within the given range (both ends included)

### Utilities
The library also exposes a set of convenience methods:

- `horizontal(propertyName, value)`: Produces a CSS object with `-left` and `-right` declarations for the given CSS property. Useful to set margins, paddings and similar properties.
- `vertical(propertyName, value)`: Produces a CSS object with `-top` and `-bottom` declarations for the given CSS property. Useful to set margins, paddings and similar properties.
- `centerContent`: A CSS object with rules to center an element's content according to the content width reserved to the active breakpoint (see `--cq-content-width`)
