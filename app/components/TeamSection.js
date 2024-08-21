import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this import is correct
import { TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TeamSection() {
  const [user, setUser] = useState(null);
  const [user2, setUser2] = useState(null); // New state for the second user
  const [user3, setUser3] = useState(null); // New state for the third user
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null); // New state to track which user's badge is hovered

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('email', '==', 'kirchgessner@wisc.edu'));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUser(userData);
        } else {
          console.error('User data not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUser2Data = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('email', '==', 'tridhatriv@gmail.com'));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUser2(userData);
        } else {
          console.error('User data not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUser3Data = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('email', '==', 'bethelbezabeh@gmail.com'));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUser3(userData);
        } else {
          console.error('User data not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchUser2Data();
    fetchUser3Data();
  }, []);

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
    <div className="bg-[#140D0C] py-24 sm:py-32 flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">Our Team</h1>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-8" data-aos="fade-up" data-aos-duration="1000">
          {user && (
            <Link href={`/ProfilePage/${encodeURIComponent(user.email)}`} passHref>
              <div
                className="bg-[#1E1412] p-4 rounded-lg shadow-lg w-[300px] h-[450px] relative flex flex-col justify-center transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer"
                style={{ border: '2px solid #C69635' }}
              >
                <div className="absolute top-2 left-2 text-[#C69635] text-xs font-bold px-2 py-1">Founder</div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img 
                      alt="" 
                      src={user.imageUrl || '/placeholder.png'} 
                      className="h-32 w-32 rounded-full shadow-lg shadow-[#140D0C] object-cover" 
                      style={{ border: `2px solid ${user.userNumber && user.userNumber <= 100 ? '#C69635' : '#2D1E1B'}` }}
                    />
                    {user.userNumber && user.userNumber <= 100 && (
                      <img
                        alt="First User Badge"
                        src="/firstUserBadge.png"
                        className="absolute -top-[32px] right-[34px] h-14 w-14 cursor-pointer"
                        onMouseEnter={() => {
                          setIsBadgeModalOpen(true);
                          setIsImageHovered(true);
                          setHoveredUser(user);
                        }}
                        onMouseLeave={() => setIsImageHovered(false)}
                      />
                    )}
                  </div>
                  <div className="text-[#C69635] text-[22px] font-bold">{user.firstname} {user.lastname}</div>
                  <div className="text-white text-sm" dangerouslySetInnerHTML={{ __html: user.bio }} />
                  <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full">Lead Developer</div>
                </div>
              </div>
            </Link>
          )}

          {user2 && (
            <Link href={`/ProfilePage/${encodeURIComponent(user2.email)}`} passHref>
              <div
                className="bg-[#1E1412] p-4 rounded-lg shadow-lg w-[300px] h-[450px] relative flex flex-col justify-center transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer"
                style={{ border: '2px solid #C69635' }}
              >
                <div className="absolute top-2 left-2 text-[#C69635] text-xs font-bold px-2 py-1">Co-Founder</div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img 
                      alt="" 
                      src={user2.imageUrl || '/placeholder.png'} 
                      className="h-32 w-32 rounded-full shadow-lg shadow-[#140D0C] object-cover" 
                      style={{ border: `2px solid ${user2.userNumber && user2.userNumber <= 100 ? '#C69635' : '#2D1E1B'}` }}
                    />
                    {user2.userNumber && user2.userNumber <= 100 && (
                      <img
                        alt="First User Badge"
                        src="/firstUserBadge.png"
                        className="absolute -top-[32px] right-[34px] h-14 w-14 cursor-pointer"
                        onMouseEnter={() => {
                          setIsBadgeModalOpen(true);
                          setIsImageHovered(true);
                          setHoveredUser(user2);
                        }}
                        onMouseLeave={() => setIsImageHovered(false)}
                      />
                    )}
                  </div>
                  <div className="text-[#C69635] text-[22px] font-bold">{user2.firstname} {user2.lastname}</div>
                  <div className="text-white text-sm" dangerouslySetInnerHTML={{ __html: user2.bio }} />
                  <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full">Developer</div>
                </div>
              </div>
            </Link>
          )}

          {user3 && (
            <Link href={`/ProfilePage/${encodeURIComponent(user3.email)}`} passHref>
              <div
                className="bg-[#1E1412] p-4 rounded-lg shadow-lg w-[300px] h-[450px] relative flex flex-col justify-center transition-transform duration-300 hover:translate-y-[-10px] cursor-pointer"
                style={{ border: '2px solid #C69635' }}
              >
                <div className="absolute top-2 left-2 text-[#C69635] text-xs font-bold px-2 py-1">Co-Founder</div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img 
                      alt="" 
                      src={user3.imageUrl || '/placeholder.png'} 
                      className="h-32 w-32 rounded-full shadow-lg shadow-[#140D0C] object-cover" 
                      style={{ border: `2px solid ${user3.userNumber && user3.userNumber <= 100 ? '#C69635' : '#2D1E1B'}` }}
                    />
                    {user3.userNumber && user3.userNumber <= 100 && (
                      <img
                        alt="First User Badge"
                        src="/firstUserBadge.png"
                        className="absolute -top-[32px] right-[34px] h-14 w-14 cursor-pointer"
                        onMouseEnter={() => {
                          setIsBadgeModalOpen(true);
                          setIsImageHovered(true);
                          setHoveredUser(user3);
                        }}
                        onMouseLeave={() => setIsImageHovered(false)}
                      />
                    )}
                  </div>
                  <div className="text-[#C69635] text-[22px] font-bold">{user3.firstname} {user3.lastname}</div>
                  <div className="text-white text-sm" dangerouslySetInnerHTML={{ __html: user3.bio }} />
                  <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full">Developer</div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isBadgeModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div
          className="bg-[#1E1412] p-6 rounded-lg shadow-lg text-center h-[330px] w-[300px] border-[#C69635] border-[1px]"
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
    </div>
  );
}