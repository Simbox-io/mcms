# TimePicker Component

The `TimePicker` component is a reusable React component that allows users to select a time value from a dropdown menu. It provides a customizable and user-friendly interface for time selection.

## Props

The `TimePicker` component accepts the following props:

| Prop Name         | Type                 | Default   | Description                                                                                  |
|-------------------|----------------------|-----------|----------------------------------------------------------------------------------------------|
| `value`           | `string`             | -         | The currently selected time value.                                                          |
| `onChange`        | `(time: string) => void` | -         | A callback function that is invoked when the selected time value changes.                    |
| `className`       | `string`             | `''`      | Additional CSS class name(s) to be applied to the outer container of the `TimePicker`.      |
| `inputClassName`  | `string`             | `''`      | Additional CSS class name(s) to be applied to the input field of the `TimePicker`.           |
| `popupClassName`  | `string`             | `''`      | Additional CSS class name(s) to be applied to the dropdown menu of the `TimePicker`.         |
| `format`          | `'12h'` \| `'24h'`    | `'12h'`   | The time format to be used. It can be either 12-hour (`'12h'`) or 24-hour (`'24h'`) format. |
| `hourStep`        | `number`             | `1`       | The step value for hours when generating time options.                                       |
| `minuteStep`      | `number`             | `1`       | The step value for minutes when generating time options.                                     |

## Usage

To use the `TimePicker` component in your React application, follow these steps:

1. Import the `TimePicker` component into your file:

```jsx
import TimePicker from './TimePicker';
```

2. Render the `TimePicker` component with the desired props:

```jsx
const [selectedTime, setSelectedTime] = useState('09:00');

const handleTimeChange = (time) => {
  setSelectedTime(time);
};

return (
  <TimePicker
    value={selectedTime}
    onChange={handleTimeChange}
    format="12h"
    hourStep={1}
    minuteStep={30}
  />
);
```

3. Customize the appearance and behavior of the `TimePicker` by providing different prop values.

## Functionality

The `TimePicker` component allows users to select a time value from a dropdown menu. When the input field is clicked, the dropdown menu opens, displaying a list of time options based on the specified `format`, `hourStep`, and `minuteStep` props.

Users can click on a time option to select it, and the selected time will be displayed in the input field. The `onChange` callback function will be invoked with the selected time value whenever the selection changes.

## Styling

The `TimePicker` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the component. The appearance of the `TimePicker` can be customized by providing additional CSS classes through the `className`, `inputClassName`, and `popupClassName` props.

- The `className` prop applies additional classes to the outer container of the `TimePicker`.
- The `inputClassName` prop applies additional classes to the input field of the `TimePicker`.
- The `popupClassName` prop applies additional classes to the dropdown menu of the `TimePicker`.

## Time Format

The `TimePicker` component supports both 12-hour and 24-hour time formats. The desired format can be specified using the `format` prop. By default, it uses the 12-hour format (`'12h'`).

When the 12-hour format is used, the time options in the dropdown menu will be displayed with "AM" or "PM" suffixes, and the selected time will be formatted accordingly in the input field.

## Time Step

The `hourStep` and `minuteStep` props allow you to control the step values for hours and minutes when generating time options. By default, both `hourStep` and `minuteStep` are set to `1`, meaning that all hours and minutes will be included in the dropdown menu.

You can adjust these values to generate time options with larger intervals. For example, setting `hourStep` to `2` will generate time options with even hours only, and setting `minuteStep` to `15` will generate time options with 15-minute intervals.