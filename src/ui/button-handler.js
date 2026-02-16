export class ButtonHandler {
  constructor({ gridElement, dispatcher }) {
    gridElement.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) dispatcher.dispatch(btn.dataset.action, btn.dataset.value);
    });
  }
}
