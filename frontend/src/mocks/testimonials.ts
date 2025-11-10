export interface Testimonial {
  id: number
  quote: string
  author: string
  position: string
  company?: string
  image?: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "An exceptionally skilled software engineer with both deep technical expertise and outstanding UX/UI design sensibilities. Their ability to bridge development and design resulted in a product that was not only technically sound but delightfully user-friendly.",
    author: "Alex Johnson",
    position: "Engineering Manager",
    company: "Tech Innovations Inc."
  },
  {
    id: 2,
    quote: "Working with this engineer was transformative for our team. Their comprehensive understanding of the entire product lifecycle—from conception to deployment—and their meticulous attention to user experience set them apart from other developers I've collaborated with.",
    author: "Sarah Chen",
    position: "Product Manager",
    company: "Digital Solutions Ltd."
  },
  {
    id: 3,
    quote: "A rare combination of technical mastery and design thinking. They don't just write code; they craft experiences. Their contributions elevated not only the quality of our codebase but also the overall user satisfaction significantly.",
    author: "Michael O'Brien",
    position: "CTO",
    company: "Creative Studios"
  }
]

export async function getTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS
}

export async function getTestimonial(id: number): Promise<Testimonial | null> {
  return TESTIMONIALS.find(t => t.id === id) || null
}
