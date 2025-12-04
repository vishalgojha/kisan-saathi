import Home from './pages/Home';
import Weather from './pages/Weather';
import MandiPrices from './pages/MandiPrices';
import CropDiagnosis from './pages/CropDiagnosis';
import GovtSchemes from './pages/GovtSchemes';
import Dashboard from './pages/Dashboard';


export const PAGES = {
    "Home": Home,
    "Weather": Weather,
    "MandiPrices": MandiPrices,
    "CropDiagnosis": CropDiagnosis,
    "GovtSchemes": GovtSchemes,
    "Dashboard": Dashboard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};