# Breadcrumbs Component

The `Breadcrumbs` component is a reusable React component that displays a navigation breadcrumb trail. It allows users to navigate through a hierarchy of pages or sections within an application.

## Props

The `Breadcrumbs` component accepts the following props:

| Prop Name             | Type                                                 | Default                                                 | Description                                                                                                                                         |
|-----------------------|------------------------------------------------------|----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `items`               | `BreadcrumbItem[]`                                   | -                                                       | An array of `BreadcrumbItem` objects representing the items in the breadcrumb trail.                                                                  |
| `className`           | `string`                                             | `''`                                                    | Additional CSS class name(s) to be applied to the breadcrumb navigation container.                                                                   |
| `itemClassName`       | `string`                                             | `''`                                                    | Additional CSS class name(s) to be applied to each breadcrumb item link.                                                                             |
| `activeItemClassName` | `string`                                             | `''`                                                    | Additional CSS class name(s) to be applied to the active (last) breadcrumb item.                                                                     |
| `separatorClassName`  | `string`                                             | `''`                                                    | Additional CSS class name(s) to be applied to the separator between breadcrumb items.                                                                |
| `separator`           | `React.ReactNode`                                    | `<ChevronRightSVG className="w-4 h-4 text-gray-400" />` | The separator element to be rendered between breadcrumb items. Defaults to a chevron right SVG icon.                                                 |
| `renderItem`          | `(item: BreadcrumbItem, isLast: boolean) => React.ReactNode` | -                                                       | A render prop function that allows custom rendering of each breadcrumb item. If provided, it overrides the default rendering of the breadcrumb items. |

The `BreadcrumbItem` interface defines the shape of each item in the `items` array:

```typescript
interface BreadcrumbItem {
  label: string;
  href: string;
}
```

- `label`: The text label for the breadcrumb item.
- `href`: The URL or path for the breadcrumb item link.

## Usage

To use the `Breadcrumbs` component in your React application, follow these steps:

1. Import the `Breadcrumbs` component into your file:

```jsx
import Breadcrumbs from './Breadcrumbs';
```

2. Define an array of `BreadcrumbItem` objects representing the items in the breadcrumb trail:

```jsx
const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Subcategory', href: '/category/subcategory' },
  { label: 'Product', href: '/category/subcategory/product' },
];
```

3. Render the `Breadcrumbs` component with the desired props:

```jsx
<Breadcrumbs items={breadcrumbItems} />
```

4. Customize the appearance and behavior of the breadcrumbs by providing different prop values.

## Customization

The `Breadcrumbs` component provides several props for customization:

- Use the `className`, `itemClassName`, `activeItemClassName`, and `separatorClassName` props to apply custom CSS classes to the breadcrumb navigation container, item links, active item, and separators, respectively.
- Provide a custom separator element using the `separator` prop to replace the default chevron right SVG icon.
- Use the `renderItem` prop to provide a custom render function for each breadcrumb item. This allows you to have full control over the rendering of each item.

## Accessibility

The `Breadcrumbs` component follows accessibility best practices by using semantic HTML elements and ARIA attributes:

- The breadcrumb navigation is wrapped in a `<nav>` element with an `aria-label` of "Breadcrumb" to indicate its purpose.
- The breadcrumb items are rendered as an ordered list (`<ol>`) to convey the hierarchical structure.
- The active (last) breadcrumb item is marked with an `aria-current` attribute set to "page" to indicate the current page.