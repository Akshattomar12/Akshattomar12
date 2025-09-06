import { useEffect, useMemo, useState } from "react";
import { analyticsSummary, fetchIssues, updateIssueStatus } from "../services/api";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ total: 0, byStatus: {} });
  const [issues, setIssues] = useState([]);
  const socket = useMemo(() => io(import.meta.env.VITE_API_URL || "http://localhost:4000"), []);

  useEffect(() => {
    (async ()=>{
      setSummary(await analyticsSummary());
      setIssues(await fetchIssues({}));
    })();
    socket.on("issue:new", (i)=> setIssues(prev => [i, ...prev]));
    socket.on("issue:updated", (u)=> setIssues(prev => prev.map(i=> i.id===u.id?u:i)));
    return () => socket.close();
  }, [socket]);

  async function markResolved(id){
    await updateIssueStatus(id, { status: "resolved" });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold">Summary</div>
        <div className="text-sm">Total: {summary.total}</div>
        <div className="text-sm">Received: {summary.byStatus?.received || 0}</div>
        <div className="text-sm">In progress: {summary.byStatus?.in_progress || 0}</div>
        <div className="text-sm">Resolved: {summary.byStatus?.resolved || 0}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold mb-2">Issues</div>
        <div className="grid gap-2">
          {issues.map(i=> (
            <div key={i.id} className="flex items-center justify-between border rounded p-2">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-xs">{i.status} {i.category? `| ${i.category}`: ""}</div>
              </div>
              <button className="text-xs bg-green-600 text-white px-2 py-1 rounded" onClick={()=>markResolved(i.id)}>Mark Resolved</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
