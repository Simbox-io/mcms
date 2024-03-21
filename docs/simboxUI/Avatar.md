## Avatar Component

The `Avatar` component is a reusable React component that displays an avatar image or a fallback icon. It provides various customization options through props.

### Props

| Prop         | Type                                   | Default     | Description                                                                         |
|--------------|----------------------------------------|-------------|--------------------------------------------------------------------------------------|
| `src`        | `string`                               | `undefined` | The URL of the avatar image.                                                        |
| `alt`        | `string`                               | `''`        | The alternative text for the avatar image.                                          |
| `size`       | `'small'` \| `'medium'` \| `'large'`   | `'medium'`  | The size of the avatar.                                                             |
| `shape`      | `'circle'` \| `'rounded'` \| `'square'` | `'circle'`  | The shape of the avatar.                                                            |
| `className`  | `string`                               | `''`        | Additional CSS class name(s) to apply to the avatar container.                      |
| `style`      | `React.CSSProperties`                  | `undefined` | Custom CSS styles to apply to the avatar container.                                 |
| `fallback`   | `React.ReactNode`                      | `undefined` | The fallback content to display when the avatar image fails to load.                |
| `borderColor` | `string`                               | `'gray-300'` | The color of the avatar border.                                                    |
| `borderWidth` | `number`                               | `2`         | The width of the avatar border in pixels.                                           |
| `onClick`    | `() => void`                           | `undefined` | The callback function to invoke when the avatar is clicked.                         |

### Usage

```jsx
import Avatar from './Avatar';

// Basic usage
<Avatar src="path/to/avatar.jpg" alt="User Avatar" />

// Customizing size and shape
<Avatar src="path/to/avatar.jpg" size="large" shape="rounded" />

// Applying additional styles
<Avatar
  src="path/to/avatar.jpg"
  className="custom-class"
  style={{ backgroundColor: 'red' }}
/>

// Providing a fallback
<Avatar fallback={<span>FB</span>} />

// Handling click events
<Avatar src="path/to/avatar.jpg" onClick={() => console.log('Avatar clicked')} />
```

### Fallback

If the `src` prop is not provided or the image fails to load, the `Avatar` component will display a fallback content. By default, it renders the `DefaultAvatar` component, which is an SVG icon of a person. You can customize the fallback content by passing a `fallback` prop with your desired React node.

### Styling

The `Avatar` component applies default styles based on the `size` and `shape` props. You can override or extend these styles by providing a `className` prop with your custom CSS class name(s) or by passing a `style` prop with inline styles.

The component also supports customizing the border color and width through the `borderColor` and `borderWidth` props, respectively.

### Accessibility

The `Avatar` component uses an `img` element to display the avatar image. It is important to provide a meaningful `alt` text for accessibility purposes, describing the content of the avatar image.

When the `onClick` prop is provided, the avatar becomes clickable, and the appropriate cursor style is applied to indicate interactivity.