
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { useState, useEffect } from 'react';

interface ShadcnCalendarRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnCalendarRenderer({ instance }: ShadcnCalendarRendererProps) {
  const { configuredValues } = instance;

  const mode = configuredValues?.mode as CalendarProps['mode'] || 'single';
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    configuredValues?.selectedDate ? new Date(configuredValues.selectedDate) : new Date()
  );
  
  useEffect(() => {
    if (configuredValues?.selectedDate) {
      const newDate = new Date(configuredValues.selectedDate);
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      }
    } else {
       setSelectedDate(new Date()); // Default to today if no valid date
    }
  }, [configuredValues?.selectedDate]);


  // For 'multiple' or 'range' mode, selectedDate would need different handling
  // This basic renderer primarily supports 'single' mode for display.
  return (
    <Calendar
      mode={mode}
      selected={selectedDate}
      onSelect={mode === 'single' ? setSelectedDate : undefined} // Basic select for single mode
      className="rounded-md border"
    />
  );
}
