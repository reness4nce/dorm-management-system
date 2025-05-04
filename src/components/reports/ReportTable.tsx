
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  interface ReportTableProps {
    type: "checkouts" | "clearance" | "residents";
  }
  
  // Sample data - in a real app, this would come from your backend
  const data = [
    { id: 1, date: "2024-04-27", status: "Approved", requestor: "John Doe" },
    { id: 2, date: "2024-04-26", status: "Pending", requestor: "Jane Smith" },
    { id: 3, date: "2024-04-25", status: "Rejected", requestor: "Bob Johnson" },
  ];
  
  export const ReportTable = ({ type }: ReportTableProps) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Requestor</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.requestor}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  