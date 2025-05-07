'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UNITS, PhysicsUnit, PhysicsTopic, SimulationInfo } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Beaker } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [expandedUnits, setExpandedUnits] = React.useState<Record<string, boolean>>(
    UNITS.reduce((acc, unit) => ({ ...acc, [unit.id]: true }), {})
  );
  
  const [expandedTopics, setExpandedTopics] = React.useState<Record<string, boolean>>({});

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const isTopicExpanded = (topicId: string) => {
    return expandedTopics[topicId] || false;
  };

  const isUnitExpanded = (unitId: string) => {
    return expandedUnits[unitId] || false;
  };

  const isSimulationActive = (path: string) => {
    return pathname === path;
  };

  const isTopicActive = (topic: PhysicsTopic) => {
    return topic.simulations.some(sim => isSimulationActive(sim.path));
  };

  const isUnitActive = (unit: PhysicsUnit) => {
    return unit.topics.some(isTopicActive);
  };

  return (
    <div className="w-64 h-screen bg-card border-r overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl mb-6">
          <Beaker className="w-6 h-6" />
          <span>Lucerna</span>
        </Link>
        
        <nav className="space-y-1">
          {UNITS.map(unit => (
            <div key={unit.id} className="space-y-1">
              <button
                onClick={() => toggleUnit(unit.id)}
                className={cn(
                  "flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md",
                  isUnitActive(unit) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <span>{unit.name}</span>
                {isUnitExpanded(unit.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {isUnitExpanded(unit.id) && (
                <div className="ml-4 space-y-1">
                  {unit.topics.map(topic => (
                    <div key={topic.id} className="space-y-1">
                      <button
                        onClick={() => toggleTopic(`${unit.id}-${topic.id}`)}
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md",
                          isTopicActive(topic) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        )}
                      >
                        <span>{topic.name}</span>
                        {isTopicExpanded(`${unit.id}-${topic.id}`) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {isTopicExpanded(`${unit.id}-${topic.id}`) && (
                        <div className="ml-4 space-y-1">
                          {topic.simulations.map(simulation => (
                            <Link
                              key={simulation.id}
                              href={simulation.path}
                              className={cn(
                                "block px-2 py-1.5 text-sm rounded-md",
                                isSimulationActive(simulation.path)
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              )}
                            >
                              {simulation.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}