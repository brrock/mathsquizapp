// components/ui/upload-button.tsx
"use client";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

interface ImageUploadProps {
  value?: string;
  onChange?: (url?: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <UploadButton<OurFileRouter, "questionImage">
          endpoint="questionImage"
          onClientUploadComplete={(res) => {
            setPreview(res[0].url);
            onChange?.(res[0].url);
          }}
          onUploadError={(error: Error) => {
            console.error(error);
          }}
        />
        {preview && (
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => {
              setPreview(undefined);
              onChange?.(undefined);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {preview && (
        <div className="relative aspect-video w-full h-60 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
