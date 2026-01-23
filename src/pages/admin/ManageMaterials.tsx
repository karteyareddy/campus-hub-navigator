import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ManageMaterials() {
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        const { data } = await supabase
            .from('study_materials')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setMaterials(data);
    };

    const handleDelete = async (id: string, filePath: string) => {
        if (!confirm("Are you sure you want to delete this material?")) return;

        try {
            const { error } = await supabase.from('study_materials').delete().eq('id', id);
            if (error) throw error;

            toast.success("Material deleted");
            fetchMaterials();
        } catch (error) {
            toast.error("Error deleting material");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">Study Materials</h1>
                    <p className="text-muted-foreground mt-1">Review and manage student uploads</p>
                </div>
            </div>

            <Card className="glass-card border-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
                <CardHeader className="relative">
                    <CardTitle>Uploaded Materials</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-white/10">
                                <TableHead>Title</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.map((item) => (
                                <TableRow key={item.id} className="hover:bg-white/5 transition-colors border-white/5">
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.subject}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-md bg-white/10 text-xs font-medium border border-white/10">
                                            {item.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                                                <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(item.id, item.file_url)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {materials.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No materials uploaded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
