import { UserCircleIcon, BookOpenIcon, CalendarDaysIcon, BriefcaseIcon, ChatBubbleBottomCenterTextIcon, UserGroupIcon, ArrowUpOnSquareIcon, TrophyIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Resource Library',
    description:
      'Browse our comprehensive tech library with a wide range of resources, such as roadmaps, certifications, job listings, and more.',
    icon: BookOpenIcon,
  },
  {
    name: 'Job Search',
    description:
      'Access internships and entry-level jobs by utilizing our integrated search and filter tools in the resource library.',
    icon: BriefcaseIcon, // Maybe switch to magnifying glass icon
  },
  {
    name: 'Progress Badges',
    description:
      'Document your success by earning badges through event participation, resource library contribution, certification completion, and more.',
    icon: TrophyIcon,
  },
  {
    name: 'User Profiles',
    description:
      'Showcase your skills, interests, and achievements by linking your social profiles, and earning milestone-based progress badges.',
    icon: UserCircleIcon,
  },
  {
    name: 'Tech Events',
    description:
      'Stay up-to-date and informed about webinars, hackathons, and other events through our all-inclusive events calendar.',
    icon: CalendarDaysIcon,
  },
  {
    name: 'Messaging System',
    description:
      'Connect with others through our real-time messaging platform to build your network.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: 'Swipe-to-Connect',
    description:
      'Discover like-minded peers with similar or complementary skills for project collaboration and growth, giving you the top picks based on your unique set of skills and interests.',
    icon: UserGroupIcon,
  },
  {
    name: 'Contribute Resources',
    description:
      'Upload new resources to help others learn faster, and earn milestone-based reward badges for contributing to the library.',
    icon: ArrowUpOnSquareIcon,
  },
]

export default function FeatureSection() {
  return (
    <div className="bg-[#140D0C] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#C69635]">Learn Faster</h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">
            Your Gateway to Big Tech
          </h3>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Tech Catalyst is your all-in-one resource platform designed to help undergrads and recent 
            graduates break into the tech industry. We provide essential resources like resume 
            templates, skill-building roadmaps, courses, and job listings, empowering you to 
            navigate the tech landscape and land your dream role.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-[#F2F4E6]">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E1412]">
                    <feature.icon aria-hidden="true" className="h-7 w-7 text-[#C69635]" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}