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

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user information in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                firstname,
                lastname,
                email
            });

            // Add user to Brevo contact list
            const response = await axios.post('/api/addRegisterContact', { email, firstname, lastname });
            if (response.status === 200) {
              setError('Account created successfully!');
              setErrorColor('text-green-400'); // Set color to green-400
            } else {
              setError('Account creation failed. Please try again.');
              setErrorColor('text-red-500'); // Set color to red-500
            }

            window.location.href = '/Login'; // Navigate to login page after registration
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already associated with another account');
            } else if (err.message) { // Check if there's a specific error message
                setError(err.message);
            } else {
                setError('Error creating account'); // Fallback error message
            }
        }
    };

    return (
      <>
        <Header />
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-gray-900 flex min-h-screen flex-1 flex-col justify-center py-12 lg:px-8 overflow-hidden">
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
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt=""
              src="" /* TODO: Add Logo */
              className="mx-auto h-10 w-auto"
            />
          </div>
          <div 
           
          style={{
            width: '500px', 
            height: '564px',
            margin: '0px auto 0 auto', 
            padding: '20px', 
            borderRadius: '10px',
            boxShadow: '0px 0px 35px 5px rgba(8,20,30,2)', 
            WebkitBoxShadow: '0px 0px 35px 5px rgba(8,20,30,2)', 
            MozBoxShadow: '0px 0px 35px 5px rgba(8,20,30,2)',
            border: '2px solid white'
          }}>
            {error && <p className={`${errorColor} text-right mt-0 pt-0`}>{error}</p>}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
              Create Account
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" 
              style={{
                position: 'fixed', 
                transform: `translate(10%, ${error ? '-12%' : '0%'})`
              }}>
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
  
                <div className=""
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                }}
                >
                  <button
                    type="submit"
                    className="flex w-[205px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create Account
                  </button>

                  <a href="/Login"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0819b5] to-[#07d2fb] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </>
    )
  }