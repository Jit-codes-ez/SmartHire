import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Full name, email address and phone number.",
        "Academic information including course, branch, CGPA and passing year.",
        "Resume, LinkedIn profile and other professional details.",
        "Placement applications and activity on the SmartHire platform."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Create and manage your SmartHire account.",
        "Match eligible students with recruitment drives.",
        "Allow recruiters to review student applications.",
        "Improve platform performance and user experience.",
        "Provide notifications regarding job drives and applications."
      ]
    },
    {
      title: "Data Security",
      description:
        "We use secure authentication, encrypted passwords, protected databases and controlled access mechanisms to safeguard your personal information from unauthorized access."
    },
    {
      title: "Information Sharing",
      description:
        "Student information is shared only with authorized recruiters and placement administrators for recruitment purposes. SmartHire never sells personal information to third parties."
    },
    {
      title: "Cookies & Sessions",
      description:
        "Cookies and secure sessions may be used to maintain login status, improve security and provide a personalized browsing experience."
    },
    {
      title: "Your Rights",
      description:
        "Users may update their profile information, request corrections, or contact the SmartHire support team regarding any privacy concerns."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">
            Privacy Policy
          </h1>

          <p className="mt-4 text-blue-100 max-w-3xl">
            Your privacy is important to us. This policy explains how
            SmartHire collects, uses, stores and protects your personal
            information while using our campus recruitment platform.
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

              {section.content ? (
                <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-7">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
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

        {/* Contact Section */}
        <div className="mt-12 bg-blue-700 rounded-2xl text-white p-8 text-center">

          <h2 className="text-2xl font-semibold">
            Questions About Your Privacy?
          </h2>

          <p className="mt-3 text-blue-100">
            If you have any questions regarding this Privacy Policy or
            the handling of your personal information, please contact us.
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