import React from 'react';

export const FAQ = () => {
  const faqs = [
    {
      question: "Where does Fillin work?",
      answer: "Fillin natively supports text boxes, forms, and rich-text editors (like Gmail, Notion, and Jira) within webpages. For maximum privacy and zero friction, it intentionally stays out of your browser's native URL bar and settings pages."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Fillin has zero remote analytics and no backend database. Your snippets are stored 100% locally in your browser, and keystrokes are processed entirely within the tab's secure sandbox."
    },
    {
      question: "Is Fillin free?",
      answer: "Yes, Fillin is completely free and open-source. There are no premium tiers, no locked features, and no tracking."
    }
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
