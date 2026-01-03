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
import { Upload, Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const subjects = ["Data Structures", "Database Systems", "Computer Networks", "Operating Systems", "Mathematics", "Physics", "Chemistry"];
const regulations = ["R20", "R18", "R22"];
const examTypes = ["Mid-1", "Mid-2", "End Sem", "Lab Internal", "Lab External"];

export function UploadPYQDialog() {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        subject: "",
        year: new Date().getFullYear().toString(),
        regulation: "",
        examType: "",
    });
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !formData.subject || !formData.regulation || !formData.examType) {
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
                .from('pyq-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('pyq-documents')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('previous_year_questions')
                .insert({
                    subject: formData.subject,
                    year: parseInt(formData.year),
                    regulation: formData.regulation,
                    exam_type: formData.examType,
                    file_url: publicUrl,
                    file_name: file.name,
                    user_id: user.id
                });

            if (dbError) throw dbError;

            toast.success("PYQ uploaded successfully!");
            setOpen(false);
            setFile(null);
            setFormData({
                subject: "",
                year: new Date().getFullYear().toString(),
                regulation: "",
                examType: "",
            });
            queryClient.invalidateQueries({ queryKey: ['pyqs'] });

        } catch (error: any) {
            toast.error(error.message || "Failed to upload PYQ");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Paper
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Question Paper</DialogTitle>
                    <DialogDescription>
                        Share previous year question papers with the community.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4 py-4">
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
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="regulation">Regulation</Label>
                            <Select
                                value={formData.regulation}
                                onValueChange={(val) => setFormData({ ...formData, regulation: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regulations.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="examType">Exam Type</Label>
                            <Select
                                value={formData.examType}
                                onValueChange={(val) => setFormData({ ...formData, examType: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {examTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">File (PDF/Image)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,image/*"
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
