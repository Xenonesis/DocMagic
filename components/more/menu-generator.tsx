'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus } from 'lucide-react';

export function MenuGenerator() {
  const [menuData, setMenuData] = useState({
    restaurantName: '',
    categories: [] as { name: string; items: { name: string; description: string; price: string }[] }[],
  });

  const addCategory = () => {
    setMenuData(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', items: [] }],
    }));
  };

  const addItem = (categoryIndex: number) => {
    const newCategories = [...menuData.categories];
    newCategories[categoryIndex].items.push({ name: '', description: '', price: '' });
    setMenuData(prev => ({ ...prev, categories: newCategories }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Restaurant Name</Label>
            <Input
              placeholder="My Restaurant"
              value={menuData.restaurantName}
              onChange={(e) => setMenuData(prev => ({ ...prev, restaurantName: e.target.value }))}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Categories</h3>
              <Button onClick={addCategory} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
            {menuData.categories.map((category, catIndex) => (
              <div key={catIndex} className="p-4 border rounded-lg space-y-4">
                <Input
                  placeholder="Category Name (e.g., Appetizers)"
                  value={category.name}
                  onChange={(e) => {
                    const newCategories = [...menuData.categories];
                    newCategories[catIndex].name = e.target.value;
                    setMenuData(prev => ({ ...prev, categories: newCategories }));
                  }}
                />
                <Button onClick={() => addItem(catIndex)} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded">
                    <Input
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => {
                        const newCategories = [...menuData.categories];
                        newCategories[catIndex].items[itemIndex].name = e.target.value;
                        setMenuData(prev => ({ ...prev, categories: newCategories }));
                      }}
                    />
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newCategories = [...menuData.categories];
                        newCategories[catIndex].items[itemIndex].description = e.target.value;
                        setMenuData(prev => ({ ...prev, categories: newCategories }));
                      }}
                    />
                    <Input
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => {
                        const newCategories = [...menuData.categories];
                        newCategories[catIndex].items[itemIndex].price = e.target.value;
                        setMenuData(prev => ({ ...prev, categories: newCategories }));
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="bg-white p-12 rounded-lg border">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold">{menuData.restaurantName || 'Restaurant Menu'}</h1>
            </div>
            {menuData.categories.map((category, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2">{category.name || 'Category'}</h2>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name || 'Item Name'}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <span className="font-bold">{item.price || '$0.00'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bolt-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Menu
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
