import { Box, BoxProps } from 'theme-ui';

export const Layout = (props: BoxProps) => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      maxWidth: 1200,
      m: '0 auto',
    }}
    {...props}
  />
);
