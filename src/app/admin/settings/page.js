"use client";

import { useEffect, useState } from "react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    whatsapp: "",
    address: "",
    logo: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetch("/api/shop-settings");
      const data = await res.json();

      if (data.setting) {
        setForm({
          shopName: data.setting.shopName || "",
          phone: data.setting.phone || "",
          whatsapp: data.setting.whatsapp || "",
          address: data.setting.address || "",
          logo: data.setting.logo || "",
        });

        setPreview(data.setting.logo || "");
      }
    }

    fetchSettings();
  }, []);

  function handleLogoChange(file) {
    if (!file) return;

    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  const uploadLogo = async () => {
    if (!logoFile) return form.logo;

    const formData = new FormData();
    formData.append("file", logoFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.imageUrl;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const logoUrl = await uploadLogo();

    await fetch("/api/shop-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        logo: logoUrl,
      }),
    });

    setForm((prev) => ({
      ...prev,
      logo: logoUrl,
    }));

    setLoading(false);
    alert("Settings updated successfully");
  }

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">Shop Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Shop Name"
          className="w-full border p-3 rounded-lg"
          value={form.shopName}
          onChange={(e) => setForm({ ...form, shopName: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          className="w-full border p-3 rounded-lg"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="WhatsApp Number e.g. 919876543210"
          className="w-full border p-3 rounded-lg"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />

        <div>
          <label className="block mb-2 font-medium">Shop Logo</label>
          <ImageUploadInput preview={preview} onFileChange={handleLogoChange} />
        </div>

        <textarea
          placeholder="Shop Address"
          className="w-full border p-3 rounded-lg"
          rows={4}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}