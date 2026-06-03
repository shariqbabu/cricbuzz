import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { usePlayer } from '@/hooks/useTeamPlayer';

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading, error } = usePlayer(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading player...</p>
        </div>
      </Layout>
    );
  }

  if (error || !player) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Player not found.</p>
          <Link to="/players" className="text-blue-600 hover:underline">
            Back to Players
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          to="/players"
          className="text-blue-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Players
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-3xl">
                {player.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                {player.number !== undefined && (
                  <span className="text-2xl font-bold text-gray-400">
                    #{player.number}
                  </span>
                )}
                <h1 className="text-2xl font-bold text-gray-900">
                  {player.name}
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {player.position && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm">
                    {player.position}
                  </span>
                )}
                {player.nationality && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm">
                    {player.nationality}
                  </span>
                )}
              </div>

              {player.teamId && (
                <Link
                  to={`/teams/${player.teamId}`}
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  {player.teamName ?? 'View Team'}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Player Details</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Age</dt>
              <dd className="font-medium text-gray-900">
                {player.age !== undefined ? player.age : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Position</dt>
              <dd className="font-medium text-gray-900">
                {player.position ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Nationality</dt>
              <dd className="font-medium text-gray-900">
                {player.nationality ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Jersey Number</dt>
              <dd className="font-medium text-gray-900">
                {player.number !== undefined ? `#${player.number}` : '-'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Stats - explicitly type the value as number */}
        {player.stats && Object.keys(player.stats).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(
                Object.entries(player.stats) as Array<[string, number]>
              ).map(([key, value]: [string, number]) => (
                <div
                  key={key}
                  className="text-center bg-gray-50 rounded-lg p-4"
                >
                  <p className="text-2xl font-bold text-blue-600">{value}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerDetailPage;
