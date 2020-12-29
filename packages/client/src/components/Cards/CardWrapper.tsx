import { PropsWithChildren, MouseEvent, useRef } from 'react';
import { Box } from 'theme-ui';
import { useSpring, animated, config } from 'react-spring';

type CardWrapperProps = PropsWithChildren<{
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  isMoving: boolean;
  moveTo: {
    x: number;
    y: number;
  };
}>;

const INITIAL_POSITION = { y: 0, x: 0 };

export const CardWrapper = ({ isMoving, moveTo, ...rest }: CardWrapperProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { x, y } = ref.current?.getBoundingClientRect() ?? INITIAL_POSITION;
  const { xys } = useSpring({
    config: config.slow,
    xys: isMoving ? [moveTo.x - x, moveTo.y - y, 0.9] : [0, 0, 1],
  });

  console.log(isMoving, { x, y, moveTo }, moveTo.x - x, moveTo.y - y);
  return (
    <animated.div
      style={{
        transform: xys.interpolate(
          // @ts-ignore interpolations with more than one parameter fails
          (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`,
        ),
      }}
    >
      <Box ref={ref} role="button" {...rest} />
    </animated.div>
  );
};
