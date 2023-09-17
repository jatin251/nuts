<!-- @component 
    Modaler is responsible for rendering all the modals.
    Think of it like the Portal where modals are spawned. 
-->
<script>
  import { Modals, closeModal } from 'svelte-modals';
</script>

<Modals>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    slot="backdrop"
    class="backdrop"
    on:click={closeModal}
    aria-roledescription="a"
  />
</Modals>

<style>
  .backdrop {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
