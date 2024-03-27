# Carousel Component

The `Carousel` component is a reusable React component that displays a carousel with customizable items, navigation controls, indicators, and autoplay functionality.

## Props

The `Carousel` component accepts the following props:

| Prop Name           | Type                  | Default     | Description                                                                                                                         |
|---------------------|----------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `items`             | `React.ReactNode[]`   | -           | An array of React elements to be displayed as carousel items.                                                                        |
| `activeIndex`       | `number`              | `0`         | The index of the initially active carousel item.                                                                                     |
| `onSlideChange`     | `(index: number) => void` | -           | A callback function to be invoked when the active slide changes, receiving the new index as an argument.                              |
| `interval`          | `number`              | `5000`      | The interval (in milliseconds) between automatic slide transitions when `autoPlay` is enabled.                                        |
| `autoPlay`          | `boolean`             | `false`     | Whether the carousel should automatically transition between slides.                                                                 |
| `indicators`        | `boolean`             | `true`      | Whether to display indicator buttons for each slide.                                                                                 |
| `controls`          | `boolean`             | `true`      | Whether to display navigation controls (previous and next buttons).                                                                  |
| `pauseOnHover`      | `boolean`             | `true`      | Whether to pause the autoplay functionality when the mouse hovers over the carousel.                                                 |
| `className`         | `string`              | `''`        | Additional CSS class name(s) to be applied to the carousel container.                                                                |
| `style`             | `React.CSSProperties` | -           | Custom inline styles to be applied to the carousel container.                                                                        |
| `slideClassName`    | `string`              | `''`        | Additional CSS class name(s) to be applied to each slide.                                                                            |
| `indicatorClassName` | `string`              | `''`        | Additional CSS class name(s) to be applied to the indicator buttons.                                                                 |
| `controlClassName`  | `string`              | `''`        | Additional CSS class name(s) to be applied to the navigation control buttons.                                                        |
| `prevLabel`         | `string`              | `'Previous'` | The label for the previous navigation control button.                                                                                |
| `nextLabel`         | `string`              | `'Next'`    | The label for the next navigation control button.                                                                                    |

## Usage

To use the `Carousel` component in your React application, follow these steps:

1. Import the `Carousel` component into your file:

```jsx
import Carousel from './Carousel';
```

2. Prepare an array of React elements to be displayed as carousel items.

3. Render the `Carousel` component with the desired props:

```jsx
<Carousel
  items={carouselItems}
  activeIndex={0}
  onSlideChange={handleSlideChange}
  interval={3000}
  autoPlay
  indicators
  controls
  pauseOnHover
  className="my-carousel"
  slideClassName="slide"
  indicatorClassName="indicator"
  controlClassName="control"
  prevLabel="Prev"
  nextLabel="Next"
/>
```

4. Customize the appearance and behavior of the carousel by providing different prop values.

## Functionality

The `Carousel` component provides the following functionality:

- Displays a set of carousel items, with the active item being shown prominently.
- Allows navigation between slides using previous and next buttons.
- Supports autoplay functionality, automatically transitioning between slides at a specified interval.
- Provides indicators to visually represent the current active slide and allow direct navigation to a specific slide.
- Pauses the autoplay functionality when the mouse hovers over the carousel (if `pauseOnHover` is enabled).
- Invokes the `onSlideChange` callback function whenever the active slide changes, providing the new index as an argument.

## Styling

The `Carousel` component can be styled using CSS classes and inline styles. The following class names can be customized:

- `className`: Applied to the carousel container.
- `slideClassName`: Applied to each slide.
- `indicatorClassName`: Applied to the indicator buttons.
- `controlClassName`: Applied to the navigation control buttons.

Additionally, inline styles can be applied to the carousel container using the `style` prop.

## Dependencies

The `Carousel` component relies on the following dependencies:

- `react`: The React library for building user interfaces.
- `framer-motion`: A library for creating smooth animations and transitions.
- `ChevronLeftSVG` and `ChevronRightSVG`: Custom SVG components for the previous and next navigation buttons.

Make sure to install these dependencies and import them correctly in your project.