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
          const userNumber = usersSnapshot.size; // Assign the next available user number

          // Store user data in Firestore
          await setDoc(userDoc, {
            firstname: user.displayName.split(' ')[0],
            lastname: user.displayName.split(' ')[1] || '',
            email: user.email,
            userNumber, // Store the user number
            imageUrl: user.photoURL || '/placeholder.png', // Default image URL
            bio: '',
            projects: [],
          });
        } else {
          // Modify the photo URL to request a higher resolution image
          const highResPhotoURL = user.photoURL ? user.photoURL.replace('s96-c', 's400-c') : '/placeholder.png';

          // Check if userNumber exists in the existing user data
          let userNumber = userSnapshot.data().userNumber;
          if (!userNumber) {
            // Get the current number of users
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            userNumber = usersSnapshot.size; // Assign the next available user number
          }

          // Update user information in Firestore
          await setDoc(userDoc, {
            firstname: user.displayName.split(' ')[0],
            lastname: user.displayName.split(' ').slice(1).join(' '),
            email: user.email,
            userNumber, // Ensure userNumber is stored
            imageUrl: highResPhotoURL,
            bio: '',
          }, { merge: true });
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
              boxShadow: '0px 0px 10px 5px rgba(20,13,1,1)', 
              WebkitBoxShadow: '0px 0px 10px 5px rgba(20,13,1,1)', 
              MozBoxShadow: '0px 0px 10px 5px rgba(20,13,1,1)',
              border: '2px solid white',
            }}>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
              Log  In
            </h2>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex w-full h-[36px] justify-center items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-[#140D0C] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724428] border-[2px] border-[#D6D6D6] hover:border-[2px] hover:border-[#724428]"
                    style={{ transition: 'border-color 0.3s ease-in-out' }}
                  >
                    <FcGoogle className="h-4 w-4 mr-2" />
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#] sm:text-sm sm:leading-6"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px' }}
                    />
                  </div>
                </div>
                
  
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-[#683F24] hover:text-[#442718]" style={{transition: 'color 0.3s ease-in-out'}}>
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:[#b79994] sm:text-sm sm:leading-6"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px' }}
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
                  marginTop: '108px', // ensures buttons are in same place as register form
                }}
                >
                  
                  <button
                    type="submit"
                    className="flex w-[100px] justify-center rounded-md bg-[#683F24] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#442718] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b79994]"
                    style={{transition: 'background-color 0.3s ease-in-out'}}
                  >
                    Login
                  </button>
                  <a href="/Register"
                    className="flex w-full justify-center rounded-md bg-[#683F24] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#442718] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b79994]"
                    style={{transition: 'background-color 0.3s ease-in-out'}}
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
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
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