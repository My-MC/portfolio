import { describe, expect, test } from 'bun:test';
import { previewName, previewUrl } from '../../scripts/preview-target';

describe('Preview名とURL', () => {
  test('ブランチ名をDNSラベルに変換する', () => {
    expect(previewName('feature/Add_Terminal')).toBe('feature-add-terminal');
    expect(previewName('dependabot/bun/astro-7.5')).toBe(
      'dependabot-bun-astro-7-5',
    );
    expect(previewName('123-fix')).toBe('b-123-fix');
  });
  test('63文字に収まる', () => {
    const name = previewName('a'.repeat(100));
    expect(`${name}-portfolio`.length).toBeLessThanOrEqual(63);
  });
  test('Preview URL', () => {
    expect(previewUrl('feature/x')).toBe(
      'https://feature-x-portfolio.my-mc.workers.dev',
    );
  });
});
