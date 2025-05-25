
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShadcnTableRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnTableRenderer({ instance }: ShadcnTableRendererProps) {
  const { configuredValues } = instance;

  const caption = configuredValues?.caption;
  let headers: string[] = ['Header 1', 'Header 2']; // Default
  let rows: (string | number)[][] = [['Cell 1.1', 'Cell 1.2'], ['Cell 2.1', 'Cell 2.2']]; // Default

  if (typeof configuredValues?.headersJson === 'string') {
    try {
      const parsedHeaders = JSON.parse(configuredValues.headersJson);
      if (Array.isArray(parsedHeaders) && parsedHeaders.every(h => typeof h === 'string')) {
        headers = parsedHeaders;
      } else {
         console.warn("Table headersJson is not a valid array of strings.");
      }
    } catch (e) {
      console.error("Table: Error parsing headersJson", e);
      headers = ["Error: Invalid Headers JSON"];
    }
  } else if (Array.isArray(configuredValues?.headersJson)){
      headers = configuredValues.headersJson;
  }


  if (typeof configuredValues?.rowsJson === 'string') {
    try {
      const parsedRows = JSON.parse(configuredValues.rowsJson);
      if (Array.isArray(parsedRows) && parsedRows.every(row => Array.isArray(row))) {
        rows = parsedRows;
      } else {
        console.warn("Table rowsJson is not a valid array of arrays.");
      }
    } catch (e) {
      console.error("Table: Error parsing rowsJson", e);
      rows = [["Error: Invalid Rows JSON"]];
    }
  } else if (Array.isArray(configuredValues?.rowsJson)) {
    rows = configuredValues.rowsJson;
  }

  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{String(cell)}</TableCell>
            ))}
            {/* Fill empty cells if row has fewer cells than headers */}
            {row.length < headers.length && Array(headers.length - row.length).fill(null).map((_, emptyCellIndex) => (
                <TableCell key={`empty-${rowIndex}-${emptyCellIndex}`}></TableCell>
            ))}
          </TableRow>
        ))}
         {rows.length === 0 && (
            <TableRow>
                <TableCell colSpan={headers.length || 1} className="text-center text-muted-foreground">
                    No data rows configured.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
