'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: 'Docverse transformed how I create resumes. The AI understood my experience and generated a professional, ATS-optimized resume in minutes. I got 3 interview calls within a week!',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    name: 'Sarah Johnson',
    role: 'Software Engineer',
  },
  {
    text: 'Creating presentations has never been easier. The AI generates beautiful slides with relevant content, and I can customize everything. My clients are always impressed!',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Michael Chen',
    role: 'Marketing Consultant',
  },
  {
    text: 'As a career coach, I recommend Docverse to all my clients. The quality of documents it produces is outstanding, and the AI suggestions are spot-on.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: 'Emily Rodriguez',
    role: 'Career Coach',
  },
  {
    text: 'I needed a professional CV for my academic applications. Docverse made it incredibly easy to showcase my research and publications in a clean, organized format.',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Dr. James Wilson',
    role: 'Research Scientist',
  },
  {
    text: "The cover letter generator is a game-changer. It creates personalized letters that perfectly complement my resume. I've saved hours of writing time!",
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'Aisha Patel',
    role: 'Product Manager',
  },
  {
    text: 'I use Docverse for all my business presentations. The AI understands my content and creates visually stunning slides that engage my audience every time.',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    name: 'Lisa Anderson',
    role: 'Business Consultant',
  },
  {
    text: 'As a freelancer, I need professional documents quickly. Docverse delivers every time - from proposals to presentations, everything looks polished and professional.',
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
    name: 'David Kim',
    role: 'Freelance Designer',
  },
  {
    text: 'The diagram feature is incredible for technical documentation. I can create flowcharts and system diagrams in minutes instead of hours. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
    name: 'Rachel Thompson',
    role: 'Technical Writer',
  },
  {
    text: 'Docverse helped me land my dream job. The resume builder created a document that stood out from hundreds of applications. The AI really understands what recruiters want.',
    image: 'https://randomuser.me/api/portraits/men/9.jpg',
    name: 'Alex Martinez',
    role: 'Data Analyst',
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full"
                  key={i}
                >
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export { testimonials };
