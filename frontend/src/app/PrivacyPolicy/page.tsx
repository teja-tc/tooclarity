import React from 'react';
import Image from 'next/image';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2 sm:mb-0">
          <Image
            src="/New blue one 1.png"
            alt="Too Clarity Logo"
            width={150}
            height={50}
            className="w-32 sm:w-40"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Need help? Call +91 9391160205</span>
          <span className="text-green-500 text-lg sm:text-xl">📱</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-10 md:px-40 py-6 md:py-8 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Privacy Policy
          </h1>
          
          <p className="text-sm sm:text-base leading-relaxed">
            We, at TOOCLARITY SEARCH PRIVATE LIMITED. (hereinafter referred to as “TooClarity”), are committed to safeguarding your privacy and ensuring that your personal information is protected. This Privacy Policy explains how we collect, use, share, and safeguard the data you provide when you register as a Partner (such as educational institutions, consultancies, coaching centres, or service providers) on our platform. This Policy is subject to the Terms of Use of TooClarity. It applies to all individuals and organizations registering on the platform, and to any information we collect in connection with our services.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed">
            Personal Information (PI) – means any information that identifies or can reasonably identify a living person, such as name, contact number, email address, government-issued ID, financial details, or any other data as defined under applicable laws and regulations.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed">
            Core Purpose – The TooClarity Platform is designed to help students discover and research institutions, courses, consultancies, and related services. It also enables partners to connect with prospective students, businesses, and collaborators. Partner information provided on the platform may be shared with relevant users who have shown interest in the partner’s services, or where the partner has expressed intent to reach specific user groups.
          </p>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Information Collection
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              We collect information about you and your organization to provide effective services. The information we may collect includes (but is not limited to):
            </p>
            
            <ol className="list-decimal list-inside text-sm sm:text-base space-y-2 pl-4 max-w-3xl">
              <li>Registration Information: Name, email, phone number, designation, organization details, address, and verification documents.</li>
              <li>Business Profile Information: Course details, consultancy services, brochures, pricing, logos, and promotional materials.</li>
              <li>Usage Data: How you interact with the platform, including log data, IP address, device information, and location data.</li>
              <li>Financial Information: Bank account details or payment-related data where applicable for paid services, commissions, or premium listings.</li>
              <li>Communications: Any messages, queries, or interactions you have with students, institutions, or TooClarity support staff via the platform.</li>
            </ol>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Processing of Personal Information
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              TooClarity may process your personal information for the following purposes:
            </p>
            
            <ul className="list-disc list-inside text-sm sm:text-base space-y-2 pl-4 max-w-3xl">
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
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Cookies and Tracking Technologies
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              We use cookies and similar tracking technologies to improve the platform experience. These may include session cookies, analytics tools, and tracking pixels to monitor user interactions, performance of listings, and marketing campaigns. Partners may choose to disable cookies through browser settings, though this may affect certain features of the platform.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Third-Party Services
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              TooClarity may share information with third-party service providers for:
            </p>
            
            <ul className="list-disc list-inside text-sm sm:text-base space-y-2 pl-4 max-w-3xl">
              <li>Payment processing.</li>
              <li>Marketing and lead generation campaigns.</li>
              <li>Data analytics and reporting.</li>
              <li>Technical support and infrastructure hosting.</li>
            </ul>
            
            <p className="text-sm sm:text-base leading-relaxed">
              We ensure such service providers are bound by confidentiality obligations and comply with data protection standards.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Children
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              The TooClarity Partner platform is not intended for individuals under the age of 18. By registering, you confirm that you are legally authorized to represent your organization.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Information Sharing
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              We do not sell or rent your personal information. However, we may share information:
            </p>
            
            <ul className="list-disc list-inside text-sm sm:text-base space-y-2 pl-4 max-w-3xl">
              <li>With prospective students who have expressed interest in your institution/services.</li>
              <li>With third-party vendors working with us under confidentiality agreements.</li>
              <li>With regulators or law enforcement, if required under applicable law.</li>
              <li>During corporate restructuring, mergers, or acquisitions of TooClarity.</li>
            </ul>
            
            <p className="text-sm sm:text-base leading-relaxed">
              Once shared with educational institutions or consultancies, the use of data by such parties is subject to their respective privacy policies, and TooClarity is not liable for their practices.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Retention of Personal Information
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              Your personal information is retained for as long as necessary to provide services or comply with legal obligations. Post this period, information may be archived or securely deleted.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Confidentiality and Security
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              TooClarity uses industry-standard technical, organizational, and administrative measures to safeguard your data against unauthorized access, misuse, or disclosure. While we strive for security, no system is fully immune to breaches.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Your Rights
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              Depending on applicable law, you may have the right to:
            </p>
            
            <ul className="list-disc list-inside text-sm sm:text-base space-y-2 pl-4 max-w-3xl">
              <li>Access your personal information.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Restrict or object to data processing.</li>
              <li>Withdraw consent at any time.</li>
              <li>Lodge a complaint with the relevant data protection authority.</li>
            </ul>
            
            <p className="text-sm sm:text-base leading-relaxed">
              Requests may be sent to our Grievance Officer (details below).
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Changes to This Policy
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              TooClarity may update this Privacy Policy from time to time. Updated versions will be posted on the platform, and continued use of our services implies acceptance of the revised policy.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Disclaimer
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              TooClarity is an independent platform and is not affiliated with or endorsed by any government body. Information displayed about institutions or services is based on content provided by partners or sourced from their official communications. TooClarity strives to ensure accuracy but does not guarantee completeness or timeliness of information.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              Contact Information
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed">
              If you have any queries regarding this Privacy Policy or wish to exercise your rights, please contact: Data Protection Officer / Grievance Officer (Saikiran Chindam) TOOCLARITY SEARCH PRIVATE LIMITED 12-15-11, MANIKESWAR NAGAR, Tarnaka, Secunderabad, Hyderabad- 500007, Telangana Email ID: Tooclarity0@gmail.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;