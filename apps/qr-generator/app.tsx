'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import QRGenerator from './components/QRGenerator';
import { qrGeneratorConfig } from './config';

export default function QRCodeGeneratorApp() {
  const [activeTab, setActiveTab] = useState('url');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            QR Code Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Generate QR codes for URLs, text, and contact information
          </p>
        </div>

        {/* 主要内容 */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger 
                  value="url" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <span className="mr-2">🔗</span>
                  URL
                </TabsTrigger>
                <TabsTrigger 
                  value="text"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <span className="mr-2">📝</span>
                  Text
                </TabsTrigger>
                <TabsTrigger 
                  value="contact"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <span className="mr-2">👤</span>
                  Contact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url">
                <QRGenerator type="url" />
              </TabsContent>

              <TabsContent value="text">
                <QRGenerator type="text" />
              </TabsContent>

              <TabsContent value="contact">
                <QRGenerator type="contact" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Generate QR codes instantly • No data stored • Free to use
        </div>
      </div>
    </div>
  );
}

export { qrGeneratorConfig as config };