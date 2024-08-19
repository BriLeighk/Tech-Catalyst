import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { checkUserLoggedIn } from '../utils/auth'; // Import the utility function

// Navigation bar
const navigation = [
    { name: 'About Us', href: 'about' }, // Link to About section
    { name: 'Pricing', href: 'pricing' }, // Link to Pricing section
    { name: 'Contact', href: 'newsletter' }, // Link to Newsletter section
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false) // State to track login status

    useEffect(() => {
        const checkLoginStatus = async () => {
            const loggedIn = await checkUserLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        checkLoginStatus();
    }, []);

    const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const handleScroll = (id) => {
        const scrollToSection = () => {
            const element = document.getElementById(id);
            if (element) {
                const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1500; // Duration in milliseconds
                let start = null;

                window.requestAnimationFrame(function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percent = Math.min(progress / duration, 1);
                    const easedPercent = easeInOutCubic(percent);
                    window.scrollTo(0, startPosition + distance * easedPercent);
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                });
            }
        };

        if (window.location.pathname !== '/') {
            window.location.href = `/#${id}`;
            window.addEventListener('load', scrollToSection);
        } else {
            scrollToSection();
        }
    };

    const handleLoginClick = async () => {
        const loggedIn = await checkUserLoggedIn();
        if (loggedIn) {
            window.location.href = '/Dashboard';
        } else {
            window.location.href = '/Login';
        }
    };

    return (
        <>
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">The Tech Catalyst</span>
                        <img
                            alt="The Tech Catalyst Logo"
                            src="/logo.png" /*TODO: Add logo*/
                            className="h-28 w-auto"
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleScroll(item.href)}
                            className="text-sm font-semibold leading-6 text-white cursor-pointer"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <button
                        onClick={handleLoginClick}
                        className="text-sm font-semibold leading-6 text-white"
                    >
                        {isLoggedIn ? 'Dashboard' : 'Log in'} <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#140D0C] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">The Tech Catalyst</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-300"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-300">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            handleScroll(item.href);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-[#1E1412] cursor-pointer"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                            <div className="py-6">
                                <button
                                    onClick={handleLoginClick}
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-300 hover:bg-[#1E1412]"
                                >
                                    {isLoggedIn ? 'Dashboard' : 'Log in'}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
        </>
    )
}