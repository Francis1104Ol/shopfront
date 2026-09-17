import React from 'react';
import { useToast } from '../context/ToastContext';


const TOAST_STYLES = {
  error: "bg-red-100 text-red-800 border-red-400",
  success: "bg-green-100 text-green-800 border-green-400",
  info: "bg-blue-100 text-blue-800 border-blue-400"
};

export default function Toast() {
  const { toast } = useToast();

 
  if (!toast) return null;


  const typeClasses = TOAST_STYLES[toast.type] || TOAST_STYLES.error;

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-sm rounded-md border p-4 font-medium shadow-lg animate-fade-in ${typeClasses}`}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
