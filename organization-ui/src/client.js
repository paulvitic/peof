/* globals window */
import BlueBasket from './blue-basket/BlueBasket';
import BlueBuy from './blue-buy/BlueBuy';

window.blue = { count: 0 };
window.customElements.define('blue-basket', BlueBasket);
window.customElements.define('blue-buy', BlueBuy);

