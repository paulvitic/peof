import renderPage from "../page/render";

export const home = (req, res) => {
    const html = renderPage();
    res.render('layout', { html });
};