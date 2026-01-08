import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import React from "react";

const HeaderDashboard = () => {
  return (
    <div>
      <header className="sticky top-0 z-50 bg-zinc-800">
        <div className="container mx-auto  py-4">
          <div className="flex items-center justify-between">
            <div className="pl-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Monitoramento em tempo real • Última atualização:{" "}
                {new Date().toLocaleTimeString("pt-BR")}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-green-600 border-green-500 mr-6"
            >
              <Activity className="w-4 h-4 mr-2" />
              Sistema Online
            </Badge>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderDashboard;
