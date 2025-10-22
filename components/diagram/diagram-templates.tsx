"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow, 
  GitBranch, 
  Database, 
  Network, 
  Users, 
  FileText,
  Sparkles,
  Copy,
  Eye,
  Check
} from "lucide-react";

interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  code: string;
  preview: string;
}

interface DiagramTemplatesProps {
  onSelectTemplate: (templateId: string, code: string) => void;
}

const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  {
    id: "flowchart",
    name: "Basic Flowchart",
    description: "Simple decision-making process flow",
    category: "Process",
    icon: <Workflow className="h-5 w-5" />,
    preview: "Start → Decision → Action → End",
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`
  },
  {
    id: "system-architecture",
    name: "System Architecture",
    description: "High-level system design diagram",
    category: "Architecture",
    icon: <Network className="h-5 w-5" />,
    preview: "Frontend → API → Database",
    code: `flowchart LR
    A[Frontend App] --> B[API Gateway]
    B --> C[Authentication Service]
    B --> D[Business Logic]
    D --> E[Database]
    D --> F[Cache]
    B --> G[External APIs]`
  },
  {
    id: "user-journey",
    name: "User Journey",
    description: "Map user experience and touchpoints",
    category: "UX",
    icon: <Users className="h-5 w-5" />,
    preview: "Discovery → Consideration → Purchase",
    code: `journey
    title User Journey
    section Discovery
      Visit Website: 5: User
      Browse Products: 4: User
      Read Reviews: 3: User
    section Purchase
      Add to Cart: 5: User
      Checkout: 4: User
      Payment: 3: User
    section Post-Purchase
      Receive Product: 5: User
      Leave Review: 4: User`
  },
  {
    id: "git-workflow",
    name: "Git Workflow",
    description: "Version control branching strategy",
    category: "Development",
    icon: <GitBranch className="h-5 w-5" />,
    preview: "Main → Feature → Merge",
    code: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout develop
    merge feature
    checkout main
    merge develop`
  },
  {
    id: "database-schema",
    name: "Database Schema",
    description: "Entity relationship diagram",
    category: "Database",
    icon: <Database className="h-5 w-5" />,
    preview: "Users → Orders → Products",
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
    PRODUCT ||--o{ LINE-ITEM : includes
    CATEGORY ||--o{ PRODUCT : contains`
  },
  {
    id: "sequence-diagram",
    name: "Sequence Diagram",
    description: "Interaction between system components",
    category: "Process",
    icon: <FileText className="h-5 w-5" />,
    preview: "User → System → Database",
    code: `sequenceDiagram
    participant U as User
    participant A as App
    participant API as API Server
    participant DB as Database
    
    U->>A: Login Request
    A->>API: Authenticate
    API->>DB: Verify Credentials
    DB-->>API: User Data
    API-->>A: Auth Token
    A-->>U: Login Success`
  },
  {
    id: "class-diagram",
    name: "Class Diagram",
    description: "Object-oriented design structure",
    category: "Development",
    icon: <Network className="h-5 w-5" />,
    preview: "Classes → Inheritance → Methods",
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
        +move()
    }
    class Dog {
        +String breed
        +bark()
        +wagTail()
    }
    class Cat {
        +String color
        +meow()
        +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`
  },
  {
    id: "state-diagram",
    name: "State Diagram",
    description: "System state transitions",
    category: "Process",
    icon: <Workflow className="h-5 w-5" />,
    preview: "Idle → Processing → Complete",
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : start
    Processing --> Complete : success
    Processing --> Error : failure
    Error --> Idle : retry
    Complete --> [*]`
  },
  {
    id: "mindmap",
    name: "Mind Map",
    description: "Hierarchical information structure",
    category: "Planning",
    icon: <Sparkles className="h-5 w-5" />,
    preview: "Central Idea → Branches → Details",
    code: `mindmap
  root((docverse Features))
    Documents
      Resumes
      Presentations
      Letters
      CVs
    AI Features
      Content Generation
      ATS Optimization
      Smart Templates
    Export Options
      PDF
      DOCX
      PPTX
    Collaboration
      Sharing
      Comments
      Version Control`
  }
];

const CATEGORIES = ["All", "Process", "Architecture", "Development", "Database", "UX", "Planning"];

export function DiagramTemplates({ onSelectTemplate }: DiagramTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = DIAGRAM_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyTemplateCode = async (template: DiagramTemplate) => {
    try {
      await navigator.clipboard.writeText(template.code);
      setCopiedTemplate(template.id);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (error) {
      console.error('Failed to copy template code:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
          Professional Diagram Templates
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          Choose from our collection of professionally designed diagram templates. 
          Each template includes optimized Mermaid syntax and best practices.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 glass-effect border border-yellow-400/30 rounded-lg focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/20 outline-none text-sm"
            />
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => {
          const count = category === "All" 
            ? DIAGRAM_TEMPLATES.length 
            : DIAGRAM_TEMPLATES.filter(t => t.category === category).length;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bolt-gradient text-white shadow-lg" : "glass-effect hover:border-yellow-400/50"}
            >
              {category}
              <Badge variant="secondary" className="ml-2 text-xs">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="text-center text-sm text-muted-foreground">
          Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-muted/30 mb-4">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No templates found matching your criteria</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <Card 
              key={template.id} 
              className="glass-effect border-yellow-400/20 hover:shadow-xl transition-all duration-300 group relative overflow-hidden hover:scale-105"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeIn 0.5s ease-out forwards'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bolt-gradient text-white group-hover:scale-110 transition-transform">
                      {template.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:bolt-gradient-text transition-all">
                  {template.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="p-3 bg-gradient-to-br from-muted/30 to-muted/20 rounded-lg border border-border/50 group-hover:border-yellow-400/30 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Flow Preview:</p>
                  <p className="text-sm font-mono text-foreground/80">{template.preview}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => onSelectTemplate(template.id, template.code)}
                    className="flex-1 bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyTemplateCode(template)}
                    className="glass-effect border-yellow-400/30 hover:border-yellow-400/60 hover:scale-110 transition-all"
                    title="Copy code to clipboard"
                  >
                    {copiedTemplate === template.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Code Preview */}
                <details className="group/details">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <span className="group-open/details:hidden">▶ View Code</span>
                    <span className="hidden group-open/details:inline">▼ Hide Code</span>
                  </summary>
                  <pre className="mt-2 p-3 bg-muted/50 rounded-lg text-xs overflow-x-auto border border-border/30">
                    <code className="text-foreground/80">{template.code}</code>
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="glass-effect p-6 rounded-xl border border-yellow-400/20 bg-blue-50/10">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Getting Started with Mermaid
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Basic Syntax:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>flowchart TD</code> - Top-down flowchart</li>
              <li>• <code>A[Rectangle]</code> - Rectangle node</li>
              <li>• <code>B{"{Diamond}"}</code> - Decision node</li>
              <li>• <code>A --&gt; B</code> - Arrow connection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Diagram Types:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>flowchart</code> - Process flows</li>
              <li>• <code>sequenceDiagram</code> - Interactions</li>
              <li>• <code>classDiagram</code> - OOP structures</li>
              <li>• <code>erDiagram</code> - Database schemas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}