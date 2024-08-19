'use client'
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { confirmPasswordReset } from 'firebase/auth';
import axios from 'axios';
import Header from '../components/Header';

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [oobCode, setOobCode] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const oobCodeFromUrl = query.get('oobCode');
        if (oobCodeFromUrl) {
            setOobCode(oobCodeFromUrl);
            checkLinkValidity(oobCodeFromUrl);
        } else {
            window.location.href = '/ErrorPage';
        }
    }, []);

    const checkLinkValidity = async (oobCode) => {
        try {
            console.log('Checking link validity for oobCode:', oobCode);
            const response = await axios.post('/api/checkPasswordResetLink', { oobCode });
            if (response.data.valid) {
                console.log('Link is valid');
                setIsValid(true);
            } else {
                console.log('Link is invalid or expired');
                window.location.href = '/ErrorPage';
            }
        } catch (error) {
            console.error('Error checking link validity:', error);
            window.location.href = '/ErrorPage';
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        if (!isValid) {
            setError('This password reset link is invalid or has expired.');
            setShowError(true);
            return;
        }

        try {
            // Confirm the password reset with the oobCode and new password
            await confirmPasswordReset(auth, oobCode, newPassword);

            // Invalidate the reset link
            await axios.post('/api/invalidatePasswordResetLink', { oobCode });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                window.location.href = '/Login';
            }, 3000); // Show success message for 3 seconds before redirecting
        } catch (error) {
            console.error('Error during password update:', error); // Log the error
            setError('Error updating password: ' + error.message);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000); // Hide error message after 3 seconds
        }
    };

    const cancelRequest = async () => {
        try {
            await axios.post('/api/invalidatePasswordResetLink', { oobCode });
            window.location.href = '/';
        } catch (error) {
            console.error('Error canceling request:', error);
            setError('Error canceling request.');
            setShowError(true);
        }
    };

    return (
        <>
            <Header />
            <div className="relative isolate px-6 pt-14 lg:px-8 bg-[#140D0C] flex min-h-screen flex-1 flex-col justify-center py-12 lg:px-8 overflow-hidden">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-20 text-center text-2xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
                        Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-6 mt-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-300">
                                New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                                    style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-300">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="block w-full bg-[#1E1412] rounded-md border-0 py-1.5 text-gray-300 shadow-sm border-[1px] focus:border-[#C69635] focus:outline-none"
                                    style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#C69635] px-3 py-1.5 text-sm font-semibold leading-6 text-[#140D0C] shadow-sm border border-[#2B1C1A] hover:border-[#C69635] rounded"
                                style={{ transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                            >
                            Submit
                        </button>
                        </div>
                    
                        <p className="mt-2 text-sm text-gray-300 text-center pt-12"> Don't want to reset your password? <a href="/" onClick={cancelRequest} className="text-[#C69635] hover:text-[#C69635]/80 transition-colors duration-300 ease-in-out">Cancel request.</a></p>

                </form>
                </div>
            </div>
            {showSuccess && (
                <div className="fixed bottom-4 right-4 bg-[#C69635] text-[#1E1412] p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
                    Password updated successfully! Redirecting to login...
                </div>
            )}
            {showError && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
                    {error}
                </div>
            )}
        </>
    );
}