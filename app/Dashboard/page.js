'use client'
import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon, Bars3Icon, XMarkIcon, PencilSquareIcon, ArrowUpOnSquareIcon, CloudUploadIcon } from '@heroicons/react/24/outline'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth, db, storage } from '../firebase'; // Ensure this import is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    imageUrl: '/placeholder.png',
    bio: '',
    password: '*'.repeat(8) // Fixed-length masked password
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // New state for active tab
  const [showProfileConfirmation, setShowProfileConfirmation] = useState(false); // State for profile confirmation
  const [showNameConfirmation, setShowNameConfirmation] = useState(false); // State for name confirmation in settings
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // State for password confirmation
  const [showError, setShowError] = useState(false); // State for error messages
  const [errorMessage, setErrorMessage] = useState(''); // State for error message text
  const [isSubscribed, setIsSubscribed] = useState(false); // State for subscription status
  const [showSuccess, setShowSuccess] = useState(false); // State for success message

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
  
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const highResPhotoURL = userData.imageUrl.replace('s96-c', 's400-c');
          setUser({
            ...user,
            firstname: userData.firstname || '',
            lastname: userData.lastname || '',
            email: userData.email || '',
            imageUrl: highResPhotoURL || '/placeholder.png',
            bio: userData.bio || '',
            password: '*'.repeat(8) // Fixed-length masked password
          });
          setFirstName(userData.firstname || '');
          setLastName(userData.lastname || '');
          setBio(userData.bio || '');
  
          // Fetch subscription status from Brevo
          const response = await axios.post('/api/checkBrevoSubscription', { email: userData.email });
          setIsSubscribed(response.data.isSubscribed);
        }
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserData(user); // Fetch user data from Firestore
    });
  
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = '/Login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && user) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', user.uid), { imageUrl });
      setUser((prevUser) => ({ ...prevUser, imageUrl }));
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleSave = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { firstname: firstName, lastname: lastName, bio });
        setUser((prevUser) => ({ ...prevUser, firstname: firstName, lastname: lastName, bio }));
        setIsEditing(false);

        // Show profile confirmation message
        setShowProfileConfirmation(true);
        setTimeout(() => setShowProfileConfirmation(false), 3000);

        // Call the API route to update Brevo contact information
        const response = await fetch('/api/updateBrevoContact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            firstName,
            lastName,
          }),
        });

        if (response.ok) {
          console.log('Brevo contact updated successfully.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error updating Brevo contact');
        }
      } catch (error) {
        console.error('Error updating Brevo contact:', error);
        setErrorMessage('Error updating profile: ' + error.message);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  const handleSaveName = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { firstname: firstName, lastname: lastName });
        setUser((prevUser) => ({ ...prevUser, firstname: firstName, lastname: lastName }));
        setIsEditing(false);

        // Show name confirmation message
        setShowNameConfirmation(true);
        setTimeout(() => setShowNameConfirmation(false), 3000);
      } catch (error) {
        console.error('Error updating name:', error);
        setErrorMessage('Error updating name: ' + error.message);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordError('Password updated successfully');
      setIsPasswordEditing(false);

      // Show password confirmation message
      setShowPasswordConfirmation(true);
      setTimeout(() => setShowPasswordConfirmation(false), 3000);
    } catch (error) {
      setPasswordError('Error updating password: ' + error.message);
      setErrorMessage('Error updating password: ' + error.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleRemovePhoto = async () => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { imageUrl: '/placeholder.png' });
      setUser((prevUser) => ({ ...prevUser, imageUrl: '/placeholder.png' }));
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById('file-upload').click();
  };
  
  const navigation = [
    
      // add more tabs here
  ]

  const userNavigation = [
    { name: 'Profile', href: '#', onClick: () => setActiveTab('profile') },
    { name: 'Settings', href: '#', onClick: () => setActiveTab('settings') },
    { name: 'Sign out', href: '#', onClick: handleSignOut },
  ]

  const initialUser = user ? {
    name: user.firstname + ' ' + user.lastname,
    email: user.email,
    imageUrl: user.imageUrl
  } : { name: '', email: '', imageUrl: '/placeholder.png' };

  const handleSubscriptionChange = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleSaveSubscription = async () => {
    try {
      const response = await axios.post('/api/updateBrevoSubscription', {
        email: user.email,
        isSubscribed,
      });
      if (response.status === 200) {
        console.log('Subscription updated successfully.');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
      } else {
        throw new Error(response.data.message || 'Error updating subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setErrorMessage('Error updating subscription: ' + error.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <>
      <div className="relative isolate bg-[#140D0C] min-h-[800px] overflow-hidden" style={{margin: '0',padding: '0'}}>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#5A3A2F] to-[#2B1D1A] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#5A3A2F] to-[#2B1D1A] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
        <Disclosure as="nav" className="bg-[#140D0C]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                    <a href="/">
                    <img
                    alt="The Tech Catalyst"
                    src="/logo.png"
                    className="h-20 w-20"
                  />
                    </a>
                  
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current ? 'bg-[#1E1412] text-white' : 'text-gray-300 hover:bg-[#140D0C] hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full bg-[#140D0C] p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-[#140D0C] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img alt="" src={initialUser.imageUrl} className="h-10 w-10 rounded-full" />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-[#b79994]"
                            onClick={item.onClick}
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-[#1E1412] p-2 text-[#F2F4E6] hover:bg-[#442718] hover:text-[#1E1412] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                style={{
                  transition: 'background-color 0.3s ease-in-out',
                }}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'bg-[#140D0C] text-white' : 'text-gray-300 hover:bg-[#1E1412] hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  onClick={item.onClick}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img alt="" src={initialUser.imageUrl} className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{initialUser.name}</div>
                  <div className="text-sm font-medium leading-none text-gray-400">{initialUser.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-[#140D0C] p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-[#1E1412] hover:text-white"
                    onClick={item.onClick}
                    style={{
                      transition: 'background-color 0.2s ease-in-out',
                    }}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <header className=" text-center">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="b mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            {user && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img alt="" src={user.imageUrl} className="h-32 w-32 rounded-full shadow-lg" style={{ border: '2px solid #2D1E1B' }}/>
                  <Menu as="div" className="absolute bottom-0 right-0">
                    <MenuButton className="cursor-pointer">
                      <ArrowUpOnSquareIcon className="h-6 w-6 text-white" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleUploadButtonClick}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                          >
                            Upload a photo
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleRemovePhoto}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                          >
                            Delete photo
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="bg-[#1E1412] p-4 rounded-lg shadow-lg w-full max-w-md relative" style={{ border: '2px solid #2D1E1B' }}>
                  {activeTab === 'profile' && (
                    <>
                      <button onClick={() => setIsEditing(true)} className="absolute top-2 right-2">
                        <PencilSquareIcon className="h-6 w-6 text-white" />
                      </button>
                      {isEditing && <div className="text-white text-xl font-bold mb-2">Name</div>}
                      <div className={`text-white text-xl flex items-center mb-2 ${!isEditing ? 'font-bold' : ''}`}>
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={firstName}
                              onChange={handleFirstNameChange}
                              size={firstName.length || 1}
                              className="bg-[#231715] border border-gray-400 rounded text-left text-sm text-white pl-1 mr-2" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                            />
                            <input
                              type="text"
                              value={lastName}
                              onChange={handleLastNameChange}
                              size={lastName.length || 1}
                              className="bg-[#231715] border border-gray-400 rounded text-left text-sm text-white pl-1" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                            />
                          </>
                        ) : (
                          <span>{user.firstname} {user.lastname}</span>
                        )}
                      </div>
                      {/* Put something here */}
                      {isEditing && <div className="text-white text-xl font-bold mb-2">Bio</div>}
                      <div className={`text-white text-sm flex items-center mb-4`}>
                        {isEditing ? (
                          <textarea
                            value={bio}
                            onChange={(e) => {
                              handleBioChange(e);
                              e.target.style.height = 'auto';
                              e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
                            }}
                            className="bg-[#231715] border border-gray-400 rounded text-left text-sm text-white w-full pl-1"
                            style={{ minHeight: '1.5rem', maxHeight: '10rem', overflow: 'hidden', paddingLeft: '4px', border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                            maxLength={200}
                          />
                        ) : (
                          <span>{user.bio}</span>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex justify-end mt-4">
                          <button onClick={handleSave} className="text-white text-sm px-4 py-2 border border-white rounded">Save</button>
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === 'settings' && (
                    <div className="flex flex-col mb-0">
                      <div className="text-white text-xl font-bold mb-0">Name</div>
                      <p className="text-gray-400 text-xs mb-4">Update your first and last name below.</p>
                      <div>
                        <label className="text-white text-sm">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={handleFirstNameChange}
                          className="bg-[#231715] border border-gray-400 rounded text-left text-white w-full pl-1 mb-4" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={handleLastNameChange}
                          className="bg-[#231715] border border-gray-400 rounded text-left text-white w-full pl-1 mb-4" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <button onClick={handleSaveName} className="text-white text-sm px-4 py-2 border border-gray-400 hover:border-white rounded">Save</button>
                      </div>
                      
                      <div className="text-white text-xl font-bold mb-0 mt-8">Password Settings</div>
                      <p className="text-gray-400 text-xs mb-4">To change your password, you must enter your current password and a new password. Choose a strong password for your account.</p>
                      <div>
                        <label className="text-white text-sm">Current Password</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="bg-[#231715] border border-gray-400 rounded text-left text-white w-full pl-1" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-[#231715] border border-gray-400 rounded text-left text-white w-full pl-1" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="bg-[#231715] border border-gray-400 rounded text-left text-white w-full pl-1" style={{ border: '2px solid #33211E', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                        />
                      </div>
                      {passwordError && <div className="text-red-500">{passwordError}</div>}
                      <div className="flex justify-end mt-4">
                        <button onClick={handlePasswordChange} className="text-white text-sm px-4 py-2 border border-gray-400 hover:border-white rounded">Change Password</button>
                      </div>

                    {/* Update Emailing preferences */}
                    <div className="text-white text-xl font-bold mb-0 mt-8">Email Preferences</div>
                    <p className="text-gray-400 text-xs mb-4">Update your email preferences below to receive updates and early access to our features from our newsletter.</p>
                    <div className="flex items-center">
                      <label className="text-white text-sm mr-2">Subscribe to Newsletter</label>
                      <input
                        type="checkbox"
                        checked={isSubscribed}
                        onChange={handleSubscriptionChange}
                        className="form-checkbox h-5 w-5 text-[#683F24] border-gray-300 rounded focus:ring-[#683F24] bg-[#724428]"
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <button onClick={handleSaveSubscription} className="text-white text-sm px-4 py-2 border border-gray-400 hover:border-white rounded">Save Changes</button>
                    </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {showProfileConfirmation && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-300" style={{ opacity: showProfileConfirmation ? 1 : 0 }}>
          Profile updated successfully
        </div>
      )}
      {showNameConfirmation && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-300" style={{ opacity: showNameConfirmation ? 1 : 0 }}>
          Name updated successfully
        </div>
      )}
      {showPasswordConfirmation && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-300" style={{ opacity: showPasswordConfirmation ? 1 : 0 }}>
          Password updated successfully
        </div>
      )}
      {showError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-300" style={{ opacity: showError ? 1 : 0 }}>
          {errorMessage}
        </div>
      )}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
          Email preferences updated successfully
        </div>
      )}
    </>
  )
}