# PageWrapper

A reusable component for creating consistent page layouts in the mobile app.

## Features

- Consistent page styling
- Optional scrolling behavior
- Handles overflow properly

## Usage

```jsx
import { PageWrapper } from '@/components'

// Regular page without scrolling
const RegularPage = () => {
  return (
    <PageWrapper>
      <div>Page content that doesn't need scrolling</div>
    </PageWrapper>
  )
}

// Page with scrolling content
const ScrollingPage = () => {
  return (
    <PageWrapper useScrollView={true}>
      <div>Long content that needs scrolling</div>
    </PageWrapper>
  )
}

// With custom styling
const CustomPage = () => {
  return (
    <PageWrapper
      className="customPageClass"
      contentClassName="customContentClass"
      style={{ backgroundColor: 'var(--custom-bg)' }}
      contentStyle={{ padding: '24px' }}
    >
      <div>Custom styled content</div>
    </PageWrapper>
  )
}
```

## Props

| Prop               | Type          | Default     | Description                                  |
| ------------------ | ------------- | ----------- | -------------------------------------------- |
| `children`         | ReactNode     | (required)  | The content to render inside the page        |
| `useScrollView`    | boolean       | `false`     | Whether to enable scrolling for the content  |
| `className`        | string        | `''`        | Additional class name for the page container |
| `contentClassName` | string        | `''`        | Additional class name for the content area   |
| `style`            | CSSProperties | `undefined` | Inline styles for the page container         |
| `contentStyle`     | CSSProperties | `undefined` | Inline styles for the content area           |
