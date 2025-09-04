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
          <h1 className="text-5xl leading-normal font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Ubuntu Remote Agent
          </h1>
        </div>

        <div className="grid mb-8">
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate("/kiosk")}
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

        <div className="mt-8">
          <div className="p-4 rounded-xl from-slate-50 to-blue-50 shadow-sm text-center">
            <p className="text-sm font-medium text-gray-700">
              Built for{" "}
              <span className="text-blue-600 font-semibold">
                Ubuntu 22.04 LTS+
              </span>
              on{" "}
              <span className="text-purple-600 font-semibold">
                Intel mini PC
              </span>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Press{" "}
              <kbd className="px-2 py-1 bg-slate-200 rounded text-gray-700 shadow-inner">
                Alt + F4
              </kbd>{" "}
              to close the application
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
