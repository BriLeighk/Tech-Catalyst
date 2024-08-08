"use client"

import Image from "next/image";
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    // Handle the email submission, like sending it to a backend API.

  };

  return (
    <div>
      <Head>
        <title>Catalyst</title>
        <meta name="description" content="Your Gateway to Big Tech" />
      </Head>
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-lightBlue to-darkBlue min-h-screen py-2">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-20 bg-primary text-white w-full px-4 lg:px-8">
          <h1 className="text-6xl font-extrabold mb-6 text-white drop-shadow-lg leading-tight">
            Welcome to Catalyst!
          </h1>
          <p className="text-xl text-white font-light mb-10 max-w-3xl drop-shadow-md leading-relaxed">
            Empowering CS Students with tools, opportunities, and connections
            to excel in the tech industry. Unlock your potential today!
          </p>
          <button className="px-8 py-4 bg-accent text-black font-medium rounded-full hover:bg-gray-500 hover:text-white transition transform hover:scale-105 shadow-lg">
            <a href="#signup">Get Started for Free</a>
          </button>
          <div className="mt-12 w-full max-w-4xl">
            <Image
              src="/images/catalyst.png"
              alt="Catalyst App"
              layout="responsive"
              width={1600}
              height={900}
              priority
              className="w-full h-auto object-cover rounded-lg shadow-2xl"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 w-full">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <FeatureCard
                icon="/images/library.png"
                title="Resource Library"
                description="A comprehensive library with articles, courses, and more."
              />
              <FeatureCard
                icon="/images/job.png"
                title="Job Search"
                description="Access internships and entry-level jobs with our integrated search tools."
              />
              <FeatureCard
                icon="/images/user.png"
                title="User Profiles"
                description="Showcase your skills and connect with like-minded peers."
              />
              <FeatureCard
                icon="/images/events.png"
                title="Tech Events"
                description="Stay informed with webinars, hackathons, and more."
              />
              <FeatureCard
                icon="/images/chat.png"
                title="Messaging System"
                description="Connect with others through our real-time chat system."
              />
              <FeatureCard
                icon="/images/swipe.png"
                title="Swipe-to-Connect"
                description="Discover peers with similar or complementary skills."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-lightGrey w-full">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading mb-12">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <TestimonialCard
                quote="Catalyst has been a game changer for me. The resources and community are top-notch!"
                author="Alice Johnson"
                role="Software Engineer"
              />
              <TestimonialCard
                quote="The job search feature helped me land my dream internship. Highly recommend!"
                author="John Doe"
                role="Computer Science Student"
              />
              <TestimonialCard
                quote="An invaluable tool for anyone looking to break into the tech industry."
                author="Sarah Williams"
                role="Tech Enthusiast"
              />
            </div>
          </div>
        </section>

        {/* Freemium Explanation Section */}
        <section id="freemium" className="py-20 w-full">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading mb-12">
              Free vs Premium Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Free</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>Access to community resources</li>
                  <li>Basic job search functionality</li>
                  <li>Profile creation and updates</li>
                  <li>Participate in tech events</li>
                  <li>Basic badges for achievements</li>
                </ul>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Premium</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>Access to exclusive resources</li>
                  <li>Advanced job search and filters</li>
                  <li>Personalized recommendations</li>
                  <li>Exclusive tech events</li>
                  <li>Enhanced profile customization</li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-lg">
              Sign up now to enjoy premium features with a limited-time free trial for the first 100 users!
            </p>
          </div>
        </section>

        {/* Sign Up Section */}
        <section id="signup" className="py-20 bg-primary text-white w-full">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading mb-6">Join Headstarter</h2>
            <p className="text-lg font-light mb-8 max-w-2xl">
              Start your journey with Catalyst and unlock new opportunities in tech.
            </p>
            <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row justify-center items-center">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="Enter your email"
                className="p-3 w-72 md:w-96 border rounded-l-full text-black"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-r-full hover:bg-teal-500 transition"
              >
                Sign Up
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-darkGrey text-white w-full">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Headstarter. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 space-y-4 shadow-lg rounded-lg bg-white">
    <div className="p-3 bg-primary text-white rounded-full">
      <Image
        src={icon}
        alt={title}
        width={32}
        height={32}
        className="object-contain"
      />
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <div className="flex flex-col items-center p-6 space-y-4 shadow-lg rounded-lg bg-white">
    <p className="text-gray-600 italic">"{quote}"</p>
    <h3 className="text-lg font-semibold">{author}</h3>
    <p className="text-sm text-gray-500">{role}</p>
  </div>
);
