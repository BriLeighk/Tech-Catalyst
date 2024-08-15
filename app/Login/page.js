'use client'
import { useState } from 'react';
import { auth } from '../firebase';
import Header from '../components/Header'
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          // User is logged in, start session and redirect to dashboard
          sessionStorage.setItem('user', JSON.stringify(userCredential.user));
          window.location.href = '/Dashboard';
      } catch (err) {
          setError('Incorrect email or password'); // Handle errors
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
            {error && <p className="text-red-800 text-right mt-0 pt-0" style={{position: 'fixed', transform: 'translate(130%, -40%)'}}>{error}</p>}

            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
              Log In
            </h2>
            
            <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleLogin} className="space-y-6">
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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
                  marginTop: '168px', // ensures buttons are in same place as register form
                }}
                >
                  <button
                    type="submit"
                    className="flex w-[100px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Login
                  </button>
                  <a href="/Register"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Don't have an account? Register here
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