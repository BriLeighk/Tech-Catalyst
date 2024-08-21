import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this import is correct
import Link from 'next/link';
import { TrophyIcon } from '@heroicons/react/24/outline';

export default function OtherUsers({ currentUserEmail }) { // Accept currentUserEmail as a prop
  const [users, setUsers] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null); // New state to track which user's badge is hovered

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersList = querySnapshot.docs.map(doc => doc.data());
        // Filter out the current user
        const filteredUsers = usersList.filter(user => user.email !== currentUserEmail);
        setUsers(filteredUsers);
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

  return (
    <div className="position-fixed">
        <div className="py-24 sm:py-32 flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-0 lg:px-8 ">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">Other Users</h1>
        </div>
        <div className="mt-10 flex flex-wrap justify-center" style={{ gap: '0rem' }} data-aos="fade-up" data-aos-duration="1000">
          {users.map((user, index) => (
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
                      style={{ border: `2px solid ${user.userNumber && user.userNumber <= 100 ? '#C69635' : '#2D1E1B'}` }}
                    />
                    {user.userNumber && user.userNumber <= 100 && (
                      <img
                        alt="First User Badge"
                        src="/firstUserBadge.png"
                        className="absolute -top-[18px] right-[16px] h-8 w-8 cursor-pointer"
                        onMouseEnter={() => {
                          setIsBadgeModalOpen(true);
                          setIsImageHovered(true);
                          setHoveredUser(user);
                        }}
                        onMouseLeave={() => setIsImageHovered(false)}
                      />
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
      </div>
      {isBadgeModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isBadgeModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <div
            className="bg-[#1E1412] p-6 rounded-lg shadow-lg text-center h-[330px] w-[250px] border-[#C69635] border-[1px]"
            onMouseEnter={() => setIsBadgeModalOpen(true)}
            onMouseLeave={() => {
              if (!isImageHovered) {
                setIsBadgeModalOpen(false);
              }
            }}
          >
            <img src="/firstUserBadge.png" alt="First User Badge" className="h-20 w-20 mx-auto mb-4"/>
            <h2 className="text-[#DDBA6C] text-xl font-bold mb-2">First User Badge</h2>
            <p className="text-[#DDBA6C] text-sm">{hoveredUser && `Earned as The Tech Catalysts' ${getOrdinalSuffix(hoveredUser.userNumber)} member.`}</p>
            <p className="text-[#C69635] text-xs flex row text-left mt-8">
              <TrophyIcon className="h-5 w-5 mr-1"/>Must be one of The Tech Catalysts' first 100 registered users to earn this badge.</p>
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
}