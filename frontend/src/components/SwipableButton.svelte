<script lang="ts">
  import IconArrow from '~icons/ic/round-arrow-forward';
  import { baseButton } from '@/styles/variants';
  import { spring } from 'svelte/motion';
  import { drag } from 'svelte-gesture';

  export let onSwipeMaxRelease: () => void = () => {};

  let buttonPos = spring(
    { x: 0, y: 0 },
    {
      precision: 10,
      damping: 0.8
    }
  );
  function clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }

  function dragHandler({ detail }: any) {
    const {
      active,
      movement: [mx, my]
    } = detail;

    buttonPos.set(
      {
        x: active ? clamp(mx, -30, 5) : 0,
        y: active ? 0 : 0
      },
      active
        ? undefined
        : {
            soft: true
          }
    );

    if ($buttonPos.x >= -30 && !active) {
      onSwipeMaxRelease?.(); // Trigger the event.
    }
  }
</script>

<div class="absolute bottom-0 right-0 top-0 z-20 flex items-center">
  <button
    use:drag
    on:drag={dragHandler}
    style="transform: translate({$buttonPos.x}px, 0px);"
    class={baseButton({
      class:
        'absolute -right-10 flex h-20 w-40  items-center gap-x-1 rounded-l-full bg-primary-500 pl-8 text-white transition active:scale-90'
    })}><IconArrow class="rotate-180" />Swipe</button
  >
</div>
