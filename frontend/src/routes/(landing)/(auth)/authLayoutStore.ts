import { writable } from 'svelte/store';

export const authLayoutStore = writable<{
  mode: 'login-register' | 'new-account';
}>({
  mode: 'login-register'
});

/** Sets the current mode in Auth Layout Store. (For styling purposes) */
export const setMode = (mode: 'login-register' | 'new-account') => {
  authLayoutStore.update((store) => {
    store.mode = mode;
    return store;
  });
};
