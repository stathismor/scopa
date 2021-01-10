import { PropsWithChildren, MouseEvent } from 'react';
import { Box } from 'theme-ui';

type CardWrapperProps = PropsWithChildren<{
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  id: string;
}>;

export const CardWrapper = ({ id, ...rest }: CardWrapperProps) => {
  return (
    <Box id={`card_${id}`}>
      <Box role="button" {...rest} />
    </Box>
  );
};
