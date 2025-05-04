import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Download, QrCode as QrCodeIcon, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';

interface QRData {
  type: string;
  name: string;
  identifier: string;
  customData: string;
  expiration: string;
  qrContent?: string;
}

const QRCodesPage = () => {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [qrData, setQrData] = useState<QRData>({
    type: 'attendance',
    name: '',
    identifier: '',
    customData: '',
    expiration: '60'
  });
  
  // Mock classes data
  const classes = [
    { id: '1', name: 'Matematika Dasar', teacher: 'Dr. Susanto' },
    { id: '2', name: 'Fisika Dasar', teacher: 'Mrs. Hartono' },
    { id: '3', name: 'Kimia Dasar', teacher: 'Mr. Wijaya' },
    { id: '4', name: 'Biologi Dasar', teacher: 'Dr. Wulandari' },
    { id: '5', name: 'Sejarah Indonesia', teacher: 'Mrs. Suharto' },
  ];
  
  const generateQRCode = () => {
    if (selectedClass) {
      const classInfo = classes.find(c => c.id === selectedClass);
      if (!classInfo) {
        toast.error('Kelas tidak ditemukan');
        return;
      }

      try {
        const timestamp = new Date().toISOString();
        const qrContent = JSON.stringify({
          type: qrData.type,
          class: {
            id: classInfo.id,
            name: classInfo.name,
            teacher: classInfo.teacher
          },
          timestamp,
          expiration: qrData.expiration,
          customData: qrData.customData
        });
        
        setQrData(prev => ({
          ...prev,
          name: classInfo.name,
          identifier: classInfo.id,
          qrContent
        }));

        toast.success('Kode QR berhasil dibuat');
      } catch (error) {
        toast.error('Gagal membuat kode QR');
        console.error('Error generating QR code:', error);
      }
    } else {
      toast.error('Silakan pilih kelas terlebih dahulu');
    }
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    try {
      const svg = qrRef.current.querySelector('svg');
      if (!svg) {
        throw new Error('QR Code SVG not found');
      }

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      // Convert SVG to PNG
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx?.drawImage(img, 0, 0);

        // Convert to PNG and download
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-code-${qrData.name}-${new Date().getTime()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up
        URL.revokeObjectURL(url);
        toast({
          title: 'Success',
          description: 'QR Code downloaded successfully',
        });
      };

      img.src = url;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download QR code',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQrData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout title="Generate Kode QR" showBottomNav={false}>
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">Generate Kode QR</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Generator Kode QR</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="class">Pilih Kelas</Label>
                <select 
                  id="class" 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Pilih kelas</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name} - {cls.teacher}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiration">Waktu Kadaluarsa</Label>
                <select 
                  id="expiration"
                  name="expiration"
                  value={qrData.expiration}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                >
                  <option value="15">15 Menit</option>
                  <option value="30">30 Menit</option>
                  <option value="60">1 Jam</option>
                  <option value="120">2 Jam</option>
                  <option value="1440">Seharian</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Jenis Kode QR</Label>
                <select
                  name='type'
                  value={qrData.type}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                >
                  <option value='attendance'>Absensi</option>
                  <option value='registration'>Pendaftaran</option>
                  <option value='custom'>Kustom</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nama/Judul</Label>
                <Input
                  type='text'
                  name='name'
                  value={qrData.name}
                  onChange={handleInputChange}
                  placeholder='Masukkan nama atau judul'
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="identifier">Identifikasi</Label>
                <Input
                  type='text'
                  name='identifier'
                  value={qrData.identifier}
                  onChange={handleInputChange}
                  placeholder='Masukkan identifikasi unik'
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                />
              </div>
              
              {qrData.type === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customData">Data Kustom</Label>
                  <Input
                    type='text'
                    name='customData'
                    value={qrData.customData}
                    onChange={handleInputChange}
                    placeholder='Masukkan data kustom'
                    className="w-full h-10 rounded-md border border-input px-3 py-2"
                  />
                </div>
              )}
              
              <Button 
                onClick={generateQRCode}
                disabled={!selectedClass} 
                className="w-full flex items-center justify-center gap-2"
              >
                <QrCodeIcon size={16} /> Generate Kode QR
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Pratinjau Kode QR</h3>
            
            <div className="flex flex-col items-center justify-center h-[250px] border-2 border-dashed border-gray-200 rounded-md">
              {qrData.name ? (
                <div className="flex flex-col items-center gap-4" ref={qrRef}>
                  <QRCodeSVG 
                    value={qrData.qrContent || ''} 
                    size={200} 
                    level={'H'} 
                    includeMargin={true} 
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setQrData({
                        type: 'attendance',
                        name: '',
                        identifier: '',
                        customData: '',
                        expiration: '60'
                      })}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Reset
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex items-center gap-2"
                      onClick={downloadQRCode}
                      disabled={!qrData.name || !qrData.qrContent}
                    >
                      <Download size={16} /> Unduh QR
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Pilih kelas dan generate kode QR untuk melihat pratinjau</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default QRCodesPage;
