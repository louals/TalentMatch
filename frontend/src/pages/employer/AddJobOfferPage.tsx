import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createJobOffer } from "api";

export default function AddJobOfferPage() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const criteria = {
        required_skills: data.required_skills.split(",").map((s: string) => s.trim()),
        preferred_skills: data.preferred_skills.split(",").map((s: string) => s.trim()),
        experience_years: {
          min: parseInt(data.min_experience),
          preferred: parseInt(data.preferred_experience),
        },
        education_level: data.education_level,
        languages: {
          required: data.required_languages.split(",").map((l: string) => l.trim()),
          optional: data.optional_languages.split(",").map((l: string) => l.trim()),
        },
        location: {
          remote: data.remote === "yes",
          preferred_location: data.preferred_location,
        },
        availability: {
          start_date: data.start_date,
          contract_type: data.contract_type,
        },
      };

      await createJobOffer({
        title: data.title,
        description: data.description,
        criteria,
      });

      alert("Job offer created!");
      reset();
    } catch (err) {
      console.error("Error creating job offer:", err);
      alert("Failed to create job offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Post a New Job Offer
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-300">
            Fill out the form below to create a new job listing
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                {...register("title")}
                id="title"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed job description..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="required_skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  {...register("required_skills")}
                  id="required_skills"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. React, TypeScript, CSS"
                />
              </div>

              <div>
                <label htmlFor="preferred_skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Skills (comma-separated)
                </label>
                <input
                  {...register("preferred_skills")}
                  id="preferred_skills"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. GraphQL, Jest, AWS"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="min_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Experience (years)
                </label>
                <input
                  {...register("min_experience")}
                  id="min_experience"
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 3"
                />
              </div>

              <div>
                <label htmlFor="preferred_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Experience (years)
                </label>
                <input
                  {...register("preferred_experience")}
                  id="preferred_experience"
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Education Level
              </label>
              <input
                {...register("education_level")}
                id="education_level"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Bachelor's Degree"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="required_languages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required Languages (comma-separated)
                </label>
                <input
                  {...register("required_languages")}
                  id="required_languages"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. English, Spanish"
                />
              </div>

              <div>
                <label htmlFor="optional_languages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Optional Languages (comma-separated)
                </label>
                <input
                  {...register("optional_languages")}
                  id="optional_languages"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. French, German"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="remote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Arrangement
                </label>
                <select
                  {...register("remote")}
                  id="remote"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="yes">Remote</option>
                  <option value="no">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferred_location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Location
                </label>
                <input
                  {...register("preferred_location")}
                  id="preferred_location"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. New York, USA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  {...register("start_date")}
                  id="start_date"
                  type="date"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Type
                </label>
                <input
                  {...register("contract_type")}
                  id="contract_type"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Full-time"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Job Offer...
                  </>
                ) : (
                  "Create Job Offer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}