import { useVehicle, useDeleteVehicle, useUpdateVehicle } from "@/hooks/use-vehicles";
import { useReminders, useCreateReminder, useDeleteReminder } from "@/hooks/use-reminders";
import { useRecords, useCreateRecord } from "@/hooks/use-records";
import { useTransactions, useCreateTransaction } from "@/hooks/use-transactions";
import { useInsurancePolicies, useCreateInsurance, useDeleteInsurance } from "@/hooks/use-insurance";
import { useRoute, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar as CalendarIcon, MoreVertical, Plus, Trash2, CheckCircle, AlertCircle, FileText, DollarSign, PenTool } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServiceReminderSchema, insertServiceRecordSchema, insertTransactionSchema, insertInsurancePolicySchema } from "@shared/routes";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function VehicleDetails() {
  const [, params] = useRoute("/vehicles/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  
  const { data: vehicle, isLoading } = useVehicle(id);
  const deleteVehicle = useDeleteVehicle();

  if (isLoading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">{vehicle.make} {vehicle.model}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{vehicle.year}</span>
              <span>•</span>
              <span className="font-mono">{vehicle.licensePlate}</span>
              <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                {vehicle.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><MoreVertical className="w-4 h-4 mr-2" />Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                if (confirm('Are you sure you want to delete this vehicle?')) {
                  deleteVehicle.mutate(id, { onSuccess: () => setLocation("/") });
                }
              }}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="rounded-lg h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="service" className="rounded-lg h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Service</TabsTrigger>
          <TabsTrigger value="financials" className="rounded-lg h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Financials</TabsTrigger>
          <TabsTrigger value="insurance" className="rounded-lg h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
           <OverviewTab vehicle={vehicle} />
        </TabsContent>

        <TabsContent value="service">
          <ServiceTab vehicleId={id} />
        </TabsContent>

        <TabsContent value="financials">
          <FinancialsTab vehicleId={id} />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceTab vehicleId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// === SUB-COMPONENTS FOR TABS ===

function OverviewTab({ vehicle }: { vehicle: any }) {
  const updateVehicle = useUpdateVehicle();
  const [mileage, setMileage] = useState(vehicle.currentMileage);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">VIN Number</Label>
              <div className="font-mono text-lg mt-1 select-all">{vehicle.vin || 'Not provided'}</div>
            </div>
             <div>
              <Label className="text-muted-foreground">License Plate</Label>
              <div className="font-mono text-lg mt-1">{vehicle.licensePlate || 'Not provided'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Current Mileage</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input 
                  type="number" 
                  value={mileage} 
                  onChange={(e) => setMileage(parseInt(e.target.value))}
                  className="max-w-[150px]"
                />
                <Button 
                  size="sm" 
                  disabled={mileage === vehicle.currentMileage}
                  onClick={() => updateVehicle.mutate({ id: vehicle.id, currentMileage: mileage })}
                >
                  Update
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1 capitalize">{vehicle.status}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="opacity-80 text-sm">Most common actions for this vehicle.</p>
          <Button variant="secondary" className="w-full justify-start gap-2" asChild>
            {/* Logic to open add fuel would be complex here without state lifting, simplified for demo */}
            <div className="cursor-pointer"><DollarSign className="w-4 h-4"/> Log Expense</div>
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2">
            <PenTool className="w-4 h-4"/> Record Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ServiceTab({ vehicleId }: { vehicleId: number }) {
  const { data: reminders } = useReminders(vehicleId);
  const { data: records } = useRecords(vehicleId);
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder();
  const createRecord = useCreateRecord();
  
  const [openReminder, setOpenReminder] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);

  // Forms setup
  const reminderForm = useForm({ resolver: zodResolver(insertServiceReminderSchema.omit({ vehicleId: true })) });
  const recordForm = useForm({ resolver: zodResolver(insertServiceRecordSchema.omit({ vehicleId: true })) });

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Reminders Section */}
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Service Reminders
            </CardTitle>
            <CardDescription>Upcoming maintenance tasks</CardDescription>
          </div>
          <Dialog open={openReminder} onOpenChange={setOpenReminder}>
            <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Reminder</DialogTitle></DialogHeader>
              <Form {...reminderForm}>
                <form onSubmit={reminderForm.handleSubmit((d) => createReminder.mutate({ vehicleId, ...d } as any, { onSuccess: () => setOpenReminder(false) }))} className="space-y-4">
                  <FormField control={reminderForm.control} name="serviceType" render={({ field }) => (
                    <FormItem><FormLabel>Service Type</FormLabel><FormControl><Input placeholder="Oil Change" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={reminderForm.control} name="intervalMileage" render={({ field }) => (
                      <FormItem><FormLabel>Interval (km)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={reminderForm.control} name="intervalMonths" render={({ field }) => (
                      <FormItem><FormLabel>Interval (Months)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full">Create Reminder</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders?.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 rounded-xl border bg-secondary/20">
                <div>
                  <h4 className="font-semibold">{reminder.serviceType}</h4>
                  <div className="text-sm text-muted-foreground mt-1 space-x-2">
                    {reminder.nextDueMileage && <span>Due at {reminder.nextDueMileage.toLocaleString()} km</span>}
                    {reminder.nextDueMileage && reminder.nextDueDate && <span>•</span>}
                    {reminder.nextDueDate && <span>Due on {format(new Date(reminder.nextDueDate), "MMM d, yyyy")}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteReminder.mutate({ id: reminder.id, vehicleId })}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {reminders?.length === 0 && <p className="text-center text-muted-foreground py-8">No active reminders.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Records Section */}
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Service History
            </CardTitle>
            <CardDescription>Past maintenance records</CardDescription>
          </div>
          <Dialog open={openRecord} onOpenChange={setOpenRecord}>
            <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Service Record</DialogTitle></DialogHeader>
              <Form {...recordForm}>
                <form onSubmit={recordForm.handleSubmit((d) => createRecord.mutate({ vehicleId, ...d } as any, { onSuccess: () => setOpenRecord(false) }))} className="space-y-4">
                  <FormField control={recordForm.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="Replaced brake pads" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <div className="grid grid-cols-2 gap-4">
                    <FormField control={recordForm.control} name="cost" render={({ field }) => (
                      <FormItem><FormLabel>Cost (cents)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={recordForm.control} name="mileage" render={({ field }) => (
                      <FormItem><FormLabel>Mileage</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={recordForm.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={recordForm.control} name="provider" render={({ field }) => (
                    <FormItem><FormLabel>Provider (Optional)</FormLabel><FormControl><Input placeholder="Jiffy Lube" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full">Save Record</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-border ml-4 space-y-8 py-2">
            {records?.map((record) => (
              <div key={record.id} className="relative pl-6">
                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary border border-background" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                   <div>
                     <p className="font-semibold text-sm">{record.description}</p>
                     <p className="text-xs text-muted-foreground">{format(new Date(record.date), 'MMM d, yyyy')} • {record.provider || 'Unknown Provider'}</p>
                   </div>
                   <div className="text-right mt-1 sm:mt-0">
                     <p className="font-mono font-bold text-sm">{(record.cost / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                     <p className="text-xs text-muted-foreground">{record.mileage.toLocaleString()} km</p>
                   </div>
                </div>
              </div>
            ))}
             {records?.length === 0 && <p className="text-muted-foreground text-sm ml-6">No service history recorded.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FinancialsTab({ vehicleId }: { vehicleId: number }) {
  const { data: transactions } = useTransactions(vehicleId);
  const createTx = useCreateTransaction();
  const [open, setOpen] = useState(false);
  const form = useForm({ resolver: zodResolver(insertTransactionSchema.omit({ vehicleId: true })) });

  const data = [
    { name: 'Income', value: transactions?.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) || 0 },
    { name: 'Expense', value: transactions?.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0) || 0 },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Transactions</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="sm">Add Transaction</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((d) => createTx.mutate({ vehicleId, ...d } as any, { onSuccess: () => setOpen(false) }))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="Fuel" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem><FormLabel>Amount (cents)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="Optional details" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                    <Button type="submit" className="w-full">Save</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="capitalize"><Badge variant="outline">{t.category}</Badge></TableCell>
                    <TableCell>{t.description || '-'}</TableCell>
                    <TableCell className={cn("text-right font-mono", t.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                      {t.type === 'income' ? '+' : '-'}{(t.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions?.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground h-24">No transactions recorded</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cashflow</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data[0].value === 0 && data[1].value === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => (value/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Income</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div>Expense</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InsuranceTab({ vehicleId }: { vehicleId: number }) {
  const { data: policies } = useInsurancePolicies(vehicleId);
  const createPolicy = useCreateInsurance();
  const deletePolicy = useDeleteInsurance();
  const [open, setOpen] = useState(false);
  const form = useForm({ resolver: zodResolver(insertInsurancePolicySchema.omit({ vehicleId: true })) });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Insurance Policies</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm">Add Policy</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Policy</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => createPolicy.mutate({ vehicleId, ...d } as any, { onSuccess: () => setOpen(false) }))} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="provider" render={({ field }) => (
                    <FormItem><FormLabel>Provider</FormLabel><FormControl><Input placeholder="Geico" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="policyNumber" render={({ field }) => (
                    <FormItem><FormLabel>Policy #</FormLabel><FormControl><Input placeholder="123-456" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <FormField control={form.control} name="premiumAmount" render={({ field }) => (
                    <FormItem><FormLabel>Premium (cents)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                  )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="coverageDetails" render={({ field }) => (
                    <FormItem><FormLabel>Details</FormLabel><FormControl><Input placeholder="Full coverage" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                <Button type="submit" className="w-full">Save Policy</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {policies?.map((policy) => (
             <Card key={policy.id} className="bg-secondary/20">
               <CardContent className="p-4 relative">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => deletePolicy.mutate({ id: policy.id, vehicleId })}>
                   <Trash2 className="w-4 h-4" />
                 </Button>
                 <div className="font-semibold text-lg">{policy.provider}</div>
                 <div className="text-sm text-muted-foreground font-mono mb-4">{policy.policyNumber}</div>
                 <div className="flex justify-between text-sm mb-2">
                   <span>Period</span>
                   <span>{format(new Date(policy.startDate), 'MMM yyyy')} - {format(new Date(policy.endDate), 'MMM yyyy')}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span>Premium</span>
                   <span className="font-bold">{(policy.premiumAmount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                 </div>
               </CardContent>
             </Card>
          ))}
          {policies?.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">No insurance policies added.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
