import React, { useEffect, useState } from "react";
import { getJobOffers } from "api";

type JobOffer = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  criteria: {
    required_skills: string[];
    location: { remote: boolean; preferred_location?: string };
  };
};

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOffer[]>([]);
  const [search, setSearch] = useState("");
  const [stackFilter, setStackFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState<"all" | "remote" | "onsite">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobOffers();
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    if (search) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stackFilter) {
      filtered = filtered.filter((job) =>
        job.criteria.required_skills.some((skill) =>
          skill.toLowerCase().includes(stackFilter.toLowerCase())
        )
      );
    }

    if (remoteFilter !== "all") {
      filtered = filtered.filter((job) =>
        remoteFilter === "remote" ? job.criteria.location.remote : !job.criteria.location.remote
      );
    }

    filtered.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return sort === "newest" ? bDate - aDate : aDate - bDate;
    });

    setFilteredJobs(filtered);
    setPage(1);
  }, [jobs, search, stackFilter, remoteFilter, sort]);

  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const isNew = (date: string) => {
    const daysAgo = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo < 3;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browse Job Offers</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Filter by skill (e.g. React)"
            value={stackFilter}
            onChange={(e) => setStackFilter(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <select
            value={remoteFilter}
            onChange={(e) => setRemoteFilter(e.target.value as any)}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {paginatedJobs.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">No matching job offers found.</p>
          )}

          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <div className="flex gap-2 text-xs">
                  {job.criteria.location.remote && (
                    <span className="bg-green-200 text-green-800 dark:bg-green-700 dark:text-white px-2 py-1 rounded-full">
                      Remote
                    </span>
                  )}
                  {isNew(job.created_at) && (
                    <span className="bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-white px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {Math.random() > 0.8 && (
                    <span className="bg-red-200 text-red-800 dark:bg-red-700 dark:text-white px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{job.description}</p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {job.criteria.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
