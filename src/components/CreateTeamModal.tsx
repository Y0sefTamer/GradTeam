'use client';

import { useState, useActionState, useEffect } from 'react';
import { createTeam } from '@/app/actions/teams';
import { Plus, X, Award, Briefcase, Share2, Layers } from 'lucide-react';

export default function CreateTeamModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createTeam, null);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 py-3 px-5 border border-transparent rounded-2xl shadow-lg shadow-indigo-600/10 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 cursor-pointer self-start md:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Create Team</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create a Project Team</h2>
              <p className="text-sm text-slate-500 mt-1">
                Post your project details and the roles you are looking to fill.
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                  {state.error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                  Team Name
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Team Alpha"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-semibold text-slate-700">
                  Project Domain
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    placeholder="e.g. EdTech, Healthcare, AI assistant"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="requiredRoles" className="block text-sm font-semibold text-slate-700">
                  Required Roles (Roles you are missing)
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="requiredRoles"
                    name="requiredRoles"
                    type="text"
                    required
                    placeholder="e.g. 1 UI/UX Designer, 1 AI/ML Developer"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactLink" className="block text-sm font-semibold text-slate-700">
                  Leader's Contact (WhatsApp/Telegram link or handle)
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Share2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="contactLink"
                    name="contactLink"
                    type="text"
                    required
                    placeholder="wa.me/1234567890 or @telegram_handle"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 border border-transparent text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
