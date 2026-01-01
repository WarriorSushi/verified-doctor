"use client";

import { Play } from "lucide-react";

interface VideoIntroductionProps {
  url: string;
  doctorName: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

function parseVideoUrl(url: string): { embedUrl: string; provider: string } | null {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        provider: "YouTube",
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
      };
    }
  }

  // Vimeo patterns
  const vimeoPattern = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoPattern);
  if (vimeoMatch) {
    return {
      provider: "Vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return null;
}

export function VideoIntroduction({ url, doctorName, themeColors }: VideoIntroductionProps) {
  const videoInfo = parseVideoUrl(url);

  if (!videoInfo) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.primary}15` }}
          >
            <Play className="w-4 h-4" style={{ color: themeColors.primary }} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Meet {doctorName}</h3>
            <p className="text-xs text-slate-500">Video Introduction</p>
          </div>
        </div>
      </div>
      <div className="aspect-video">
        <iframe
          src={videoInfo.embedUrl}
          title={`Video introduction by ${doctorName}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
