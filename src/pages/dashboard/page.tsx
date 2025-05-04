import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Users, CalendarDays, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Students',
      value: '150',
      icon: Users,
      link: '/students',
    },
    {
      title: 'Attendance Today',
      value: '142',
      icon: CalendarDays,
      link: '/attendance',
    },
    {
      title: 'QR Codes',
      value: '12',
      icon: QrCode,
      link: '/qr-codes',
    },
  ];

  return (
    <Layout showBottomNav={false}>
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
