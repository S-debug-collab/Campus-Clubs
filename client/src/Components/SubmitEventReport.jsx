import { useState } from "react";
import axios from "axios";

function SubmitEventReport({ eventId, token }) {
  const [report, setReport] = useState("");

  const submitReport = async () => {
    await axios.put(
      `http://localhost:5000/api/events/${eventId}/report`,
      { report },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Report submitted!");
  };

  return (
    <div className="p-4 bg-zinc-900 rounded-xl mt-4">
      <textarea
        placeholder="Write event report..."
        className="w-full p-2 rounded text-black"
        value={report}
        onChange={(e) => setReport(e.target.value)}
      />
      <button
        onClick={submitReport}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit Report
      </button>
    </div>
  );
}

export default SubmitEventReport;
