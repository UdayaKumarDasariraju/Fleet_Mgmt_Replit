import { useDashboardStats } from "@/hooks/use-dashboard";
import { useVehicles, useCreateVehicle } from "@/hooks/use-vehicles";
import { useReminders } from "@/hooks/use-reminders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Car, DollarSign, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVehicleSchema, type InsertVehicle } from "@shared/routes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const createVehicle = useCreateVehicle();

  // Fetch reminders for all vehicles to show in tooltip
  const remindersData = vehicles?.map(v => useReminders(v.id)) || [];
  const allReminders = remindersData
    .filter(r => r.data)
    .flatMap((r, idx) => (r.data || []).map(reminder => ({ ...reminder, vehicleId: vehicles?.[idx].id, vehicleName: `${vehicles?.[idx].make} ${vehicles?.[idx].model}` })));

  const form = useForm<InsertVehicle>({
    resolver: zodResolver(insertVehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      status: "active",
      initialMileage: 0,
      vin: "",
      licensePlate: "",
    },
  });

  const onSubmit = (data: InsertVehicle) => {
    createVehicle.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <Card className="border-none shadow-md bg-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="text-3xl font-display font-bold tracking-tight">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );

  if (statsLoading || vehiclesLoading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return "₹ " + (cents / 100).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your fleet performance</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Enter the details of the vehicle you want to track.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="make" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl><Input placeholder="Toyota" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl><Input placeholder="Camry" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="initialMileage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Mileage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="licensePlate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl><Input placeholder="ABC-1234" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={createVehicle.isPending}>
                    {createVehicle.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                    Add Vehicle
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Vehicles" 
          value={stats?.totalVehicles || 0} 
          icon={Car} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard 
          title="Active Fleet" 
          value={stats?.activeVehicles || 0} 
          icon={Car} 
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard 
          title="Monthly Spend" 
          value={formatCurrency(stats?.totalMonthlyExpenses || 0)} 
          icon={DollarSign} 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard 
                title="Reminders Due" 
                value={stats?.upcomingRemindersCount || 0} 
                icon={AlertTriangle} 
                colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            {allReminders.length > 0 ? (
              <div className="space-y-2">
                <p className="font-semibold">Upcoming Reminders:</p>
                <ul className="text-sm space-y-1">
                  {allReminders.slice(0, 5).map((reminder, idx) => (
                    <li key={idx} className="text-xs">
                      <span className="font-medium">{reminder.vehicleName}</span>: {reminder.description || reminder.serviceType}
                    </li>
                  ))}
                  {allReminders.length > 5 && <li className="text-xs opacity-75">+{allReminders.length - 5} more...</li>}
                </ul>
              </div>
            ) : (
              <p className="text-sm">No upcoming reminders</p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Vehicle List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display">My Vehicles</h2>
        
        {vehicles?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
             <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
               <Car className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-medium">No vehicles yet</h3>
             <p className="text-muted-foreground mb-4">Add your first vehicle to start tracking.</p>
             <Button onClick={() => setIsDialogOpen(true)}>Add Vehicle</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles?.map(vehicle => (
              <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                <div className="group relative bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-muted-foreground text-sm">{vehicle.year} • {vehicle.licensePlate || 'No Plate'}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      vehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mileage</p>
                      <p className="font-mono font-medium text-lg mt-1">{vehicle.currentMileage.toLocaleString()} km</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">VIN</p>
                      <p className="font-mono text-sm mt-2 truncate text-muted-foreground">{vehicle.vin || 'Not Set'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
