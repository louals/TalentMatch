import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchResults, generateApplicationsFromMatches } from "api";
import { toast } from "react-hot-toast";
import LoadingM from "../../components/animations/LoadingM";

interface Match {
  job_offer_id: string;
  title: string;
  description: string;
  score: number;
  justification: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await getMatchResults();
        setMatches(res.data.matches || []);
      } catch (err) {
        toast.error("Failed to fetch matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleGenerateAll = async () => {
    if (matches.length === 0) {
      toast.error("No matches to generate applications from");
      return;
    }

    setGenerating(true);
    try {
      await generateApplicationsFromMatches({});
      toast.success("Applications generated!");
      navigate("/applications");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to generate applications");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingM />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
  
        <button
          onClick={handleGenerateAll}
          disabled={generating}
          className="mb-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          {generating ? "Generating Applications..." : "Generate All Applications"}
        </button>
  
        {matches.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No matches found.</p>
        ) : (
          <ul className="space-y-6">
            {matches.map((match) => (
              <li
                key={match.job_offer_id}
                className="border border-gray-300 dark:border-gray-700 rounded p-4 shadow-sm bg-white dark:bg-gray-800"
              >
                <h2 className="text-xl font-semibold mb-1">{match.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Match Score: {match.score.toFixed(2)}
                </p>
  
                <details className="mb-2">
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                    View Job Description
                  </summary>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {match.description}
                  </p>   
                </details>
  
                <details>
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                    View Match Justification
                  </summary>
                  <p className="mt-2 italic text-gray-700 dark:text-gray-400 whitespace-pre-wrap">
                    {match.justification}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

            }