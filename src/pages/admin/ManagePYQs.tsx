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

export default function ManagePYQs() {
    const [pyqs, setPyqs] = useState<any[]>([]);

    useEffect(() => {
        fetchPYQs();
    }, []);

    const fetchPYQs = async () => {
        const { data } = await supabase
            .from('previous_year_questions')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setPyqs(data);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this paper?")) return;

        try {
            const { error } = await supabase.from('previous_year_questions').delete().eq('id', id);
            if (error) throw error;

            toast.success("PYQ deleted");
            fetchPYQs();
        } catch (error) {
            toast.error("Error deleting PYQ");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">Question Papers</h1>
                    <p className="text-muted-foreground mt-1">Manage Previous Year Questions (PYQs)</p>
                </div>
            </div>

            <Card className="glass-card border-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 pointer-events-none" />
                <CardHeader className="relative">
                    <CardTitle>Uploaded Papers</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-white/10">
                                <TableHead>Subject</TableHead>
                                <TableHead>Exam Type</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pyqs.map((item) => (
                                <TableRow key={item.id} className="hover:bg-white/5 transition-colors border-white/5">
                                    <TableCell className="font-medium">{item.subject}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-md bg-white/10 text-xs font-medium border border-white/10">
                                            {item.exam_type}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.year}</TableCell>
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
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pyqs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No papers uploaded yet.
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
