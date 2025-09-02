
import { Monitor, Globe, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto animate-slide-up">
        <div className="mb-8">
          <Monitor className="w-20 h-20 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Ubuntu Remote Agent
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Remote device monitoring and management portal for Ubuntu Desktop endpoints
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/login')}
          >
            <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Management Portal</h3>
            <p className="text-muted-foreground mb-4">
              Monitor and manage all connected Ubuntu devices with real-time metrics
            </p>
            <Button variant="outline" className="w-full">
              Open Portal
            </Button>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/kiosk')}
          >
            <Wifi className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Kiosk Mode</h3>
            <p className="text-muted-foreground mb-4">
              Device-side interface for network configuration and connectivity
            </p>
            <Button variant="outline" className="w-full">
              Launch Kiosk
            </Button>
          </Card>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Built for Ubuntu 22.04 LTS+ on Intel mini PC architecture</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
