'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, X } from 'lucide-react';

interface ContractData {
  type: string;
  parties: { name: string; role: string }[];
  effectiveDate: string;
  expirationDate: string;
  terms: string[];
  customClauses: string[];
}

export function ContractGenerator() {
  const [contractData, setContractData] = useState<ContractData>({
    type: 'service',
    parties: [{ name: '', role: 'Client' }, { name: '', role: 'Service Provider' }],
    effectiveDate: '',
    expirationDate: '',
    terms: [],
    customClauses: [],
  });

  const contractTemplates = {
    service: 'Service Agreement',
    employment: 'Employment Contract',
    nda: 'Non-Disclosure Agreement',
    freelance: 'Freelance Contract',
    rental: 'Rental Agreement',
  };

  const commonClauses = [
    'Payment Terms',
    'Confidentiality',
    'Intellectual Property Rights',
    'Termination Clause',
    'Dispute Resolution',
    'Force Majeure',
    'Liability Limitations',
    'Governing Law',
  ];

  const addParty = () => {
    setContractData(prev => ({
      ...prev,
      parties: [...prev.parties, { name: '', role: '' }],
    }));
  };

  const removeParty = (index: number) => {
    setContractData(prev => ({
      ...prev,
      parties: prev.parties.filter((_, i) => i !== index),
    }));
  };

  const toggleClause = (clause: string) => {
    setContractData(prev => ({
      ...prev,
      terms: prev.terms.includes(clause)
        ? prev.terms.filter(t => t !== clause)
        : [...prev.terms, clause],
    }));
  };

  const addCustomClause = () => {
    setContractData(prev => ({
      ...prev,
      customClauses: [...prev.customClauses, ''],
    }));
  };

  const updateCustomClause = (index: number, value: string) => {
    setContractData(prev => ({
      ...prev,
      customClauses: prev.customClauses.map((clause, i) => i === index ? value : clause),
    }));
  };

  const removeCustomClause = (index: number) => {
    setContractData(prev => ({
      ...prev,
      customClauses: prev.customClauses.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="clauses">Clauses</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contract Type</h3>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={contractData.type}
              onChange={(e) => setContractData(prev => ({ ...prev, type: e.target.value }))}
            >
              {Object.entries(contractTemplates).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Parties</h3>
              <Button onClick={addParty} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Party
              </Button>
            </div>
            {contractData.parties.map((party, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Party Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={party.name}
                    onChange={(e) => {
                      const newParties = [...contractData.parties];
                      newParties[index].name = e.target.value;
                      setContractData(prev => ({ ...prev, parties: newParties }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Client"
                      value={party.role}
                      onChange={(e) => {
                        const newParties = [...contractData.parties];
                        newParties[index].role = e.target.value;
                        setContractData(prev => ({ ...prev, parties: newParties }));
                      }}
                    />
                    {contractData.parties.length > 2 && (
                      <Button onClick={() => removeParty(index)} variant="destructive" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Duration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={contractData.effectiveDate}
                  onChange={(e) => setContractData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date (Optional)</Label>
                <Input
                  type="date"
                  value={contractData.expirationDate}
                  onChange={(e) => setContractData(prev => ({ ...prev, expirationDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clauses" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Standard Clauses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonClauses.map((clause) => (
                <label
                  key={clause}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={contractData.terms.includes(clause)}
                    onChange={() => toggleClause(clause)}
                    className="w-4 h-4"
                  />
                  <span>{clause}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Custom Clauses</h3>
              <Button onClick={addCustomClause} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Clause
              </Button>
            </div>
            {contractData.customClauses.map((clause, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  placeholder="Enter your custom clause..."
                  value={clause}
                  onChange={(e) => updateCustomClause(index, e.target.value)}
                  rows={3}
                />
                <Button onClick={() => removeCustomClause(index)} variant="destructive" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border min-h-[600px]">
              <ContractPreview contractData={contractData} />
            </div>

            <div className="flex justify-center gap-4">
              <Button className="bolt-gradient text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Contract
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContractPreview({ contractData }: { contractData: ContractData }) {
  const contractTemplates = {
    service: 'SERVICE AGREEMENT',
    employment: 'EMPLOYMENT CONTRACT',
    nda: 'NON-DISCLOSURE AGREEMENT',
    freelance: 'FREELANCE CONTRACT',
    rental: 'RENTAL AGREEMENT',
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold uppercase">{contractTemplates[contractData.type as keyof typeof contractTemplates]}</h1>
        <p className="text-sm text-gray-600">Effective Date: {contractData.effectiveDate || '[Date]'}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">PARTIES</h2>
        <p>This Agreement is entered into by and between:</p>
        <ul className="list-disc pl-6 space-y-2">
          {contractData.parties.map((party, index) => (
            <li key={index}>
              <strong>{party.name || `[Party ${index + 1} Name]`}</strong> ("{party.role || `Party ${index + 1}`}")
            </li>
          ))}
        </ul>
      </div>

      {contractData.terms.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">TERMS AND CONDITIONS</h2>
          {contractData.terms.map((term, index) => (
            <div key={index}>
              <h3 className="font-semibold">{index + 1}. {term}</h3>
              <p className="text-sm text-gray-600 mt-1">
                [Details regarding {term.toLowerCase()} will be specified here]
              </p>
            </div>
          ))}
        </div>
      )}

      {contractData.customClauses.filter(c => c.trim()).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">ADDITIONAL PROVISIONS</h2>
          {contractData.customClauses.filter(c => c.trim()).map((clause, index) => (
            <p key={index} className="text-sm">{clause}</p>
          ))}
        </div>
      )}

      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-lg font-bold">SIGNATURES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {contractData.parties.map((party, index) => (
            <div key={index} className="space-y-2">
              <p className="font-semibold">{party.name || `[Party ${index + 1} Name]`}</p>
              <div className="border-t-2 border-black pt-1">
                <p className="text-xs text-gray-600">Signature</p>
              </div>
              <div className="border-t-2 border-black pt-1">
                <p className="text-xs text-gray-600">Date</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
