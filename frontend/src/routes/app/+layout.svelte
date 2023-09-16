<script>
  import IconExplore from '~icons/eos-icons/compass';
  import IconPeople from '~icons/ic/round-people-alt';
  import IconProfile from '~icons/material-symbols/person-rounded';
  import { baseButton } from '@/styles/variants';
</script>

<header class="absolute left-0 right-0 top-0 grid h-[60px] place-items-center">
  <div
    class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white to-transparent"
  />
  <a
    href="/app"
    class="relative touch-none font-circularstd text-[16px] font-medium"
    >Resonate</a
  >
</header>
<div class="flex max-h-screen min-h-screen flex-col">
  <main class="flex flex-1 flex-col overflow-auto">
    <slot />
  </main>
  <footer class="sticky bottom-0 z-50 flex h-20 flex-shrink-0 bg-red-500">
    <a
      href="/app"
      class={baseButton({
        class:
          'grid flex-1 place-items-center bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-400'
      })}><IconExplore font-size="25" /></a
    >
    <a
      href="/meet"
      class={baseButton({
        class:
          'grid flex-1 place-items-center bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-400'
      })}><IconPeople font-size="25" /></a
    >
    <a
      href="/profile"
      class={baseButton({
        class:
          'grid flex-1 place-items-center bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-400'
      })}><IconProfile font-size="25" /></a
    >
  </footer>
</div>
