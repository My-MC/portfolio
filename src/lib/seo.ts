import { profile, site, social } from '../data/site';

export interface SocialImage {
  src: string;
  width: number;
  height: number;
  type: string;
  alt: string;
}
export interface Breadcrumb {
  name: string;
  path: string;
}
export const defaultSocialImage: SocialImage = {
  src: '/og.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: `${profile.displayName}（${profile.handle}）のポートフォリオ`,
};

export const personId = new URL('/#person', site.url).href;

export function isPreview(preview: boolean, branch?: string): boolean {
  return preview || (!!branch && branch !== 'main');
}

export function person(data = { site, profile, social }) {
  const sameAs = [
    ...new Set(data.social.map((s) => s.url.trim()).filter(Boolean)),
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': new URL('/#person', data.site.url).href,
    name: data.profile.displayName,
    alternateName: data.profile.handle,
    url: new URL('/', data.site.url).href,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbList(items: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}
