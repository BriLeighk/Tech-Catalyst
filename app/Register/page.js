'use client'
import { useState } from 'react';
import Header from '../components/Header'
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import axios from 'axios'; // Import axios

export default function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorColor, setErrorColor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation for password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setErrorColor('text-red-500');
            setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
            return;
        }

        try {
            // Check if email already exists in the database
            const emailCheckResponse = await axios.post('/api/checkEmailExists', { email });
            if (emailCheckResponse.data.exists) {
                setError('An account with this email already exists.');
                setErrorColor('text-red-500');
                setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
                return;
            }

            // Store the password in session storage
            sessionStorage.setItem('password', password);

            // Generate verification code and send email
            const response = await axios.post('/api/sendVerificationCode', { email, firstname, lastname, password });
            if (response.status === 200) {
                // Navigate to verification page
                window.location.href = `/Verify?email=${email}`;
            } else {
                setError('Failed to send verification email. Please try again.');
                setErrorColor('text-red-500');
                setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
            }
        } catch (err) {
            setError('Error creating account');
            setErrorColor('text-red-500');
            setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
        }
    };

    return (
      <>
        <Header />
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-[#140D0C] flex min-h-screen flex-1 flex-col justify-center py-12 lg:px-8 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#5A3A2F] to-[#2B1D1A] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt=""
              src="" /* TODO: Add Logo */
              className="mx-auto h-24 w-auto"
            />
          </div>
          <div 
            className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#1E1412] rounded-lg shadow-lg"
          >
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
              Create Account
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-300">
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      required
                      autoComplete="firstname"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-300">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      required
                      autoComplete="lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex justify-center rounded-md bg-[#1E1412] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm border border-gray-400 hover:border-[#C69635] rounded"
                    style={{ transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                  >
                    Create Account
                  </button>
                  <a href="/Login"
                    className="w-full sm:w-auto flex justify-center rounded-md bg-[#1E1412] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm border border-gray-400 hover:border-[#C69635] rounded"
                    style={{
                      transition: 'background-color 0.3s ease-in-out',
                      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Have an account? Login here
                  </a>
                </div>
              </form>
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
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#5A3A2F] to-[#2B1D1A] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
          {error && (
            <div className={`fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${error ? 'opacity-100' : 'opacity-0'}`}>
              {error}
            </div>
          )}
        </div>
      </>
    )
  }