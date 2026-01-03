import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const subjects = ["Data Structures", "Database Systems", "Computer Networks", "Operating Systems", "Mathematics", "Physics", "Chemistry"];
const units = ["1", "2", "3", "4", "5", "0"]; // 0 for general/all
const types = ["PDF", "PPT", "Word", "Image", "Other"];

export function UploadMaterialDialog() {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        unit: "",
        type: "",
    });
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !formData.title || !formData.subject || !formData.unit || !formData.type) {
            toast.error("Please fill in all fields and select a file");
            return;
        }

        setUploading(true);
        try {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) throw new Error("Not authenticated");

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${formData.subject}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('study-materials')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('study-materials')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('study_materials')
                .insert({
                    title: formData.title,
                    subject: formData.subject,
                    unit: parseInt(formData.unit),
                    type: formData.type,
                    file_url: publicUrl,
                    file_name: file.name,
                    user_id: user.id
                });

            if (dbError) throw dbError;

            toast.success("Material uploaded successfully!");
            setOpen(false);
            setFile(null);
            setFormData({
                title: "",
                subject: "",
                unit: "",
                type: "",
            });
            queryClient.invalidateQueries({ queryKey: ['study-materials'] });

        } catch (error: any) {
            toast.error(error.message || "Failed to upload material");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Material
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Study Material</DialogTitle>
                    <DialogDescription>
                        Share notes, presentations, and resources with your peers.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Unit 1 Complete Notes"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select
                                value={formData.subject}
                                onValueChange={(val) => setFormData({ ...formData, subject: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(val) => setFormData({ ...formData, unit: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map(u => <SelectItem key={u} value={u}>{u === "0" ? "General" : `Unit ${u}`}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">File Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => setFormData({ ...formData, type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>
                        {file && <p className="text-xs text-muted-foreground">Selected: {file.name}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={uploading}>
                            {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
