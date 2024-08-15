'use client'

import { useState, useEffect } from 'react'
import Features from './components/FeatureSection.js'
import Pricing from './components/PricingSection.js'
import Newsletter from './components/NewsletterSection.js'
import About from './components/AboutSection.js'
import Header from './components/Header.js'
import { checkUserLoggedIn } from './utils/auth'; // Import the utility function

export default function Home() {

  const [email, setEmail] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    // Handle the email submission, like sending it to a backend API.
  };

  const handleRegisterClick = async () => {
    const isLoggedIn = await checkUserLoggedIn();
    if (isLoggedIn) {
      window.location.href = '/Dashboard';
    } else {
      window.location.href = '/Register';
    }
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="bg-gray-900"> 
    {/* Header Component */}
      <Header/>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#07d2fb] to-[#0819b5] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl" style={{ fontFamily: 'CustomFont' }}>
              The Tech Catalyst
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300" style={{ fontFamily: 'CustomFont' }}>
            Empowering CS Students with tools, opportunities, and connections
            to excel in the tech industry.
            </p>
            {/*Hero Section Buttons - Links to Register Page */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleRegisterClick}
              className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              style={{ fontFamily: 'CustomFont' }}
            >
               
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0819b5] to-[#07d2fb] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      <div id="about">
        <About />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="newsletter">
        <Newsletter />
      </div>
    </div>
  )
}