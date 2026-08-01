'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const TEAM_MEMBERS = [
  {
    email: 'hello@brianaleighstudio.com',
    role: 'Lead Full Stack Developer',
    badge: 'Founder',
  },
];

function getOrdinalSuffix(number) {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) return `${number}st`;
  if (j === 2 && k !== 12) return `${number}nd`;
  if (j === 3 && k !== 13) return `${number}rd`;
  return `${number}th`;
}

/** Quill often saves black text colors that disappear on dark cards. */
function readableBioHtml(html) {
  if (!html) return '';
  return html
    .replace(/color\s*:\s*[^;"]+;?/gi, '')
    .replace(/\sstyle="\s*"/gi, '')
    .replace(/\sstyle='\s*'/gi, '');
}

function TeamCard({ member, isBadgeModalOpen, hoveredUser, setIsBadgeModalOpen, setHoveredUser }) {
  const isFirstHundred = member.userNumber && member.userNumber <= 100;

  return (
    <Link
      href={`/ProfilePage/${encodeURIComponent(member.id)}`}
      className="block max-w-[300px] no-underline"
    >
      <article
        className="group relative flex h-[420px] w-full flex-col overflow-hidden rounded-xl border border-[#C69635] bg-[#1E1412] p-5 text-[#E8E4D9] shadow-lg transition-transform duration-300 hover:-translate-y-2"
      >
        {member.badge && (
          <span className="absolute left-4 top-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C69635]">
            {member.badge}
          </span>
        )}

        <div className="mt-6 flex flex-col items-center">
          <div className="relative shrink-0">
            <img
              alt={`${member.firstname} ${member.lastname}`}
              src={member.imageUrl || '/placeholder.png'}
              className="h-28 w-28 rounded-full object-cover shadow-lg shadow-[#140D0C]"
              style={{ border: `2px solid ${isFirstHundred ? '#C69635' : '#2D1E1B'}` }}
            />
            {isFirstHundred && (
              <img
                alt="First User Badge"
                src="/firstUserBadge.png"
                className="absolute -top-7 right-6 h-12 w-12 cursor-pointer"
                onMouseEnter={() => {
                  setIsBadgeModalOpen(true);
                  setHoveredUser(member);
                }}
                onMouseLeave={() => setIsBadgeModalOpen(false)}
              />
            )}
            {isBadgeModalOpen && hoveredUser === member && (
              <div
                className="absolute bottom-full left-1/2 z-20 mb-5 w-[170px] -translate-x-1/2 rounded-lg border border-[#C69635] bg-[#1E1412] p-3 text-center shadow-lg shadow-black before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-[#C69635] after:absolute after:left-1/2 after:top-full after:mt-[-1px] after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#1E1412]"
                onMouseEnter={() => setIsBadgeModalOpen(true)}
                onMouseLeave={() => setIsBadgeModalOpen(false)}
              >
                <img src="/firstUserBadge.png" alt="First User Badge" className="mx-auto mb-2 h-10 w-10" />
                <h2 className="mb-1 text-sm font-bold text-[#DDBA6C]">First User Badge</h2>
                <p className="text-xs text-[#DDBA6C]">
                  Earned as The Tech Catalysts&apos; {getOrdinalSuffix(member.userNumber)} member.
                </p>
                <p className="mt-2 flex items-start gap-1 text-left text-xs text-[#C69635]">
                  <TrophyIcon className="mt-0.5 h-3 w-3 shrink-0" />
                  Must be one of the first 100 registered users to earn this badge.
                </p>
              </div>
            )}
          </div>

          <h3 className="mt-4 w-full truncate text-center text-[22px] font-bold text-[#C69635]">
            {member.firstname} {member.lastname}
          </h3>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-hidden">
          <div
            className="line-clamp-5 text-center text-sm leading-relaxed text-[#E8E4D9] [&_*]:m-0 [&_*]:text-[#E8E4D9] [&_p]:inline [&_a]:text-[#C69635] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: readableBioHtml(member.bio) }}
          />
        </div>

        <div className="mt-4 shrink-0 self-center rounded-full bg-[#C69635] px-3 py-1 text-xs font-bold text-[#1E1412]">
          {member.role}
        </div>
      </article>
    </Link>
  );
}

export default function TeamSection() {
  const [members, setMembers] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const results = await Promise.all(
          TEAM_MEMBERS.map(async (entry) => {
            const userQuery = query(collection(db, 'users'), where('email', '==', entry.email));
            const querySnapshot = await getDocs(userQuery);
            if (querySnapshot.empty) return null;
            const userDoc = querySnapshot.docs[0];
            return {
              id: userDoc.id,
              ...userDoc.data(),
              role: entry.role,
              badge: entry.badge,
            };
          })
        );
        setMembers(results.filter(Boolean));
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section className="bg-[#140D0C] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">Our Team</h2>
          <p className="mt-3 text-sm text-[#C9C4BB] sm:text-base">
            The people building The Tech Catalysts community and platform.
          </p>
        </div>

        <div
          className="mt-12 flex flex-wrap justify-center gap-8"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {members.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              isBadgeModalOpen={isBadgeModalOpen}
              hoveredUser={hoveredUser}
              setIsBadgeModalOpen={setIsBadgeModalOpen}
              setHoveredUser={setHoveredUser}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
