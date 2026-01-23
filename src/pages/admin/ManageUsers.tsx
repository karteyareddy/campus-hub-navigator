import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserX, Shield, GraduationCap, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This will remove their profile and access.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            toast.success("User profile deleted successfully");
            setUsers(users.filter(u => u.id !== userId));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30 border-red-500/50"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
            case 'teacher':
                return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border-blue-500/50"><GraduationCap className="w-3 h-3 mr-1" /> Teacher</Badge>;
            default:
                return <Badge variant="outline" className="border-primary/50 text-foreground"><User className="w-3 h-3 mr-1" /> Student</Badge>;
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8"><div className="animate-spin w-6 h-6 border-2 border-primary rounded-full border-t-transparent"></div></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage access and roles</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-primary">{users.length} Total Users</span>
                </div>
            </div>

            <Card className="glass-card overflow-hidden border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
                <CardHeader className="relative">
                    <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-primary/10">
                                <TableHead>User Details</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-primary/5 transition-colors border-primary/5">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{user.full_name || 'Anonymous User'}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(user.role)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={user.role === 'admin'}
                                            title={user.role === 'admin' ? "Cannot delete admin" : "Delete user"}
                                        >
                                            {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
