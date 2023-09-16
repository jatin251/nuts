import { writable } from 'svelte/store';

export const authLayoutStore = writable<{
  mode: 'login-register' | 'new-account';
}>({
  mode: 'login-register'
});

export const setMode = (mode: 'login-register' | 'new-account') => {
  authLayoutStore.update((store) => {
    store.mode = mode;
    return store;
  });
};
