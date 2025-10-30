'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export function CalendarGenerator() {
  const [calendarData, setCalendarData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    title: '',
    primaryColor: '#3b82f6',
  });

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="My Calendar 2024"
                value={calendarData.title}
                onChange={(e) => setCalendarData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                type="number"
                value={calendarData.year}
                onChange={(e) => setCalendarData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Month</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={calendarData.month}
                onChange={(e) => setCalendarData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>{name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={calendarData.primaryColor}
                onChange={(e) => setCalendarData(prev => ({ ...prev, primaryColor: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="bg-white p-8 rounded-lg border">
            <div className="text-center mb-6" style={{ color: calendarData.primaryColor }}>
              <h2 className="text-3xl font-bold">{calendarData.title || 'Calendar'}</h2>
              <h3 className="text-2xl mt-2">{monthNames[calendarData.month]} {calendarData.year}</h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold p-2" style={{ color: calendarData.primaryColor }}>
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="border p-2 h-16 text-center">{i + 1}</div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Calendar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
