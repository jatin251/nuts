import { tv } from 'tailwind-variants';

/** Completely unstyled button, only with the right accessibility styles. */
export const baseButton = tv({
  base: 'block cursor-pointer touch-none select-none outline-primary-200 active:scale-95'
});

/** General Rounded Buttons. */
export const button = tv({
  base: 'transform rounded-full font-circularstd shadow transition',
  extend: baseButton,
  variants: {
    color: {
      primary: 'bg-primary-500 text-white ',
      secondary: 'bg-white text-primary-500'
    },
    size: {
      lg: 'px-20 py-4 text-2xl'
    }
  },
  defaultVariants: {
    size: 'lg',
    color: 'primary',
    rounded: 'full'
  }
});
