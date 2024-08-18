'use client'
import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, deleteDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

export default function Verify() {
  const [code, setCode] = useState(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for error popup
  const inputRefs = useRef([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setCode(codeParam.split(''));
    }
  }, []);

  const handleChange = (e, index) => {
    const newCode = [...code];
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      newCode[index] = value;
      setCode(newCode);

      // Auto-advance to the next input field
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      newCode[index] = '';
      setCode(newCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowErrorPopup(false); // Hide error popup initially

    const verificationCode = code.join('');
    try {
      console.log('Verification Code:', verificationCode); // Log verification code
      if (!verificationCode) {
        throw new Error('Verification code is not defined');
      }
      const docRef = doc(db, 'verifications', verificationCode); // Correct document reference
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
          setShowErrorPopup(true); // Show error popup
          return;
        }

        if (verificationCode === verificationCode) { // Compare verification codes as strings
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Get the current number of users
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const userNumber = usersSnapshot.size; // Assign the next available user number

          // Store user information in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            firstname,
            lastname,
            email,
            userNumber // Add userNumber to the user record
          });

          // Add user to Brevo contact list and send welcome email
          try {
            await axios.post('/api/addRegisterContact', { email, firstname, lastname });
            await axios.post('/api/sendWelcomeEmail', { email, firstname, lastname });
          } catch (err) {
            console.error('Error adding contact to Brevo or sending welcome email:', err);
            setError('Error adding contact to Brevo or sending welcome email');
            setShowErrorPopup(true); // Show error popup
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
          setShowErrorPopup(true); // Show error popup
        }
      } else {
        setError('Verification code not found');
        setShowErrorPopup(true); // Show error popup
      }
    } catch (err) {
      console.error('Error verifying account:', err);
      setError('Error verifying account');
      setShowErrorPopup(true); // Show error popup
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
            <div className="mt-2 flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`block w-14 h-14 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#b79994] sm:text-xl sm:leading-6 text-center `}
                />
              ))}
            </div>
          </div>
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
      {showErrorPopup && (
        <div className="fixed bottom-4 right-4 bg-[#C69635] text-[#1E1412] p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
          {error}
        </div>
      )}
    </div>
  );
}