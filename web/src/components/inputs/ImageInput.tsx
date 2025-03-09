import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Image, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import api from '@/api/api';

export type ImageInputProps = {
  value?: string;
  onChange?: (url: string) => void;
  className?: string;
  pathPrefix?: string;
};

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange, className, ...props }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.files.upload(formData);
        console.log('response', response);

        if (response && response.filename) {
          onChange?.(response.filename);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropzone from triggering
    onChange?.('');
  };

  const imageUrl = useMemo(() => {
    if (!value) return null;
    return `${props.pathPrefix || ''}/${value}`;
  }, [props.pathPrefix, value]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative h-[300px] rounded-lg border-2 border-dashed border-gray-200 transition-all p-4',
        isDragActive && 'border-primary bg-primary/5',
        className,
      )}
      {...props}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Uploading image...</p>
        </div>
      ) : value ? (
        <div className="relative h-full w-fit">
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 rounded-full bg-destructive hover:bg-destructive/75 text-white transition-colors"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={imageUrl ?? ''}
            alt="Recipe preview"
            className="h-full w-fit min-w-[100px] object-contain rounded-lg"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
          {isDragActive ? (
            <>
              <Upload className="h-12 w-12 animate-bounce" />
              <p>Drop your image here</p>
            </>
          ) : (
            <>
              <Image className="h-12 w-12" />
              <p>Drag & drop or click to upload recipe image</p>
              <p className="text-sm">PNG, JPG, JPEG up to 10MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageInput;
