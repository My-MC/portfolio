import { describe, expect, test } from 'bun:test';
import { isPreview, person } from '../../src/lib/seo';

describe('検索公開ポリシー', () => {
  test('mainは公開、それ以外のブランチはプレビュー', () => {
    expect(isPreview(false, 'main')).toBe(false);
    expect(isPreview(false, 'feature/x')).toBe(true);
    expect(isPreview(false)).toBe(false);
    expect(isPreview(true, 'main')).toBe(true);
  });
});

describe('構造化データ', () => {
  test('PersonにSNSのURLがsameAsとして入る', () => {
    const data = person({
      site: { url: 'https://example.com' } as never,
      profile: { displayName: 'My', handle: 'My-MC' } as never,
      social: [{ label: 'GitHub', id: '@x', url: 'https://github.com/x' }],
    });
    expect(data['@type']).toBe('Person');
    expect(data.sameAs).toEqual(['https://github.com/x']);
    expect(data.url).toBe('https://example.com/');
  });
});
