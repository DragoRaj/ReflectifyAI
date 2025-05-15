
import { ClassWellbeingSummary } from "@/types/school-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, AlertTriangle } from "lucide-react";

interface ClassListProps {
  classes: ClassWellbeingSummary[];
}

export default function ClassList({ classes }: ClassListProps) {
  // Function to render wellbeing indicator colors
  const getWellbeingIndicator = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Wellbeing Score</TableHead>
          <TableHead>Students with Concerns</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No classes found
            </TableCell>
          </TableRow>
        ) : (
          classes.map((cls) => (
            <TableRow key={cls.class_id}>
              <TableCell>
                <div className="font-medium">
                  {cls.class_name}
                </div>
              </TableCell>
              <TableCell>
                {cls.grade_level}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{cls.students_count}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getWellbeingIndicator(cls.average_wellbeing)}`}></div>
                  <span className="font-medium">{cls.average_wellbeing}</span>
                  <span className="text-xs text-slate-500">/10</span>
                </div>
              </TableCell>
              <TableCell>
                {cls.flagged_students_count > 0 ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {cls.flagged_students_count} student{cls.flagged_students_count !== 1 ? 's' : ''}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50">No concerns</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Class</Button>
                  <Button variant="outline" size="sm">Manage Students</Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
