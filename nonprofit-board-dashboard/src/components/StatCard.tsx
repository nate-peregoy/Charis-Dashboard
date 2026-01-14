import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "bg-green-50 text-green-700 border-green-200";
      case "negative":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <Badge className={`mt-2 ${getChangeColor()}`} variant="outline">
            {change}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
