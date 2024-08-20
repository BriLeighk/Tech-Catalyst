'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../app/firebase'; // Ensure db is correctly exported
import { TrophyIcon } from '@heroicons/react/24/outline';
import '../../app/Dashboard/customQuill.css';
import '../../app/globals.css'; // Import global styles
import Header from '../../app/components/Header';

export default function ProfilePage() {
  const router = useRouter();
  const { email } = router.query; // Get the email from the route parameters
  const [user, setUser] = useState(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isClient, setIsClient] = useState(false); // Track if component is mounted on client

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts on client
  }, []);

  useEffect(() => {
    if (!email) return; // Wait for the email to be available

    const fetchUserData = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
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
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUserData();
  }, [email]); // Fetch user data when email changes

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

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (

    <div className="relative isolate bg-[#140D0C] min-h-[800px] overflow-hidden" style={{ margin: '0', padding: '0' }}>
      <Header/>
      <div className="text-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-28">
      </div>
      <main>
        <div className="b mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img 
                  alt="" 
                  src="/loading.png" 
                  className="h-32 w-32 rounded-full shadow-lg" 
                  style={{ border: '1px solid #2D1E1B' }}
                />
              </div>
              <div className="bg-[#1E1412] p-4 rounded-lg shadow-lg w-full max-w-[700px] relative" style={{ border: '2px solid #2D1E1B' }}>
                <div className="text-[#C69635] text-[22px] flex items-center mb-2 font-bold justify-center">
                  <span>Loading...</span>
                </div>
                <div className="text-[#C69635] text-xl font-bold mb-2 pt-8">Bio</div>
                <div className="text-white text-sm flex items-center text-center mb-4">
                </div>
                <div className="text-[#C69635] text-[22px] font-bold mb-2 mt-8">Projects</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img 
                  alt="" 
                  src={user.imageUrl || '/placeholder.png'} 
                  className="h-32 w-32 rounded-full shadow-lg" 
                  style={{ border: `1px solid ${user.userNumber && user.userNumber <= 100 ? '#C69635' : '#2D1E1B'}` }}
                />
                {user.userNumber && user.userNumber <= 100 && (
                  <img
                    alt="First User Badge"
                    src="/firstUserBadge.png"
                    className="absolute -top-[32px] right-[34px] h-14 w-14 cursor-pointer"
                    onMouseEnter={() => {
                      setIsBadgeModalOpen(true);
                      setIsImageHovered(true);
                    }}
                    onMouseLeave={() => setIsImageHovered(false)}
                  />
                )}
              </div>
              <div className="bg-[#1E1412] p-4 rounded-lg shadow-lg w-full max-w-[700px] relative" style={{ border: '2px solid #2D1E1B' }}>
              <div className=" text-[#C69635] text-sm font-bold px-2 py-1 mb-2">
                {user.email === 'kirchgessner@wisc.edu' ? 'Founder' : user.email === 'tridhatriv@gmail.com' || user.email === 'bethelbezabeh@gmail.com' ? 'Co-Founder' : ''}
              </div>
                <div className="text-[#C69635] text-[22px] flex items-center mb-2 font-bold justify-center">
                  <span>{user.firstname} {user.lastname}</span>
                </div>
                
                <div className="text-[#C69635] text-xl font-bold mb-2 pt-8">Bio</div>
                <div className="text-white text-sm flex items-center text-center mb-4">
                  <div className="display-container" dangerouslySetInnerHTML={{ __html: user.bio }} />
                </div>
                {user.email === 'kirchgessner@wisc.edu' && (
                  <>
                    <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full w-[120px] text-center justify-center mx-auto">Lead Developer</div>
                  </>
                )}
                {user.email === 'tridhatriv@gmail.com' || user.email === 'bethelbezabeh@gmail.com' && (
                  <>
                    <div className="bg-[#C69635] text-[#1E1412] text-xs font-bold px-2 py-1 rounded-full w-[120px] text-center justify-center mx-auto">Developer</div>
                  </>
                )}
                
                <div className="text-[#C69635] text-[22px] font-bold mb-2 mt-8">Projects</div>
                {user.projects && user.projects.map((project, index) => (
                  <div key={index} className="mb-6 flex justify-evenly items-center">
                    <div className="flex items-start w-[80%]">
                      <span className="text-white text-xl mr-2">•</span>
                      <div>
                        <div className="text-[#C99F4A] text-[16px] font-bold">{project.title}</div>
                        <div className="display-container text-white text-sm" dangerouslySetInnerHTML={{ __html: project.description.replace(/<ul>/g, '<ul class="list-disc list-inside ml-4">').replace(/<ol>/g, '<ol class="list-decimal list-inside ml-4">') }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      {isBadgeModalOpen && (
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
            <p className="text-[#DDBA6C] text-sm">{user && `Earned as The Tech Catalysts' ${getOrdinalSuffix(user.userNumber)} member.`}</p>
            <p className="text-[#C69635] text-xs flex row text-left mt-8">
              <TrophyIcon className="h-5 w-5 mr-1"/>Must be one of The Tech Catalysts' first 100 registered users to earn this badge.</p>
          </div>
        </div>
      )}
    </div>
  );
}