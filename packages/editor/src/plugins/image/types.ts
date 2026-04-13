export interface UploadImageResult {
  url: string;
}

export interface UseEditorImageOptions {
  uploadImage: (file: File) => Promise<UploadImageResult>;
  onUploadError?: (error: Error, file: File) => void;
}
