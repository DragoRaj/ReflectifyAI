
import { ClassWellbeingSummary } from "@/types/school-types";
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class Name</TableHead>
          <TableHead>Grade Level</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Average Wellbeing</TableHead>
          <TableHead>Flagged Students</TableHead>
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
          classes.map((classItem) => (
            <TableRow key={classItem.class_id}>
              <TableCell>
                <div className="font-medium">{classItem.class_name}</div>
              </TableCell>
              <TableCell>{classItem.grade_level}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>{classItem.students_count}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{classItem.average_wellbeing}</span>
                <span className="text-xs text-slate-500">/10</span>
              </TableCell>
              <TableCell>
                {classItem.flagged_students_count > 0 ? (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{classItem.flagged_students_count}</span>
                  </div>
                ) : (
                  <span className="text-green-600">None</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
