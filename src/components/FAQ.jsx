import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQ = () => {
    const [questions, setQuestions] = useState([
        { id: 1, question: 'আমি কীভাবে রিকশা মামা ব্যবহার করতে পারি?', answer: 'রিকশা মামা ব্যবহার করতে প্রথমে অ্যাপ্লিকেশনটি ডাউনলোড করুন এবং রেজিস্ট্রেশন সম্পন্ন করুন। লগইন করুন এবং আপনার স্থান নির্ধারণ করুন। পরে আপনি আপনার গন্তব্য প্রদর্শন করতে পারেন এবং আপনি চাইলে রিকশা মামাকে কল করতে পারেন।' },
        { id: 2, question: 'How can I use RickshawMama?', answer: 'To use RickshawMama, first download the application and complete the registration process. Log in and set your location. Then you can view available destinations and call RickshawMama if you wish.' },
        { id: 3, question: 'রিকশা মামা ব্যবহার করার জন্য আমার কোন অ্যাপ্লিকেশন প্রয়োজন?', answer: 'আপনি রিকশা মামা ব্যবহার করতে হলে আপনাকে অ্যাপ্লিকেশনটি ডাউনলোড করে রেজিস্ট্রেশন প্রক্রিয়া সম্পন্ন করতে হবে। এরপরে আপনি লগ ইন করে আপনার স্থান নির্ধারণ করতে হবে এবং পরে আপনি চাইলে রিকশা মামাকে কল করতে পারেন।' },
        { id: 4, question: 'Do I need any application to use RickshawMama?', answer: 'Yes, you need to download the RickshawMama application and complete the registration process to use the service.' },
        // Add more questions and answers as needed
      ]);

  const [expandedId, setExpandedId] = useState(null);

  const toggleAnswer = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full h-full relative p-8 md:p-20 bg-gray-100 text-black overflow-y-auto">
      <div className="questionList">
        {questions.map((qna) => (
          <div key={qna.id} className="w-full px-2 border-b border-gray-200 py-4">
            <div className="questionHeader flex justify-between items-start cursor-pointer" onClick={() => toggleAnswer(qna.id)}>
              <h3 className="text-lg md:text-xl font-semibold">{qna.question}</h3>
              {expandedId === qna.id ? <FaMinus className="text-gray-600" /> : <FaPlus className="text-gray-600" />}
            </div>
            <div className={`transition-all duration-500 ${expandedId === qna.id ? 'max-h-[500px] h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
              <p className="text-gray-600 text-sm md:text-base mt-2">{qna.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
