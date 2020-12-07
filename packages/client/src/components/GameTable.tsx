import { Flex, FlexProps } from 'theme-ui';

export const GameTable = (props: FlexProps) => (
  <Flex
    sx={{
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
    }}
    {...props}
  />
);
