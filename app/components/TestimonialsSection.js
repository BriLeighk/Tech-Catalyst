// NOT IN USE: For when we have testimonials to show

export default function TestimonialsSection() {
  return (
    <div>
      <section id="testimonials" className="py-20 bg-lightGrey w-full">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading mb-12">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <TestimonialCard
                quote="Catalyst has been a game changer for me. The resources and community are top-notch!"
                author="Alice Johnson"
                role="Software Engineer"
              />
              <TestimonialCard
                quote="The job search feature helped me land my dream internship. Highly recommend!"
                author="John Doe"
                role="Computer Science Student"
              />
              <TestimonialCard
                quote="An invaluable tool for anyone looking to break into the tech industry."
                author="Sarah Williams"
                role="Tech Enthusiast"
              />
            </div>
          </div>
        </section>
    </div>
  )
}