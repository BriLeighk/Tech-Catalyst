'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import PendingResources from '../components/PendingResources';
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  getDoc,
  where,
} from 'firebase/firestore';
import { checkUserLoggedIn } from '../utils/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

const ADMIN_EMAIL = 'hello@brianaleighstudio.com';

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeResourceUrl = (rawUrl) => {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const isPublicResource = (resource) =>
  !resource.status || resource.status === 'approved';

export default function ResourceLibrary() {
  const [borderColor, setBorderColor] = useState('#33211E');
  const inputRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 50;
  const [resourceURL, setResourceURL] = useState('');
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState('');
  const [resources, setResources] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const filteredResources = resources.filter((resource) => {
    const q = searchQuery.toLowerCase();
    return (
      resource.title?.toLowerCase().includes(q) ||
      resource.domainName?.toLowerCase().includes(q) ||
      resource.contributor?.toLowerCase().includes(q)
    );
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleClick = () => setBorderColor('#C69635');

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setBorderColor('#33211E');
    }
  };

  const fetchResources = async () => {
    const resourcesQuery = query(collection(db, 'community_resources'));
    const querySnapshot = await getDocs(resourcesQuery);
    const resourcesList = (
      await Promise.all(
        querySnapshot.docs.map(async (resourceDoc) => {
          const resource = resourceDoc.data();
          if (!isPublicResource(resource)) return null;

          let contributor = 'Unknown';
          let imageUrl = '/placeholder.png';
          try {
            const userDoc = await getDoc(doc(db, 'users', resource.id));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              contributor = `${userData.firstname || ''} ${userData.lastname || ''}`.trim();
              imageUrl = userData.imageUrl || '/placeholder.png';
            }
          } catch {
            // keep defaults
          }

          return {
            ...resource,
            docId: resourceDoc.id,
            contributor,
            imageUrl,
          };
        })
      )
    ).filter(Boolean);

    setResources(resourcesList);
    setImageErrors(new Array(resourcesList.length).fill(false));
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

    fetchResources();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      unsubscribe();
    };
  }, []);

  const handleUpload = async () => {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      showToast('You must be logged in to upload a resource.');
      return;
    }

    const normalizedUrl = normalizeResourceUrl(resourceURL);
    if (!normalizedUrl) {
      showToast('Please provide a valid URL of the resource you wish to upload.');
      return;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      showToast('Please provide a valid URL of the resource you wish to upload.');
      return;
    }

    if (!user) {
      showToast('User information is missing.');
      return;
    }

    setIsUploading(true);

    try {
      const resourcesQuery = query(
        collection(db, 'community_resources'),
        where('link', '==', normalizedUrl)
      );
      const querySnapshot = await getDocs(resourcesQuery);
      const blockingDoc = querySnapshot.docs.find((d) => {
        const status = d.data().status;
        return !status || status === 'approved' || status === 'pending';
      });
      if (blockingDoc) {
        showToast(
          blockingDoc.data().status === 'pending'
            ? 'This URL is already awaiting review.'
            : 'This URL is already a resource in the library.'
        );
        return;
      }

      let resourceName = '';
      let logoUrl = '';
      let domainName = '';

      try {
        const { data: metadata } = await axios.get(
          `/api/extract-metadata?url=${encodeURIComponent(normalizedUrl)}`
        );
        if (metadata.error) throw new Error(metadata.error);

        resourceName = metadata.h1 || metadata.title || 'Unknown Resource';
        const domain = new URL(normalizedUrl).hostname;
        domainName = capitalizeWords(domain.split('.')[0]);
        logoUrl = metadata.isValidLogo ? metadata.logoUrl : '';

        const urlPath = new URL(normalizedUrl).pathname;
        let lastSegment = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        if (lastSegment) {
          lastSegment = lastSegment.replace(/[-_]/g, ' ').replace(/[^\w\s]/gi, '');
          if (lastSegment.trim()) {
            resourceName = `${resourceName} | ${lastSegment}`;
          }
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
        showToast('Please provide a valid URL of the resource you wish to upload.');
        return;
      }

      const newResource = {
        title: resourceName,
        link: normalizedUrl,
        id: user.id,
        logoUrl,
        domainName,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'community_resources'), newResource);

      setResourceURL('');
      setIsUploadModalOpen(false);
      showToast('Resource submitted for review. It will appear after approval.');
    } finally {
      setIsUploading(false);
    }
  };

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / resourcesPerPage));
  const pageResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

  const handleImageError = (index) => {
    setImageErrors((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#140D0C]">
      <Header />

      <main className="relative isolate overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#302a18] to-[#5A3A2F] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div
          className="mx-auto max-w-6xl"
          data-aos="fade-up"
          data-aos-anchor-placement="center-center"
        >
          <section className="rounded-xl border border-[#33211E] bg-[#1E1412] p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#C69635] sm:text-3xl">
                  Resource Library
                </h1>
                <p className="mt-2 max-w-xl text-sm text-[#C9C4BB]">
                  Community-shared roadmaps, tools, and learning materials. New uploads are
                  reviewed before they appear here.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <div
                  ref={inputRef}
                  className="flex items-center rounded-lg border-2 bg-[#231715] px-3 py-2"
                  style={{ borderColor }}
                  onClick={handleClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    className="ml-2 w-full bg-transparent text-sm text-white outline-none sm:w-52"
                    type="text"
                    placeholder="Search resources…"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C69635] px-4 py-2.5 text-xs font-semibold tracking-wide text-[#140D0C]"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="sm:inline">New Resource</span>
                </button>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-[#33211E]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#231715] text-left text-xs font-semibold uppercase tracking-wider text-[#F2F4E6]">
                      <th className="px-5 py-3">Resource</th>
                      <th className="px-5 py-3">Company</th>
                      <th className="px-5 py-3">Contributor</th>
                      <th className="px-5 py-3 text-center">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageResources.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-12 text-center text-sm text-[#C9C4BB]"
                        >
                          No approved resources match your search.
                        </td>
                      </tr>
                    ) : (
                      pageResources.map((resource, index) => (
                        <tr
                          key={resource.docId || index}
                          className="border-t border-[#33211E] bg-[#1E1412]"
                        >
                          <td className="max-w-[280px] px-5 py-4 text-sm text-white">
                            <p className="truncate font-medium">{resource.title}</p>
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <a
                              href={resource.link ? new URL(resource.link).origin : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#C69635] hover:underline"
                            >
                              {resource.logoUrl && !imageErrors[index] ? (
                                <Image
                                  src={resource.logoUrl}
                                  alt={resource.domainName || 'Company'}
                                  width={28}
                                  height={28}
                                  quality={90}
                                  className="h-7 w-7 rounded-full border border-[#C69635] object-cover"
                                  onError={() => handleImageError(index)}
                                />
                              ) : null}
                              <span>{resource.domainName}</span>
                            </a>
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <Link
                              href={`/ProfilePage/${encodeURIComponent(resource.id)}`}
                              className="inline-flex items-center gap-2 text-[#F2F4E6] hover:text-[#C69635]"
                            >
                              <img
                                src={resource.imageUrl || '/placeholder.png'}
                                alt={resource.contributor}
                                className="h-8 w-8 rounded-full border border-[#33211E] object-cover"
                              />
                              <span className="hidden sm:inline">{resource.contributor}</span>
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              type="button"
                              className="rounded-lg p-2 text-[#C69635] transition-colors hover:bg-[#231715]"
                              onClick={() => window.open(resource.link, '_blank')}
                              aria-label={`Open ${resource.title}`}
                            >
                              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#33211E] bg-[#231715] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-gray-400">
                  Showing{' '}
                  {filteredResources.length === 0 ? 0 : indexOfFirstResource + 1}–
                  {Math.min(indexOfLastResource, filteredResources.length)} of{' '}
                  {filteredResources.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-[#C69635] px-3 py-1.5 text-xs font-semibold text-[#140D0C] disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-[#C69635] px-3 py-1.5 text-xs font-semibold text-[#140D0C] disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>

          {isAdmin && (
            <PendingResources
              currentUserEmail={user.email}
              onReviewed={fetchResources}
            />
          )}
        </div>
      </main>

      {isUploadModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#140D0C]/80"
            onClick={() => setIsUploadModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[#33211E] bg-[#1E1412] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              className="absolute right-4 top-4 text-[#C69635]"
              onClick={() => setIsUploadModalOpen(false)}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="pr-8 text-xl font-semibold text-[#C69635]">Submit a Resource</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#C9C4BB]">
              Share a useful link with the community. Submissions are reviewed manually
              before they appear in the library. Inappropriate content may result in account
              restrictions.
            </p>

            <div className="mt-6 space-y-2 rounded-lg border border-[#33211E] bg-[#231715] p-4 text-xs text-[#C9C4BB]">
              <p className="font-semibold text-[#DDBA6C]">Before you submit</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>You must be logged in so we can credit you as the contributor.</li>
                <li>Use a valid, publicly accessible URL.</li>
                <li>Duplicate links already in the library will be rejected.</li>
              </ul>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-[#C69635]" htmlFor="resource-url">
                Resource URL
              </label>
              <p className="mt-1 text-xs text-gray-400">
                Example: https://roadmap.sh or roadmap.sh
              </p>
              <input
                id="resource-url"
                type="text"
                className="mt-3 h-10 w-full rounded-lg border-2 border-[#33211E] bg-[#231715] px-3 text-sm text-gray-200 outline-none focus:border-[#C69635]"
                value={resourceURL}
                onChange={(e) => setResourceURL(e.target.value)}
                placeholder="https://"
              />
            </div>

            <button
              type="button"
              disabled={isUploading}
              className="mt-6 w-full rounded-lg bg-[#C69635] px-4 py-2.5 text-sm font-semibold text-[#140D0C] disabled:opacity-50"
              onClick={handleUpload}
            >
              {isUploading ? 'Submitting…' : 'Submit for Review'}
            </button>
          </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-[#C69635] px-4 py-3 text-sm font-medium text-[#1E1412] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
