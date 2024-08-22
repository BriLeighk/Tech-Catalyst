'use client'
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { PlusIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

const resources = [
  {
    title: 'Resource 1',
    description: 'Description for resource 1',
    link: '#',
    contributor: 'PFP',
  },
  {
    title: 'Resource 2',
    description: 'Description for resource 2',
    link: '#',
    contributor: 'PFP',
  },
  // Add more resources as needed
];

export default function ResourceLibrary() {
  const [borderColor, setBorderColor] = useState('#33211E');
  const inputRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleClick = () => {
    setBorderColor('#C69635'); // Gold color
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setBorderColor('#33211E'); // Reset to original color
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUpload = () => {
    console.log('Upload');
    setIsUploadModalOpen(false);
  }


  return (
    <div className="" style={{backgroundColor: '#140D0C'}}> 
      {/* Header Component */}
      <Header/>

      <div className="relative isolate bg-[#140D0C] min-h-[800px] overflow-hidden mx-0 px-0 ">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-0"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#302a18] to-[#5A3A2F] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-32 lg:py-50" 
          data-aos="fade-up"
          data-aos-anchor-placement="center-center"
        >
          <div className="bg-[#1E1412] p-8 rounded-md w-full mt-20">
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6">
              <div className="mb-4 sm:mb-0 sm:text-left text-center">
                <h2 className="text-[#C69635] font-semibold">Resource Library</h2>
                <span className="text-xs text-[#DDBA6C]">All resources</span>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div ref={inputRef} className="flex bg-[#231715] items-center p-2 rounded-md border-[2px] focus:outline-none sticky top-0"
                  style={{ 
                    borderColor: borderColor, 
                    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' 
                  }}
                  onClick={handleClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input className="bg-[#231715] outline-none ml-1 block text-white text-sm" type="text" name="" id="" placeholder="search..." />
                </div>
                <div className="ml-4 sm:ml-10 space-x-8">
                  <button className="bg-[#C69635] px-2 py-2 rounded-lg text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer sm:hidden"
                  >
                    <PlusIcon className="h-5 w-5" 
                    onClick={() => setIsUploadModalOpen(true)}
                    />
                  </button>
                  <button className="hidden sm:block bg-[#C69635] px-2 py-2 rounded-lg text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer"
                  onClick={() => setIsUploadModalOpen(true)}
                  >
                    New Resource
                  </button>
                </div>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow-md shadow-[#140D0C] rounded-lg overflow-hidden border-[#33211E] border-[1px]">
                <table className="min-w-full leading-normal ">
                  <thead className=" shadow-md shadow-[#140D0C]">
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Resource Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="sm:hidden px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Cont.
                      </th>
                      <th className="hidden sm:block px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Contributor
                      </th>
                      <th className="px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Open
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm">
                          <p className="text-[#C69635] whitespace-no-wrap">{resource.title}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm">
                          <p className="text-[#C69635] whitespace-no-wrap">Icon</p>
                        </td>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm">
                          <p className="text-[#C69635] whitespace-no-wrap">{resource.contributor}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm">
                        <button className=" px-2 py-2 rounded-lg text-[#C69635] text-xs font-bold tracking-wide cursor-pointer" onClick={() => window.location.href = resource.link}>
                            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                        </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* Upload Modal */}
        {isUploadModalOpen && (
        <>
          <div className="fixed inset-0 bg-[#140D0C] opacity-75 z-40"></div> {/* Overlay */}
          <div className="bg-[#1E1412] shadow-lg shadow-[#140D0C] w-[80%] max-w-[800px] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md z-50 overflow-auto">
            <div className="flex flex-col items-center h-full">
                <XMarkIcon className="h-5 w-5 text-[#C69635] cursor-pointer absolute top-2 right-2 mt-2 mr-2" onClick={() => setIsUploadModalOpen(false)} />
                <h2 className="text-[#C69635] text-xl font-semibold align-start mt-10">Upload Resource</h2>
                <p className="text-gray-400 text-xs mb-4 text-center pt-2 pb-0 px-14 w-full">Please fill out the form below to upload your resource.
                    If the resource is not already part of the library, we will add it and credit you as the contributor.
                    Note that uploading inappropriate content will result in an immediate ban on your account.
                    </p>
                {/* Resource Name */}
                <div className="mt-10 px-14 w-full">
                <label className="text-[#C69635] text-md font-bold mb-0 mt-2">Name</label>
                <p className="text-gray-400 text-xs mb-4">Please provide the name of the resource you are uploading. 
                    </p>
                    <input
                        type="resourceName"
                        className="bg-[#231715] rounded text-left text-xs text-gray-300 h-8 w-full pl-1 mb-4 border-[#33211E] border-[2px] focus:border-[#C69635] focus:outline-none"
                        style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>

                {/* Resource URL */}
                <div className="mt-10 px-14 w-full">
                <label className="text-[#C69635] text-md font-bold mb-0 mt-8">URL</label>
                <p className="text-gray-400 text-xs mb-4">Please provide the URL of the resource you are uploading.
                </p>
                    <input
                        type="resourceName"
                        className="bg-[#231715] rounded text-left text-xs text-gray-300 h-8 w-full pl-1 mb-4 border-[#33211E] border-[2px] focus:border-[#C69635] focus:outline-none"
                        style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>

                <button className="bg-[#C69635] px-4 py-2 rounded-md text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer mt-20"
                onClick={() => handleUpload()}
                >Upload</button>
            </div>
          </div>
        </>
        )}
    </div>
  )
}