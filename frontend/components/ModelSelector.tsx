"use client";
import { useEffect, useState } from "react";
import { API_URL } from "./statics";

export default function ModelSelector({ value, onChange }: any) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/models`)
      .then((res) => res.json())
      .then((data) => {
        setModels(data.models);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>در حال بارگذاری مدل‌ها...</p>;

  return (
    <select
      dir="ltr"
      className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 direction-ltr text-left"
      style={{ direction: "ltr", textAlign: "left" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {models.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
