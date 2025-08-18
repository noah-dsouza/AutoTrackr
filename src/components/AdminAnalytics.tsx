import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, TrendingUp, DollarSign, Car as CarIcon, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Car } from './CarInventoryDashboard';

interface AdminAnalyticsProps {
  cars: Car[];
  onBack: () => void;
}

// Mock historical sales data
const generateMockSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map((month) => ({
    month,
    sales: Math.floor(Math.random() * 15) + 5,
    revenue: Math.floor(Math.random() * 500000) + 200000,
    avgPrice: Math.floor(Math.random() * 15000) + 25000,
    thisYear: Math.floor(Math.random() * 15) + 5,
    lastYear: Math.floor(Math.random() * 12) + 3,
  }));
};

const mockSalesData = generateMockSalesData();

export function AdminAnalytics({ cars, onBack }: AdminAnalyticsProps) {
  const [timeFilter, setTimeFilter] = useState('ytd');

  // Calculate key metrics
  const totalInventory = cars.length;
  const soldCars = cars.filter((car) => car.status === 'sold').length;
  const availableCars = cars.filter((car) => car.status === 'available').length;
  const pendingCars = cars.filter((car) => car.status === 'pending').length;

  const totalRevenue = cars
    .filter((car) => car.status === 'sold')
    .reduce((sum, car) => sum + car.price, 0);

  const avgSellingPrice = soldCars > 0 ? Math.round(totalRevenue / soldCars) : 0;

  // Prepare data for charts
  const inventoryByMake = cars.reduce((acc, car) => {
    acc[car.make] = (acc[car.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const makeData = Object.entries(inventoryByMake).map(([make, count]) => ({
    name: make,
    value: count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

  const statusData = [
    { name: 'Available', value: availableCars, color: '#10b981' },
    { name: 'Sold', value: soldCars, color: '#ef4444' },
    { name: 'Pending', value: pendingCars, color: '#f59e0b' },
  ];

  const salesByMake = cars
    .filter((car) => car.status === 'sold')
    .reduce((acc, car) => {
      acc[car.make] = (acc[car.make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const salesMakeData = Object.entries(salesByMake).map(([make, count]) => ({
    make,
    sales: count,
  }));

  // Calculate cumulative revenue
  const cumulativeRevenueData = mockSalesData.map((item, index) => ({
    ...item,
    cumulative: mockSalesData.slice(0, index + 1).reduce((sum, data) => sum + data.revenue, 0),
  }));

  // Inventory age simulation
  const inventoryAgeData = [
    { range: '< 30 days', count: Math.floor(availableCars * 0.4) },
    { range: '30-60 days', count: Math.floor(availableCars * 0.35) },
    { range: '60+ days', count: Math.floor(availableCars * 0.25) },
  ];

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'mtd':
        return 'Month to Date';
      case 'qtd':
        return 'Quarter to Date';
      case 'ytd':
        return 'Year to Date';
      case 'custom':
        return 'Custom Range';
      default:
        return 'Year to Date';
    }
  };

  return (
    <div className="min-h-screen bg-backround p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive sales and inventory insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtd">Month to Date</SelectItem>
                  <SelectItem value="qtd">Quarter to Date</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl">${totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12.5% from last month</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl">{soldCars}</p>
                  <p className="text-sm text-green-600">+8.2% from last month</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inventory</p>
                  <p className="text-2xl">{totalInventory}</p>
                  <p className="text-sm text-orange-600">-5.1% from last month</p>
                </div>
                <CarIcon className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Selling Price</p>
                  <p className="text-2xl">${avgSellingPrice.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+3.4% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time ({getTimeFilterLabel()})</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Sales Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="thisYear" fill="#3b82f6" name="This Year" />
                  <Bar dataKey="lastYear" fill="#94a3b8" name="Last Year" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inventory by Make */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Make</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={makeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {makeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inventory by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Selling Price Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Average Selling Price Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg Price']} />
                  <Line type="monotone" dataKey="avgPrice" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cumulative Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Revenue (YTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cumulativeRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Cumulative Revenue']} />
                  <Line type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Selling Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cars
                  .filter((car) => car.status === 'sold')
                  .slice(0, 5)
                  .map((car, index) => (
                    <div key={car.id} className="flex items-center justify-between">
                      <span className="text-sm">
                        {index + 1}. {car.make} {car.model}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${car.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">BMW 320i sold for $35,000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">New Honda Civic added to inventory</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Ford F-150 marked as pending</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Toyota Camry inquiry received</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
