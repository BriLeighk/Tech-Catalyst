import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this import is correct
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function OtherUsers({ currentUserEmail }) { // Accept currentUserEmail as a prop
  const resourcesPerPage = 5; // Number of resources to display per page
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserResources = async () => {
      try {
        // Fetch the current user's document ID
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', currentUserEmail));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.empty) {
          console.error('No matching user found');
          return;
        }
        const userId = userSnapshot.docs[0].id;

        // Fetch resources for the current user
        const resourcesCollection = collection(db, 'community_resources');
        const resourcesQuery = query(resourcesCollection, where('id', '==', userId));
        const resourcesSnapshot = await getDocs(resourcesQuery);
        const resourcesList = resourcesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResources(resourcesList);
      } catch (error) {
        console.error('Error fetching user resources:', error);
      }
    };

    fetchUserResources();
  }, [currentUserEmail]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(resources.length / resourcesPerPage);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = 1; i <= maxPagesToShow; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return (
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 rounded bg-[#1E1412] text-[#C69635] disabled:opacity-50"
        >
          &lt;
        </button>
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => number !== '...' && handlePageChange(number)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-[#C69635] text-[#1E1412]' : 'bg-[#1E1412] text-[#C69635]'}`}
            disabled={number === '...'}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="mx-1 px-3 py-1 rounded bg-[#1E1412] text-[#C69635] disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="position-fixed">
        <div className="py-24 sm:py-32 flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-0 lg:px-8 ">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#F2F4E6] sm:text-2xl pt-10">Your Contributions</h1>
        </div>
        
        <div className="mt-5">
          <div className="mt-5 flex flex-wrap justify-center" style={{ gap: '0rem' }} data-aos="fade-up" data-aos-duration="1000">
            {currentResources.map((resource, index) => (
              <div key={index} className="bg-[#1E1412] p-2 rounded-lg shadow-lg w-full relative flex flex-row justify-center transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer transform scale-90"
              onClick={() => window.open(resource.link, '_blank')}
              >
                
                <div className="flex flex-row items-center space-y-1">
                  <div className="relative">
                    <img 
                      alt="" 
                      src={resource.logoUrl || '/placeholder.png'} 
                      className="h-8 w-8 rounded-full shadow-lg shadow-[#140D0C]" 
                      style={{ 
                        border: `2px solid #C69635`,
                        objectFit: 'cover' // Ensure images aren't distorted
                      }}
                      onClick={() => window.open(new URL(resource.link).origin, '_blank')}
                    />
                  </div>
                  <div className="text-center text-[#C69635] text-[11px] font-bold">{resource.title}</div>
                </div>
                <ArrowTopRightOnSquareIcon className="h-6 w-6 text-[#C69635] fixed right-4 top-2"
                onClick={() => window.open(resource.link, '_blank')}
                />
              </div>
            ))}
          </div>
        </div>
        {renderPagination()}
      </div>
    </div>
    </div>
  );
}