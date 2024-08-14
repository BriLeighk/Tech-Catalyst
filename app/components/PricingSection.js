import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import Switch from 'react-switch';

const freeFeatures = [
  'Access to community-uploaded resources',
  'Restricted access to job listings',
  'Ability to create and update basic profile features',
  'Limited visibility of events',
  'Basic account badges for milestones'
]

const premiumFeatures = [
  'Access to all resources',
  'Personalized event & resource recommendations',
  'Enhanced profile customization',
  'Exclusive badges for milestone completion',
  'Visibility of all tech event listings',
]

export default function PricingSection() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <div className="bg-white py-24 sm:py-32"> {/* Change background color */}
      <div className="mx-auto max-w-8xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Free vs Premium Features</h2>

        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6" style={{ marginTop: '20px' }}> {/* Flex container for the cards */}
          {/* Free Tier */}
          <div className="mt-16 rounded-3xl ring-1 ring-gray-200 lg:mt-0 lg:flex-1 lg:max-w-none" style={{ width: '100%' }}> {/* Adjusted width */}
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center">Free Tier</h3>
              <p className="mt-6 text-base leading-7 text-gray-600 text-center">
                Our Free Tier offers limited access to our resource library, job listings, and events calendar. <br/> 
                
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What's included</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 mx-auto">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16 h-[350px]">
                <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Free</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$0.00</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                  </p>
                  <a
                    href="/register"
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create Account
                  </a>
                </div>
                 <p className="mt-6 text-xs leading-5 text-gray-600">
                  Create an account now for early access to our platform, discounts on premium features, and to gain a custom First User Badge on your profile. <br/> <em>Eligible for the first 100 users only.</em>
                </p>
              </div>
            </div>
          </div>

          {/* Premium Yearly Tier - Monthly or Yearly (discount on year) */}
          <div className="mt-16 w-full max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mt-0 lg:flex-1 lg:max-w-none"> {/* Adjusted width */}
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center">Premium</h3>
              <p className="mt-6 text-base leading-7 text-gray-600 text-center">
                Our Premium Tier offers unlimited access to our resources, job listings, and events calendar. <br/> 
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What's included</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 mx-auto">
              <div className="relative rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16 h-[350px]">
                <div className="absolute top-4 right-4">
                  <Switch
                    checked={!isMonthly}
                    onChange={() => setIsMonthly(!isMonthly)}
                    onColor="#ff9900"
                    offColor="#86d3ff"
                    offHandleColor="#0052cc"
                    onHandleColor="#ffcc00"
                    handleDiameter={28}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    aria-label="Monthly/Yearly switch"
                  />
                </div>
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600 w-[201px]">{isMonthly ? '/ Month  ' : '/ Year  '}</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      {isMonthly ? '$9.99' : '$99.99'}
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                  </p>
                  <a
                    href="/register"
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Coming Soon
                  </a>
                </div>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Choose between monthly and yearly plans. <br/>
                  <em>Purchase yearly for a 16% discount.</em>
                  <br/><br/>
                </p>
              </div>
            </div>
          </div>

          {/* Lifetime membership */}
          <div className="mt-16 w-full max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mt-0 lg:flex-1 lg:max-w-none"> {/* Adjusted width */}
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center">Lifetime membership</h3>
              <p className="mt-6 text-base leading-7 text-gray-600 text-center">
                Pay once, and own unlimited access to our features forever. <br/>
              </p> 
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What's included</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 mx-auto">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16 h-[350px]">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$249</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                  </p>
                  <a
                    href="/register"
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Coming Soon
                  </a>
                </div>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                <em>Price equivalent to 2 years of premium.</em><br/><br/><br/></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}