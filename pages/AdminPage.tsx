import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  const mockStats = [
    { label: t('admin.users'), value: '1,250' },
    { label: t('admin.movies'), value: '5,800' },
    { label: t('admin.reviews'), value: '25,430' },
  ];
  
  const mockUsers = [
    { id: 1, username: 'CinemaFan92', joined: '2023-05-12' },
    { id: 2, username: 'MovieCriticPro', joined: '2023-02-01' },
    { id: 3, username: 'User123', joined: '2024-01-15' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent inline-block">{t('admin.dashboard')}</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('admin.stats')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockStats.map(stat => (
            <div key={stat.label} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow">
              <h3 className="text-slate-500 dark:text-slate-400 text-md">{stat.label}</h3>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t('admin.manage_users')}</h2>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">{t('admin.user_id')}</th>
                <th className="p-4">{t('admin.username')}</th>
                <th className="p-4">{t('admin.joined')}</th>
                <th className="p-4 text-end">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4 font-medium">{user.username}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{user.joined}</td>
                  <td className="p-4 text-end">
                    <button className="text-red-500 hover:underline">{t('nav.logout')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;