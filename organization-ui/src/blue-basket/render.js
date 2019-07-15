export default function render(count) {
  const classname = count === 0 ? 'empty' : 'filled';
  return `<div class="${classname}">basket: ${count} item(s)</div>`;
}
