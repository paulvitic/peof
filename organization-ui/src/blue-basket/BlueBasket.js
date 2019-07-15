/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window, CustomEvent */
import render from './render';

class BlueBasket extends HTMLElement {
  connectedCallback() {
    this.refresh = this.refresh.bind(this);
    BlueBasket.log('connected');
    this.render();
    window.addEventListener('blue:basket:changed', this.refresh);
  }
  refresh() {
    BlueBasket.log('event recieved "blue:basket:changed"');
    this.render();
  }
  render() {
    this.innerHTML = render(window.blue.count);
  }
  disconnectedCallback() {
    window.removeEventListener('blue:basket:changed', this.refresh);
    BlueBasket.log('disconnected');
  }
  static log(...args) {
    console.log('🛒 blue-basket', ...args);
  }
}

export default BlueBasket;
