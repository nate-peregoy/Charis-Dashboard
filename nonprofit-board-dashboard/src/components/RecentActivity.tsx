import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface Activity {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  date: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Ministry Leadership Development Grant",
    description: "Approved $75,000 grant for leadership training program serving 12 partner organizations",
    status: "completed",
    date: "3 days ago"
  },
  {
    id: 2,
    title: "Faith & Work Initiative - Nashville",
    description: "Partnership with Nashville Institute for Faith and Work expanding to reach 500+ professionals",
    status: "in-progress",
    date: "1 week ago"
  },
  {
    id: 3,
    title: "International Missions Support",
    description: "Evaluating grant applications from 8 gospel-driven organizations across 4 countries",
    status: "pending",
    date: "2 weeks ago"
  },
  {
    id: 4,
    title: "Q4 Grantmaking Review",
    description: "Completed strategic review and approved $425,000 in grants to 15 partner organizations",
    status: "completed",
    date: "3 weeks ago"
  }
];

export default function RecentActivity() {
  const getStatusVariant = (status: Activity['status']) => {
    switch (status) {
      case "completed":
        return { variant: "default" as const, label: "Completed" };
      case "in-progress":
        return { variant: "secondary" as const, label: "In Progress" };
      case "pending":
        return { variant: "outline" as const, label: "Pending" };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and initiatives</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const status = getStatusVariant(activity.status);
            return (
              <div key={activity.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <Badge variant={status.variant} className="ml-2 shrink-0">
                  {status.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
