import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicationsByOffer, getUser, downloadCV } from "api";

const ApplicantsPage = () => {
  const { id: offerId } = useParams();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null); // for toggling

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await getApplicationsByOffer(offerId!);
        const apps = res.data;

        const withUserData = await Promise.all(
          apps.map(async (app: any) => {
            try {
              const userRes = await getUser(app.user_id);
              return {
                ...app,
                user: userRes.data,
              };
            } catch (err) {
              console.error("Failed to fetch user for application", err);
              return app;
            }
          })
        );

        setApplicants(withUserData);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [offerId]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (loading) return <div className="p-6 text-gray-700 dark:text-gray-300">Loading applicants...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Applicants for this Job</h1>
      {applicants.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No one has applied yet.</p>
      ) : (
        <ul className="space-y-6">
          {applicants.map((app) => (
            <li
              key={app.id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-semibold">
                    {app.user?.first_name} {app.user?.last_name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email: <span className="text-gray-700 dark:text-gray-200">{app.user?.email}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role: <span className="text-gray-700 dark:text-gray-200 capitalize">{app.user?.role}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Score: <span className="font-medium text-green-600 dark:text-green-400">{(app.matching_score * 100).toFixed(2)}%</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleExpand(app.id)}
                    className="text-sm px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {expanded === app.id ? "Hide" : "See"} Cover Letter
                  </button>
                  <button
                    onClick={() => downloadCV(app.user_id, `${app.user?.first_name}_CV.pdf`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
                  >
                    Download CV
                  </button>
                </div>
              </div>

              {expanded === app.id && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Cover Letter:
                  </p>
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    {app.cover_letter}
                  </pre>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicantsPage;
