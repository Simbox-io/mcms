# Card Component

The `Card` component is a versatile and reusable component that displays a card with customizable header, content, footer, and image. It supports optional effects using the Framer Motion library.

## Props

The `Card` component accepts the following props:

| Prop Name         | Type                 | Default   | Description                                                                         |
|-------------------|----------------------|-----------|------------------------------------------------------------------------------------|
| `header`          | `React.ReactNode`    | -         | The content to be displayed in the card header.                                    |
| `content`         | `React.ReactNode`    | -         | The main content to be displayed in the card body.                                 |
| `footer`          | `React.ReactNode`    | -         | The content to be displayed in the card footer.                                    |
| `image`           | `string`             | -         | The URL of the image to be displayed in the card.                                  |
| `imageAlt`        | `string`             | `''`      | The alternative text for the card image.                                           |
| `effects`         | `boolean`            | `true`    | Determines whether to apply hover and tap effects using Framer Motion.              |
| `className`       | `string`             | `''`      | Additional CSS class name(s) to be applied to the card container.                  |
| `contentClassName`| `string`             | `''`      | Additional CSS class name(s) to be applied to the card content.                    |
| `headerClassName` | `string`             | `''`      | Additional CSS class name(s) to be applied to the card header.                     |
| `footerClassName` | `string`             | `''`      | Additional CSS class name(s) to be applied to the card footer.                     |
| `imageClassName`  | `string`             | `''`      | Additional CSS class name(s) to be applied to the card image container.            |
| `onClick`         | `() => void`         | -         | A callback function to be invoked when the card is clicked.                        |

## Usage

To use the `Card` component in your React application, follow these steps:

1. Import the `Card` component into your file:

```jsx
import Card from './Card';
```

2. Render the `Card` component with the desired props:

```jsx
<Card
  header={<h3>Card Header</h3>}
  content={<p>This is the card content.</p>}
  footer={<button>Learn More</button>}
  image="path/to/image.jpg"
  imageAlt="Card Image"
  effects={true}
  onClick={() => console.log('Card clicked')}
/>
```

3. Customize the appearance and behavior of the card by providing different prop values.

## Styling

The `Card` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the card. The appearance of the card can be customized by providing additional CSS classes using the `className`, `contentClassName`, `headerClassName`, `footerClassName`, and `imageClassName` props.

The component also supports dark mode styling by applying the appropriate CSS classes based on the dark mode state.

## Effects

By default, the `Card` component applies hover and tap effects using the Framer Motion library. When the user hovers over the card, it scales up slightly, and when the user taps on the card, it scales down slightly. These effects can be disabled by setting the `effects` prop to `false`.

## Callback

The `Card` component accepts an optional `onClick` prop, which is a callback function that will be invoked when the card is clicked. You can use this prop to handle any desired actions or interactions when the card is clicked.