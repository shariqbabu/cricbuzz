import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { useMatch, MatchEvent } from '@/hooks/useMatch';

interface StatRow {
  label: string;
  home: string | number;
  away: string | number;
}

const ScorecardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useMatch(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading scorecard...</p>
        </div>
      </Layout>
    );
  }

  if (error || !match) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Scorecard not found.</p>
          <Link to="/matches" className="text-blue-600 hover:underline">
            Back to Matches
          </Link>
        </div>
      </Layout>
    );
  }

  const goals = (match.events ?? []).filter(
    (e: MatchEvent) => e.type === 'goal'
  );

  const yellowCards = (match.events ?? []).filter(
    (e: MatchEvent) => e.type === 'yellow_card'
  );

  const redCards = (match.events ?? []).filter(
    (e: MatchEvent) => e.type === 'red_card'
  );

  const stats: StatRow[] = [
    {
      label: 'Goals',
      home: match.homeScore ?? 0,
      away: match.awayScore ?? 0,
    },
    {
      label: 'Yellow Cards',
      home: yellowCards.filter((e) => e.teamId === match.homeTeamId).length,
      away: yellowCards.filter((e) => e.teamId === match.awayTeamId).length,
    },
    {
      label: 'Red Cards',
      home: redCards.filter((e) => e.teamId === match.homeTeamId).length,
      away: redCards.filter((e) => e.teamId === match.awayTeamId).length,
    },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          to={`/matches/${match.id}`}
          className="text-blue-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Match
        </Link>

        <h1 className="text-3xl font-bold mb-6">Scorecard</h1>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between gap-4 text-center">
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-900">
                {match.homeTeam ?? 'Home'}
              </p>
            </div>
            <div className="px-6">
              <p className="text-4xl font-bold text-gray-900">
                {match.homeScore ?? 0}
                <span className="text-gray-300 mx-2">-</span>
                {match.awayScore ?? 0}
              </p>
              {match.status && (
                <p className="text-sm text-gray-400 mt-1 capitalize">
                  {match.status}
                </p>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-900">
                {match.awayTeam ?? 'Away'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Match Statistics</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.map((row: StatRow) => (
              <div
                key={row.label}
                className="grid grid-cols-3 px-6 py-3 items-center text-sm"
              >
                <span className="font-bold text-gray-900 text-center">
                  {row.home}
                </span>
                <span className="text-gray-500 text-center">{row.label}</span>
                <span className="font-bold text-gray-900 text-center">
                  {row.away}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Timeline */}
        {goals.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Goals</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {goals.map((event: MatchEvent) => {
                const isHome = event.teamId === match.homeTeamId;
                return (
                  <div
                    key={event.id}
                    className={`px-6 py-3 flex items-center gap-3 ${
                      isHome ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <span className="text-xl">⚽</span>
                    <div className={isHome ? 'text-left' : 'text-right flex-1'}>
                      <p className="font-medium text-gray-900">
                        {event.playerName ?? 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {event.minute}'
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScorecardPage;
