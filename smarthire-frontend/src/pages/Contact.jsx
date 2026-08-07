import { Link } from "react-router-dom";

export default function Contact() {
  const contacts = [
    {
      title: "Email",
      value: "smarthire.js@gmail.com",
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=smarthire.js@gmail.com&su=SmartHire%20Support",
      description:
        "For general queries, technical support, account assistance, and feedback."
    },
    {
      title: "Office Address",
      value: "Kolkata, West Bengal, India",
      description: "SmartHire Development Team."
    },
    {
      title: "Working Hours",
      value: "Monday – Friday",
      description: "9:00 AM – 6:00 PM (IST)"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">
            Contact Us
          </h1>

          <p className="mt-4 text-blue-100 max-w-2xl leading-7">
            Have questions or need assistance? Our SmartHire support team
            is here to help students, recruiters, and administrators with
            any platform-related queries.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid gap-6 md:grid-cols-3">

          {contacts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {item.title}
              </h2>

              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:text-blue-800 hover:underline break-all"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-blue-700 font-medium">
                  {item.value}
                </p>
              )}

              <p className="mt-3 text-gray-600 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>

        {/* Support Section */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 shadow-sm p-8">

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Need Additional Support?
          </h2>

          <p className="text-gray-600 leading-7 text-center max-w-3xl mx-auto">
            If you are experiencing issues with registration, login,
            recruiter verification, job applications, profile updates,
            or any other SmartHire services, please don't hesitate to
            contact our support team. We strive to respond to all
            inquiries within <strong>24–48 business hours</strong>.
          </p>

        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-10">

          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-white font-medium shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg"
          >
            Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}