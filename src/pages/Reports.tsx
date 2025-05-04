
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { ReportChart } from "@/components/reports/ReportChart";
import { ReportTable } from "@/components/reports/ReportTable";

const Reports = () => {
  const [reportType, setReportType] = useState<"checkouts" | "clearance" | "residents">("checkouts");

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="checkouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checkouts">Checkout Reports</TabsTrigger>
          <TabsTrigger value="clearance">Clearance Reports</TabsTrigger>
          <TabsTrigger value="residents">Resident Reports</TabsTrigger>
        </TabsList>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 days</div>
              <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportChart type={reportType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable type={reportType} />
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Reports;
