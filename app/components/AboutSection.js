import { useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutSection() {
  const videoRef = useRef(null);


  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    if (videoRef.current) {
      videoRef.current.playbackRate = 2; // Set the playback rate
    }
  }, []);

  return (
    <div className="bg-[#140D0C] py-10 sm:py-20 pl-4">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10 mt-0">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-bold tracking-tight text-[#F2F4E6] sm:text-4xl">About Us</h1>
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
        <div className="mt-22 lg:mt-32 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            <video 
              ref={videoRef}
              className="w-full max-w-[30rem] rounded-xl shadow-xl sm:max-w-[40rem] border-2 border-[#C69635] shadow-lg mr-[20px]"
              src="/about-video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ transform: 'scale(1)' }}
              data-aos="fade-up"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-300 lg:max-w-lg">
              <h2 className="text-2xl font-bold tracking-tight text-[#F2F4E6]">Our Solution</h2>
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