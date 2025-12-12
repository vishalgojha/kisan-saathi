import Home from './pages/Home';
import Weather from './pages/Weather';
import MandiPrices from './pages/MandiPrices';
import CropDiagnosis from './pages/CropDiagnosis';
import GovtSchemes from './pages/GovtSchemes';
import Dashboard from './pages/Dashboard';
import RenewableEnergy from './pages/RenewableEnergy';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Weather": Weather,
    "MandiPrices": MandiPrices,
    "CropDiagnosis": CropDiagnosis,
    "GovtSchemes": GovtSchemes,
    "Dashboard": Dashboard,
    "RenewableEnergy": RenewableEnergy,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};