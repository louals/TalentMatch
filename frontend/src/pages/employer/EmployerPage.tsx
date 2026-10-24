// This is the EmployerJobDashboard.tsx - view and manage job offers

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getJobOffers, deleteJobOffer } from "api";
import { Link } from "react-router-dom";

const EmployerJobDashboard = () => {
  const { user } = useAuth();
  const [jobOffers, setJobOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobOffers = async () => {
    try {
      const res = await getJobOffers();
      const filtered = res.data.filter((job: any) => job.created_by === user.id);
      setJobOffers(filtered);
    } catch (err) {
      console.error("Failed to fetch job offers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job offer?")) {
      try {
        await deleteJobOffer(id);
        setJobOffers((prev) => prev.filter((job) => job.id !== id));
      } catch (err) {
        console.error("Failed to delete job offer", err);
      }
    }
  };

  useEffect(() => {
    if (user) fetchJobOffers();
  }, [user]);

  if (loading)
    return <div className="p-6 text-gray-700 dark:text-gray-300">Loading job offers...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Job Offers</h1>
        <Link
          to="/employer/jobs/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          + New Job Offer
        </Link>
      </div>

      {jobOffers.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          You haven’t posted any job offers yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {jobOffers.map((job) => (
            <li
              key={job.id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posted on {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/employer/jobs/${job.id}/applicants`}
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Applicants
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-500 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployerJobDashboard;
