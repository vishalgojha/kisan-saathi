import Home from './pages/Home';
import Weather from './pages/Weather';
import MandiPrices from './pages/MandiPrices';
import CropDiagnosis from './pages/CropDiagnosis';
import GovtSchemes from './pages/GovtSchemes';
import Dashboard from './pages/Dashboard';
import RenewableEnergy from './pages/RenewableEnergy';
import About from './pages/About';
import Vision from './pages/Vision';
import Creator from './pages/Creator';
import Careers from './pages/Careers';
import AIHelp from './pages/AIHelp';
import Glossary from './pages/Glossary';
import GettingStarted from './pages/GettingStarted';
import Troubleshooter from './pages/Troubleshooter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import Cookies from './pages/Cookies';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Weather": Weather,
    "MandiPrices": MandiPrices,
    "CropDiagnosis": CropDiagnosis,
    "GovtSchemes": GovtSchemes,
    "Dashboard": Dashboard,
    "RenewableEnergy": RenewableEnergy,
    "About": About,
    "Vision": Vision,
    "Creator": Creator,
    "Careers": Careers,
    "AIHelp": AIHelp,
    "Glossary": Glossary,
    "GettingStarted": GettingStarted,
    "Troubleshooter": Troubleshooter,
    "Privacy": Privacy,
    "Terms": Terms,
    "Disclaimer": Disclaimer,
    "Cookies": Cookies,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};