'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth functions

export default function Popup({ setShowPopup }) {
  const [open, setOpen] = useState(true);

  const handleLogoutAndRegister = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = '/Register';
  };

  return (
    <Dialog open={open} onClose={() => setShowPopup(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[gray-900 bg-opacity-75] transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-[#1E1412] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="bg-[#1E1412] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" style={{ position: 'fixed', transform: 'translate(900%, -40%)' }}>
                  {/* add other icon - possibly a checkmark or logo */}
                  <img src="/logo.png" alt="logo" className="h-14" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-[#F2F4E6]">
                    You're Already Logged In.
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-[#F2F4E6]">
                      Do you want to logout and create a new account?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#1E1412] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleLogoutAndRegister}
                className="inline-flex w-full justify-center rounded-md bg-[#683F24] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#442718] sm:ml-3 sm:w-auto"
                style={{ transition: 'background-color 0.3s ease-in-out' }}
              >
                Create Account
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setShowPopup(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-[#DCDDD2] sm:mt-0 sm:w-auto"
                style={{ transition: 'background-color 0.3s ease-in-out' }}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}