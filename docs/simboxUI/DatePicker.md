# DatePicker Component

The `DatePicker` component is a reusable React component that allows users to select a date from a calendar interface. It provides a customizable and interactive date picker with support for minimum and maximum selectable dates, custom styling, and smooth animations.

## Props

The `DatePicker` component accepts the following props:

| Prop Name              | Type                  | Default   | Description                                                                         |
|------------------------|----------------------|-----------|-----------------------------------------------------------------------------------|
| `selected`             | `Date`                | -         | The currently selected date.                                                     |
| `onChange`             | `(date: Date) => void` | -         | Callback function invoked when a date is selected, receiving the selected date.  |
| `minDate`              | `Date`                | -         | The minimum selectable date.                                                     |
| `maxDate`              | `Date`                | -         | The maximum selectable date.                                                     |
| `className`            | `string`              | `''`      | Additional CSS class name(s) to be applied to the date picker container.         |
| `inputClassName`       | `string`              | `''`      | Additional CSS class name(s) to be applied to the date input field.              |
| `calendarClassName`    | `string`              | `''`      | Additional CSS class name(s) to be applied to the calendar container.            |
| `dayClassName`         | `string`              | `''`      | Additional CSS class name(s) to be applied to each day button in the calendar.   |
| `selectedDayClassName` | `string`              | `''`      | Additional CSS class name(s) to be applied to the selected day button.           |
| `disabledDayClassName` | `string`              | `''`      | Additional CSS class name(s) to be applied to disabled day buttons.              |
| `monthYearClassName`   | `string`              | `''`      | Additional CSS class name(s) to be applied to the month and year display.        |
| `prevMonthClassName`   | `string`              | `''`      | Additional CSS class name(s) to be applied to the previous month button.         |
| `nextMonthClassName`   | `string`              | `''`      | Additional CSS class name(s) to be applied to the next month button.             |

## Usage

To use the `DatePicker` component in your React application, follow these steps:

1. Import the `DatePicker` component into your file:

```jsx
import DatePicker from './DatePicker';
```

2. Render the `DatePicker` component with the desired props:

```jsx
<DatePicker
  selected={selectedDate}
  onChange={handleDateChange}
  minDate={minDate}
  maxDate={maxDate}
/>
```

3. Customize the appearance and behavior of the date picker by providing different prop values.

## Functionality

The `DatePicker` component provides the following functionality:

- Displays a text input field showing the currently selected date in the format "MM/dd/yyyy".
- Clicking on the input field toggles the visibility of the calendar.
- The calendar displays the days of the current month, with the ability to navigate to previous and next months.
- Clicking on a day in the calendar selects that date and updates the input field.
- The selected date is highlighted in the calendar.
- Disabled dates (outside the allowed range) are visually distinguished and not selectable.
- The calendar animates smoothly when opening and closing.

## Styling

The `DatePicker` component allows for customization of its appearance through CSS class names. The following class names can be provided via the respective props:

- `className`: Applied to the outer container of the date picker.
- `inputClassName`: Applied to the date input field.
- `calendarClassName`: Applied to the calendar container.
- `dayClassName`: Applied to each day button in the calendar.
- `selectedDayClassName`: Applied to the selected day button.
- `disabledDayClassName`: Applied to disabled day buttons.
- `monthYearClassName`: Applied to the month and year display.
- `prevMonthClassName`: Applied to the previous month button.
- `nextMonthClassName`: Applied to the next month button.

By providing custom CSS classes, you can style the date picker to match your application's design.

## Dependencies

The `DatePicker` component has the following dependencies:

- `react`: The React library for building user interfaces.
- `framer-motion`: A library for creating smooth animations in React.
- `date-fns`: A lightweight JavaScript date utility library for manipulating and formatting dates.

Make sure to install these dependencies before using the `DatePicker` component.