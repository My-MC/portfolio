import rss from '@astrojs/rss';
import { site } from '../data/site';
import { publishedBlog } from '../lib/content';

export async function GET() {
  const posts = await publishedBlog();
  return rss({
    title: `${site.name}のブログ`,
    description: site.description,
    site: site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>ja</language>',
  });
}
