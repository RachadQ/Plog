import React, { useEffect, useState} from 'react';
import BaseLayout from "./Default/BaseLayout";
import { useAuth } from "./Default/AuthProvider";
import axios from 'axios';

const mockBookmarks = [
  'Advanced Git Techniques',
  'Introduction to GraphQL',
  'Optimizing SQL Queries',
  'Dependency Injection in .NET'
];

const mockUser = {
  name: 'Kenneth Netthhagnalya',
  avatar: 'https://via.placeholder.com/100',
  logsPosted: 20,
  followers: 112,
  following: 98,
  stats: {
    logsThisWeek: 5,
    mostLiked: 'Python Tips and Tricks',
    mostCommented: 'Getting Started with Django'
  }
};

const mockLogs = [
  { id: 1, title: 'Building a REST API with FastAPI', date: '3 days ago' },
  { id: 2, title: 'Python Tips and Tricks', date: '5 days ago' },
  { id: 3, title: 'Database Migrations with Alembic', date: '7 days ago' },
  { id: 4, title: 'Error Handling in JavaScript', date: '8 days ago' }
];

const mockDrafts = [
  { id: 1, title: 'Working with WebSockets in Node.js', date: 'Draft saved 2 days ago' },
  { id: 2, title: 'A Guide to Progressive Web Apps', date: 'Draft saved 1 week ago' }
];

const mockScheduled = [
  { id: 1, title: 'Serverless Functions in AWS Lambda', date: 'Scheduled for Apr 18' },
  { id: 2, title: 'Styling with Tailwind CSS 4.0', date: 'Scheduled for Apr 20' }
];

// Skeleton loading components
const SkeletonCard = () => (
  <div className="bg-white shadow-md rounded-2xl p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const SkeletonProfile = () => (
  <div className="col-span-1 bg-white shadow-sm rounded-xl p-4 flex flex-col items-center text-center space-y-2 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
    <div className="h-5 bg-gray-200 rounded w-32"></div>
    <div className="h-4 bg-gray-200 rounded w-24"></div>
    <div className="flex items-center gap-2">
      <div className="h-3 bg-gray-200 rounded w-16"></div>
      <div className="w-1 h-3 bg-gray-300 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const HomePage: React.FC<{}>  = () => {
  const { isLoading: authLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [drafts, setDrafts] = useState(mockDrafts);
  const [scheduled, setScheduled] = useState(mockScheduled);
  const [user, setUser] = useState(mockUser);
  const [logs, setLogs] = useState(mockLogs);
  const [bookmarks, setBookmarks] = useState(mockBookmarks);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userRes = mockUser;
      const logsRes = mockLogs;
      const bookmarksRes = mockBookmarks;
      
      setIsPageLoading(false);
    };
    
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  // Show loading state while auth is loading or page is loading
  if (authLoading || isPageLoading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonProfile />
        <div className="col-span-2 grid gap-4">
          <SkeletonCard />
          <div className="grid md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Profile Card */}
      <div className="col-span-1 bg-white shadow-sm rounded-xl p-4 flex flex-col items-center text-center space-y-2">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-16 h-16 rounded-full border border-gray-300"
        />
        <h2 className="text-lg font-medium">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.logsPosted} logs posted</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{user.followers} followers</span>
          <span className="text-gray-400">•</span>
          <span>{user.following} following</span>
        </div>
      </div>

      {/* Main Section */}
      <div className="col-span-2 grid gap-4">
        {/* Recent Logs */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h3 className="text-lg font-bold mb-2">Recent Logs</h3>
          {logs.map(log => (
            <div key={log.id} className="border-b py-2">
              <h4 className="font-semibold">{log.title}</h4>
              <p className="text-sm text-gray-500">{log.date}</p>
              <button className="text-blue-500 mr-2">Edit</button>
              <button className="text-red-500">Delete</button>
            </div>
          ))}
        </div>

        {/* Drafts & Scheduled */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-lg font-bold mb-2">Drafts</h3>
            {drafts.map(draft => (
              <div key={draft.id} className="border-b py-2">
                <h4 className="font-semibold">{draft.title}</h4>
                <p className="text-sm text-gray-500">{draft.date}</p>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-lg font-bold mb-2">Scheduled</h3>
            {scheduled.map(sch => (
              <div key={sch.id} className="border-b py-2">
                <h4 className="font-semibold">{sch.title}</h4>
                <p className="text-sm text-gray-500">{sch.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Bookmarks */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-lg font-bold">Stats</h3>
            <p>{user.stats.logsThisWeek} logs this week</p>
            <p>Most liked: {user.stats.mostLiked}</p>
            <p>Most commented: {user.stats.mostCommented}</p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-4">
            <h3 className="text-lg font-bold">Bookmarks</h3>
            <ul className="list-disc ml-5">
              {bookmarks.map((bm, index) => (
                <li key={index}>{bm}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;