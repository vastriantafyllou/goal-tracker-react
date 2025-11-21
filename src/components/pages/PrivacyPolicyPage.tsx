import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Privacy Policy
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
            This application is a personal portfolio/demo project created for educational purposes. It is not intended for commercial use.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">2.</span>
            Information Collected
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The app stores only the information required for basic functionality (such as goals, categories, and user account data). No additional personal information is collected.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">3.</span>
            How Data Is Used
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            All stored data is used strictly for goal-tracking functionality and nothing else.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">4.</span>
            Data Sharing
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Your data is never shared, sold, or used for advertising.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">5.</span>
            Data Removal
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            You may request to delete your data at any time. Since this is a demo app, deleting your account removes all related data.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">6.</span>
            "As-Is" Disclaimer
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            This demo is provided "as-is" without warranties. Functionality may change or break at any time.
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
