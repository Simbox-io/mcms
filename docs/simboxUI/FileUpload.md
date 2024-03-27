# FileUpload Component

The `FileUpload` component is a reusable React component that allows users to select and upload files. It provides a user-friendly interface for dragging and dropping files or selecting files using a file input.

## Props

The `FileUpload` component accepts the following props:

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `onFileSelect` | `(files: FileList \| null) => void` | - | Callback function invoked when files are selected. |
| `onUpload` | `(files: File[]) => void` | - | Callback function invoked when the upload button is clicked. |
| `accept` | `string` | `'*'` | File types that are accepted for upload. |
| `multiple` | `boolean` | `false` | Allows multiple files to be selected. |
| `maxSize` | `number` | `Infinity` | Maximum size allowed for each file (in bytes). |
| `minSize` | `number` | `0` | Minimum size allowed for each file (in bytes). |
| `maxFiles` | `number` | `Infinity` | Maximum number of files allowed to be uploaded. |
| `label` | `string` | `'Drag and drop files here or'` | Label text for the dropzone. |
| `uploadLabel` | `string` | `'Upload'` | Label text for the upload button. |
| `dragActiveLabel` | `string` | `'Drop the files here'` | Label text when files are being dragged over the dropzone. |
| `className` | `string` | `''` | Additional CSS class name for the component container. |
| `fileClassName` | `string` | `''` | Additional CSS class name for each file item. |
| `dropzoneClassName` | `string` | `''` | Additional CSS class name for the dropzone. |
| `labelClassName` | `string` | `''` | Additional CSS class name for the label text. |
| `uploadClassName` | `string` | `''` | Additional CSS class name for the upload button. |
| `dragActiveClassName` | `string` | `''` | Additional CSS class name when files are being dragged over the dropzone. |
| `errorClassName` | `string` | `''` | Additional CSS class name for the error messages. |

## Usage

To use the `FileUpload` component in your React application, follow these steps:

1. Import the `FileUpload` component into your file:

```jsx
import FileUpload from './FileUpload';
```

2. Render the `FileUpload` component with the desired props:

```jsx
<FileUpload
  onFileSelect={handleFileSelect}
  onUpload={handleUpload}
  accept=".jpg,.png"
  multiple
  maxSize={1024 * 1024 * 5} // 5MB
  maxFiles={3}
/>
```

3. Implement the `onFileSelect` and `onUpload` callback functions to handle the selected files and perform the upload logic.

## Functionality

The `FileUpload` component provides the following functionality:

- Drag and drop files: Users can drag and drop files onto the dropzone to select them for upload.
- File input: Users can click on the upload button to open the file input dialog and select files.
- File validation: The component validates the selected files based on the specified `accept`, `maxSize`, `minSize`, and `maxFiles` props.
- Error handling: If any file fails the validation, error messages are displayed to the user.
- File list: The selected files are displayed as a list, showing the file name and size.
- Remove files: Users can remove individual files from the selected file list.
- Upload button: Clicking the upload button triggers the `onUpload` callback with the selected files.

## Styling

The `FileUpload` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the component. The appearance can be customized by providing additional CSS class names through the various `className` props.

The component also includes some default styling for the dropzone, file list, and error messages. You can override or extend these styles using the provided class names.

## Dependencies

The `FileUpload` component has the following dependencies:

- `react`: The React library itself.
- `Button`: A custom `Button` component used for the upload button.
- `CloudUploadIcon`: An icon component used to display the upload icon in the dropzone.

Make sure to have these dependencies available in your project.

## File Size Formatting

The `formatSize` function is a utility function used internally by the `FileUpload` component to format the file sizes in a human-readable format (bytes, KB, MB, or GB). It takes a `size` parameter representing the file size in bytes and returns the formatted size as a string.