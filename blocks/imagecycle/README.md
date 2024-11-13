# Imagecycle Block

A Franklin block that creates an interactive image carousel with automatic rotation and user controls.

## Features

- Automatic image rotation every 5 seconds
- Pause on hover
- Navigation dots
- Keyboard navigation (left/right arrow keys)
- Responsive design
- Accessibility support

## Usage

Create a table with images in your markdown document:

| Imagecycle |
|------------|
| ![Image 1](path/to/image1.jpg) |
| ![Image 2](path/to/image2.jpg) |
| ![Image 3](path/to/image3.jpg) |

## Configuration

### CSS Variables

- `--image-cycle-bg`: Background color (default: light blue)
- `--image-cycle-dot-size`: Size of navigation dots
- `--image-cycle-dot-color`: Color of inactive dots
- `--image-cycle-dot-active`: Color of active dot
- `--image-cycle-spacing`: Spacing around the carousel

## Accessibility

- Keyboard navigation support
- ARIA labels for navigation
- Focus management
- Screen reader friendly structure

## Performance

- Optimized image loading
- Minimal DOM manipulation
- Efficient event handling
- Smooth transitions

## Browser Compatibility

- Supports all modern browsers
- Graceful degradation for older browsers

## Troubleshooting

- If images don't rotate, check browser console for errors
- Ensure images are properly linked in the markdown table
- Verify CSS variables are properly set if customizing appearance 