import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this import is correct
import Link from 'next/link';
import { TrophyIcon } from '@heroicons/react/24/outline';

export default function OtherUsers({ currentUserEmail }) { // Accept currentUserEmail as a prop
  const [users, setUsers] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null); // New state to track which user's badge is hovered
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const usersPerPage = 10; // Number of users to display per page

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersList = querySnapshot.docs.map(doc => doc.data());
        // Filter out the current user
        const filteredUsers = usersList.filter(user => user.email !== currentUserEmail);
        
        // Sort users alphabetically by first name
        filteredUsers.sort((a, b) => a.firstname.localeCompare(b.firstname));

        // Separate co-founders
        const founders = filteredUsers.filter(user => user.email === 'kirchgessner@wisc.edu');
        const coFounders = filteredUsers.filter(user => ['bethelbezabeh@gmail.com', 'tridhatriv@gmail.com'].includes(user.email));
        const otherUsers = filteredUsers.filter(user => !['kirchgessner@wisc.edu', 'bethelbezabeh@gmail.com', 'tridhatriv@gmail.com'].includes(user.email));

        // Combine the lists
        const sortedUsers = [...founders, ...coFounders, ...otherUsers];
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchUsersData();
  }, [currentUserEmail]);

  const getOrdinalSuffix = (number) => {
    const j = number % 10,
          k = number % 100;
    if (j === 1 && k !== 11) {
      return number + "st";
    }
    if (j === 2 && k !== 12) {
      return number + "nd";
    }
    if (j === 3 && k !== 13) {
      return number + "rd";
    }
    return number + "th";
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
          disabled={currentPage === totalPages}
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
          <h1 className="text-2xl font-bold tracking-tight text-[#F2F4E6] sm:text-2xl pt-10">Other Users</h1>
        </div>
        <div className="mt-5 flex flex-wrap justify-center" style={{ gap: '0rem' }} data-aos="fade-up" data-aos-duration="1000">
          {currentUsers.map((user, index) => (
            <Link key={index} href={`/ProfilePage/${encodeURIComponent(user.email)}`} passHref>
              <div
                className="bg-[#1E1412] p-2 rounded-lg shadow-lg w-[130px] h-[180px] relative flex flex-col justify-center transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer transform scale-90"
                style={{ border: `${['kirchgessner@wisc.edu', 'bethelbezabeh@gmail.com', 'tridhatriv@gmail.com'].includes(user.email) ? '1px solid #C69635' : '2px solid #2D1E1B'}` }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <img 
                      alt="" 
                      src={user.imageUrl || '/placeholder.png'} 
                      className="h-16 w-16 rounded-full shadow-lg shadow-[#140D0C]" 
                      style={{ 
                        border: `2px solid ${user.userNumber && user.userNumber <= 100 ? '#C69635' : '#2D1E1B'}`,
                        objectFit: 'cover' // Ensure images aren't distorted
                      }}
                    />
                    {user.userNumber && user.userNumber <= 100 && (
                      <img
                        alt="First User Badge"
                        src="/firstUserBadge.png"
                        className="absolute -top-[18px] right-[16px] h-8 w-8 cursor-pointer"
                        onMouseEnter={() => {
                          setIsBadgeModalOpen(true);
                          setHoveredUser(user);
                        }}
                        onMouseLeave={() => setIsBadgeModalOpen(false)}
                      />
                    )}
                    {isBadgeModalOpen && hoveredUser === user && (
                      <div
                        className="absolute bottom-full mb-6 left-1/2 transform -translate-x-1/2 bg-[#1E1412] p-2 rounded-lg shadow-lg shadow-black text-center w-[150px] border-[#C69635] border-[1px] before:content-[''] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-[#C69635] after:content-[''] after:absolute after:top-full after:left-1/2 after:transform after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#1E1412] after:mt-[-1px]"
                        onMouseEnter={() => setIsBadgeModalOpen(true)}
                        onMouseLeave={() => {
                            setIsBadgeModalOpen(false);
                        }}
                      >
                        <img src="/firstUserBadge.png" alt="First User Badge" className="h-12 w-12 mx-auto mb-2"/>
                        <h2 className="text-[#DDBA6C] text-sm font-bold mb-1">First User Badge</h2>
                        <p className="text-[#DDBA6C] text-xs">{hoveredUser && `Earned as The Tech Catalysts' ${getOrdinalSuffix(hoveredUser.userNumber)} member.`}</p>
                        <p className="text-[#C69635] text-xs flex row text-left mt-2">
                          <TrophyIcon className="h-3 w-3 mr-1"/>Must be one of The Tech Catalysts' first 100 registered users to earn this badge.</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-[#C69635] text-[11px] font-bold">{user.firstname} {user.lastname}</div>
                  {user.email === 'kirchgessner@wisc.edu' && (
                    <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full">
                      Founder
                    </div>
                  )}
                  {(user.email === 'bethelbezabeh@gmail.com' || user.email === 'tridhatriv@gmail.com') && (
                    <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full">
                      Co-Founder
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {renderPagination()}
      </div>
    </div>
    </div>
    
  );
}