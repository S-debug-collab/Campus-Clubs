import { useState } from "react";
import axios from "axios";

function UploadEventPhotos({ eventId, token }) {
  const [photos, setPhotos] = useState([]);

  const uploadHandler = async () => {
    const formData = new FormData();
    photos.forEach(photo => formData.append("photos", photo));

    await axios.post(`http://localhost:5000/api/events/${eventId}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Photos uploaded successfully!");
  };

  return (
    <div className="p-4 bg-zinc-900 rounded-xl">
      <input
        type="file"
        multiple
        onChange={(e) => setPhotos([...e.target.files])}
        className="text-white"
      />
      <button
        onClick={uploadHandler}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload Event Photos
      </button>
    </div>
  );
}

export default UploadEventPhotos;
