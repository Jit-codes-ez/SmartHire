import { Link } from "react-router-dom";

export default function HelpCenter() {
  const helpTopics = [
    {
      title: "Student Registration",
      description:
        "Create your SmartHire account, verify your email address, complete your profile, and upload your resume before applying for placement drives.",
    },
    {
      title: "Recruiter Registration",
      description:
        "Recruiters can register their organizations, complete company verification, and publish placement drives to connect with eligible students.",
    },
    {
      title: "Applications & Job Drives",
      description:
        "Browse active placement drives, view eligibility criteria, apply to opportunities, and monitor your application status from your dashboard.",
    },
    {
      title: "Technical Support",
      description:
        "If you're experiencing issues with registration, login, profile updates, or job applications, our support team is available to assist you.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">
            Help Center
          </h1>

          <p className="mt-4 text-blue-100 max-w-2xl">
            Find answers to common questions and learn how to use the
            SmartHire platform effectively.
          </p>
        </div>
      </div>

      {/* Help Topics */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-2 gap-6">

          {helpTopics.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {item.title}
              </h2>

              <p className="text-gray-600 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>

        {/* Contact Card */}
        <div className="mt-12 bg-blue-700 rounded-2xl p-8 text-white text-center">

          <h2 className="text-2xl font-semibold">
            Still Need Assistance?
          </h2>

          <p className="mt-3 text-blue-100">
            Our support team is ready to help you with any questions
            regarding SmartHire.
          </p>

          <div className="mt-6 space-y-2">
            <p>
              <strong>Email:</strong> smarthire.js@gmail.com
            </p>

          </div>

          <Link
            to="/contact"
            className="inline-block mt-8 bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Contact Support
          </Link>

        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block border border-blue-600 text-blue-700 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Back to Home
          </Link>
        </div>

      </div>

    </div>
  );
}