import { describe, expect, test } from 'bun:test';
import {
  comparePosts,
  isPublished,
  readingMinutes,
  slugPattern,
} from '../../src/lib/publishing';
import { validateSources } from '../../src/lib/validate-source';

describe('公開ポリシー', () => {
  const now = new Date('2026-11-15T00:00:00+09:00');
  test('下書きは公開しない', () => {
    expect(isPublished({ draft: true }, now)).toBe(false);
  });
  test('未来の日付は公開しない', () => {
    expect(
      isPublished(
        { draft: false, publishedAt: new Date('2026-12-01T00:00:00Z') },
        now,
      ),
    ).toBe(false);
    expect(
      isPublished(
        { draft: false, publishedAt: new Date('2026-11-01T00:00:00Z') },
        now,
      ),
    ).toBe(true);
  });
  test('新しい順に並ぶ', () => {
    const a = { id: 'a', data: { publishedAt: new Date('2026-01-01') } };
    const b = { id: 'b', data: { publishedAt: new Date('2026-02-01') } };
    expect([a, b].sort(comparePosts).map((post) => post.id)).toEqual([
      'b',
      'a',
    ]);
  });
  test('slugは小文字英数字とハイフンのみ', () => {
    expect(slugPattern.test('hello-world')).toBe(true);
    expect(slugPattern.test('Hello_World')).toBe(false);
  });
  test('読了時間は最低1分', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('あ'.repeat(1500))).toBe(3);
  });
  test('リポジトリのコンテンツは事前検査を通る', async () => {
    await validateSources();
  });
});
