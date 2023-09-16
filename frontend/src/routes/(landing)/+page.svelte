<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { button } from '@/styles/variants';
  import {
    animate,
    stagger,
    spring,
    timeline,
    type TimelineDefinition
  } from 'motion';
  import { onMount } from 'svelte';

  onMount(() => {
    const sequence: TimelineDefinition = [
      [
        '.chat-bubble',
        { scale: [0.5, 1], opacity: [0, 1] },
        { easing: spring({ stiffness: 80 }), delay: stagger(0.5) }
      ],
      [
        document.querySelectorAll('.chat-bubble')[0],
        { x: -7 },
        { duration: 1.1, easing: 'ease-out' }
      ],
      [
        '.chat-bubble',
        { opacity: [1, 0.8, 1], scale: [1, 1.04, 1] },
        {
          duration: 1.5,
          delay: stagger(0.3, { easing: 'ease-in-out' }),
          easing: 'ease-in-out'
        }
      ],
      [
        document.querySelectorAll('.chat-bubble')[2],
        { x: 17 },
        { duration: 1.5, easing: 'ease-out' }
      ],
      ['.chat-bubble', { z: 1 }, { duration: 2 }],
      [
        document.querySelectorAll('.chat-bubble')[0],
        { opacity: [1, 0.8, 1] },
        { duration: 1, easing: 'ease-out', at: '<' }
      ],
      [
        '.chat-bubble',
        { opacity: [1, 0.8, 1], scale: [1, 1.04, 1] },
        {
          duration: 1.5,
          delay: stagger(0.3, { easing: 'ease-in-out', from: 'last' }),
          easing: 'ease-in-out'
        }
      ],
      [
        document.querySelectorAll('.chat-bubble')[1],
        { x: -18 },
        { duration: 1.5, easing: 'ease-out' }
      ],
      [
        '.chat-bubble',
        { scale: [1, 0.5], opacity: [1, 0] },
        {
          easing: spring({ stiffness: 80 }),
          delay: stagger(undefined, {
            from: 'last'
          })
        }
      ]
    ];

    timeline(sequence, { repeat: Infinity, duration: 10 });
  });

  onNavigate((navigation) => {
    if (!(document as any).startViewTransition) return;

    return new Promise((resolve) => {
      (document as any).startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<div class="flex min-h-screen flex-col bg-primary-500">
  <div class="flex h-full flex-grow items-center">
    <div
      class="mx-auto flex w-full max-w-xl flex-col justify-center gap-y-5 px-9 py-16"
    >
      <div style="view-transition-name: resonate-logo;">
        <a href="/">
          <h1 class="text-center font-circularstd text-5xl text-white">
            Resonate
          </h1>
        </a>
      </div>

      <div class="flex flex-col items-center gap-y-8 text-gray-600">
        <div
          class="chat-bubble self-start rounded-xl bg-white bg-opacity-80 px-7 py-6 shadow-lg"
        >
          🔉 A new <b>audio-based</b> social media.
        </div>
        <div
          class="chat-bubble self-end rounded-xl bg-white px-7 py-6 shadow-lg"
        >
          Don't read, just <b>listen</b>. 👂
        </div>
        <div
          class="chat-bubble ml-5 max-w-xs self-start rounded-xl bg-white bg-opacity-90 px-7 py-6 shadow-lg"
        >
          🎶 <b>Resonate</b> with your friends, without the noise.
        </div>

        <!-- Simulate the height of the Button -->
        <div class="h-16" />

        <!-- Make Button Stay at the Bottom for next pages -->
        <div class="fixed bottom-0" style="padding-bottom: 10vh;">
          <a href="/login" class={button({ color: 'secondary' })}>Get Started</a
          >
        </div>
      </div>
    </div>
  </div>
</div>
