import React, { useEffect, useState } from "react";
import { getJobOffers, deleteJobOffer } from "api";
import { FiBriefcase, FiTrash2, FiEye, FiRefreshCw, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { formatDate } from "../../utils/dateUtils";

type JobOffer = {
  id: string;
  title: string;
  company: string;
  location: string;
  created_at: string;
};

export default function JobManagementPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<"details" | "delete">("details");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobOffers();
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      toast.error("Failed to load job offers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
    
    try {
      await deleteJobOffer(selectedJob.id);
      setJobs(jobs.filter(j => j.id !== selectedJob.id));
      toast.success("Job offer deleted successfully");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to delete job offer", err);
      toast.error("Failed to delete job offer");
    }
  };

  const filteredJobs = jobs.filter(job => {
    const title = (job.title || '').toLowerCase();
    const company = (job.company || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const term = (searchTerm || '').toLowerCase();
    
    return title.includes(term) || 
           company.includes(term) || 
           location.includes(term);
  });

  const columns = [
    { header: "Title", accessor: (job: JobOffer) => job.title },
    { header: "Company", accessor: (job: JobOffer) => job.company },
    { header: "Location", accessor: (job: JobOffer) => job.location },
    { header: "Posted", accessor: (job: JobOffer) => formatDate(job.created_at) },
    {
      header: "Actions",
      accessor: (job: JobOffer) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedJob(job);
              setModalContent("details");
              setShowModal(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <FiEye />
          </button>
          <button
            onClick={() => {
              setSelectedJob(job);
              setModalContent("delete");
              setShowModal(true);
            }}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <button
          onClick={fetchJobs}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Job Offers</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredJobs}
          emptyMessage="No job offers found"
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {modalContent === "details" ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Job Offer Details</h3>
            <div className="space-y-4">
              {selectedJob &&
                Object.entries(selectedJob).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium w-1/3 capitalize">{key.replace('_', ' ')}:</span>
                    <span className="w-2/3">
                      {key.includes("created_at") && typeof value === "string"
                        ? formatDate(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this job offer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}