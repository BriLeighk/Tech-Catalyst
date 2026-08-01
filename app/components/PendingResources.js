'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const ADMIN_EMAIL = 'hello@brianaleighstudio.com';

export default function PendingResources({ currentUserEmail, onReviewed }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const isAdmin = currentUserEmail === ADMIN_EMAIL;

  const fetchPending = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'community_resources'));
      const list = await Promise.all(
        snapshot.docs
          .filter((resourceDoc) => resourceDoc.data().status === 'pending')
          .map(async (resourceDoc) => {
            const data = resourceDoc.data();
            let contributor = 'Unknown';
            try {
              const userDoc = await getDoc(doc(db, 'users', data.id));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                contributor = `${userData.firstname || ''} ${userData.lastname || ''}`.trim();
              }
            } catch {
              // keep Unknown
            }
            return {
              ...data,
              docId: resourceDoc.id,
              contributor,
            };
          })
      );
      setPending(list);
    } catch (error) {
      console.error('Error fetching pending resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchPending();
  }, [isAdmin]);

  const reviewResource = async (docId, status) => {
    setBusyId(docId);
    try {
      await updateDoc(doc(db, 'community_resources', docId), {
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: ADMIN_EMAIL,
      });
      setPending((prev) => prev.filter((item) => item.docId !== docId));
      if (onReviewed) onReviewed();
    } catch (error) {
      console.error(`Error marking resource ${status}:`, error);
    } finally {
      setBusyId(null);
    }
  };

  if (!isAdmin) return null;

  return (
    <section className="mt-10 rounded-xl border border-[#33211E] bg-[#1E1412] p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#DDBA6C]">
            Admin
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#F2F4E6]">
            Pending Resources
          </h2>
          <p className="mt-1 text-sm text-[#C9C4BB]">
            Review community submissions before they appear in the library.
          </p>
        </div>
        <span className="rounded-full bg-[#231715] px-3 py-1 text-xs font-semibold text-[#C69635]">
          {pending.length} waiting
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-[#C9C4BB]">Loading submissions…</p>
      ) : pending.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#33211E] px-4 py-8 text-center text-sm text-[#C9C4BB]">
          No resources awaiting approval.
        </p>
      ) : (
        <ul className="space-y-3">
          {pending.map((resource) => (
            <li
              key={resource.docId}
              className="flex flex-col gap-4 rounded-lg border border-[#33211E] bg-[#231715] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#F2F4E6]">
                  {resource.title || 'Untitled resource'}
                </p>
                <p className="mt-1 truncate text-xs text-[#DDBA6C]">
                  {resource.domainName || 'Unknown domain'} · {resource.contributor}
                </p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[#C69635] hover:underline"
                >
                  Preview link
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={busyId === resource.docId}
                  onClick={() => reviewResource(resource.docId, 'approved')}
                  className="inline-flex items-center gap-1 rounded-md bg-[#C69635] px-3 py-2 text-xs font-semibold text-[#140D0C] disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === resource.docId}
                  onClick={() => reviewResource(resource.docId, 'rejected')}
                  className="inline-flex items-center gap-1 rounded-md border border-[#683F24] px-3 py-2 text-xs font-semibold text-[#DDBA6C] disabled:opacity-50"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
