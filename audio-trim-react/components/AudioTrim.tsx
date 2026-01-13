import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  convertAudio,
  getJobStatus,
  downloadResult,
  type Job,
} from "../src/utils/api/api";
import "../src/styles/audio.css";

const AudioTrim = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState<File[]>([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(7);

  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleConvert = async () => {
    setError("");

    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    if (end <= start) {
      setError("End time must be greater than start time");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("start_time", start.toString());
    formData.append("end_time", end.toString());

    try {
      setLoading(true);

      const res = await convertAudio(formData);
      setJobId(res.data.job_id);

      setJob({
        ID: res.data.job_id,
        Status: "queued",
      });

      pollJob(res.data.job_id);
    } catch {
      setLoading(false);
      setError("Upload failed");
    }
  };

  const pollJob = (id: string) => {
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await getJobStatus(id);
        const updatedJob = res.data;

        setJob(updatedJob);

        if (updatedJob.Status === "completed") {
          clearInterval(pollRef.current!);
          setLoading(false);
        }

        if (updatedJob.Status === "failed") {
          clearInterval(pollRef.current!);
          setLoading(false);
          setError("Processing failed");
        }
      } catch {
        clearInterval(pollRef.current!);
        setLoading(false);
        setError("Unable to fetch job status");
      }
    }, 2000);
  };

  const handleDownload = async () => {
    if (!jobId) return;

    const res = await downloadResult(jobId);

    const blob = new Blob([res.data], {
      type: res.headers["content-type"],
    });

    const url = URL.createObjectURL(blob);

    const filename =
      res.headers["content-type"] === "application/zip"
        ? "audios.zip"
        : "trimmed_audio.mp3";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="audio-container">
      <div className="audio-card">
        <button className="audio-back-button" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>

        <h2 className="audio-title">Audio Trimming</h2>

        <input
          className="audio-file"
          type="file"
          accept="audio/*,video/*"
          multiple
          onChange={(e) =>
            setFiles(e.target.files ? Array.from(e.target.files) : [])
          }
        />

        <div className="audio-group">
          <label>Start Time (seconds)</label>
          <input
            type="number"
            min={0}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
        </div>

        <div className="audio-group">
          <label>End Time (seconds)</label>
          <input
            type="number"
            min={0}
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
          />
        </div>

        {!job && (
          <button
            className="audio-button"
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Trim Audio"}
          </button>
        )}

        {job && (
          <p className="audio-status">
            Status: <strong>{job.Status}</strong>
          </p>
        )}

        {job?.Status === "completed" && (
          <button className="audio-button success" onClick={handleDownload}>
            ⬇ Download {files.length > 1 ? "ZIP" : "Audio"}
          </button>
        )}

        {job?.Status === "failed" && (
          <p className="audio-error">Processing failed due to may your file doesn't contain audio!</p>
        )}

        {error && <p className="audio-error">{error}</p>}
      </div>
    </div>
  );
};

export default AudioTrim;
