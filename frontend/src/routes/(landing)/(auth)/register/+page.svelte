<script lang="ts">
  import { button } from '@/styles/variants';
</script>

<div class="flex flex-col gap-y-8">
  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Username</h2>
    <input
      type="text"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Create your username"
    />
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Email</h2>
    <input
      type="email"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Use your existing email"
    />
  </div>

  <div class="flex flex-col">
    <h2 class="font-productsans text-2xl font-semibold text-white">Password</h2>
    <input
      type="password"
      class="border-b-2 border-white bg-transparent pb-2 text-xl text-white outline-none placeholder:text-white/50"
      placeholder="Create your password"
    />
  </div>
</div>

<!-- Simulate the height of the Button -->
<div class="h-16" />

<!-- Make Button Stay at the Bottom for next pages -->
<div
  class="fixed bottom-0 left-0 right-0 flex justify-center"
  style="padding-bottom: 10vh;"
>
  <a href="/login" class={button({ color: 'secondary' })}>Create Account</a>
</div>
