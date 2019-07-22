

export default function renderPage() {
  return `
    <h1 id="store">Company List Web Component</h1>
    <company-list id="companyList"><!--#include virtual="/company-list" --></company-list>
  `;
}
