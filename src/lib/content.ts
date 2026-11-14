import { type CollectionEntry, getCollection } from 'astro:content';
import { comparePosts, isPublished } from './publishing';

export async function publishedBlog() {
  return (
    await getCollection(
      'blog',
      ({ data }) => import.meta.env.DEV || isPublished(data),
    )
  ).sort(comparePosts);
}
export async function publishedProjects() {
  return (
    await getCollection(
      'projects',
      ({ data }) => import.meta.env.DEV || isPublished(data),
    )
  ).sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      a.id.localeCompare(b.id),
  );
}
export function relatedPosts(
  post: CollectionEntry<'blog'>,
  posts: CollectionEntry<'blog'>[],
) {
  const score = (entry: CollectionEntry<'blog'>) =>
    entry.data.tags.filter((tag) => post.data.tags.includes(tag)).length;
  return posts
    .filter((entry) => entry.id !== post.id)
    .sort((a, b) => score(b) - score(a) || comparePosts(a, b))
    .slice(0, 2);
}
