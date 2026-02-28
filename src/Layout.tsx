import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Layout({ children, currentPageName: _currentPageName }) {
    const footerSections = {
        company: {
            title: 'Company',
            links: [
                { name: 'About Chaos Craft Labs', url: createPageUrl('About') },
                { name: 'Our Vision', url: createPageUrl('Vision') },
                { name: 'Meet the Creator', url: createPageUrl('Creator') },
                { name: 'Careers', url: createPageUrl('Careers') }
            ]
        },
        aiPages: {
            title: 'AI Pages',
            links: [
                { name: 'AI Help Center', url: createPageUrl('AIHelp') },
                { name: 'AI Terms Glossary', url: createPageUrl('Glossary') },
                { name: 'Getting Started Guide', url: createPageUrl('GettingStarted') },
                { name: 'Smart Troubleshooter', url: createPageUrl('Troubleshooter') }
            ]
        },
        legal: {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', url: createPageUrl('Privacy') },
                { name: 'Terms of Service', url: createPageUrl('Terms') },
                { name: 'Disclaimer', url: createPageUrl('Disclaimer') },
                { name: 'Cookie Policy', url: createPageUrl('Cookies') }
            ]
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {children}
            </main>

            {/* Global Footer */}
            <footer className="bg-white border-t border-gray-100 mt-auto">
                <div className="container mx-auto px-6 py-12">
                    {/* Footer Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {Object.values(footerSections).map((section, idx) => (
                            <div key={idx}>
                                <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link 
                                                to={link.url}
                                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-6">
                        {/* Brand Stamp */}
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                A Chaos Craft Labs Creation · Made with ❤️ in India ·{' '}
                                <a 
                                    href="https://www.chaoscraftlabs.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-700 transition-colors"
                                >
                                    www.chaoscraftlabs.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
