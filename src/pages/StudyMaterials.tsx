import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  File,
  FileType,
  Folder
} from "lucide-react";

const materials = [
  { id: 1, name: "Data Structures Complete Notes", subject: "Data Structures", department: "CSE", semester: 3, unit: 1, type: "PDF", size: "2.4 MB", date: "2024-01-15" },
  { id: 2, name: "DBMS Unit 2 - ER Diagrams", subject: "Database Systems", department: "CSE", semester: 3, unit: 2, type: "PDF", size: "1.8 MB", date: "2024-01-14" },
  { id: 3, name: "CN Lab Manual", subject: "Computer Networks", department: "CSE", semester: 3, unit: 0, type: "PDF", size: "5.2 MB", date: "2024-01-13" },
  { id: 4, name: "OS Process Scheduling PPT", subject: "Operating Systems", department: "CSE", semester: 3, unit: 3, type: "PPT", size: "3.1 MB", date: "2024-01-12" },
  { id: 5, name: "DSA Practice Problems Set 1", subject: "Data Structures", department: "CSE", semester: 3, unit: 1, type: "PDF", size: "890 KB", date: "2024-01-11" },
  { id: 6, name: "SQL Queries Cheat Sheet", subject: "Database Systems", department: "CSE", semester: 3, unit: 3, type: "PDF", size: "456 KB", date: "2024-01-10" },
  { id: 7, name: "Network Protocols Overview", subject: "Computer Networks", department: "CSE", semester: 3, unit: 4, type: "PPT", size: "4.2 MB", date: "2024-01-09" },
  { id: 8, name: "Memory Management Notes", subject: "Operating Systems", department: "CSE", semester: 3, unit: 4, type: "PDF", size: "1.5 MB", date: "2024-01-08" },
];

const subjects = ["All Subjects", "Data Structures", "Database Systems", "Computer Networks", "Operating Systems"];
const units = ["All Units", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"];

const StudyMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterUnit, setFilterUnit] = useState("All Units");

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          material.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "All Subjects" || material.subject === filterSubject;
    const matchesUnit = filterUnit === "All Units" || 
                        (filterUnit === "Unit 1" && material.unit === 1) ||
                        (filterUnit === "Unit 2" && material.unit === 2) ||
                        (filterUnit === "Unit 3" && material.unit === 3) ||
                        (filterUnit === "Unit 4" && material.unit === 4) ||
                        (filterUnit === "Unit 5" && material.unit === 5);
    return matchesSearch && matchesSubject && matchesUnit;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-6 h-6 text-destructive" />;
      case "PPT":
        return <FileType className="w-6 h-6 text-status-partial" />;
      default:
        return <File className="w-6 h-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Study Materials</h1>
          <p className="text-muted-foreground mt-1">Access notes, presentations, and resources</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
          <Folder className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {materials.length} resources
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                className="h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredMaterials.map((material, index) => (
          <Card 
            key={material.id}
            variant="interactive"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {getFileIcon(material.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{material.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{material.subject}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {material.unit > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        Unit {material.unit}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs">
                      {material.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{material.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="campus" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No materials found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </Card>
      )}
    </div>
  );
};

export default StudyMaterials;
