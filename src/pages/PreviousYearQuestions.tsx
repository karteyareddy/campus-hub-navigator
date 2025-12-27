import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, 
  Download, 
  Eye, 
  Search,
  Calendar,
  FileText
} from "lucide-react";

const pyqData = [
  { id: 1, subject: "Data Structures", year: 2023, regulation: "R20", examType: "Mid-1", semester: 3 },
  { id: 2, subject: "Data Structures", year: 2023, regulation: "R20", examType: "Mid-2", semester: 3 },
  { id: 3, subject: "Data Structures", year: 2023, regulation: "R20", examType: "End Sem", semester: 3 },
  { id: 4, subject: "Database Systems", year: 2023, regulation: "R20", examType: "Mid-1", semester: 3 },
  { id: 5, subject: "Database Systems", year: 2023, regulation: "R20", examType: "End Sem", semester: 3 },
  { id: 6, subject: "Computer Networks", year: 2023, regulation: "R20", examType: "Mid-1", semester: 3 },
  { id: 7, subject: "Computer Networks", year: 2023, regulation: "R20", examType: "End Sem", semester: 3 },
  { id: 8, subject: "Data Structures", year: 2022, regulation: "R20", examType: "End Sem", semester: 3 },
  { id: 9, subject: "Data Structures", year: 2022, regulation: "R18", examType: "End Sem", semester: 3 },
  { id: 10, subject: "Operating Systems", year: 2023, regulation: "R20", examType: "Mid-1", semester: 3 },
  { id: 11, subject: "Operating Systems", year: 2023, regulation: "R20", examType: "End Sem", semester: 3 },
  { id: 12, subject: "Database Systems", year: 2022, regulation: "R20", examType: "End Sem", semester: 3 },
];

const subjects = ["All Subjects", "Data Structures", "Database Systems", "Computer Networks", "Operating Systems"];
const years = ["All Years", "2023", "2022", "2021"];
const regulations = ["All Regulations", "R20", "R18"];
const examTypes = ["All Types", "Mid-1", "Mid-2", "End Sem"];

const PreviousYearQuestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterRegulation, setFilterRegulation] = useState("All Regulations");
  const [filterExamType, setFilterExamType] = useState("All Types");

  const filteredPYQs = pyqData.filter(pyq => {
    const matchesSearch = pyq.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "All Subjects" || pyq.subject === filterSubject;
    const matchesYear = filterYear === "All Years" || pyq.year.toString() === filterYear;
    const matchesRegulation = filterRegulation === "All Regulations" || pyq.regulation === filterRegulation;
    const matchesExamType = filterExamType === "All Types" || pyq.examType === filterExamType;
    return matchesSearch && matchesSubject && matchesYear && matchesRegulation && matchesExamType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Previous Year Questions</h1>
          <p className="text-muted-foreground mt-1">Access past exam papers for practice</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
          <HelpCircle className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">
            {pyqData.length} papers available
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject..."
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
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={filterRegulation}
                onChange={(e) => setFilterRegulation(e.target.value)}
                className="h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {regulations.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
              <select
                value={filterExamType}
                onChange={(e) => setFilterExamType(e.target.value)}
                className="h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PYQ Table */}
      <Card variant="glass" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-left text-sm font-semibold text-foreground">Subject</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Year</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Regulation</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Exam Type</th>
                <th className="p-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPYQs.map((pyq, index) => (
                <tr 
                  key={pyq.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.03}s`, opacity: 0 }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{pyq.subject}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {pyq.year}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {pyq.regulation}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      pyq.examType === 'End Sem' 
                        ? 'bg-campus-purple/10 text-campus-purple' 
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {pyq.examType}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredPYQs.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No papers found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </Card>
      )}
    </div>
  );
};

export default PreviousYearQuestions;
