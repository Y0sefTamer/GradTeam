import { getStudents } from '@/app/actions/students';
import SearchFilters from '@/components/SearchFilters';
import { formatContactLink } from '@/lib/utils';
import { Send, Users, Sparkles } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  track: string;
  skills: string;
  contactLink: string;
  hasTeam: boolean;
  createdAt: Date;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const track = typeof params.track === 'string' ? params.track : 'All';
  const search = typeof params.search === 'string' ? params.search : '';

  const { data = [] } = await getStudents({ track, search });
  const students = data as Student[];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Members</h1>
          <p className="text-slate-500 mt-1">
            Browse registered students, filter by track, and connect with potential team partners.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 text-sm font-semibold self-start md:self-auto">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>{students.length} Students active</span>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilters />

      {/* Students Grid */}
      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => {
            const skillTags = student.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <div
                key={student.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors duration-300">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                          {student.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">{student.track}</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        student.hasTeam
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {student.hasTeam ? 'In a Team' : 'Seeking Team'}
                    </span>
                  </div>

                  {/* Skills/Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {skillTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={formatContactLink(student.contactLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-slate-700 bg-slate-50 hover:bg-indigo-600 hover:text-white group-hover:border-transparent transition-all duration-300 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Contact Member</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto mt-8">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">No students found</h3>
          <p className="text-slate-500 mt-2 text-sm">
            Try adjusting your search criteria or changing your selected track filter.
          </p>
        </div>
      )}
    </div>
  );
}
