// app/privacy-policy/page.tsx (Next.js 13+ / app router)
import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="bg-gray-50 py-16 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-4 leading-relaxed">
          We, at <strong>TOOCLARITY SEARCH PRIVATE LIMITED</strong> (hereinafter referred to as “TooClarity”), are committed to safeguarding your privacy and ensuring that your personal information is protected. This Privacy Policy explains how we collect, use, share, and safeguard the data you provide when you register as a Partner (such as educational institutions, consultancies, coaching centres, or service providers) on our platform. This Policy is subject to the Terms of Use of TooClarity. It applies to all individuals and organizations registering on the platform, and to any information we collect in connection with our services.
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          <strong>Personal Information (PI)</strong> – means any information that identifies or can reasonably identify a living person, such as name, contact number, email address, government-issued ID, financial details, or any other data as defined under applicable laws and regulations.
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          <strong>Core Purpose:</strong> The TooClarity Platform is designed to help students discover and research institutions, courses, consultancies, and related services. It also enables partners to connect with prospective students, businesses, and collaborators. Partner information provided on the platform may be shared with relevant users who have shown interest in the partner’s services, or where the partner has expressed intent to reach specific user groups.
        </p>

        {/* Information Collection */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information Collection</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            We collect information about you and your organization to provide effective services. The information we may collect includes (but is not limited to):
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Registration Information:</strong> Name, email, phone number, designation, organization details, address, and verification documents.</li>
            <li><strong>Business Profile Information:</strong> Course details, consultancy services, brochures, pricing, logos, and promotional materials.</li>
            <li><strong>Usage Data:</strong> How you interact with the platform, including log data, IP address, device information, and location data.</li>
            <li><strong>Financial Information:</strong> Bank account details or payment-related data where applicable for paid services, commissions, or premium listings.</li>
            <li><strong>Communications:</strong> Any messages, queries, or interactions you have with students, institutions, or TooClarity support staff via the platform.</li>
          </ul>
        </section>

        {/* Processing */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Processing of Personal Information</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            TooClarity may process your personal information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>To create and maintain your partner account on the platform.</li>
            <li>To publish and display your institution’s/organization’s information to prospective students and businesses.</li>
            <li>To facilitate inquiries, applications, and interactions between you and prospective students/clients.</li>
            <li>To send alerts, newsletters, promotional campaigns, or updates relevant to your listings.</li>
            <li>To verify your identity and ensure compliance with applicable laws.</li>
            <li>To improve our services, website, and user experience.</li>
            <li>To conduct surveys, research, and feedback assessments.</li>
            <li>For legal, regulatory, or compliance requirements, including fraud prevention.</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar tracking technologies to improve the platform experience. Partners may choose to disable cookies through browser settings, though this may affect certain features of the platform.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            TooClarity may share information with third-party service providers for payment processing, marketing campaigns, analytics, technical support, and hosting. These providers are bound by confidentiality obligations and data protection standards.
          </p>
        </section>

        {/* Children */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Children</h2>
          <p className="text-gray-700 leading-relaxed">
            The TooClarity Partner platform is not intended for individuals under 18. By registering, you confirm that you are legally authorized to represent your organization.
          </p>
        </section>

        {/* Information Sharing */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information Sharing</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>With prospective students who have expressed interest in your services.</li>
            <li>With third-party vendors under confidentiality agreements.</li>
            <li>With regulators or law enforcement as required by law.</li>
            <li>During corporate restructuring, mergers, or acquisitions.</li>
          </ul>
        </section>

        {/* Retention, Security, Rights, Disclaimer, Contact */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Retention of Personal Information</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Your personal information is retained as long as necessary to provide services or comply with legal obligations.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Confidentiality and Security</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            TooClarity uses industry-standard technical and organizational measures to safeguard your data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            You may have the right to access, correct, delete, or restrict processing of your data and lodge complaints with the relevant authorities.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            TooClarity is independent and not affiliated with any government body. Information is provided by partners and may not be fully verified.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            Data Protection Officer / Grievance Officer: <strong>Saikiran Chindam</strong> <br />
            TOOCLARITY SEARCH PRIVATE LIMITED <br />
            12-15-11, MANIKESWAR NAGAR, Tarnaka, Secunderabad, Hyderabad-500007, Telangana <br />
            Email: <a href="mailto:Tooclarity0@gmail.com" className="text-blue-600 underline">Tooclarity0@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
