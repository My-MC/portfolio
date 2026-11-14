/**
 * Workers Previews の名前とURLを、ビルドとデプロイで同じ規則から決める。
 * Preview URL: https://<name>-<worker>.<subdomain>.workers.dev
 */
export const workerName = 'portfolio';
export const workersSubdomain = 'my-mc';

/** ブランチ名を Preview 名（DNSラベルとして使える形）に変換する。 */
export function previewName(branch: string) {
  let name = branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!/^[a-z]/.test(name)) name = `b-${name}`;
  // `<name>-<worker>` が DNS ラベルの上限63文字に収まるようにする
  const max = 63 - workerName.length - 1;
  return name.slice(0, max).replace(/-+$/, '');
}

export function previewUrl(branch: string) {
  return `https://${previewName(branch)}-${workerName}.${workersSubdomain}.workers.dev`;
}
