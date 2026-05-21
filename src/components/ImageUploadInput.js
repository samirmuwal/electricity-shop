"use client";

export default function ImageUploadInput({ preview, onFileChange }) {
  return (
    <div>
      <label className="block mb-1 font-medium">Product Image</label>

      <input
        type="file"
        accept="image/*"
        className="w-full border p-3 rounded"
        onChange={(e) => onFileChange(e.target.files[0])}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-3 w-40 h-40 object-cover rounded-xl border"
        />
      )}
    </div>
  );
}