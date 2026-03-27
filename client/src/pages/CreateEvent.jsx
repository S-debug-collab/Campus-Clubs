import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationLink: "",
    tags: "",
    highlights: "",
    contactName: "",
    contactPhone: ""
  });

  const [poster, setPoster] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !poster ||
      !formData.tags.trim() ||
      !formData.highlights.trim() ||
      !formData.contactName.trim() ||
      !formData.contactPhone.trim()
    ) {
      alert("Please fill all fields 🚫");
      return;
    }

    try {
      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("date", formData.date);
      data.append("time", formData.time.trim());
      data.append("venue", formData.venue.trim());
      data.append("registrationLink", formData.registrationLink.trim());

      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const highlightsArray = formData.highlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      data.append("tags", JSON.stringify(tagsArray));
      data.append("highlights", JSON.stringify(highlightsArray));

      data.append(
        "contacts",
        JSON.stringify([
          {
            name: formData.contactName.trim(),
            phone: formData.contactPhone.trim()
          }
        ])
      );

      data.append("poster", poster);

      await axios.post("/events/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Event created successfully! 🎉");
      navigate("/club-dashboard");

    } catch (err) {
     console.error(err.response?.data);   
  alert(err.response?.data?.message || "Failed to create event ❌");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        Create Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-xl"
      >

        <input
          name="title"
          placeholder="Event Title"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="time"
          placeholder="Event Time (e.g. 02:00 PM)"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="venue"
          placeholder="Venue"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="registrationLink"
          placeholder="Registration Link"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="highlights"
          placeholder="Highlights (comma separated)"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="contactName"
          placeholder="Contact Person Name"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          name="contactPhone"
          placeholder="Contact Phone"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPoster(e.target.files[0])}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>

      </form>
    </div>
  );
}