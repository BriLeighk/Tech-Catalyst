'use client'
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { PlusIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { db } from '../firebase'; 
import { collection, addDoc, query, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { checkUserLoggedIn } from '../utils/auth'; // Import the auth function
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

// Utility function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export default function ResourceLibrary() {
  const [borderColor, setBorderColor] = useState('#33211E');
  const inputRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 50;
  const [resourceURL, setResourceURL] = useState('');
  const [user, setUser] = useState(null); // Add state for user
  const [error, setError] = useState(''); // Add state for error message
  const [resources, setResources] = useState([]); // State for resources
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [imageErrors, setImageErrors] = useState([]); // State to track image errors
  const [searchQuery, setSearchQuery] = useState(''); // State to track search query

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.domainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.contributor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = () => {
    setBorderColor('#C69635'); // Gold color
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setBorderColor('#33211E'); // Reset to original color
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    // Fetch resources from Firestore
    const fetchResources = async () => {
      const resourcesQuery = query(collection(db, 'community_resources'));
      const querySnapshot = await getDocs(resourcesQuery);
      const resourcesList = await Promise.all(
        querySnapshot.docs.map(async (resourceDoc) => {
          const resource = resourceDoc.data();
          const userDocRef = doc(db, 'users', resource.id);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          return {
            ...resource,
            contributor: `${userData.firstname} ${userData.lastname}`,
            imageUrl: userData.imageUrl || '/placeholder.png', // Use placeholder if no image URL
          };
        })
      );
      setResources(resourcesList);
      setImageErrors(new Array(resourcesList.length).fill(false)); // Initialize image error state
    };
    fetchResources();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      unsubscribe(); // Clean up the onAuthStateChanged listener
    };
  }, []);

  const handleUpload = async () => {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      setError('You must be logged in to upload a resource.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      return;
    }
  
    if (!resourceURL) {
      alert('Please provide a valid URL of the resource you wish to upload.');
      return;
    }
  
    if (!user) {
      setError('User information is missing.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      return;
    }
  
    // Check if the URL is already in the database
    const resourcesQuery = query(collection(db, 'community_resources'), where('link', '==', resourceURL.trim()));
    const querySnapshot = await getDocs(resourcesQuery);
    if (!querySnapshot.empty) {
      setError('This URL is already a resource in the library.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      return;
    }
  
    // Check if the URL is safe and appropriate using the server-side endpoint
    try {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        body: JSON.stringify({ url: resourceURL.trim() }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Web Risk API error:', errorData);
        setError('Please provide a valid URL of the resource you wish to upload.');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
        return;
      }
  
      const data = await response.json();
      console.log('Web Risk API response:', data); // Log the response for debugging
  
      if (data && data.threat) {
        const threatTypes = data.threatTypes ? data.threatTypes.join(', ') : data.categories.join(', ');
        if (threatTypes.includes('Explicit Content Detected') || threatTypes.includes('Explicit Content Detected from Text')) {
          setError('This content is explicit. Your account has been given a strike');
        } else {
          setError(`The URL you provided is not safe. Detected threats: ${threatTypes}`);
        }
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
        return;
      }
    } catch (error) {
      console.error('Error checking URL safety:', error);
      setError('Failed to check URL safety.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      return;
    }
  
    // Fetch the resource name and logo
    let resourceName = '';
    let logoUrl = '';
    let domainName = '';
  
    try {
      const { data: metadata } = await axios.get(`/api/extract-metadata?url=${encodeURIComponent(resourceURL.trim())}`);
      if (metadata.error) {
        throw new Error(metadata.error);
      }
      resourceName = metadata.h1 || metadata.title || 'Unknown Resource';
      const domain = new URL(resourceURL).hostname;
      domainName = capitalizeWords(domain.split('.')[0]); // Capitalize each word in the domain name
      logoUrl = metadata.isValidLogo ? metadata.logoUrl : ''; // Use logoUrl only if it's valid
  
      // Extract the part after the last '/' in the URL
      const urlPath = new URL(resourceURL).pathname;
      let lastSegment = urlPath.substring(urlPath.lastIndexOf('/') + 1);
      if (lastSegment) {
        // Replace '-' with spaces and remove any other unwanted characters
        lastSegment = lastSegment.replace(/[-_]/g, ' ').replace(/[^\w\s]/gi, '');
        resourceName = `${resourceName} | ${lastSegment}`;
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setError('Please provide a valid URL of the resource you wish to upload');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      return;
    }
  
    const newResource = {
      title: resourceName,
      link: resourceURL.trim(), // Ensure URL is trimmed
      id: user.id, // Store user ID as a foreign key
      logoUrl: logoUrl,
      domainName: domainName,
    };
  
    // Add the new resource to Firestore
    await addDoc(collection(db, 'community_resources'), newResource);
  
    // Fetch the user's profile image
    const userDocRef = doc(db, 'users', user.id);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
  
    // Add the new resource to the local state with updated contributor image
    setResources([...resources, {
      ...newResource,
      contributor: `${userData.firstname} ${userData.lastname}`,
      imageUrl: userData.imageUrl || '/placeholder.png', // Use placeholder if no image URL
    }]);
    setImageErrors([...imageErrors, false]); // Add new entry to image error state
    setIsUploadModalOpen(false);
  }
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirstResource, indexOfLastResource);

  const totalPages = Math.ceil(resources.length / resourcesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImageError = (index) => {
    const newImageErrors = [...imageErrors];
    newImageErrors[index] = true;
    setImageErrors(newImageErrors);
  };

  return (
    <div className="" style={{ backgroundColor: '#140D0C' }}>
      {/* Header Component */}
      <Header />

      <div className="relative z-10 isolate bg-[#140D0C] min-h-[800px] overflow-visible mx-0 px-0 ">
        
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 transform-gpu overflow-hidden blur-3xl sm:top-0"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#302a18] to-[#5A3A2F] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-[90%] py-32 sm:py-32 lg:py-50" 
          data-aos="fade-up"
          data-aos-anchor-placement="center-center"
        >
          <div className="bg-[#1E1412] p-8 rounded-md w-full mt-20 z-10 relative">
            <div className="flex flex-col z-10 sm:flex-row items-center justify-between pb-6 relative" style={{ zIndex: 1 }}>
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
                  <input 
                    className="bg-[#231715] outline-none ml-1 block text-white text-sm" 
                    type="text" 
                    placeholder="search..." 
                    value={searchQuery} // Bind search query state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                  />
                </div>
                <div className="ml-4 sm:ml-10 space-x-8">
                  <button className="bg-[#C69635] px-2 py-2 rounded-lg text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer sm:hidden" 
                  onClick={() => setIsUploadModalOpen(true)}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                  <button className="hidden sm:block bg-[#C69635] px-2 py-2 rounded-lg text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer"
                  onClick={() => setIsUploadModalOpen(true)}
                  >
                    New Resource
                  </button>
                </div>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto relative z-50">
              <div className="inline-block min-w-full shadow-md shadow-[#140D0C] rounded-lg overflow-visible border-[#33211E] border-[1px]">
                <table className="min-w-full leading-normal">
                  <thead className="shadow-md shadow-[#140D0C]">
                    <tr>
                      <th className="px-5 py-3 text-center border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Resource Name
                      </th>
                      <th className="px-5 py-3 text-center border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="sm:hidden px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Cont.
                      </th>
                      <th className="hidden text-center sm:block px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Contributor
                      </th>
                      <th className="px-5 py-3 border-b-2 border-[#140D0C] bg-[#231715] text-center text-xs font-semibold text-gray-100 uppercase tracking-wider">
                        Open
                      </th>
                    </tr>
                  </thead>
                  <tbody className="relative">
                    {filteredResources.slice(indexOfFirstResource, indexOfLastResource).map((resource, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm">
                          <p className="text-white text-left whitespace-no-wrap">{resource.title}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm justify-center text-center align-middle items-center">
                          <div className="flex items-center justify-center">
                            {resource.logoUrl && !imageErrors[index] ? (
                              <a href={new URL(resource.link).origin} target="_blank" rel="noopener noreferrer">
                              <Image
                                src={resource.logoUrl}
                                alt={resource.domainName}
                                width={20}
                                height={20}
                                quality={90} // Set image quality
                                className="w-8 h-8 rounded-full border-2 border-[#C69635] shadow-md shadow-[#140D0C] mr-2"
                                onError={() => handleImageError(index)} // Handle broken image
                              />
                            </a>
                          ) : (
                            <a href={new URL(resource.link).origin} target="_blank" rel="noopener noreferrer">
                              <p className="text-[#C69635] text-center">{resource.domainName}</p>
                            </a>
                          )}
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm relative">
                          <div className="flex items-center justify-center">
                            <Link href={`/ProfilePage/${encodeURIComponent(resource.id)}`} passHref>
                              <img
                                src={resource.imageUrl || '/placeholder.png'}
                                alt="Profile"
                                className="w-8 h-8 rounded-full border-2 border-[#231715] shadow-md shadow-[#140D0C] mr-2"
                              />
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-[#33211E] bg-[#1E1412] text-sm text-center">
                          <button className=" px-2 py-2 rounded-lg text-[#C69635] text-xs font-bold tracking-wide cursor-pointer" onClick={() => window.open(resource.link, '_blank')}>
                            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center p-4">
                  <span className="text-xs text-gray-400">
                    Showing {indexOfFirstResource + 1} to {Math.min(indexOfLastResource, resources.length)} of {resources.length} results
                  </span>
                  <div className="space-x-2">
                    <button
                      className="bg-[#C69635] px-2 py-1 rounded-lg text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="bg-[#C69635] px-2 py-1 rounded-lg text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* Upload Modal */}
        {isUploadModalOpen && (
        <>
          <div className="fixed inset-0 bg-[#140D0C] opacity-75 z-40"></div> {/* Overlay */}
          <div className="bg-[#1E1412] shadow-lg shadow-[#140D0C] w-[80%] max-w-[900px] h-[95%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md z-50 overflow-auto">
            <div className="flex flex-col items-center">
                <XMarkIcon className="h-5 w-5 text-[#C69635] cursor-pointer absolute top-2 right-2 mt-2 mr-2" onClick={() => setIsUploadModalOpen(false)} />
                <h2 className="text-[#C69635] text-xl font-semibold align-start mt-10">Upload Resource</h2>
                <p className="text-gray-300 text-xs mb-4 text-center pt-2 pb-0 px-14 w-full">Please fill out the form below to upload your resource. 
                    If the resource is not already part of the library, we will add it and credit you as the contributor.
                    Note that uploading inappropriate content will result in an immediate ban on your account.
                    </p>
                    <h3 className="text-[#C69635] text-md text-left font-bold mb-0 mt-4 px-14 w-full">Common Errors</h3>
                    <p className="text-gray-300 text-xs text-left pt-2 pb-0 px-14 w-full">If you encounter any errors that are not listed below,
                      please contact us at support@thetechcatalyst.com for assistance.
                    </p>
                    <ul className="list-disc list-inside text-gray-400 text-xs mb-4 text-left pt-2 pb-0 px-14 w-full ">
                        <li className="text-[#DDBA6C] font-bold mb-2">You must be logged in to upload a resource <br />
                        <div className="ml-8">
                        <em className="text-[#C9C4BB] text-[10px] font-normal"> To make a contribution to the resource library, you must be logged in.
                          This will allow us to credit you as the contributor of the resource.
                        </em>
                        </div>
                        </li>
                        <li className="text-[#DDBA6C] font-bold mb-2">Please provide a valid URL of the resource you wish to upload <br />
                          <div className="ml-8">
                            <em className="text-[#C9C4BB] text-[10px] font-normal"> Ensure your provided URL is correct and accessible.</em>                          
                          </div>
                        </li>
                          <li className="text-[#DDBA6C] font-bold mb-2">This URL is already a resource in the library <br />
                        <div className="ml-8">
                        <em className="text-[#C9C4BB] text-[10px] font-normal"> This contribution has already been made. Provide another resource if you wish to make a contribution.</em>
                        </div>
                        </li>
                        <li className="text-[#DDBA6C] font-bold mb-2">The URL you provided is not safe. Detected threats: MALWARE <br />
                        <div className="ml-8">
                        <em className="text-[#C9C4BB] text-[10px] font-normal"> This URL poses a malware threat, intended to steal data and gain unauthorized access to your system. Please exercise caution when visiting this site.</em>
                        </div>
                        </li>
                        <li className="text-[#DDBA6C] font-bold mb-2">The URL you provided is not safe. Detected threats: SOCIAL_ENGINEERING <br />
                        <div className="ml-8">
                        <em className="text-[#C9C4BB] text-[10px] font-normal"> This URL poses a social engineering threat, intended to trick you into providing personal information. Please exercise cuation when visiting this site.</em>
                        </div>
                        </li>
                        <li className="text-[#DDBA6C] font-bold">The URL you provided is not safe. Detected threats: UNWANTED_SOFTWARE <br />
                        <div className="ml-8">
                        <em className="text-[#C9C4BB] text-[10px] font-normal"> This URL poses an unwanted software threat, intended to install software that performs actions not clearly disclosed or are deceptive. Please exercise caution when visiting this site.</em>
                        </div>
                        </li>
                    </ul>
                {/* Resource URL */}
                <div className="mt-4 px-14 w-full">
                <label className="text-[#C69635] text-md font-bold mb-0 mt-0">URL</label>
                <p className="text-gray-400 text-xs mb-4">Please provide the URL of the resource you are uploading.
                </p>
                    <input
                        type="text"
                        className="bg-[#231715] rounded text-left text-xs text-gray-300 h-8 w-full pl-1 mb-4 border-[#33211E] border-[2px] focus:border-[#C69635] focus:outline-none"
                        style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                        value={resourceURL}
                        onChange={(e) => setResourceURL(e.target.value)}
                    />
                </div>

                <button className="bg-[#C69635] px-4 py-2 rounded-md text-[#140D0C] text-xs font-semibold tracking-wide cursor-pointer m-2 md:mt-8"
                onClick={handleUpload}
                >Upload</button>
            </div>
          </div>
        </>
        )}
        {showPopup && (
          <div className="fixed bottom-4 right-4 bg-[#C69635] text-[#1E1412] p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out z-50">
            {error}
          </div>
        )}
    </div>
  )
}