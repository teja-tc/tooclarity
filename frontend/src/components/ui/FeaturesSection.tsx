import Link from "next/link";

const features = [
  {
    title: "Create Your Listing",
    description: "Showcase your programs with details.",
    color: "bg-pink-100",
  },
  {
    title: "Reach Qualified Students",
    description: "Receive inquiries, view analytics, and track performance.",
    color: "bg-purple-100",
  },
  {
    title: "Manage Your Dashboard",
    description: "Easily monitor and manage your institution's profile.",
    color: "bg-blue-100",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Getting Started is Easy</h2>
      <p className="text-gray-500 mb-10">
        Create your profile in minutes to reach thousands of actively searching students.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${feature.color} p-6 rounded-2xl shadow-lg`}
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <Link href="/features" className="mt-8 inline-block text-brandBlue font-medium">
        See all features →
      </Link>
    </section>
  );
}
