import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, ShieldCheck, TrendingUp, Clock } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            FleetCommand
          </div>
          <Button onClick={handleLogin} className="rounded-full px-6">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              The Intelligent Way to Manage Your Fleet
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Your entire fleet <br/>
              <span className="text-primary">in one dashboard.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Track vehicle maintenance, monitor insurance policies, and analyze cashflow effortlessly. 
              Designed for modern fleet owners who demand control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="rounded-full text-lg h-14 px-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1" onClick={handleLogin}>
                Start Tracking Free
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-lg h-14 px-8 border-2">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-16">Everything you need to stay on road</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Service Reminders",
                  desc: "Never miss an oil change or tire rotation. Automated tracking based on mileage and time."
                },
                {
                  icon: ShieldCheck,
                  title: "Insurance Management",
                  desc: "Keep track of all policies in one place. Get notified before coverage expires."
                },
                {
                  icon: TrendingUp,
                  title: "Cashflow Analysis",
                  desc: "Visualize expenses and income per vehicle. Know exactly where your money goes."
                }
              ].map((feature, i) => (
                <Card key={i} className="p-8 border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card hover:-translate-y-1 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-t border-border/50">
           <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-4xl font-display font-bold mb-6">Data-driven decisions for your vehicles</h2>
               <p className="text-lg text-muted-foreground mb-8">
                 Stop using spreadsheets. Our platform gives you real-time insights into your fleet's performance, maintenance health, and financial standing.
               </p>
               <ul className="space-y-4">
                 {['Real-time mileage tracking', 'Expense categorization', 'Document storage (coming soon)'].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-lg font-medium">
                     <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="relative">
               {/* Decorative graphical element */}
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-3xl opacity-20 transform rotate-3"></div>
               <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                  {/* Mock UI */}
                  <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                    <div className="font-bold text-lg">Monthly Expenses</div>
                    <div className="text-sm text-muted-foreground">Last 30 Days</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fuel</span>
                      <span className="font-mono font-bold">$450.00</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-orange-400 rounded-full"></div>
                    </div>
                     <div className="flex justify-between text-sm">
                      <span>Maintenance</span>
                      <span className="font-mono font-bold">$120.00</span>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="opacity-70">© 2024 FleetCommand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
