const themeButtons =
  document.querySelectorAll<HTMLButtonElement>('[data-theme-value]');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
// Keep the current preference in memory even when storage is unavailable.
let themePreference =
  document.documentElement.dataset.themePreference ?? 'system';
function applyTheme() {
  const theme =
    themePreference === 'system'
      ? systemTheme.matches
        ? 'dark'
        : 'light'
      : themePreference;
  document.documentElement.dataset.themePreference = themePreference;
  document.documentElement.dataset.theme = theme;
  for (const button of themeButtons) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.themeValue === themePreference),
    );
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', theme === 'dark' ? '#0c1012' : '#f6f7f4');
    meta.removeAttribute('media');
  });
}
applyTheme();
for (const button of themeButtons) {
  button.addEventListener('click', () => {
    themePreference = button.dataset.themeValue ?? 'system';
    applyTheme();
    try {
      localStorage.setItem('portfolio-theme', themePreference);
    } catch {
      /* 保存できない環境でも現在のページでは選択を維持 */
    }
  });
}
systemTheme.addEventListener('change', () => {
  if (themePreference === 'system') applyTheme();
});
const menuButton = document.querySelector<HTMLButtonElement>('#menu-toggle');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute(
    'aria-label',
    expanded ? 'メニューを閉じる' : 'メニューを開く',
  );
  document.querySelector('#mobile-nav')?.classList.toggle('is-open', expanded);
});
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    menuButton?.getAttribute('aria-expanded') === 'true'
  ) {
    menuButton.click();
    menuButton.focus();
  }
});
document
  .querySelectorAll<HTMLButtonElement>('[data-filter]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      let count = 0;
      document
        .querySelectorAll<HTMLElement>('[data-category]')
        .forEach((card) => {
          card.hidden =
            button.dataset.filter !== 'all' &&
            card.dataset.category !== button.dataset.filter;
          if (!card.hidden) count++;
        });
      const countLabel = document.querySelector('#filter-count');
      if (countLabel) countLabel.textContent = `${count}件`;
    });
  });
for (const pre of document.querySelectorAll('.prose .code-wrapper pre')) {
  pre.setAttribute('tabindex', '0');
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.textContent = 'コピー';
  button.setAttribute('aria-label', 'コードをコピー');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(
        pre.querySelector('code')?.textContent ?? '',
      );
      button.textContent = 'コピーしました';
    } catch {
      button.textContent = 'コピーできませんでした';
    }
    setTimeout(() => {
      button.textContent = 'コピー';
    }, 2000);
  });
  pre.parentElement?.querySelector('.code-header')?.append(button);
}
for (const table of document.querySelectorAll('.prose table')) {
  if (table.parentElement?.classList.contains('table-wrapper')) continue;
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', '表（横スクロール可能）');
  table.before(wrapper);
  wrapper.append(table);
}
interface SearchResult {
  data: () => Promise<{
    url: string;
    meta: { title?: string };
    excerpt: string;
  }>;
}
interface SearchAPI {
  search: (query: string) => Promise<{ results: SearchResult[] }>;
}
const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const input = document.querySelector<HTMLInputElement>('#search-input');
const status = document.querySelector<HTMLElement>('#search-status');
const results = document.querySelector<HTMLUListElement>('#search-results');
let pagefind: Promise<SearchAPI> | undefined;
let searchSequence = 0;
let timer: ReturnType<typeof setTimeout>;
function loadSearch() {
  const searchModulePath: string = '/pagefind/pagefind.js';
  pagefind ??= (
    import(/* @vite-ignore */ searchModulePath) as Promise<SearchAPI>
  ).catch((error: unknown) => {
    pagefind = undefined;
    throw error;
  });
  return pagefind;
}
for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-search-open]',
)) {
  button.addEventListener('click', () => {
    dialog?.showModal();
    input?.focus();
    void loadSearch().catch(() => {
      if (status)
        status.textContent =
          '検索を読み込めませんでした。ビルド後のプレビューで再度お試しください。';
    });
  });
}
document
  .querySelector('[data-search-close]')
  ?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});
