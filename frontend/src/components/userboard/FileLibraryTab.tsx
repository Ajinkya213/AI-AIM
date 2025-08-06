// components/userboard/FileLibraryTab.tsx
import * as React from "react";
import { UploadIcon, FileIcon, TrashIcon, ViewHorizontalIcon, ViewGridIcon } from "@radix-ui/react-icons"; // Import new icons
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // e.g., "application/pdf", "image/jpeg"
  uploadDate: string; // e.g., "2025-07-27"
  status: "pending" | "uploading" | "completed" | "failed";
  progress?: number; // 0-100
}

interface FileLibraryTabProps {
  uploadedFiles: UploadedFile[];
  onFileUpload: (file: File) => void;
  onFileDelete: (fileId: string) => void;
}

export function FileLibraryTab({ uploadedFiles, onFileUpload, onFileDelete }: FileLibraryTabProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"list" | "card">("list");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileUpload(event.target.files[0]);
      event.target.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileUpload(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const FileCard = ({ file }: { file: UploadedFile }) => (
    <Card className="flex flex-col items-center justify-center p-4 text-center h-full">
      <FileIcon className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-sm font-medium truncate w-full px-1">{file.name}</p>
      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      {file.status === "uploading" && (
        <Progress value={file.progress} className="h-2 w-full mt-2" />
      )}
      {file.status === "failed" && (
        <p className="text-xs text-destructive mt-1">Upload Failed!</p>
      )}
      <Button variant="ghost" size="icon" onClick={() => onFileDelete(file.id)} className="mt-2 text-destructive">
        <TrashIcon className="h-4 w-4" />
        <span className="sr-only">Delete file</span>
      </Button>
    </Card>
  );

  const FileListItem = ({ file }: { file: UploadedFile }) => (
    <Card className="flex items-center p-3">
      <FileIcon className="h-5 w-5 mr-3 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)} &bull; {file.type.split("/").pop()} &bull; {file.uploadDate}
        </p>
        {file.status === "uploading" && (
          <Progress value={file.progress} className="h-2 mt-1" />
        )}
        {file.status === "failed" && (
          <p className="text-xs text-destructive mt-1">Upload Failed!</p>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={() => onFileDelete(file.id)} className="ml-4">
        <TrashIcon className="h-4 w-4 text-destructive" />
        <span className="sr-only">Delete file</span>
      </Button>
    </Card>
  );

  return (
    <div className="flex flex-col h-full p-4">
      <Card
        className={cn(
          "border-2 border-dashed bg-muted p-6 text-center transition-colors",
          isDragging ? "border-primary" : "border-gray-300 dark:border-gray-700",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center p-0 pt-4">
          <UploadIcon className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">Drag & drop files here, or</p>
          <Label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
            Click to upload
          </Label>
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          <p className="text-xs text-muted-foreground mt-1">Max file size: 25MB</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="text-lg font-semibold">Your Files ({uploadedFiles.length})</h2>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value: "list" | "card") => value && setViewMode(value)} aria-label="Toggle view mode">
          <ToggleGroupItem value="list" aria-label="List view">
            <ViewHorizontalIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="card" aria-label="Card view">
            <ViewGridIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Changed class from flex-1 pr-4 to grow pr-4 to ensure scrolling */}
      <div className="grow pr-4 overflow-hidden">
        <ScrollArea className="h-full">
          {uploadedFiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">No files uploaded yet.</p>
          ) : viewMode === "list" ? (
            <div className="grid gap-3">
              {uploadedFiles.map((file) => (
                <FileListItem key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}