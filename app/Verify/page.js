'use client'
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

export default function Verify() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setCode(codeParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      console.log('Verification Code:', code); // Log verification code
      if (!code) {
        throw new Error('Verification code is not defined');
      }
      const docRef = doc(db, 'verifications', code); // Correct document reference
      console.log('Document Reference:', docRef.path); // Log document reference path
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { email, verificationCode, timestamp, firstname, lastname, password } = docSnap.data(); // Retrieve email and other details
        console.log('Retrieved data:', { email, verificationCode, timestamp, firstname, lastname, password });
        const now = new Date();
        const codeTimestamp = timestamp.toDate(); // Convert timestamp to Date object
        const timeDifference = now - codeTimestamp; // Calculate time difference

        // Check if the code is older than 24 hours (86400000 milliseconds)
        if (timeDifference > 86400000) {
          await deleteDoc(docRef);
          setError('Verification code has expired. Please register again.');
          return;
        }

        if (verificationCode === code) { // Compare verification codes as strings
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Store user information in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            firstname,
            lastname,
            email
          });

          // Add user to Brevo contact list and send welcome email
          try {
            await axios.post('/api/addRegisterContact', { email, firstname, lastname });
            await axios.post('/api/sendWelcomeEmail', { email, firstname, lastname });
          } catch (err) {
            console.error('Error adding contact to Brevo or sending welcome email:', err);
            setError('Error adding contact to Brevo or sending welcome email');
            return;
          }

          // Delete verification document
          await deleteDoc(docRef);

          setSuccess('Account verified and created successfully!');
          setTimeout(() => {
            window.location.href = '/Login';
          }, 2000);
        } else {
          setError('Invalid verification code');
        }
      } else {
        setError('Verification code not found');
      }
    } catch (err) {
      console.error('Error verifying account:', err);
      setError('Error verifying account');
    }
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-[#140D0C] flex min-h-screen flex-1 flex-col justify-center py-12 lg:px-8 overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Verify Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
          <div>
            <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-300">
              Verification Code
            </label>
            <div className="mt-2">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b79994] sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#683F24] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#442718] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b79994]"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}