'use client'
import { useState } from 'react';
import { auth, db } from '../firebase';
import Header from '../components/Header'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          // User is logged in, start session and redirect to dashboard
          sessionStorage.setItem('user', JSON.stringify(userCredential.user));
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            window.location.href = '/Dashboard';
          }, 3000); // Show success message for 3 seconds before redirecting
        } catch (err) {
          setError('Incorrect email or password'); // Handle errors
          setShowError(true);
          setTimeout(() => setShowError(false), 3000); // Hide error message after 3 seconds
        }
      };

    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if the user already exists in Firestore
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
          // Get the current number of users
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const userNumber = usersSnapshot.size + 1; // Assign the next available user number starting from 1

          // Store user data in Firestore
          await setDoc(userDoc, {
            firstname: user.displayName.split(' ')[0],
            lastname: user.displayName.split(' ')[1] || '',
            email: user.email,
            userNumber, // Store the user number
            bio: '',
            projects: [],
          });
        } else {
          // Get existing user data
          const existingData = userSnapshot.data();

          // Prepare updated data
          const updateData = {
            email: user.email,
            userNumber: existingData.userNumber || usersSnapshot.size + 1, // Ensure userNumber is stored
          };

          // Update name and bio only if they are null in the database
          if (!existingData.firstname) {
            updateData.firstname = user.displayName.split(' ')[0];
          }
          if (!existingData.lastname) {
            updateData.lastname = user.displayName.split(' ').slice(1).join(' ');
          }
          if (!existingData.bio) {
            updateData.bio = '';
          }

          // Update user information in Firestore
          await setDoc(userDoc, updateData, { merge: true });
        }

        // Add user to Brevo list
        await axios.post('/api/updateBrevoSubscription', {
          email: user.email,
          isSubscribed: true,
        });

        // Redirect to dashboard
        sessionStorage.setItem('user', JSON.stringify(user));
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          window.location.href = '/Dashboard';
        }, 3000); // Show success message for 3 seconds before redirecting
      } catch (error) {
        setError('Error signing in with Google: ' + error.message);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000); // Hide error message after 3 seconds
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
              Log In
            </h2>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex w-full h-[36px] justify-center items-center rounded-md border-[1px] border-gray-300 hover:border-[#C69635] px-3 py-1.5 text-sm font-semibold leading-6 text-[#F2F4E6] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724428]"
                    style={{ transition: 'border-color 0.3s ease-in-out' }}
                  >
                    <FcGoogle className="h-4 w-4 mr-2 shadow-lg" />
                    Sign in with Google
                  </button>
            </div>
            
            <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm" >
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
                    <div className="text-sm">
                      <a href="/ForgotPassword" className="font-semibold text-[#C69635] hover:text-[#683F24]" style={{transition: 'color 0.3s ease-in-out'}}>
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
                      className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex justify-center rounded-md bg-[#1E1412] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm border border-gray-400 hover:border-[#C69635] rounded"
                    style={{transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'}}
                  >
                    Login
                  </button>
                  <a href="/Register"
                    className="w-full sm:w-auto flex justify-center rounded-md bg-[#1E1412] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm border border-gray-400 hover:border-[#C69635] rounded"
                    style={{transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'}}
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
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#5A3A2F] to-[#2B1D1A] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
        {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-[#C69635] text-[#1E1412] p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
          Login successful! Redirecting to dashboard...
        </div>
      )}

      {showError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
          {error}
        </div>
      )}
      </>
    )
  }