'use client';

import { useState, useActionState, useEffect } from 'react';
import { updateProfile } from '@/app/actions/students';
import { User, Code, Share2, Mail, CheckCircle, Sparkles, Send } from 'lucide-react';

const TRACKS = [
  'Frontend',
  'Backend',
  'AI/ML',
  'Mobile Development',
  'UI/UX Design',
  'Cybersecurity',
  'Other',
];

interface ProfileClientProps {
  initialUser: {
    name: string;
    email: string;
    track: string;
    skills: string;
    contactLink: string;
    hasTeam: boolean;
  };
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [name, setName] = useState(initialUser.name);
  const [track, setTrack] = useState(initialUser.track);
  const [skills, setSkills] = useState(initialUser.skills);
  const [contactLink, setContactLink] = useState(initialUser.contactLink);
  const [hasTeam, setHasTeam] = useState(initialUser.hasTeam);

  const [state, formAction, isPending] = useActionState(updateProfile, null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setSaveSuccess(true);
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const skillTags = skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Edit Form */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h2>
          <p className="text-sm text-slate-500 mt-1">
            Update your skills and availability so other students can find you.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
              {state.error}
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={initialUser.email}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed text-sm"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Email address cannot be changed.</p>
            </div>

            <div>
              <label htmlFor="track" className="block text-sm font-semibold text-slate-700">
                Primary Track / Role
              </label>
              <div className="mt-2">
                <select
                  id="track"
                  name="track"
                  required
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm cursor-pointer"
                >
                  {TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contactLink" className="block text-sm font-semibold text-slate-700">
                Contact Method (WhatsApp or Telegram)
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
                  value={contactLink}
                  onChange={(e) => setContactLink(e.target.value)}
                  placeholder="wa.me/1234567890 or t.me/username"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-semibold text-slate-700">
              Skills / Bio (comma-separated list)
            </label>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Toggle Team Status */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Graduation Team Availability</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle whether you have already found a graduation project team or are still looking.
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="hidden"
                name="hasTeam"
                value={hasTeam ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setHasTeam(!hasTeam)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hasTeam ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    hasTeam ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 border border-transparent rounded-2xl shadow-lg shadow-indigo-600/10 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Saving changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Profile Card Preview */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[360px] border border-slate-800 lg:sticky lg:top-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-500 blur-[80px]" />
        </div>

        <div className="relative z-10">
          {/* Card Top Title & Status */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 text-xs text-indigo-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Card Preview</span>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                hasTeam
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {hasTeam ? 'In a Team' : 'Seeking Team'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white leading-tight truncate max-w-[150px]">
                {name || 'Your Name'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{track || 'Your Track'}</p>
            </div>
          </div>

          {/* Skill Badges */}
          <div className="flex flex-wrap gap-1.5">
            {skillTags.length > 0 ? (
              skillTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700/50"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills listed yet...</span>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="relative z-10 pt-4 border-t border-slate-800">
          <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-bold text-slate-300 select-none">
            <Send className="w-4 h-4" />
            <span>Contact Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}
