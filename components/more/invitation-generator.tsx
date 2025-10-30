'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export function InvitationGenerator() {
  const [invitationData, setInvitationData] = useState({
    eventType: 'wedding',
    title: '',
    hosts: '',
    eventDetails: '',
    date: '',
    time: '',
    venue: '',
    rsvpInfo: '',
    backgroundColor: '#f8f9fa',
    accentColor: '#3b82f6',
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
              <Label>Event Type</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={invitationData.eventType}
                onChange={(e) => setInvitationData(prev => ({ ...prev, eventType: e.target.value }))}
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Party</option>
                <option value="corporate">Corporate Event</option>
                <option value="graduation">Graduation</option>
                <option value="baby-shower">Baby Shower</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                placeholder="Join Us for Our Wedding"
                value={invitationData.title}
                onChange={(e) => setInvitationData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Hosted By</Label>
              <Input
                placeholder="John & Jane Smith"
                value={invitationData.hosts}
                onChange={(e) => setInvitationData(prev => ({ ...prev, hosts: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={invitationData.date}
                onChange={(e) => setInvitationData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={invitationData.time}
                onChange={(e) => setInvitationData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input
                placeholder="Grand Hotel Ballroom"
                value={invitationData.venue}
                onChange={(e) => setInvitationData(prev => ({ ...prev, venue: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Event Details</Label>
              <Textarea
                placeholder="Additional event information..."
                value={invitationData.eventDetails}
                onChange={(e) => setInvitationData(prev => ({ ...prev, eventDetails: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>RSVP Information</Label>
              <Input
                placeholder="RSVP by email@example.com or call (555) 123-4567"
                value={invitationData.rsvpInfo}
                onChange={(e) => setInvitationData(prev => ({ ...prev, rsvpInfo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={invitationData.backgroundColor}
                onChange={(e) => setInvitationData(prev => ({ ...prev, backgroundColor: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <Input
                type="color"
                value={invitationData.accentColor}
                onChange={(e) => setInvitationData(prev => ({ ...prev, accentColor: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="flex justify-center bg-gray-100 p-8 rounded-lg">
            <div
              className="w-full max-w-md p-12 rounded-lg shadow-2xl text-center space-y-6"
              style={{ backgroundColor: invitationData.backgroundColor }}
            >
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-wider" style={{ color: invitationData.accentColor }}>
                  You Are Invited To
                </p>
                <h1 className="text-4xl font-bold" style={{ color: invitationData.accentColor }}>
                  {invitationData.title || 'Event Title'}
                </h1>
                {invitationData.hosts && (
                  <p className="text-lg">Hosted by {invitationData.hosts}</p>
                )}
              </div>

              <div className="py-6 space-y-3 border-t-2 border-b-2" style={{ borderColor: invitationData.accentColor }}>
                {invitationData.date && (
                  <p className="text-lg">
                    <span className="font-semibold">Date:</span> {new Date(invitationData.date).toLocaleDateString()}
                  </p>
                )}
                {invitationData.time && (
                  <p className="text-lg">
                    <span className="font-semibold">Time:</span> {invitationData.time}
                  </p>
                )}
                {invitationData.venue && (
                  <p className="text-lg">
                    <span className="font-semibold">Venue:</span> {invitationData.venue}
                  </p>
                )}
              </div>

              {invitationData.eventDetails && (
                <p className="text-sm">{invitationData.eventDetails}</p>
              )}

              {invitationData.rsvpInfo && (
                <div className="pt-4">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: invitationData.accentColor }}>
                    RSVP
                  </p>
                  <p className="text-sm">{invitationData.rsvpInfo}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Invitation
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
