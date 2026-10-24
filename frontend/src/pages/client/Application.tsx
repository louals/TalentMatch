import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getApplicationsByUser, getJobOffer } from "api";
import { toast } from "react-hot-toast";
import LoadingM from "../../components/animations/LoadingM";

interface Application {
  id: string;
  offer_id: string;
  cover_letter: string;
  matching_score: number;
  created_at: string;
  title?: string;
  description?: string;
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchApplicationsWithJobs() {
      setLoading(true);

      try {
        const appRes = await getApplicationsByUser(user.id);
        const apps: Application[] = appRes.data;

        if (!apps.length) {
          setApplications([]);
          return;
        }

        const uniqueOfferIds = Array.from(new Set(apps.map(app => app.offer_id)));
        const jobPromises = uniqueOfferIds.map(id =>
          getJobOffer(id).then(res => res.data).catch(() => null)
        );
        const jobs = await Promise.all(jobPromises);

        const jobMap = new Map<string, { title: string; description: string }>();
        jobs.forEach(job => {
          if (job && job.id) {
            jobMap.set(job.id, { title: job.title, description: job.description });
          }
        });

        const appsWithJobs = apps.map(app => ({
          ...app,
          title: jobMap.get(app.offer_id)?.title || "Unknown Job Title",
          description: jobMap.get(app.offer_id)?.description || "No job description available."
        }));

        setApplications(appsWithJobs);
      } catch (error) {
        toast.error("Failed to fetch applications or job offers");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicationsWithJobs();
  }, [user]);

  if (loading) return <LoadingM />;

  if (applications.length === 0) {
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400">
        No applications found.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Applications</h1>
  
        {applications.length === 0 ? (
          <p className="p-6 text-center text-gray-500 dark:text-gray-400">
            No applications found.
          </p>
        ) : (
          <ul className="space-y-6">
            {applications.map(app => (
              <li
                key={app.id}
                className="border border-gray-300 dark:border-gray-700 rounded p-4 shadow-sm bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
              >
                <h2 className="text-xl font-semibold mb-1">{app.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{app.description}</p>
  
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Match Score: {app.matching_score.toFixed(2)}
                </p>
  
                <details className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <summary className="cursor-pointer font-medium text-gray-900 dark:text-gray-100">
                    View Cover Letter
                  </summary>
                  <pre className="whitespace-pre-wrap mt-2 text-sm text-gray-900 dark:text-gray-100">
                    {app.cover_letter}
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
            }