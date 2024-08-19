'use client'
import { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

export default function ForgotPassword() {
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSendResetEmail = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Call the API endpoint to generate the password reset link and send the email
            await axios.post('/api/sendPasswordResetEmail', {
                email: forgotPasswordEmail
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000); // Show success message for 3 seconds
            window.location.href = '/';
        } catch (error) {
            setError(error.response?.data?.message || 'Error sending password reset email');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000); // Hide error message after 3 seconds
        }
    };

    return (
        <>
            <Header />
            <div className="relative isolate px-6 pt-14 lg:px-8 bg-[#140D0C] flex min-h-screen flex-1 flex-col justify-center py-12 lg:px-8 overflow-hidden">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white" style={{ paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)' }}>
                        Forgot Password
                    </h2>
                    <form onSubmit={handleSendResetEmail} className="space-y-6 mt-6">
                        <div>
                            <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium leading-6 text-gray-300">
                                Enter the email address associated with your account, and we'll send you a link to reset your password.
                            </label>

                            <p className="text-sm text-gray-100 mt-8">Email</p>
                            <div className="mt-2">
                                <input
                                    id="forgotPasswordEmail"
                                    name="forgotPasswordEmail"
                                    type="email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
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
                                Send Reset Email
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-300 text-center pt-12"> Don't have an account? <a href="/Register" className="text-[#C69635] hover:text-[#C69635]/80 transition-colors duration-300 ease-in-out">Register here</a></p>
                    </form>
                </div>
                {showSuccess && (
                    <div className="fixed bottom-4 right-4 bg-[#C69635] text-[#1E1412] p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
                        If we find an account associated with your email, you'll receive a link to reset your password shortly! <br />
                        Redirecting...
                    </div>
                )}
                {showError && (
                    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
}