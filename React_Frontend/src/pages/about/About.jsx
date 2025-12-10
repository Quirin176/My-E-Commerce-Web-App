export default function About() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>

      <p className="text-lg text-gray-700 mb-6">
        Welcome to <span className="font-semibold">MyApp</span> — a modern web
        application designed with simplicity, performance, and scalability in mind.
        This project demonstrates a professional frontend architecture using
        React, Vite, Tailwind CSS, and React Router.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-gray-700 mb-6">
        Our mission is to provide clean and intuitive user experiences, fast
        interfaces, and reliable functionality. The goal is to show how a
        production-ready frontend can be built using modern web technologies.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Technologies We Use</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
        <li>React (for UI components)</li>
        <li>React Router (for routing and layouts)</li>
        <li>Tailwind CSS (for utility-first styling)</li>
        <li>Vite (for fast development & optimized builds)</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
      <p className="text-gray-700">
        If you have questions or want to expand this project, feel free to
        contact us anytime!
      </p>
    </div>
  );
}