dialog?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    dialog.close();
  }
});
input?.addEventListener('input', () => {
  clearTimeout(timer);
  const sequence = ++searchSequence;
  const query = input.value.trim();
  results?.replaceChildren();
  if (!query) {
    if (status) status.textContent = 'キーワードを入力してください。';
    return;
  }
  if (status) status.textContent = '検索しています…';
  timer = setTimeout(async () => {
    try {
      const api = await loadSearch();
      const found = await api.search(query);
      const entries = await Promise.all(
        found.results.slice(0, 20).map((result) => result.data()),
      );
      if (sequence !== searchSequence) return;
      if (status)
        status.textContent = found.results.length
          ? `${found.results.length}件見つかりました${found.results.length > 20 ? '（先頭20件を表示）' : ''}`
          : '該当する記事は見つかりませんでした。別のキーワードをお試しください。';
      results?.replaceChildren();
      for (const entry of entries) {
        const url = new URL(entry.url, location.origin);
        if (url.origin !== location.origin) continue;
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = url.pathname + url.hash;
        link.textContent = entry.meta.title ?? '検索結果';
        const snippet = document.createElement('p');
        const parsed = new DOMParser().parseFromString(
          entry.excerpt,
          'text/html',
        );
        snippet.textContent = parsed.body.textContent ?? '';
        item.append(link, snippet);
        results?.append(item);
      }
    } catch {
      if (sequence === searchSequence && status)
        status.textContent =
          '検索を読み込めませんでした。時間をおいて入力し直してください。';
    }
  }, 180);
});

// ---------- アニメーション ----------
const motion = document.documentElement.dataset.motion === 'on';
const toastElement = document.querySelector<HTMLElement>('[data-toast]');
let toastTimer: ReturnType<typeof setTimeout>;
export function toast(message: string) {
  if (!toastElement) return;
  toastElement.textContent = message;
  toastElement.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => toastElement.classList.remove('is-visible'),
    2400,
  );
}

// 起動ログ：クリック・キー入力でスキップ。終わったら属性を外す。
const bootScreen = document.querySelector<HTMLElement>('[data-boot-screen]');
if ('boot' in document.documentElement.dataset && bootScreen) {
  const finish = () => {
    delete document.documentElement.dataset.boot;
    document.documentElement.dataset.booted = '';
  };
  bootScreen.addEventListener('animationend', (event) => {
    if (event.target === bootScreen) finish();
  });
  bootScreen.addEventListener('click', finish);
  document.addEventListener('keydown', finish, { once: true });
}

// スクロールに合わせたフェードイン。JSが動かない場合は最初から表示される。
const revealTargets = document.querySelectorAll<HTMLElement>(
  '.section-header, .affiliation, .project-card, .post-row, .focus-card, .award-strip a, .award-list li, .activity-list li, .social-list li, .skill-table > div',
);
if (motion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  for (const target of revealTargets) {
    const siblings = target.parentElement
      ? [...target.parentElement.children]
      : [];
    target.style.setProperty(
      '--reveal-i',
      String(Math.min(siblings.indexOf(target), 6)),
    );
    observer.observe(target);
  }
}

// ボタン・ナビのデコード風ホバー
const glyphs = {
  ascii: '!<>-_\\/[]{}=+*^?#01',
  wide: 'アイウエオカキクケコサシスセソタチツテト',
};
function scramble(element: HTMLElement) {
  const node = [...element.childNodes].find(
    (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim(),
  );
  if (!node || element.dataset.scrambling) return;
  const original = node.textContent ?? '';
  element.dataset.scrambling = '1';
  element.style.minWidth = `${element.getBoundingClientRect().width}px`;
  let frame = 0;
  const total = 12;
  const tick = () => {
    frame++;
    const revealed = Math.floor((frame / total) * original.length);
    node.textContent = [...original]
      .map((char, index) => {
        if (index < revealed || /\s/.test(char)) return char;
        const set = /[\x21-\x7e]/.test(char) ? glyphs.ascii : glyphs.wide;
        return set[Math.floor(Math.random() * set.length)];
      })
      .join('');
    if (frame < total) requestAnimationFrame(() => setTimeout(tick, 28));
    else {
      node.textContent = original;
      element.style.minWidth = '';
      delete element.dataset.scrambling;
    }
  };
  tick();
}
if (motion && matchMedia('(hover: hover)').matches) {
  for (const element of document.querySelectorAll<HTMLElement>(
    '.button, .desktop-nav a, .text-link',
  ))
    element.addEventListener('mouseenter', () => scramble(element));
}

// 背景のパケット：動きを減らす設定なら止める
if (!motion)
  for (const svg of document.querySelectorAll<SVGSVGElement>(
    '[data-network-bg]',
  ))
    svg.pauseAnimations();

// 隠しコマンド：↑↑↓↓←→←→BA でCRTモード
const konami = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
let konamiIndex = 0;
document.addEventListener('keydown', (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  konamiIndex =
    key === konami[konamiIndex] ? konamiIndex + 1 : key === konami[0] ? 1 : 0;
  if (konamiIndex === konami.length) {
    konamiIndex = 0;
    const on = document.documentElement.classList.toggle('crt');
    toast(on ? '📺 CRTモード ON（もう一度で解除）' : 'CRTモード OFF');
  }
});
