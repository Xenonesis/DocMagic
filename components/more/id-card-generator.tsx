'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload } from 'lucide-react';

export function IdCardGenerator() {
  const [idCardData, setIdCardData] = useState({
    organization: '',
    cardType: 'employee',
    name: '',
    title: '',
    department: '',
    employeeId: '',
    email: '',
    validUntil: '',
    primaryColor: '#3b82f6',
    photoUrl: '',
  });

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
              <Label>Organization Name</Label>
              <Input
                placeholder="Company Name"
                value={idCardData.organization}
                onChange={(e) => setIdCardData(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Card Type</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={idCardData.cardType}
                onChange={(e) => setIdCardData(prev => ({ ...prev, cardType: e.target.value }))}
              >
                <option value="employee">Employee ID</option>
                <option value="student">Student ID</option>
                <option value="visitor">Visitor Badge</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={idCardData.name}
                onChange={(e) => setIdCardData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Job Title / Grade</Label>
              <Input
                placeholder="Senior Developer"
                value={idCardData.title}
                onChange={(e) => setIdCardData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="Engineering"
                value={idCardData.department}
                onChange={(e) => setIdCardData(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>ID Number</Label>
              <Input
                placeholder="EMP-12345"
                value={idCardData.employeeId}
                onChange={(e) => setIdCardData(prev => ({ ...prev, employeeId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="john@company.com"
                value={idCardData.email}
                onChange={(e) => setIdCardData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={idCardData.validUntil}
                onChange={(e) => setIdCardData(prev => ({ ...prev, validUntil: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={idCardData.primaryColor}
                onChange={(e) => setIdCardData(prev => ({ ...prev, primaryColor: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="flex justify-center bg-gray-100 p-8 rounded-lg">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden" style={{ aspectRatio: '3.5/2.25' }}>
              <div className="h-20 flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: idCardData.primaryColor }}>
                {idCardData.organization || 'Organization Name'}
              </div>
              <div className="p-6 flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                  Photo
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold">{idCardData.name || 'Name'}</h3>
                  <p className="text-sm text-gray-600">{idCardData.title || 'Title'}</p>
                  <p className="text-sm text-gray-600">{idCardData.department || 'Department'}</p>
                  <p className="text-xs text-gray-500 mt-2">ID: {idCardData.employeeId || 'ID Number'}</p>
                  {idCardData.validUntil && (
                    <p className="text-xs text-gray-500">Valid Until: {new Date(idCardData.validUntil).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download ID Card
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
