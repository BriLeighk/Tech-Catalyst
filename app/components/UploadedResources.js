'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const statusStyles = {
  pending: 'bg-[#33211E] text-[#DDBA6C]',
  approved: 'bg-[#2A2418] text-[#C69635]',
  rejected: 'bg-[#3A1F1A] text-[#C99F8A]',
};

export default function UploadedResources({ currentUserEmail }) {
  const resourcesPerPage = 5;
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserResources = async () => {
      if (!currentUserEmail) return;

      try {
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', currentUserEmail));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.empty) {
          console.error('No matching user found');
          return;
        }
        const userId = userSnapshot.docs[0].id;

        const resourcesCollection = collection(db, 'community_resources');
        const resourcesQuery = query(resourcesCollection, where('id', '==', userId));
        const resourcesSnapshot = await getDocs(resourcesQuery);
        const resourcesList = resourcesSnapshot.docs.map((resourceDoc) => ({
          ...resourceDoc.data(),
          docId: resourceDoc.id,
        }));
        setResources(resourcesList);
      } catch (error) {
        console.error('Error fetching user resources:', error);
      }
    };

    fetchUserResources();
  }, [currentUserEmail]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(resources.length / resourcesPerPage) || 1;

  return (
    <aside className="w-full px-2 py-8 sm:px-0">
      <div className="rounded-xl border border-[#33211E] bg-[#1E1412] p-5">
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight text-[#F2F4E6]">
            Your Contributions
          </h2>
          <p className="mt-1 text-xs text-[#C9C4BB]">
            Resources you&apos;ve submitted to the library
          </p>
        </div>

        <div className="mt-5 space-y-3" data-aos="fade-up" data-aos-duration="1000">
          {currentResources.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[#33211E] px-3 py-6 text-center text-xs text-[#C9C4BB]">
              No contributions yet.
            </p>
          ) : (
            currentResources.map((resource) => {
              const status = resource.status || 'approved';
              return (
                <div
                  key={resource.docId}
                  className="flex items-center gap-3 rounded-lg border border-[#33211E] bg-[#231715] p-3 transition-colors hover:border-[#C69635]/50"
                >
                  <img
                    alt=""
                    src={resource.logoUrl || '/placeholder.png'}
                    className="h-9 w-9 shrink-0 rounded-full border border-[#C69635] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#C69635]">
                      {resource.title}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        statusStyles[status] || statusStyles.pending
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  {status === 'approved' && (
                    <button
                      type="button"
                      className="shrink-0 rounded-md p-1.5 text-[#C69635] hover:bg-[#1E1412]"
                      onClick={() => window.open(resource.link, '_blank')}
                      aria-label="Open resource"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {resources.length > resourcesPerPage && (
          <div className="mt-4 flex justify-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded px-3 py-1 text-[#C69635] disabled:opacity-40"
            >
              &lt;
            </button>
            <span className="px-2 py-1 text-xs text-[#C9C4BB]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded px-3 py-1 text-[#C69635] disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
