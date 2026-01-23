import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function ManageClassrooms() {
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        room_no: "",
        building: "",
        capacity: "",
        type: "Lecture Hall",
        is_available: true,
        amenities: [] as string[]
    });

    const amenitiesList = ["projector", "wifi", "ac", "computers", "mic"];

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        const { data } = await supabase.from('classrooms').select('*').order('room_no');
        if (data) setClassrooms(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                room_no: formData.room_no,
                building: formData.building,
                capacity: parseInt(formData.capacity),
                type: formData.type,
                is_available: formData.is_available,
                amenities: formData.amenities
            };

            if (editingId) {
                const { error } = await supabase
                    .from('classrooms')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
                toast.success("Classroom updated");
            } else {
                const { error } = await supabase
                    .from('classrooms')
                    .insert(payload);
                if (error) throw error;
                toast.success("Classroom created");
            }

            setOpen(false);
            resetForm();
            fetchClassrooms();
        } catch (error) {
            toast.error("Error saving classroom");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this classroom?")) return;
        const { error } = await supabase.from('classrooms').delete().eq('id', id);
        if (!error) {
            toast.success("Classroom deleted");
            fetchClassrooms();
        }
    };

    const resetForm = () => {
        setFormData({
            room_no: "",
            building: "",
            capacity: "",
            type: "Lecture Hall",
            is_available: true,
            amenities: []
        });
        setEditingId(null);
    };

    const handleEdit = (room: any) => {
        setFormData({
            room_no: room.room_no,
            building: room.building,
            capacity: room.capacity.toString(),
            type: room.type,
            is_available: room.is_available,
            amenities: room.amenities || []
        });
        setEditingId(room.id);
        setOpen(true);
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-400/10 to-emerald-500/10 p-6 rounded-2xl backdrop-blur-sm border border-green-500/10">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">Classroom Manager</h1>
                    <p className="text-muted-foreground mt-1">Configure campus spaces</p>
                </div>
                <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20">
                            <Plus className="w-4 h-4" /> Add Classroom
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-none text-foreground">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Classroom" : "Add Classroom"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Room No</Label>
                                    <Input
                                        value={formData.room_no}
                                        onChange={e => setFormData({ ...formData, room_no: e.target.value })}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Building</Label>
                                    <Input
                                        value={formData.building}
                                        onChange={e => setFormData({ ...formData, building: e.target.value })}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Capacity</Label>
                                    <Input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={val => setFormData({ ...formData, type: val })}
                                    >
                                        <SelectTrigger className="bg-background/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                                            <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                                            <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Amenities</Label>
                                <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-background/30 border border-white/5">
                                    {amenitiesList.map(item => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={item}
                                                checked={formData.amenities.includes(item)}
                                                onCheckedChange={() => toggleAmenity(item)}
                                            />
                                            <label htmlFor={item} className="text-sm font-medium leading-none cursor-pointer">
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="available"
                                    checked={formData.is_available}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked as boolean })}
                                />
                                <label htmlFor="available" className="cursor-pointer">Currently Available</label>
                            </div>

                            <Button type="submit" className="w-full">{editingId ? "Update" : "Create"}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classrooms.map((room) => (
                    <Card key={room.id} className="relative group glass-card border-none overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 pointer-events-none`}>
                            {/* Visual indicator logic could go here */}
                        </div>

                        <CardHeader className="pb-2 relative">
                            <CardTitle className="flex justify-between items-center">
                                <span className="text-xl tracking-tight">{room.room_no}</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${room.is_available ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                    {room.is_available ? 'Available' : 'Occupied'}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> {room.building}</p>
                                <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent/50" /> {room.type} • {room.capacity} seats</p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {room.amenities?.map((a: string) => (
                                        <span key={a} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-wider text-muted-foreground">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 backdrop-blur-md p-1 rounded-lg">
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={() => handleEdit(room)}>
                                    <Edit className="w-4 h-4 text-blue-400" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={() => handleDelete(room.id)}>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
