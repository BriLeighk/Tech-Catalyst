export default function AboutSection() {
  return (
    <div className="bg-[#140D0C] py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className=" text-3xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">About Us</h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
              Navigating the tech industry can be challenging, especially for undergraduates and 
            recent graduates looking to break into the field. At Tech Catalyst, we understand 
            that the traditional college curriculum alone often falls short of equipping aspiring tech 
            professionals with the practical skills and knowledge needed to secure roles at top 
            tech companies. <br/>
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt=""
            src="" /* TODO: PUT IMAGE */
            className="w-[48rem] max-w-none rounded-xl bg-white shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-300 lg:max-w-lg">
              <h2 className=" text-2xl font-bold tracking-tight text-[#F2F4E6]">Our Solution</h2>
              <p className="mt-6">
              That's why we've created an all-in-one platform designed specifically for those 
            embarking on their journey into the tech world. Whether you're an aspiring software 
            engineer, cybersecurity expert, or web developer, Tech Catalyst puts everything you 
            need right at your fingertips. <br/> <br/>

            Our platform offers a comprehensive resource library, including resume templates, 
            skill-building roadmaps, in-depth courses, and up-to-date job listings from across the 
            industry. We've also curated a collection of essential tech stacks, project templates, 
            and networking opportunities to help you stand out in a competitive market. <br/> <br/>

            Join Tech Catalyst and empower yourself with the tools, knowledge, and support to 
            navigate the tech industry and land your dream role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}