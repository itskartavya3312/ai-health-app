import './globals.css';
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

export const metadata = {
  title: 'HealthAI — Intelligent Health Companion',
  description:
    'AI-powered health assistant using Gemini 2.5 Flash. Explore diseases, check symptoms.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">

        {/* Top medical disclaimer */}
        <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 text-center text-xs text-amber-800">
          ⚕️ <strong>Medical Disclaimer:</strong> This app is informational only and not a substitute for professional medical advice.
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="min-h-[calc(100vh-140px)] px-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🩺</span>
                <span className="font-display text-lg font-semibold text-white">
                  HealthAI
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-powered health insights using Gemini 2.5 Flash.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-teal-400 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/symptom-checker" className="hover:text-teal-400 transition">
                    Symptom Checker
                  </a>
                </li>
                <li>
                  <a href="/api/seed" className="hover:text-teal-400 transition">
                    Seed Database
                  </a>
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <h4 className="text-white font-medium mb-3">Disclaimer</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Always consult a qualified healthcare professional for medical advice.
                AI-generated responses may not always be accurate.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} HealthAI · Built with Next.js + Gemini AI · Not a medical device
          </div>
        </footer>

        {/* Floating AI Chat */}
        <ChatWidget />

      </body>
    </html>
  );
}