import { getTeams } from '@/app/actions/teams';
import { getCurrentUser } from '@/app/actions/students';
import TeamSearch from '@/components/TeamSearch';
import CreateTeamModal from '@/components/CreateTeamModal';
import EditTeamModal from '@/components/EditTeamModal';
import { formatContactLink } from '@/lib/utils';
import { Send, FolderKanban, Sparkles, UserPlus } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  domain: string;
  requiredRoles: string;
  contactLink: string;
  createdAt: Date;
  creatorId: string;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TeamsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';

  const { data = [] } = await getTeams({ search });
  const teams = data as Team[];
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Teams Directory</h1>
          <p className="text-slate-500 mt-1">
            Browse active project teams seeking new members, or initialize a team of your own.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 text-sm font-semibold self-start md:self-auto">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>{teams.length} Teams active</span>
        </div>
      </div>

      {/* Search Bar & Action Trigger Row */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <TeamSearch />
        <CreateTeamModal />
      </div>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const isCreator = currentUser && team.creatorId === currentUser.id;

            return (
              <div
                key={team.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Top Title & Domain */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors duration-300">
                        <FolderKanban className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 leading-tight truncate max-w-[180px]">
                          {team.name}
                        </h3>
                        <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
                          {team.domain}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Missing/Required Roles */}
                  <div className="mt-4 mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50/30">
                    <div className="flex items-center gap-2 mb-2">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Seeking Roles:</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{team.requiredRoles}</p>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <a
                    href={formatContactLink(team.contactLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-slate-700 bg-slate-50 hover:bg-indigo-600 hover:text-white group-hover:border-transparent transition-all duration-300 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Contact</span>
                  </a>
                  {isCreator && <EditTeamModal team={team} />}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto mt-8">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">No teams found</h3>
          <p className="text-slate-500 mt-2 text-sm">
            Try searching for a different keyword or create your own project team above.
          </p>
        </div>
      )}
    </div>
  );
}
