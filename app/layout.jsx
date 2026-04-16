import './globals.css';
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

export const metadata = {
  title: 'HealthAI — Intelligent Health Companion',
  description: 'AI-powered health assistant using Gemini 2.5 Flash. Explore diseases, check symptoms.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Global disclaimer banner */}
        <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 text-center text-xs text-amber-800">
          ⚕️ <strong>Medical Disclaimer:</strong> This app is for informational purposes only and is <strong>not a substitute</strong> for professional medical advice.
        </div>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-slate-900 text-slate-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🩺</span><span className="font-display text-lg font-semibold text-white">HealthAI</span></div>
              <p className="text-sm">AI-powered health information by Gemini 2.5 Flash.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-teal-400 transition-colors">Home</a></li>
                <li><a href="/symptom-checker" className="hover:text-teal-400 transition-colors">Symptom Checker</a></li>
                <li><a href="/api/seed" className="hover:text-teal-400 transition-colors">Seed Database</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Disclaimer</h4>
              <p className="text-xs text-slate-500">Always consult a qualified healthcare professional for medical advice. AI responses may not be 100% accurate.</p>
            </div>
          </div>
          <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} HealthAI. Built with Next.js + Gemini 2.5 Flash. Not a medical device.
          </div>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
