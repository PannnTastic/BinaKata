import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
  trend,
  className
}) => {
  const variants = {
    default: "border-gray-200 bg-gray-50",
    primary: "border-blue-200 bg-blue-50",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    danger: "border-red-200 bg-red-50"
  };

  const valueColors = {
    default: "text-gray-900",
    primary: "text-blue-900",
    success: "text-green-900",
    warning: "text-yellow-900",
    danger: "text-red-900"
  };

  const iconColors = {
    default: "text-gray-600",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };

  const trendIcons = {
    up: "↗️",
    down: "↘️",
    stable: "➡️"
  };

  return (
    <Card className={cn("border", variants[variant], className)} padding="md">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={cn("text-sm font-medium", iconColors[variant])}>
            {title}
          </div>
          {Icon && <Icon className={cn("w-4 h-4", iconColors[variant])} />}
        </div>
        
        <div className="space-y-1">
          <div className={cn("text-3xl font-bold", valueColors[variant])}>
            {value}
          </div>
          
          <div className="flex items-center gap-2">
            {description && (
              <p className={cn("text-xs", iconColors[variant])}>
                {description}
              </p>
            )}
            {trend && (
              <span className="text-xs">
                {trendIcons[trend]}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;