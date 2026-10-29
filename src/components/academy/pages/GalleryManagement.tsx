"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, Trash2, X, Plus, Link as LinkIcon, Smile } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { ImageUpload } from "@/components/common/ImageUpload";
import { useMyAcademy, useUpdateAcademy } from "@/lib/hooks";
import { LoadingCards } from "@/components/common/LoadingStates";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GalleryImage {
  emoji?: string;
  gradient?: string;
  title: string;
  url?: string; // real uploaded image URL
}

const emojiChoices = ["🎓", "📚", "💻", "🏛️", "👩‍🏫", "🏆", "🔬", "🎯", "📖", "✏️", "🧪", "📐"];
const gradientChoices = [
  "linear-gradient(135deg, #2563EB, #1E40AF)",
  "linear-gradient(135deg, #10B981, #059669)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #F59E0B, #D97706)",
  "linear-gradient(135deg, #EC4899, #BE185D)",
  "linear-gradient(135deg, #06B6D4, #0891B2)",
];

export function GalleryManagement() {
  const myAcademyQ = useMyAcademy();
  const updateMutation = useUpdateAcademy();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mode, setMode] = useState<"upload" | "emoji">("upload");
  const [newImage, setNewImage] = useState<GalleryImage>({
    emoji: "🎓", gradient: gradientChoices[0], title: "", url: "",
  });

  const academy = myAcademyQ.data?.data?.academy as any;
  const images: GalleryImage[] = (() => {
    try { return JSON.parse(academy?.galleryJson || "[]"); } catch { return []; }
  })();

  const addImage = () => {
    if (!newImage.title) {
      toast.error("Please add a title");
      return;
    }
    if (mode === "upload" && !newImage.url) {
      toast.error("Please upload an image");
      return;
    }
    const updated = [...images, { ...newImage }];
    updateMutation.mutate({ id: academy.id, data: { gallery: updated } }, {
      onSuccess: () => {
        setNewImage({ emoji: "🎓", gradient: gradientChoices[0], title: "", url: "" });
        setUploadOpen(false);
      },
    });
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    updateMutation.mutate({ id: academy.id, data: { gallery: updated } });
  };

  if (myAcademyQ.isLoading) return <LoadingCards count={4} />;

  return (
    <div>
      <PageHeader
        title="Gallery Management"
        description={`${images.length} photos in your academy gallery`}
        icon={ImageIcon}
        actions={
          <Button className="gradient-emerald" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-1.5" /> Upload Photos
          </Button>
        }
      />

      {images.length === 0 ? (
        <Card className="p-12 text-center border-border/60">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm text-muted-foreground mb-4">No photos uploaded yet</p>
          <Button className="gradient-emerald" onClick={() => setUploadOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Upload First Photo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-border/60 shadow-card"
              >
                {img.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: img.gradient || gradientChoices[0] }}>
                    {img.emoji || "🎓"}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="text-white text-xs font-semibold mb-2">{img.title}</div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs"
                    onClick={() => removeImage(i)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {uploadOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setUploadOpen(false)}>
          <Card className="p-6 max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add Photo</h3>
              <Button variant="ghost" size="icon" onClick={() => setUploadOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setMode("upload")}
                className={cn(
                  "flex-1 h-9 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                  mode === "upload" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Upload className="h-3.5 w-3.5" /> Upload
              </button>
              <button
                onClick={() => setMode("emoji")}
                className={cn(
                  "flex-1 h-9 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                  mode === "emoji" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Smile className="h-3.5 w-3.5" /> Icon
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Photo Title</Label>
                <Input
                  placeholder="e.g. Computer Lab"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                />
              </div>

              {mode === "upload" ? (
                <ImageUpload
                  value={newImage.url}
                  onChange={(url) => setNewImage({ ...newImage, url })}
                  label="Upload Image"
                  aspectRatio="square"
                  rounded="xl"
                />
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Choose Icon</Label>
                    <div className="flex flex-wrap gap-2">
                      {emojiChoices.map((e) => (
                        <button
                          key={e}
                          onClick={() => setNewImage({ ...newImage, emoji: e })}
                          className={cn(
                            "h-9 w-9 rounded-lg text-lg flex items-center justify-center border transition-all",
                            newImage.emoji === e ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                          )}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {gradientChoices.map((g) => (
                        <button
                          key={g}
                          onClick={() => setNewImage({ ...newImage, gradient: g })}
                          className={cn(
                            "h-9 w-9 rounded-lg border-2 transition-all",
                            newImage.gradient === g ? "border-primary" : "border-transparent"
                          )}
                          style={{ background: g }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button className="w-full gradient-emerald" onClick={addImage} disabled={updateMutation.isPending}>
                <Plus className="h-4 w-4 mr-1.5" /> Add to Gallery
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
