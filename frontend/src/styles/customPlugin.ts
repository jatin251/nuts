// https://github.com/tailwindlabs/tailwindcss-intellisense/issues/227#issuecomment-1221083129

import plugin from 'tailwindcss/plugin';

const customPlugin = plugin(({ addComponents }) => {
  addComponents({
    '.no-scrollbar': {
      /* Hide scrollbar for Chrome, Safari and Opera */
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      /* Hide scrollbar for IE, Edge and Firefox */
      '-ms-overflow-style': 'none' /* IE and Edge */,
      'scrollbar-width': 'none' /* Firefox */
    }
  });
});

export default customPlugin;
