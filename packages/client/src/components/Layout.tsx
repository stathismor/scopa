import { Box, BoxProps } from 'theme-ui';

export const Layout = (props: BoxProps) => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      m: '0 auto',
      position: 'relative',
    }}
    {...props}
  />
);
