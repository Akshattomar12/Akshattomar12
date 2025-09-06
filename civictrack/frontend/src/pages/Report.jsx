import { useEffect, useState } from "react";
import { createIssue } from "../services/api";

export default function Report() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  async function submitIssue(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    if (coords.lat && coords.lng) {
      form.append("latitude", coords.lat);
      form.append("longitude", coords.lng);
    }
    form.append("urgency", urgency);
    if (file) form.append("media", file);
    const created = await createIssue(form);
    setMessage(`Issue reported: ${created.id}`);
    setTitle(""); setDescription(""); setFile(null);
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Report an Issue</h2>
      {message && <div className="text-green-700 text-sm mb-2">{message}</div>}
      <form onSubmit={submitIssue} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full border p-2 rounded" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <select className="w-full border p-2 rounded" value={urgency} onChange={(e)=>setUrgency(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Submit</button>
      </form>
    </div>
  );
}
