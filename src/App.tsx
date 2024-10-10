import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from 'lucide-react'
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Sidebar } from "@/components/Sidebar"
import { Dashboard } from "@/components/Dashboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

function App() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', message: 'High CPU usage', severity: 'high', timestamp: '2023-04-20 10:30:00' },
    { id: '2', message: 'Low disk space', severity: 'medium', timestamp: '2023-04-20 11:15:00' },
    { id: '3', message: 'Service restart required', severity: 'low', timestamp: '2023-04-20 12:00:00' },
  ]);
  const [workOrderText, setWorkOrderText] = useState('');
  const [selectedStructure, setSelectedStructure] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'alerts'>('alerts');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const clearAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Cleared",
      description: "The alert has been successfully cleared.",
    });
  };

  const scheduleWorkOrder = (alertId: string) => {
    console.log(`Scheduling work order for alert ${alertId}: ${workOrderText}`);
    console.log(`Selected Structure: ${selectedStructure}`);
    console.log(`Selected Technician: ${selectedTechnician}`);
    toast({
      title: "Work Order Scheduled",
      description: "The work order has been successfully scheduled.",
    });
    setWorkOrderText('');
    setSelectedStructure('');
    setSelectedTechnician('');
    setIsDialogOpen(false);
  };

  const columns: ColumnDef<Alert>[] = [
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity") as string
        return (
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              severity === 'high' ? 'bg-red-500' :
              severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></span>
            {severity}
          </div>
        )
      },
    },
    {
      accessorKey: "message",
      header: "Message",
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const alert = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => clearAlert(alert.id)}>
              Clear Alert
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage Incident</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Incident</DialogTitle>
                </DialogHeader>
                <Select onValueChange={setSelectedStructure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structure1">Structure 1</SelectItem>
                    <SelectItem value="structure2">Structure 2</SelectItem>
                    <SelectItem value="structure3">Structure 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedTechnician}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech1">Technician 1</SelectItem>
                    <SelectItem value="tech2">Technician 2</SelectItem>
                    <SelectItem value="tech3">Technician 3</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Enter work order details..."
                  value={workOrderText}
                  onChange={(e) => setWorkOrderText(e.target.value)}
                />
                <Button onClick={() => scheduleWorkOrder(alert.id)}>Schedule WO</Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onNavigate={(view) => setCurrentView(view)}
      />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Zabbix Alert Manager</h1>
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <>
            <DataTable columns={columns} data={alerts} />
            {alerts.length === 0 && (
              <div className="text-center py-4">
                <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500">No alerts to display</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;