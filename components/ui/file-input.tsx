"use client";

import React, { useState } from "react";
import { Label } from "./Label";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  buttonText?: string;
  placeholder?: string;
  label?: string;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ buttonText = "Choisir un fichier", placeholder = "Aucun fichier sélectionné", label, id, className, ...props }, ref) => {
    const [fileName, setFileName] = useState("");
    const defaultId = React.useId();
    const inputId = id || defaultId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileName(file ? file.name : "");
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="space-y-2 w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            type="file"
            className="hidden"
            onChange={handleChange}
          />
          <label
            htmlFor={inputId}
            className="flex items-center gap-3 w-full border border-slate-200 rounded-lg p-2 bg-white cursor-pointer hover:bg-slate-50/80 transition-colors"
          >
            <span className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-md border border-slate-200 transition-colors shrink-0">
              {buttonText}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {fileName || placeholder}
            </span>
          </label>
        </div>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
