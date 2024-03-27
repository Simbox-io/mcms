# Table Component

The `Table` component is a reusable React component that renders a customizable table with sorting, pagination, and row click functionality. It supports generic typing to ensure type safety for the table data and column definitions.

## Props

The `Table` component accepts the following props:

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `columns` | `TableColumn<T>[]` | - | An array of column definitions for the table. |
| `data` | `T[]` | - | The data to be displayed in the table rows. |
| `onRowClick` | `(row: T) => void` | - | Callback function to be invoked when a table row is clicked. |
| `sortColumn` | `keyof T` | - | The column key by which the table is currently sorted. |
| `sortDirection` | `'asc' \| 'desc'` | - | The current sort direction of the table. |
| `onSort` | `(column: keyof T) => void` | - | Callback function to be invoked when a sortable column header is clicked. |
| `className` | `string` | `''` | Additional CSS class name(s) to be applied to the table container. |
| `rowClassName` | `string` | `''` | Additional CSS class name(s) to be applied to each table row. |
| `headerClassName` | `string` | `''` | Additional CSS class name(s) to be applied to the table header. |
| `cellClassName` | `string` | `''` | Additional CSS class name(s) to be applied to each table cell. |
| `pagination` | `{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; }` | - | Pagination configuration for the table. |
| `loading` | `boolean` | `false` | Indicates whether the table is in a loading state. |
| `loadingText` | `string` | `'Loading...'` | Text to be displayed when the table is in a loading state. |
| `emptyText` | `string` | `'No data available'` | Text to be displayed when the table has no data. |

## Usage

To use the `Table` component in your React application, follow these steps:

1. Import the `Table` component into your file:

```jsx
import Table from './Table';
```

2. Define the column configuration and table data:

```jsx
const columns: TableColumn<YourDataType>[] = [
  { header: 'Column 1', accessor: 'column1' },
  { header: 'Column 2', accessor: 'column2', sortable: true },
  { header: 'Column 3', accessor: (row) => <CustomComponent data={row} /> },
];

const data: YourDataType[] = [
  { column1: 'Row 1, Column 1', column2: 'Row 1, Column 2' },
  { column1: 'Row 2, Column 1', column2: 'Row 2, Column 2' },
  // ...
];
```

3. Render the `Table` component with the desired props:

```jsx
<Table<YourDataType>
  columns={columns}
  data={data}
  onRowClick={handleRowClick}
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={handleSort}
  pagination={{
    currentPage: currentPage,
    totalPages: totalPages,
    onPageChange: handlePageChange,
  }}
  loading={isLoading}
/>
```

4. Customize the appearance and behavior of the table by providing different prop values.

## Column Configuration

The `columns` prop accepts an array of `TableColumn<T>` objects, where `T` represents the type of the table data. Each column object has the following properties:

- `header` (required): The text to be displayed in the column header.
- `accessor` (required): The key of the data object to be displayed in the column cells, or a function that returns the cell content.
- `sortable` (optional): Indicates whether the column is sortable. Defaults to `false`.
- `className` (optional): Additional CSS class name(s) to be applied to the column header and cells.
- `width` (optional): The width of the column.

## Sorting

The `Table` component supports sorting functionality. To enable sorting for a column, set the `sortable` property to `true` in the column configuration. When a sortable column header is clicked, the `onSort` callback function will be invoked with the column key as an argument. You can use this callback to update the `sortColumn` and `sortDirection` props to reflect the current sort state.

## Pagination

The `Table` component supports pagination functionality. To enable pagination, provide the `pagination` prop with the following properties:

- `currentPage`: The current page number.
- `totalPages`: The total number of pages.
- `onPageChange`: Callback function to be invoked when the page is changed, receiving the new page number as an argument.

The pagination controls will be rendered below the table if the `pagination` prop is provided.

## Loading and Empty States

The `Table` component handles loading and empty states. When the `loading` prop is set to `true`, a loading message will be displayed in the table body. The loading text can be customized using the `loadingText` prop.

If the `data` prop is empty or not provided, an empty message will be displayed in the table body. The empty text can be customized using the `emptyText` prop.

## Styling

The `Table` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the table. You can customize the appearance of the table by providing additional CSS classes through the `className`, `rowClassName`, `headerClassName`, and `cellClassName` props.

The table is designed with a dark theme by default, but you can modify the CSS classes to match your desired theme.

## Icon Components

The `Table` component includes three icon components: `ChevronUpIcon`, `ChevronDownIcon`, and `ChevronUpDownIcon`. These icons are used to indicate the sorting direction of columns. You can customize the icons by modifying the SVG paths in the respective components.