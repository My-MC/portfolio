import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { site } from './src/data/site';
import { articleEnhancements } from './src/hast/article';

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Portfolio Sans',
      cssVariable: '--font-sans-jp',
      display: 'swap',
      options: {
        variants: [400, 700].map((weight) => ({
          src: [`./.font-trial/sans-jp-${weight}.woff2`],
          weight,
          style: 'normal',
        })),
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Portfolio Mono',
      cssVariable: '--font-mono-latin',
      display: 'swap',
      options: {
        variants: [400, 700].map((weight) => ({
          src: [`./.font-trial/mono-${weight}.woff2`],
          weight,
          style: 'normal',
        })),
      },
    },
  ],
  image: { dangerouslyProcessSVG: true },
  integrations: [
    mdx(),
    sitemap({
      filter: (url) => !/^\/404(?:\/|\.html)?$/.test(new URL(url).pathname),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: satteri({
      hastPlugins: [satteriHeadingIdsPlugin(), articleEnhancements],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },
    },
  },
});
