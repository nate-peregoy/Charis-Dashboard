import { Button } from "./ui/button";

export default function DashboardHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">Charis Foundation</h1>
            <p className="text-sm text-muted-foreground">Board of Directors Dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              New Initiative
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
