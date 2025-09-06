import { useEffect, useState } from "react";
import { fetchIssues } from "../services/api";

export default function Track() {
  const [issues, setIssues] = useState([]);

  useEffect(() => { (async ()=>{ setIssues(await fetchIssues({})); })(); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">My City Issues</h2>
      <div className="grid gap-3">
        {issues.map((i)=> (
          <div key={i.id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{i.title}</div>
            <div className="text-sm text-gray-600">{i.description}</div>
            <div className="text-xs mt-1">Status: {i.status} {i.category ? `| Category: ${i.category}` : ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
