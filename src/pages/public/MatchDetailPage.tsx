import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { useMatch, MatchEvent, Lineup } from '@/hooks/useMatch';

const statusColor: Record<string, string> = {
  live: 'bg-red-100 text-red-600',
  completed: 'bg-gray-100 text-gray-500',
  scheduled: 'bg-blue-100 text-blue-600',
  cancelled: 'bg-yellow-100 text-yellow-600',
};

const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useMatch(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading match...</p>
        </div>
      </Layout>
    );
  }

  if (error || !match) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Match not found.</p>
          <Link to="/matches" className="text-blue-600 hover:underline">
            Back to Matches
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          to="/matches"
          className="text-blue-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Matches
        </Link>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            {match.date && (
              <p className="text-sm text-gray-400">
                {new Date(match.date).toLocaleString()}
              </p>
            )}
            {match.status && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  statusColor[match.status] ?? 'bg-gray-100 text-gray-500'
                }`}
              >
                {match.status === 'live' && (
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />
                )}
                {match.status}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {match.homeTeam ?? 'Home Team'}
              </h2>
            </div>

            <div className="text-center px-6">
              <div className="text-5xl font-bold text-gray-900">
                {match.homeScore ?? 0}
                <span className="text-gray-300 mx-3">-</span>
                {match.awayScore ?? 0}
              </div>
              {match.venue && (
                <p className="text-sm text-gray-400 mt-2">{match.venue}</p>
              )}
            </div>

            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {match.awayTeam ?? 'Away Team'}
              </h2>
            </div>
          </div>
        </div>

        {/* Match Events */}
        {match.events && match.events.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Match Events</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {match.events.map((event: MatchEvent) => (
                <div
                  key={event.id}
                  className="px-6 py-3 flex items-center gap-4"
                >
                  <span className="w-10 text-center text-sm font-bold text-gray-500">
                    {event.minute}'
                  </span>
                  <span className="text-lg">
                    {event.type === 'goal'
                      ? '⚽'
                      : event.type === 'yellow_card'
                      ? '🟨'
                      : event.type === 'red_card'
                      ? '🟥'
                      : event.type === 'substitution'
                      ? '🔄'
                      : '🎯'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.playerName ?? 'Unknown Player'}
                    </p>
                    {event.description && (
                      <p className="text-xs text-gray-400">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lineups */}
        {match.lineups && match.lineups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {match.lineups.map((lineup: Lineup) => (
              <div
                key={lineup.teamId}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">
                    {lineup.teamName ?? `Team ${lineup.teamId}`}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {lineup.players.map((p) => (
                    <div
                      key={p.id}
                      className={`px-6 py-3 flex items-center gap-3 ${
                        !p.isStarter ? 'opacity-60' : ''
                      }`}
                    >
                      {p.number !== undefined && (
                        <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                          {p.number}
                        </span>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {p.name}
                        </p>
                        {p.position && (
                          <p className="text-xs text-gray-400">{p.position}</p>
                        )}
                      </div>
                      {!p.isStarter && (
                        <span className="text-xs text-gray-400">Sub</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchDetailPage;
