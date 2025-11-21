import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <FileText className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 space-y-8">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">1.</span>
            Introduction
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            This application is a personal portfolio/demo project created for educational and presentation purposes.
            By accessing or using this app, you agree to these Terms of Service.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">2.</span>
            Use of the Application
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            You may use this demo solely for testing, exploring features, and personal evaluation.
            Since this is not a commercial service, functionality may be limited or subject to change at any time.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">3.</span>
            User Responsibilities
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            You are responsible for any information you choose to enter in the app.
            Do not use the application to store sensitive or confidential data.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">4.</span>
            Data and Account Management
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The developer may modify, reset, or remove data without notice, as this is a non-production system.
            Deleting your account removes all associated data.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">5.</span>
            No Warranties
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            This app is provided "as-is".
            The developer does not guarantee uptime, data accuracy, or feature stability.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">6.</span>
            Limitation of Liability
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The developer is not liable for any issues resulting from the use or inability to use this demo application, including data loss or errors.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">7.</span>
            Changes to the Terms
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            These Terms may be updated at any time without prior notice.
            By continuing to use the app, you accept any changes.
          </p>
        </section>

        {/* Footer Notice */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            This is a demo application. For questions or concerns, please refer to the GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
}
