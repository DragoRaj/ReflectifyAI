
import { StudentWellbeingSummary } from "@/types/school-types";
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
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Check } from "lucide-react";

interface StudentListProps {
  students: StudentWellbeingSummary[];
}

export default function StudentList({ students }: StudentListProps) {
  // Function to get trend icon
  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
      default:
        return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  // Function to get concern level badge
  const getConcernBadge = (student: StudentWellbeingSummary) => {
    const activeFlags = student.flags.filter(flag => !flag.resolved);
    
    if (activeFlags.length === 0) {
      return <Badge variant="outline" className="bg-green-50">No concerns</Badge>;
    }
    
    // Find the highest concern level
    if (activeFlags.some(flag => flag.concern_level === 'critical')) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3.5 w-3.5" />
          Critical
        </Badge>
      );
    }
    
    if (activeFlags.some(flag => flag.concern_level === 'moderate')) {
      return (
        <Badge variant="default" className="bg-amber-500 flex items-center gap-1">
          <AlertTriangle className="h-3.5 w-3.5" />
          Moderate
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3.5 w-3.5" />
        Mild
      </Badge>
    );
  };

  // Function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Wellbeing Score</TableHead>
          <TableHead>Trend</TableHead>
          <TableHead>Concerns</TableHead>
          <TableHead>Last Interaction</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No students found
            </TableCell>
          </TableRow>
        ) : (
          students.map((student) => (
            <TableRow key={student.student_id}>
              <TableCell>
                <div className="font-medium">
                  {student.first_name} {student.last_name}
                </div>
                <div className="text-sm text-slate-500">{student.email}</div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{student.average_wellbeing}</span>
                <span className="text-xs text-slate-500">/10</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getTrendIcon(student.trend)}
                  <span className="capitalize">{student.trend}</span>
                </div>
              </TableCell>
              <TableCell>{getConcernBadge(student)}</TableCell>
              <TableCell>{formatDate(student.last_interaction)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button variant="outline" size="sm">Schedule Check-in</Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
