import Oracle from './pages/Oracle';
import History from './pages/History';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Oracle": Oracle,
    "History": History,
}

export const pagesConfig = {
    mainPage: "Oracle",
    Pages: PAGES,
    Layout: __Layout,
};