import React from 'react';
import Marquee from 'react-fast-marquee'; // Using a lightweight library for marquee

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const ReviewCard = ({ img, name, username, body }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-lg">
    <img className="rounded-full" width="32" height="32" src={img} alt={name} />
    <div>
      <p className="font-medium text-lg">{name}</p>
      <p className="text-sm text-gray-500">{username}</p>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  </div>
);

export const ReviewMarquee = () => (
  <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
    <Marquee pauseOnHover gradient={false} speed={30}>
      {reviews.map((review, index) => (
        <ReviewCard key={index} {...review} />
      ))}
    </Marquee>
    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"></div>
  </div>
);
