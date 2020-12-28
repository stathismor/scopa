export const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace',
  },
  radii: [0, '0.75vw'],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#07c',
    secondary: '#30c',
    muted: '#f6f6f6',
    darkGrey: '#444',
    lightGrey: '#ccc',
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      overflow: 'hidden',
    },
  },
  buttons: {
    outline: {
      border: '2px solid',
      borderColor: 'text',
      color: 'text',
      bg: 'transparent',
      '&:disabled': {
        borderColor: 'lightGrey',
        color: 'lightGrey',
      },
      '&:focus': {
        boxShadow: `rgba(32, 51, 69, 0.04) 0.25rem 0px 0px 0px,
            rgba(32, 51, 69, 0.04) -0.25rem 0px 0px 0px,
            rgba(32, 51, 69, 0.04) 0px 0px 0px 9999px inset`,
        outline: 0,
      },
    },
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 4,
      border: '1px solid',
      borderColor: 'text',
    },
    compact: {
      padding: 1,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'muted',
    },
  },
};
