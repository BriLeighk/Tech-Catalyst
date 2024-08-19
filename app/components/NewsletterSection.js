import { useState } from 'react';
import axios from 'axios';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/addContact', { email });
      if (response.status === 200) {
        setMessage(response.data.message); // Use the message from the API response
      } else {
        setMessage('Subscription failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
    setEmail('');
  };

  return (
    <div className="relative isolate bg-[#140D0C] py-16 sm:py-20 lg:py-32 min-h-screen flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">Subscribe to our newsletter.</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Subscribe to our newsletter to get the latest updates on our platform and gain early access to new features.
            </p>
            <form onSubmit={handleFormSubmit} className="mt-6 flex gap-x-4">
              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm border-[#33211E] border-[2px] focus:border-[#C69635] focus:outline-none"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="flex-none rounded-md px-3.5 py-2.5 text-sm font-semibold text-[#F2F4E6] shadow-sm border border-gray-400 hover:border-[#C69635] rounded"
                style={{ transition: 'background-color 0.3s ease-in-out' }}
              >
                Subscribe
              </button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#5A3A2F] to-[#2B1D1A] opacity-30"
        />
      </div>
    </div>
  )
}