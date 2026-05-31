"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { BUILD_STAGES } from "@/lib/db/schema";
import { addUpdate } from "../actions";

export function BuildUpdateForm({ orderId }: { orderId: number }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        uploaded.push(blob.url);
      }
      setUrls((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(
        "Upload failed (Blob storage may not be configured). You can paste photo URLs below instead.",
      );
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        // Merge uploaded URLs with any manually pasted ones.
        const pasted = String(formData.get("photosManual") ?? "");
        const all = [...urls, ...pasted.split(",").map((s) => s.trim())]
          .filter(Boolean)
          .join(",");
        formData.set("photos", all);
        startTransition(async () => {
          await addUpdate(orderId, formData);
          formRef.current?.reset();
          setUrls([]);
          router.refresh();
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="text-xs text-ms-ash">Title</label>
        <input
          name="title"
          required
          placeholder="e.g. Cabinetry installed"
          className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
        />
      </div>

      <div>
        <label className="text-xs text-ms-ash">Details</label>
        <textarea
          name="body"
          rows={3}
          placeholder="What happened this week…"
          className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ms-ash">Stage (optional)</label>
          <select
            name="stage"
            defaultValue=""
            className="mt-1 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-sm text-ms-bone outline-none focus:border-ms-ion"
          >
            <option value="">—</option>
            {BUILD_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-ms-ash">Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="mt-1 block w-full text-xs text-ms-fog file:mr-3 file:rounded-md file:border-0 file:bg-ms-graphite file:px-3 file:py-2 file:text-ms-bone"
        />
        {uploading ? (
          <p className="mt-1 text-xs text-ms-ion">Uploading…</p>
        ) : null}
        {urls.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {urls.map((u) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={u}
                src={u}
                alt=""
                className="h-16 w-16 rounded-md object-cover"
              />
            ))}
          </div>
        ) : null}
        {error ? <p className="mt-1 text-xs text-ms-danger">{error}</p> : null}
        <input
          name="photosManual"
          placeholder="…or paste photo URLs, comma-separated"
          className="mt-2 w-full rounded-md border border-ms-graphite bg-ms-black px-3 py-2 text-xs text-ms-fog outline-none focus:border-ms-ion"
        />
      </div>

      <div className="flex items-center gap-6 text-sm text-ms-fog">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="visible" defaultChecked /> Visible to
          customer
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="notify" /> Email customer
        </label>
      </div>

      <button
        type="submit"
        disabled={pending || uploading}
        className="rounded-md bg-ms-bone px-4 py-2 text-sm font-medium text-ms-black transition hover:bg-ms-paper disabled:opacity-50"
      >
        {pending ? "Posting…" : "Post update"}
      </button>
    </form>
  );
}
