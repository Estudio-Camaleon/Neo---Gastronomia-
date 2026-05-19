"use client";

import { Share2, Info } from "lucide-react";

interface SocialLinksProps {
  formData: {
    instagram_url: string;
    facebook_url: string;
    tiktok_url: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SocialLinksSection({ formData, onChange }: SocialLinksProps) {
  return (
    <div className="admin-card h-full flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Share2 size={18} className="text-[var(--admin-accent)]" />
          <h2 className="font-semibold text-gray-900">
            Redes Sociales
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Instagram
            </label>
            <input
              name="instagram_url"
              type="url"
              value={formData.instagram_url}
              onChange={onChange}
              placeholder="https://instagram.com/tu_marca"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Facebook
            </label>
            <input
              name="facebook_url"
              type="url"
              value={formData.facebook_url}
              onChange={onChange}
              placeholder="https://facebook.com/tu_marca"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              TikTok
            </label>
            <input
              name="tiktok_url"
              type="url"
              value={formData.tiktok_url}
              onChange={onChange}
              placeholder="https://tiktok.com/@tu_marca"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-2 mt-6">
        <Info size={16} className="shrink-0 text-blue-500 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Recuerda incluir <strong>https://</strong> al principio de cada enlace para que los botones funcionen correctamente en el catálogo público.
        </p>
      </div>
    </div>
  );
}
