import { Link } from "react-router-dom";

export default function TermsConditions() {
  const sections = [
    {
      title: "Eligibility",
      description:
        "SmartHire is designed for students, recruiters, and administrators participating in campus recruitment activities. All users must provide accurate, complete, and up-to-date information during registration."
    },
    {
      title: "User Responsibilities",
      points: [
        "Provide genuine personal and academic information.",
        "Keep your account credentials secure and confidential.",
        "Do not impersonate another individual or organization.",
        "Use the platform only for legitimate placement activities.",
        "Respect all users and maintain professional conduct."
      ]
    },
    {
      title: "Recruiter Responsibilities",
      description:
        "Recruiters must publish authentic job opportunities and ensure that details regarding eligibility, salary, job roles, application deadlines, and hiring processes are accurate and transparent."
    },
    {
      title: "Account Suspension",
      description:
        "SmartHire reserves the right to suspend or permanently terminate accounts involved in fraudulent activities, submission of false information, policy violations, or misuse of the platform."
    },
    {
      title: "Intellectual Property",
      description:
        "All content, software, branding, logos, graphics, and platform designs available on SmartHire are protected by intellectual property laws and may not be copied, modified, or redistributed without prior permission."
    },
    {
      title: "Limitation of Liability",
      description:
        "SmartHire serves as a platform connecting students and recruiters. While we strive to provide reliable services, we do not guarantee employment, interview opportunities, or hiring decisions."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-4xl font-bold">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-blue-100 max-w-3xl leading-7">
            Please read these Terms & Conditions carefully before using
            SmartHire. By accessing or using the platform, you agree to
            comply with these terms.
          </p>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="space-y-6">

          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-7 hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {index + 1}. {section.title}
              </h2>

              {section.points ? (
                <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-7">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 leading-7">
                  {section.description}
                </p>
              )}
            </div>
          ))}

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