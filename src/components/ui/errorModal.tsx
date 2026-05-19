"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function ErrorModal({ title, message, action }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 font-sans animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl text-center animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={24} strokeWidth={2} />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>

        {action && (
          <div className="flex justify-center items-center gap-3 animate-in fade-in delay-75">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
