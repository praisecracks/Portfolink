import React from "react";
import { FaInfoCircle, FaUserShield, FaEnvelope, FaQuestionCircle, FaGavel } from "react-icons/fa";
import InfoAccordion from "./InfoAccordion";
import ContactForm from "./ContactForm";

function BlogPage() {
  const infoSections = [
    {
      id: 1,
      title: "About the App",
      icon: <FaInfoCircle />,
      content:
        "Portfolink is a platform that lets developers and creatives manage and showcase their projects, resumes, Portfolio and tech profiles in a single shareable link. Built with simplicity and speed in mind.",
    },
    {
      id: 2,
      title: "Privacy Policy",
      icon: <FaUserShield />,
      content:
        "We don’t sell your data. Your information is used only to personalize your portfolio and help recruiters reach out. All data is stored securely.",
    },
    {
      id: 3,
      title: "Message Admin",
      icon: <FaEnvelope />,
      content: <ContactForm />, // Embeds a contact form directly
    },
{
  id: 4,
  title: "FAQ",
  icon: <FaQuestionCircle />,
  content: `
Q: Is Portfolink free?  
A: Yes.

Q: Can I build resume with portfolink?  
A: Yes, you can build your resume on portfolink.

Q: Can I export my resume?  
A: Yes, to formats like PDF, DOCX, etc.

Q: Can I build my portfolio?  
A: Yes, to formats like PDF, DOCX, etc.

Q: Can I delete my account?  
A: Yes, from your dashboard.

Q: Do the developersnhave access to my details?  
A: No. Developers do not access your private account information by default. Your data is stored securely and is only accessible to authorized backend systems. In exceptional cases — for example, to investigate a specific support request, resolve a security incident, or comply with a legal request — authorized team members may access specific data and only when necessary. For full details see our Privacy Policy.

Q: Can I manage and showcase my projects?  
A: Yes, easily even with the help of Portfolink AI.

Q: Does Portfolink have AI support?  
A: Yes! Portfolink includes AI-powered assistance to help you build, edit, and optimize your portfolio smartly and efficiently.
  `,
},
{
  id: 5,
  title: "Terms of Use",
  icon: <FaGavel />,
  content: `
By using Portfolink, you agree to the following terms:

1. Fair Use: Do not upload illegal, harmful, or misleading content.
2. Intellectual Property: Only post content you own or have permission to share.
3. Privacy: Respect the privacy of other users and do not misuse personal data.
4. Account Responsibility: You are responsible for all activity under your account.
5. No Abuse: Harassment, spamming, or abuse of the platform is strictly prohibited.
6. Data Retention: Deleted content may be retained in backups for security reasons.
7. AI Usage: You agree not to misuse AI-generated content or pass it off as factual without review.

Violation of these terms may lead to account suspension or termination without notice.
  `
},
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 sm:px-8 py-16 text-gray-800 dark:text-gray-100">
      <header className="text-center max-w-3xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Information Hub</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn more about Portfolink, your data, policies, and how to contact us.
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {infoSections.map((section) => (
          <InfoAccordion
            key={section.id}
            title={section.title}
            icon={section.icon}
            content={section.content}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
