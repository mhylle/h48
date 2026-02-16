export class ActionDispatcher {
  constructor({ inputHandler, historyStore, displayRenderer }) {
    this.inputHandler = inputHandler;
    this.historyStore = historyStore;
    this.displayRenderer = displayRenderer;
    this.handlers = {};
  }

  registerOperation(name, operationFn) {
    this.handlers[name] = () => {
      this.inputHandler.commit();
      const err = operationFn();
      this.inputHandler.isNewEntry = true;
      return err;
    };
  }

  registerConstant(name, operationFn) {
    this.handlers[name] = () => {
      if (this.inputHandler.buffer) this.inputHandler.commit();
      operationFn();
      this.inputHandler.isNewEntry = true;
    };
  }

  registerAction(name, handlerFn) {
    this.handlers[name] = handlerFn;
  }

  dispatch(action, value) {
    this.displayRenderer.clearStatus();
    const handler = this.handlers[action];
    if (!handler) return;
    this.historyStore.beforeAction(action);
    const error = handler(value);
    if (error) this.displayRenderer.showError(error);
    this.historyStore.afterAction(action, error);
    this.displayRenderer.update();
  }
}
