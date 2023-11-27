import { AttendanceRecord } from "@prisma/client";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { format } from "date-fns";
import {
  Check,
  CheckCheck,
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { AttendanceStatus } from "~/utils/constants";

import Link from "next/link";

type AttendanceRecordWithExtraInfo = AttendanceRecord & {
  studentFullName: string;
  moduleName: string;
};

export default function RecordTable({
  allAttendanceRecords,
  deleteAttendanceRecordById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allAttendanceRecords: AttendanceRecordWithExtraInfo[];
  deleteAttendanceRecordById: (id: { attendanceRecordId: string }) => void;
  idBeingDeleted: string | null;
  setIdBeingDeleted: (id: string | null) => void;
}) {
  return (
    <Table className="mt-4">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell>Attendance Record ID</TableHeaderCell>
          <TableHeaderCell>Student ID</TableHeaderCell>
          <TableHeaderCell>Student Name</TableHeaderCell>
          <TableHeaderCell>Lecture ID</TableHeaderCell>
          <TableHeaderCell>Module Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allAttendanceRecords?.map((record) => (
          <TableRow
            key={record.attendanceRecordId}
            className="[&>*]:text-foreground"
          >
            <TableCell className="">{record.attendanceRecordId}</TableCell>
            <TableCell className="">{record.studentId}</TableCell>
            <TableCell className="">{record.studentFullName}</TableCell>
            <TableCell className="">{record.lectureId}</TableCell>
            <TableCell className="">
              <Badge color="neutral" size="xs">
                {record.moduleName}
              </Badge>
            </TableCell>
            <TableCell className="">
              {record.status === AttendanceStatus.PRESENT && (
                <Badge color="green" size="sm" icon={CheckCheck}>
                  {record.status.toUpperCase()}
                </Badge>
              )}
              {record.status === AttendanceStatus.LATE && (
                <Badge color="amber" size="sm" icon={Check}>
                  {record.status.toUpperCase()}
                </Badge>
              )}
              {record.status === AttendanceStatus.ABSENT && (
                <Badge color="red" size="sm" icon={X}>
                  {record.status.toUpperCase()}
                </Badge>
              )}
            </TableCell>
            <TableCell className="">
              {format(record.timestamp, "dd-MMM-yyyy HH:mm:ss")}
            </TableCell>

            {/* Buttons to update or delete data */}
            <TableCell className="flex gap-2">
              {/* Dropdown Menu - contains actions for each student */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size={"icon"} variant={"ghost"} className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="#" className="flex">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View info
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert("Not implemented yet")}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      deleteAttendanceRecordById({
                        attendanceRecordId: record.attendanceRecordId,
                      });
                      setIdBeingDeleted(record.attendanceRecordId);
                    }}
                  >
                    {idBeingDeleted === record.attendanceRecordId && (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        size={14}
                      />
                    )}
                    {idBeingDeleted !== record.attendanceRecordId && (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
