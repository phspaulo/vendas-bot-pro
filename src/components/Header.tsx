
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, LogOut, User } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import Logo from "@/components/Logo";

interface HeaderProps {
  user: SupabaseUser | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              <Star className="w-3 h-3 mr-1" />
              Produto Digital
            </Badge>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {user.email}
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
