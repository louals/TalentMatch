import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { uploadCV, getCVs, downloadCV, deleteCV, runMatch } from "api";
import { toast } from "react-hot-toast";
import { convertDocxToPdf } from "../../utils/docsToPdf";
import LoadingMWhite from "../../components/animations/LoadingMwhite";
import LoadingM from "../../components/animations/LoadingM";

interface CVItem {
  _id: string;
  filename: string;
  upload_date: string;
}

export default function UploadCvPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cvs, setCvs] = useState<CVItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  

  useEffect(() => {
    (async () => {
      try {
        const res = await getCVs();
        setCvs(res.data);
      } catch {
        toast.error("Failed to fetch CVs");
      }
    })();
  }, []);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    let file = files[0];

    if (!file.name.match(/\.(pdf|docx?)$/i)) {
      toast.error("Only PDF or DOCX allowed");
      return;
    }

    setUploading(true);

    try {
      if (file.name.match(/\.docx$/i)) {
        const pdfBlob = await convertDocxToPdf(file);
        file = new File([pdfBlob], file.name.replace(/\.docx$/i, ".pdf"), {
          type: "application/pdf",
        });
      }

      const formData = new FormData();
      formData.append("file", file);
      await uploadCV(formData);

      toast.success("CV uploaded! Running matching...");

      await runMatch({}); 

      toast.success("Matching complete!");
      navigate("/matches"); // redirect to matches page
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Upload Your CV</h1>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-10 cursor-pointer hover:border-primary transition"
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-gray-600 dark:text-gray-300">
            Drag & drop your CV here, or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">(PDF , DOCX)</p>
          <input
            type="file"
            accept=".pdf,.docx"
            hidden
            ref={inputRef}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {uploading && (
           <>
           {/* Show dark or light spinner depending on theme */}
           <div className="mt-4 flex justify-center">
             <div className="block dark:hidden">
               <LoadingM />
             </div>
             <div className="hidden dark:block">
               <LoadingMWhite />
             </div>
           </div>
         </>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">Your CVs</h2>
        {cvs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No CVs uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {cvs.map((cv) => (
              <li
                key={cv._id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded"
              >
                <div>
                  <p className="font-medium">{cv.filename}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded {new Date(cv.upload_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => downloadCV(cv._id, cv.filename)}
                    className="text-primary hover:underline text-sm dark:text-gray-200"
                  >
                    Download
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await deleteCV(cv._id);
                        toast.success("CV deleted");
                        setCvs((prev) => prev.filter((c) => c._id !== cv._id));
                      } catch (err: any) {
                        toast.error(err.response?.data?.detail || "Delete failed");
                      }
                    }}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
