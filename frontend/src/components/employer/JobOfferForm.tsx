import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { createJobOffer, updateJobOffer } from "api";
import { useNavigate } from "react-router-dom";

export interface JobOfferFormValues {
  title: string;
  description: string;
  location?: string;
  salary?: string;
  employment_type?: "full-time" | "part-time" | "contract" | "intern";
  skills?: string; // comma-separated
}

export default function JobOfferForm({
  defaultValues,
  offerId, // if present → edit mode
}: {
  defaultValues?: Partial<JobOfferFormValues>;
  offerId?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobOfferFormValues>({ defaultValues });

  const navigate = useNavigate();

  const onSubmit = async (data: JobOfferFormValues) => {
    try {
      if (offerId) {
        await updateJobOffer(offerId, data);
        toast.success("Job updated");
      } else {
        await createJobOffer(data);
        toast.success("Job posted 🎉");
      }
      navigate("/employer/jobs");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* title */}
      <div>
        <label className="block text-sm font-medium mb-1">Job title *</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="input"
          placeholder="e.g. Senior React Developer"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={6}
          className="textarea"
          placeholder="Describe responsibilities, stack, benefits..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          {...register("location")}
          className="input"
          placeholder="Location (remote, city...)"
        />
        <input
          {...register("salary")}
          className="input"
          placeholder="Salary (e.g. 80-100k CAD)"
        />
      </div>

      <select {...register("employment_type")} className="input">
        <option value="">Employment type (optional)</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="intern">Intern</option>
      </select>

      <input
        {...register("skills")}
        className="input"
        placeholder="Key skills (comma-separated)"
      />

      <button
        type="submit"
        className="btn-primary w-full disabled:opacity-50"
        disabled={isSubmitting}
      >
        {offerId ? "Update job" : "Publish job"}
      </button>
    </form>
  );
}
