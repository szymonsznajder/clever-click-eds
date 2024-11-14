# Hero Video Block

A full-width hero video block with optional overlay text and controls.

## Features

- Full-width video background
- Optional overlay text
- Configurable video controls
- Autoplay, loop, and mute options
- Responsive design
- Accessible video player

## Usage

The block requires a video URL in the first column and optional overlay text in the second column.

| Hero Video  |
| ----------- |
| [Video URL] |

## Variations

- controls: Adds video controls
- nomute: Enables sound
- noautoplay: Disables autoplay
- noloop: Disables video loop

## Configuration

CSS Variables available for customization:

- --herovideo-height: Video height (default: 100vh)
- --herovideo-min-height: Minimum height (default: 400px)
- --herovideo-overlay-bg: Overlay background color (default: rgba(0, 0, 0, 0.4))
- --herovideo-text-color: Overlay text color (default: #ffffff)

## Accessibility

- Video includes appropriate ARIA labels
- Keyboard controls when video controls are enabled
- Proper contrast for overlay text
- Screen reader support

## Performance

- Video is lazy-loaded
- Optimized for mobile devices
- Responsive image scaling
- Minimal DOM manipulation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

- Ensure video URL is accessible and in MP4 format
- Check browser autoplay policies if video doesn't start
- Verify proper video dimensions for optimal display
