/* globals window */
import CompanyList from './company/CompanyList';

let unusedVariable;
window.blue = { count: 0 };
window.customElements.define('company-list', CompanyList);