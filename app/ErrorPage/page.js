'use client'
import Header from '../components/Header';

export default function ErrorPage() {
    return (
        <>
            <Header />
            
            <div className="relative isolate px-6 pt-14 lg:px-8 bg-[#140D0C] flex min-h-screen flex-1 flex-col justify-center py-12 lg:px-8 overflow-hidden">
                <h1 className="mt-0 text-center text-4xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
                    404 - Page Not Found
                </h1>
                    <div className="sm:mx-auto sm:w-full sm:max-w-lg text-start" style={{alignSelf: 'center'}}>
                        <h2 className="mt-20 text-2xl font-bold leading-9 tracking-tight text-white" style={{paddingTop: '0', textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'}}>
                        Sorry!
                        </h2>
                        <p className="mt-2 text-gray-300">
                            The page you are looking for has expired. If you think this is an error, please contact us at <span className='text-[#C69635]'>support@thetechcatalyst.org</span>
                        </p>
                        <button
                            onClick={() => {
                                window.location.href = '/';
                            }}
                            className="flex w-full justify-center rounded-md bg-[#C69635] px-3 py-1.5 mt-10 text-sm font-semibold leading-6 text-[#140D0C] shadow-sm border border-[#2B1C1A] hover:border-white rounded"
                                style={{ transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                            >
                            Go back to Home
                        </button>

                </div>
                
            </div>
        </>
    );
}