'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, Link, FileText, User } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    QRCode: any;
  }
}

interface QRGeneratorProps {
  type: 'url' | 'text' | 'contact';
}

interface ContactData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ type }) => {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactData, setContactData] = useState<ContactData>({
    name: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });
  
  const [qrData, setQrData] = useState('');
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<any>(null);

  // 加载 QR 码库
  useEffect(() => {
    const loadQRLibrary = async () => {
      try {
        // 加载 QRCode.js 库
        if (!window.QRCode) {
          await loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js');
        }
        setIsLibraryLoaded(true);
      } catch (error) {
        console.error('Failed to load QR library:', error);
        toast.error('二维码库加载失败');
      }
    };

    loadQRLibrary();
  }, []);

  // 根据类型生成 QR 码数据
  const generateQRData = () => {
    switch (type) {
      case 'url':
        const url = urlInput.trim();
        if (!url) return '';
        // 自动添加协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      
      case 'text':
        return textInput.trim();
      
      case 'contact':
        const { name, phone, email, organization, url } = contactData;
        if (!name && !phone && !email) return '';
        
        // 生成 vCard 格式
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (name) vcard += `FN:${name}\n`;
        if (phone) vcard += `TEL:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (organization) vcard += `ORG:${organization}\n`;
        if (url) vcard += `URL:${url}\n`;
        vcard += 'END:VCARD';
        return vcard;
      
      default:
        return '';
    }
  };

  // 生成二维码
  useEffect(() => {
    if (!isLibraryLoaded || !qrRef.current) return;

    const data = generateQRData();
    if (!data) {
      // 清空二维码
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
      setQrData('');
      return;
    }

    setQrData(data);

    // 使用 QRCode.js 生成二维码
    try {
      // 清空之前的二维码
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }

      // 创建 canvas 元素
      const canvas = document.createElement('canvas');
      qrRef.current?.appendChild(canvas);

      window.QRCode.toCanvas(canvas, data, {
        width: 256,
        height: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error: any) => {
        if (error) {
          console.error('QR生成失败:', error);
          toast.error('二维码生成失败');
        }
      });

    } catch (error) {
      console.error('QR生成错误:', error);
      toast.error('二维码生成失败');
    }
  }, [isLibraryLoaded, urlInput, textInput, contactData, type]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qrcode-${type}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('二维码已下载');
    }
  };

  const handleCopyData = async () => {
    if (!qrData) return;
    
    try {
      await navigator.clipboard.writeText(qrData);
      toast.success('数据已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const clearAllFields = () => {
    setUrlInput('');
    setTextInput('');
    setContactData({
      name: '',
      phone: '',
      email: '',
      organization: '',
      url: ''
    });
    toast.success('所有字段已清空');
  };

  const renderInputFields = () => {
    switch (type) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url" className="text-base font-medium">Enter URL</Label>
              <div className="mt-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="www.google.hk"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a website URL. If you don't include http://, we'll add https:// automatically.
                </p>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text" className="text-base font-medium">Enter Text</Label>
              <div className="mt-2">
                <Textarea
                  id="text"
                  placeholder="输入要生成二维码的文本内容..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[120px] text-base"
                />
                <p className="text-sm text-gray-500 mt-1">
                  输入任何文本内容，将生成对应的二维码。
                </p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">姓名</Label>
                <Input
                  id="name"
                  placeholder="张三"
                  value={contactData.name}
                  onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 text-base mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-base font-medium">电话</Label>
                <Input
                  id="phone"
                  placeholder="+86 138 0013 8000"
                  value={contactData.phone}
                  onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-12 text-base mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-base font-medium">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={contactData.email}
                  onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 text-base mt-2"
                />
              </div>
              <div>
                <Label htmlFor="organization" className="text-base font-medium">公司/组织</Label>
                <Input
                  id="organization"
                  placeholder="公司名称"
                  value={contactData.organization}
                  onChange={(e) => setContactData(prev => ({ ...prev, organization: e.target.value }))}
                  className="h-12 text-base mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contact-url" className="text-base font-medium">网址</Label>
                <Input
                  id="contact-url"
                  placeholder="https://www.example.com"
                  value={contactData.url}
                  onChange={(e) => setContactData(prev => ({ ...prev, url: e.target.value }))}
                  className="h-12 text-base mt-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isLibraryLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载二维码生成器...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 输入字段 */}
      <div className="bg-gray-50 rounded-lg p-6">
        {renderInputFields()}
        
        <div className="mt-6">
          <Button 
            onClick={clearAllFields} 
            variant="outline" 
            className="w-full"
          >
            Clear All Fields
          </Button>
        </div>
      </div>

      {/* 二维码显示区域 */}
      {qrData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 二维码 */}
            <div className="flex justify-center">
              <div 
                ref={qrRef} 
                className="p-4 bg-white rounded-lg shadow-inner border"
              />
            </div>
            
            <p className="text-center text-gray-600">
              Scan this QR code with your device
            </p>

            {/* 操作按钮 */}
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleDownload}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={handleCopyData}
                variant="outline"
                className="px-6"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Data
              </Button>
            </div>

            {/* 数据显示 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">QR Code Data:</p>
              <div className="bg-white rounded p-3 border text-sm text-gray-600 break-all">
                {qrData}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRGenerator;