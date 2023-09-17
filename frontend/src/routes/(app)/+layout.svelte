<script>
  import IconExplore from '~icons/eos-icons/compass';
  import IconPeople from '~icons/ic/round-people-alt';
  import IconProfile from '~icons/material-symbols/person-rounded';
  import { baseButton } from '@/styles/variants';
  import Modaler from '@/components/Modals/Modaler.svelte';
</script>

<div class="relative">
  <header
    class="absolute left-0 right-0 top-0 z-20 grid h-[60px] place-items-center"
  >
    <div
      class="pointer-events-none absolute inset-0 h-[70px] bg-gradient-to-b from-[#F3F3F3] via-[#F3F3F3] to-transparent"
    />
    <a
      href="/app"
      class="relative flex w-full touch-none justify-center text-center font-circularstd text-[16px] font-semibold"
      >Resonate</a
    >
  </header>
  <div class="no flex max-h-screen min-h-screen flex-col">
    <main class="no-scrollbar flex flex-1 flex-col overflow-auto">
      <slot />
    </main>
    <footer
      class="sticky bottom-0 z-50 flex h-20 flex-shrink-0 border-t-2 border-primary-300"
    >
      <a
        href="/app"
        class={baseButton({
          class:
            'group grid flex-1 place-items-center bg-primary-500 text-white transition hover:bg-primary-400 active:bg-primary-400'
        })}
        ><IconExplore
          font-size="25"
          class="transition group-active:scale-90"
        /></a
      >
      <a
        href="/meet"
        class={baseButton({
          class:
            'group grid flex-1 place-items-center bg-primary-500 text-white transition hover:bg-primary-400 active:bg-primary-400'
        })}
        ><IconPeople
          font-size="25"
          class="transition group-active:scale-90"
        /></a
      >
      <a
        href="/profile"
        class={baseButton({
          class:
            'group grid flex-1 place-items-center bg-primary-500 text-white transition hover:bg-primary-400 active:bg-primary-400'
        })}
        ><IconProfile
          font-size="25"
          class="transition group-active:scale-90"
        /></a
      >
    </footer>
  </div>
</div>

<Modaler />
