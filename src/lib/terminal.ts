export {};

/** トップのneofetchに入力できる「触れるターミナル」。 */
interface TerminalData {
  host: string;
  profile: {
    name: string;
    handle: string;
    school: string;
    interests: string[];
  };
  clubs: { name: string; url: string }[];
  awards: string[];
  social: { label: string; url: string }[];
  projects: { id: string; title: string }[];
  posts: { id: string; title: string }[];
}

const root = document.querySelector<HTMLElement>('[data-terminal]');
const body = root?.querySelector<HTMLElement>('[data-terminal-body]');
const log = root?.querySelector<HTMLElement>('[data-terminal-log]');
const form = root?.querySelector<HTMLFormElement>('[data-terminal-form]');
const input = root?.querySelector<HTMLInputElement>('#terminal-input');
const raw = document.querySelector('#terminal-data')?.textContent;
const parseData = (text: string | null | undefined) => {
  if (!text) return undefined;
  try {
    return JSON.parse(text) as TerminalData;
  } catch {
    return undefined;
  }
};
const data = parseData(raw);

if (root && body && log && form && input && data) {
  // clear 後に neofetch で出し直せるよう、最初の表示を控えておく
  const neofetchTemplate = root.querySelector('.neofetch')?.cloneNode(true);
  const history: string[] = [];
  let cursor = 0;

  type Line =
    | string
    | { text: string; href: string }
    | { tone: string; text: string };
  const print = (lines: Line[]) => {
    for (const line of lines) {
      const p = document.createElement('p');
      p.className = 'terminal-output';
      if (typeof line === 'string') p.textContent = line || '\u00a0';
      else if ('href' in line) {
        const a = document.createElement('a');
        a.href = line.href;
        a.textContent = line.text;
        p.append(a);
      } else {
        p.textContent = line.text;
        p.classList.add(`tone-${line.tone}`);
      }
      log.append(p);
    }
    // 古い出力は捨てて、ターミナルが伸びすぎないようにする
    while (log.childElementCount > 80) log.firstElementChild?.remove();
    body.scrollTop = body.scrollHeight;
  };
  const echo = (command: string) => {
    const p = document.createElement('p');
    p.className = 'terminal-command';
    const sign = document.createElement('span');
    sign.className = 'prompt-sign';
    sign.textContent = '$';
    p.append(sign, ` ${command}`);
    log.append(p);
  };
  const go = (path: string) => {
    print([`→ ${path} を開きます…`]);
    setTimeout(() => {
      location.href = path;
    }, 350);
  };
  const setTheme = (value: string) => {
    document
      .querySelector<HTMLButtonElement>(`[data-theme-value="${value}"]`)
      ?.click();
  };
  const pages: Record<string, string> = {
    about: '/about/',
    projects: '/projects/',
    blog: '/blog/',
    links: '/links/',
    home: '/',
    '~': '/',
  };

  const commands: Record<string, (args: string[]) => Line[] | undefined> = {
    help: (args) => {
      const basic = [
        '使えるコマンド:',
        '  whoami        自己紹介',
        '  ls [dir]      projects / blog / clubs を一覧',
        '  cd <dir>      ページを移動（about, projects, blog, links）',
        '  open <name>   プロジェクトを開く（例: open lumin）',
        '  awards        受賞・実績',
        '  contact       連絡先',
        '  theme <mode>  light / dark / system',
        '  crt           ブラウン管モードの切り替え',
        '  clear         画面を消す（Ctrl+L）',
      ];
      if (!['all', '-a', '--all'].includes(args[0] ?? ''))
        return [
          ...basic,
          { tone: 'dir', text: 'ほかにも隠しコマンドがあります → help all' },
        ];
      return [
        ...basic,
        '',
        { tone: 'dir', text: '隠しコマンド:' },
        '  neofetch      もう一度表示（上にあります）',
        '  cat <file>    about / interests',
        '  history       入力履歴（↑↓でも呼び出せます）',
        '  echo <text>   そのまま返す',
        '  date / uname / uptime',
        '  ping [host]   生存確認',
        '  curl          ターミナル用の名刺',
        '  hello         あいさつ',
        '  sudo / rm -rf / exit / vim / emacs …試してみてください',
        '',
        { tone: 'dir', text: 'キーボード:' },
        '  ↑↓ 履歴 / Tab 補完 / Ctrl+L 消去',
        '  ↑↑↓↓←→←→BA（入力欄の外で）CRTモード',
      ];
    },
    whoami: () => [
      `${data.profile.name} (@${data.profile.handle})`,
      data.profile.school,
      `好きなもの: ${data.profile.interests.join(', ')}`,
    ],
    ls: (args) => {
      const target = (args[0] ?? '').replace(/^~?\/?/, '').replace(/\/$/, '');
      if (!target)
        return [
          { tone: 'dir', text: 'about/  projects/  blog/  links/  clubs/' },
        ];
      if (target === 'projects')
        return data.projects.map((project) => ({
          text: `${project.id}/  ${project.title}`,
          href: `/projects/${project.id}/`,
        }));
      if (target === 'blog')
        return data.posts.length
          ? data.posts.map((post) => ({
              text: post.title,
              href: `/blog/${post.id}/`,
            }))
          : ['（まだ記事がありません）'];
      if (target === 'clubs')
        return data.clubs.map((club) =>
          club.url ? { text: club.name, href: club.url } : club.name,
        );
      return [`ls: ${target}: そのようなファイルやディレクトリはありません`];
    },
    cd: (args) => {
      const target = (args[0] ?? '~').replace(/^\/|\/$/g, '');
      const path = Object.hasOwn(pages, target) ? pages[target] : undefined;
      if (path) go(path);
      else
        return [`cd: ${target}: そのようなファイルやディレクトリはありません`];
      return [];
    },
    open: (args) => {
      const name = (args[0] ?? '').toLowerCase();
      const project = data.projects.find(
        (item) => item.id === name || item.title.toLowerCase().includes(name),
      );
      if (name && project) go(`/projects/${project.id}/`);
      else return ['使い方: open <プロジェクト名>（ls projects で一覧）'];
      return [];
    },
    cat: (args) => {
      const target = (args[0] ?? '').replace(/\.(md|txt)$/, '');
      if (target === 'about') return commands.whoami([]);
      if (target === 'interests') return [data.profile.interests.join(' / ')];
      return [`cat: ${args[0] ?? ''}: そのようなファイルはありません`];
    },
    awards: () => data.awards.map((award) => `- ${award}`),
    contact: () =>
      data.social.map((item) => ({
        text: `${item.label.padEnd(7)} ${item.url}`,
        href: item.url,
      })),
    neofetch: () => {
      if (!root.querySelector('.neofetch') && neofetchTemplate) {
        log.append(neofetchTemplate.cloneNode(true));
        return [];
      }
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return ['↑ 上に出ています'];
    },
    theme: (args) => {
      const mode = args[0];
      if (mode !== 'light' && mode !== 'dark' && mode !== 'system')
        return ['使い方: theme light | dark | system'];
      setTheme(mode);
      return [`テーマを ${mode} にしました`];
    },
    crt: () => {
      const on = document.documentElement.classList.toggle('crt');
      return [`CRTモード: ${on ? 'ON' : 'OFF'}`];
    },
    date: () => [new Date().toString()],
    uname: () => ['MyOS 1.0 my-mc x86_64 GNU/Shibaura'],
    uptime: () => [
      'up 24/7（自宅サーバーと同じく）, load average: 課題, 部活, 自宅ラボ',
    ],
    echo: (args) => [args.join(' ')],
    history: () => history.map((item, index) => `${index + 1}  ${item}`),
    ping: (args) => {
      const host = args[0] ?? 'my-mc';
      return [
        `PING ${host}: 56 data bytes`,
        `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.19 ms`,
      ];
    },
    sudo: () => [
      {
        tone: 'warn',
        text: `${data.profile.handle} is not in the sudoers file.`,
      },
      { tone: 'warn', text: 'This incident will be reported.' },
    ],
    rm: (args) =>
      args.includes('-rf') || args.includes('-fr')
        ? [
            {
              tone: 'warn',
              text: 'やめてください。バックアップはありますが、心は1つです。',
            },
          ]
        : ['rm: 消せるものはここにはありません'],
    exit: () => ['ログアウトするには、ブラウザのタブを閉じてください 👋'],
    vim: () => [':q! と入力して脱出してください（このターミナルでは不要です）'],
    hello: () => ['こんにちは！自鯖缶で会えたらうれしいです。'],
    clear: () => {
      log.replaceChildren();
      root.querySelector('.terminal-body > .terminal-command')?.remove();
      root.querySelector('.neofetch')?.remove();
      return [];
    },
  };
  commands.ll = commands.ls;
  commands.dir = commands.ls;
  commands.vi = commands.vim;
  commands.nvim = commands.vim;
  commands.emacs = () => ['このターミナルは vim 派です（冗談です）'];
  commands.hi = commands.hello;
  commands.curl = () => [
    `ターミナルからも見られます: curl -sL ${location.host}/hi`,
  ];

  const run = (line: string) => {
    const trimmed = line.trim();
    echo(trimmed);
    if (!trimmed) return;
    history.push(trimmed);
    cursor = history.length;
    const [name = '', ...args] = trimmed.split(/\s+/);
    const key = name.toLowerCase();
    const command = Object.hasOwn(commands, key) ? commands[key] : undefined;
    try {
      const output = command
        ? command(args)
        : [`${name}: command not found（help で一覧）`];
      if (output) print(output);
    } catch {
      print([{ tone: 'warn', text: `${name}: command failed` }]);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    run(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      cursor = Math.max(0, cursor - 1);
      input.value = history[cursor] ?? '';
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      cursor = Math.min(history.length, cursor + 1);
      input.value = history[cursor] ?? '';
    } else if (event.key === 'Tab') {
      const value = input.value.trim();
      if (!value || value.includes(' ')) return;
      const match = Object.keys(commands).filter((name) =>
        name.startsWith(value),
      );
      if (match.length === 1) {
        event.preventDefault();
        input.value = `${match[0]} `;
      }
    } else if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
      event.preventDefault();
      commands.clear([]);
    }
  });
  // ブロックカーソル：入力欄のキャレット位置に反転ブロックを重ねる
  const field = root.querySelector<HTMLElement>('[data-terminal-field]');
  const mirror = root.querySelector<HTMLElement>('[data-terminal-mirror]');
  const block = root.querySelector<HTMLElement>('[data-block-cursor]');
  let typingTimer: ReturnType<typeof setTimeout>;
  const updateCursor = () => {
    if (!field || !mirror || !block) return;
    const value = input.value;
    const position = input.selectionStart ?? value.length;
    mirror.textContent = value.slice(0, position);
    // サロゲートペア（絵文字など）を割らないよう、コードポイント単位で取る
    const next = value.slice(position).codePointAt(0);
    block.textContent = value
      ? next === undefined
        ? ' '
        : String.fromCodePoint(next)
      : ([...input.placeholder][0] ?? ' ');
    block.style.left = `${mirror.offsetWidth - input.scrollLeft}px`;
  };
  const onTyping = () => {
    // 入力中は点滅を止めて、カーソルが見え続けるようにする
    field?.classList.add('is-typing');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => field?.classList.remove('is-typing'), 500);
    requestAnimationFrame(updateCursor);
  };
  for (const type of ['input', 'keydown', 'click', 'select'])
    input.addEventListener(type, onTyping);
  input.addEventListener('scroll', updateCursor);
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === input) updateCursor();
  });
  input.addEventListener('focus', () => {
    field?.classList.add('is-focused');
    updateCursor();
  });
  input.addEventListener('blur', () => field?.classList.remove('is-focused'));
  form.addEventListener('submit', () => requestAnimationFrame(updateCursor));
  updateCursor();
  void document.fonts?.ready.then(updateCursor);

  // ターミナルのどこを押しても入力欄にフォーカス（リンクと選択中は除く）
  // スマホでは不意にキーボードが出ないよう、マウス操作のときだけ
  body.addEventListener('click', (event) => {
    if (!matchMedia('(pointer: fine)').matches) return;
    if ((event.target as HTMLElement).closest('a')) return;
    if (getSelection()?.toString()) return;
    input.focus({ preventScroll: true });
  });
}
