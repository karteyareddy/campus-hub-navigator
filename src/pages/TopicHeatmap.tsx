import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, FileText, BookOpen, Info } from "lucide-react";

const heatmapData = [
  {
    unit: "Unit 1: Introduction to DS",
    topics: [
      { name: "Arrays & Strings", importance: "high", pyqCount: 12, notesAvailable: true },
      { name: "Time Complexity", importance: "very-high", pyqCount: 18, notesAvailable: true },
      { name: "Space Complexity", importance: "medium", pyqCount: 8, notesAvailable: true },
      { name: "Recursion Basics", importance: "high", pyqCount: 15, notesAvailable: true },
    ],
  },
  {
    unit: "Unit 2: Linked Lists",
    topics: [
      { name: "Singly Linked List", importance: "very-high", pyqCount: 20, notesAvailable: true },
      { name: "Doubly Linked List", importance: "high", pyqCount: 14, notesAvailable: true },
      { name: "Circular Linked List", importance: "medium", pyqCount: 6, notesAvailable: false },
      { name: "List Applications", importance: "low", pyqCount: 3, notesAvailable: true },
    ],
  },
  {
    unit: "Unit 3: Stacks & Queues",
    topics: [
      { name: "Stack Operations", importance: "very-high", pyqCount: 22, notesAvailable: true },
      { name: "Queue Operations", importance: "high", pyqCount: 16, notesAvailable: true },
      { name: "Priority Queue", importance: "high", pyqCount: 11, notesAvailable: true },
      { name: "Infix to Postfix", importance: "very-high", pyqCount: 19, notesAvailable: true },
    ],
  },
  {
    unit: "Unit 4: Trees",
    topics: [
      { name: "Binary Trees", importance: "very-high", pyqCount: 25, notesAvailable: true },
      { name: "BST Operations", importance: "very-high", pyqCount: 23, notesAvailable: true },
      { name: "AVL Trees", importance: "high", pyqCount: 14, notesAvailable: true },
      { name: "B-Trees", importance: "medium", pyqCount: 7, notesAvailable: false },
    ],
  },
  {
    unit: "Unit 5: Graphs",
    topics: [
      { name: "Graph Traversal (BFS/DFS)", importance: "very-high", pyqCount: 28, notesAvailable: true },
      { name: "Shortest Path", importance: "high", pyqCount: 15, notesAvailable: true },
      { name: "Minimum Spanning Tree", importance: "high", pyqCount: 12, notesAvailable: true },
      { name: "Topological Sort", importance: "medium", pyqCount: 8, notesAvailable: true },
    ],
  },
];

const getImportanceColor = (importance: string) => {
  switch (importance) {
    case "very-high":
      return "bg-heat-high";
    case "high":
      return "bg-heat-medium-high";
    case "medium":
      return "bg-heat-medium";
    case "low":
      return "bg-heat-low";
    default:
      return "bg-muted";
  }
};

const getImportanceText = (importance: string) => {
  switch (importance) {
    case "very-high":
      return "Very High";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Unknown";
  }
};

const TopicHeatmap = () => {
  const [selectedTopic, setSelectedTopic] = useState<{
    unit: string;
    topic: typeof heatmapData[0]["topics"][0];
  } | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Topic Importance Heatmap</h1>
          <p className="text-muted-foreground mt-1">AI-powered analysis of exam importance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-campus-purple/10 rounded-lg">
          <Flame className="w-4 h-4 text-campus-purple" />
          <span className="text-sm font-medium text-campus-purple">
            Data Structures
          </span>
        </div>
      </div>

      {/* Legend */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm font-medium text-foreground">Importance Level:</span>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-heat-high" />
                <span className="text-sm text-muted-foreground">Very High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-heat-medium-high" />
                <span className="text-sm text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-heat-medium" />
                <span className="text-sm text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-heat-low" />
                <span className="text-sm text-muted-foreground">Low</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Heatmap Grid */}
        <div className="lg:col-span-2 space-y-4">
          {heatmapData.map((unit, unitIndex) => (
            <Card 
              key={unit.unit} 
              variant="glass"
              className="animate-slide-up"
              style={{ animationDelay: `${unitIndex * 0.1}s`, opacity: 0 }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{unit.unit}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {unit.topics.map((topic) => (
                    <button
                      key={topic.name}
                      onClick={() => setSelectedTopic({ unit: unit.unit, topic })}
                      className={`p-4 rounded-xl text-left transition-all duration-200 hover:scale-105 hover:shadow-lg ${getImportanceColor(topic.importance)} ${
                        selectedTopic?.topic.name === topic.name 
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' 
                          : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-primary-foreground leading-tight">
                        {topic.name}
                      </p>
                      <p className="text-xs text-primary-foreground/80 mt-1">
                        {topic.pyqCount} PYQs
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Topic Details Panel */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Topic Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTopic ? (
                <div className="space-y-4 animate-scale-in">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {selectedTopic.topic.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTopic.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-primary-foreground ${getImportanceColor(selectedTopic.topic.importance)}`}>
                      {getImportanceText(selectedTopic.topic.importance)} Importance
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">PYQ Count</span>
                      <span className="font-semibold text-foreground">{selectedTopic.topic.pyqCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Notes Available</span>
                      <span className={`font-semibold ${selectedTopic.topic.notesAvailable ? 'text-status-available' : 'text-status-busy'}`}>
                        {selectedTopic.topic.notesAvailable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="campus" size="sm" className="w-full">
                      <FileText className="w-4 h-4" />
                      View PYQs
                    </Button>
                    {selectedTopic.topic.notesAvailable && (
                      <Button variant="outline" size="sm" className="w-full">
                        <BookOpen className="w-4 h-4" />
                        View Notes
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Click on a topic to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TopicHeatmap;
