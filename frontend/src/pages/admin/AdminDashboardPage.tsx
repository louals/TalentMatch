import React, { useEffect, useState } from "react";
import {
  getUsers,
  getJobOffers,
  getApplications,
  getCVs,
} from "api";
import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiClipboard,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoadingM from "../../components/animations/LoadingM";

// Chart.js setup
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    candidates: 0,
    employers: 0,
    admins: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCVs: 0,
  });

  const [monthlyUsers, setMonthlyUsers] = useState<number[]>([]);
  const [monthlyJobs, setMonthlyJobs] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [userRes, jobRes, appRes, cvRes] = await Promise.all([
        getUsers(),
        getJobOffers(),
        getApplications(),
        getCVs(),
      ]);

      const users = userRes.data || [];
      const jobs = jobRes.data || [];
      const apps = appRes.data || [];
      const cvs = cvRes.data || [];

      const roleCounts = {
        candidate: 0,
        employer: 0,
        admin: 0,
      };

      const months = Array(6).fill(0);
      const jobMonths = Array(6).fill(0);
      const now = new Date();

      users.forEach((u: any) => {
        if (["candidate", "employer", "admin"].includes(u.role)) {
          roleCounts[u.role as keyof typeof roleCounts]++;
        }

        if (u.created_at) {
          const d = new Date(u.created_at);
          const diff =
            now.getMonth() - d.getMonth() +
            12 * (now.getFullYear() - d.getFullYear());
          if (diff >= 0 && diff < 6) {
            months[5 - diff]++;
          }
        }
      });

      jobs.forEach((j: any) => {
        if (j.created_at) {
          const d = new Date(j.created_at);
          const diff =
            now.getMonth() - d.getMonth() +
            12 * (now.getFullYear() - d.getFullYear());
          if (diff >= 0 && diff < 6) {
            jobMonths[5 - diff]++;
          }
        }
      });

      setStats({
        totalUsers: users.length,
        candidates: roleCounts.candidate,
        employers: roleCounts.employer,
        admins: roleCounts.admin,
        totalJobs: jobs.length,
        totalApplications: apps.length,
        totalCVs: cvs.length,
      });

      setMonthlyUsers(months);
      setMonthlyJobs(jobMonths);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const cardClass =
    "flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800 cursor-pointer";

  const StatCard = ({
    icon,
    label,
    value,
    color,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    onClick?: () => void;
  }) => (
    <div className={cardClass} onClick={onClick}>
      <div className={`text-3xl p-2 rounded-full ${color}`}>{icon}</div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </div>
        <div className="text-2xl font-semibold text-gray-800 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );

  // Chart config
  const lineChartData = {
    labels: ["5M ago", "4M ago", "3M ago", "2M ago", "1M ago", "Now"],
    datasets: [
      {
        label: "New Users",
        data: monthlyUsers,
        fill: true,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#3B82F6",
        tension: 0.4,
      },
      {
        label: "New Job Offers",
        data: monthlyJobs,
        fill: true,
        backgroundColor: "rgba(16,185,129,0.2)",
        borderColor: "#10B981",
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ["Candidates", "Employers", "Admins"],
    datasets: [
      {
        label: "User Roles",
        data: [
          stats.candidates,
          stats.employers,
          stats.admins,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#8B5CF6"],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <LoadingM />;

  return (
    <div className="p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <StatCard
          icon={<FiUsers />}
          label="Total Users"
          value={stats.totalUsers}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          icon={<FiUsers />}
          label="Candidates"
          value={stats.candidates}
          color="bg-green-100 text-green-600 dark:bg-green-900"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          icon={<FiUsers />}
          label="Employers"
          value={stats.employers}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          icon={<FiUsers />}
          label="Admins"
          value={stats.admins}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          icon={<FiBriefcase />}
          label="Job Offers"
          value={stats.totalJobs}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
          onClick={() => navigate("/admin/jobs")}
        />
        <StatCard
          icon={<FiClipboard />}
          label="Applications"
          value={stats.totalApplications}
          color="bg-pink-100 text-pink-600 dark:bg-pink-900"
          onClick={() => navigate("/admin/applications")}
        />
        <StatCard
          icon={<FiFileText />}
          label="CVs Uploaded"
          value={stats.totalCVs}
          color="bg-teal-100 text-teal-600 dark:bg-teal-900"
          onClick={() => navigate("/admin/cvs")}
        />
      </div>

      {/* CHARTS */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">New Users (Last 6 Months)</h2>
          <Line data={lineChartData} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Role Distribution</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  )
}