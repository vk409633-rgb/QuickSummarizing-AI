import React, { useState } from 'react';
import { EnvelopeIcon } from '../constants';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus('Please fill out all fields.');
            return;
        }
        
        const recipient = 'vk409633@gmail.com';
        const subject = `Message from ${name} via QuickSummarize AI`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;

        setStatus('Your email client should be opening. Thank you!');
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <section aria-labelledby="contact-heading" className="bg-white/60 dark:bg-slate-800/50 shadow-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
            <div className="text-center">
                <EnvelopeIcon className="mx-auto h-12 w-12 text-indigo-500" />
                <h2 id="contact-heading" className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Get in Touch</h2>
                <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Have a question or feedback? Send a message directly to my inbox.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                             className="mt-1 block w-full p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                        required
                    ></textarea>
                </div>
                <div className="text-center pt-2">
                    <button
                        type="submit"
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    >
                        Send Message
                    </button>
                </div>
                {status && <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">{status}</p>}
            </form>
        </section>
    );
};

export default React.memo(ContactForm);