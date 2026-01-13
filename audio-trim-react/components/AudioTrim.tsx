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
    const [duration, setDuration] = useState<number | null>(null);
    const [dragActive, setDragActive] = useState(false);

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

    const extractDuration = (file: File): Promise<number> =>
        new Promise((resolve, reject) => {
            const el = document.createElement(
                file.type.startsWith("video") ? "video" : "audio"
            );
            el.preload = "metadata";
            el.src = URL.createObjectURL(file);

            el.onloadedmetadata = () => {
                URL.revokeObjectURL(el.src);
                resolve(Math.floor(el.duration));
            };

            el.onerror = () => reject();
        });

    const handleFiles = async (list: File[]) => {
        setError("");
        setFiles(list);

        try {
            const d = await extractDuration(list[0]);
            setDuration(d);
        } catch {
            setError("Unable to read media duration");
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return setError("Please upload files");

        if (!duration || duration <= 0)
            return setError("Invalid media duration");

        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        formData.append("start_time", "0");
        formData.append("end_time", duration.toString());

        try {
            setLoading(true);
            const res = await convertAudio(formData);

            setJob({ ID: res.data.job_id, Status: "queued" });
            setJobId(res.data.job_id);

            setTimeout(() => {
                setJob((prev) => prev ? { ...prev, Status: "processing" } : prev);
            }, 800);

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
                setJob(res.data);

                if (res.data.Status === "completed") {
                    clearInterval(pollRef.current!);
                    setLoading(false);
                }

                if (res.data.Status === "failed") {
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
        const name =
            res.headers["content-type"] === "application/zip"
                ? "audios.zip"
                : "trimmed_audio.mp3";

        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="audio-page">
            <div className="audio-card">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Dashboard
                </button>

                <h1>Audio Trimming</h1>
                <p className="subtitle">
                    Upload audio or video files. Audio will be extracted automatically.
                </p>

                <div
                    className={`dropzone ${dragActive ? "active" : ""}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        handleFiles(Array.from(e.dataTransfer.files));
                    }}
                >
                    <input
                        type="file"
                        multiple
                        accept="audio/*,video/*"
                        onChange={(e) =>
                            handleFiles(e.target.files ? Array.from(e.target.files) : [])
                        }
                    />
                    <span>Drag & drop files here</span>
                    <small>or click to browse</small>
                </div>

                {files.length > 0 && (
                    <div className="file-list">
                        {files.map((f) => (
                            <div key={f.name} className="file-item">
                                {f.name}
                            </div>
                        ))}
                        <div className="duration">
                            Duration detected: {duration}s
                        </div>
                    </div>
                )}

                {!job && (
                    <button
                        className="primary-btn"
                        onClick={handleConvert}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Convert"}
                    </button>
                )}

                {job && (
                    <div className="status">
                        {job.Status === "queued" && "Queued"}
                        {job.Status === "processing" && "Processing..."}
                        {job.Status === "completed" && "Completed 🎉"}
                        {job.Status === "failed" && "Failed ❌"}
                    </div>
                )}

                {job?.Status === "completed" && (
                    <button className="success-btn" onClick={handleDownload}>
                        Download {files.length > 1 ? "ZIP" : "Audio"}
                    </button>
                )}

                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default AudioTrim;
