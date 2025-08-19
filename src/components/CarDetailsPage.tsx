import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Gauge,
  Palette,
  FileText,
  Hash,
} from "lucide-react";
import type { Car } from "./CarInventoryDashboard";

interface CarDetailsPageProps {
  car: Car;
  onBack: () => void;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function CarDetailsPage({
  car,
  onBack,
  isAdmin,
  onEdit,
  onDelete,
}: CarDetailsPageProps) {
  const getStatusColor = (status: Car["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const vehicleHistory = [
    { date: formatDate(30), event: "Vehicle added to inventory", type: "info" },
    { date: formatDate(25), event: "Initial inspection completed", type: "success" },
    { date: formatDate(20), event: "Photography session completed", type: "info" },
    { date: formatDate(15), event: "Listed online", type: "success" },
    ...(car.status === "pending"
      ? [{ date: formatDate(5), event: "Customer inquiry received", type: "warning" }]
      : []),
    ...(car.status === "sold"
      ? [{ date: formatDate(2), event: "Sale completed", type: "success" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4 inline-flex items-center transition-all duration-200 border shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(car.status)}>
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </Badge>
                <p className="text-muted-foreground">{car.color}</p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                {/* EDIT */}
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-white/5"
                >
                  Edit Vehicle
                </Button>

                {/* DELETE */}
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="border border-destructive text-destructive transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-destructive/10"
                >
                  Delete Vehicle
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card className="overflow-hidden">
            <div className="relative h-[28rem] md:h-[26rem] lg:h-[28rem] bg-muted">
              
              <img
                src={car.imageUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-40"
              />

              
              <img
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                className="relative z-10 mx-auto my-0 h-full w-full object-contain"
              />

              
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-24 lg:h-28 z-20 bg-gradient-to-b from-background/70 via-background/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-24 lg:h-28 z-20 bg-gradient-to-t from-background/70 via-background/30 to-transparent" />
            </div>
          </Card>

          {/* Vehicle Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p>${car.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p>{car.mileage.toLocaleString()} miles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p>{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p>{car.color}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">VIN</p>
                    <p className="font-mono text-sm">{car.vin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vehicle History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Vehicle History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicleHistory.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === "success"
                        ? "bg-green-500"
                        : event.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{event.event}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Air Conditioning</li>
                <li>• Power Windows &amp; Locks</li>
                <li>• Bluetooth Connectivity</li>
                <li>• Backup Camera</li>
                <li>• Cruise Control</li>
                <li>• Alloy Wheels</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In House Financing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated Monthly Payment
                </p>
                <p className="text-lg">
                  ${Math.round(car.price * 0.018).toLocaleString()}/month
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on 60 months at 6.9% APR
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Down Payment (20%)</p>
                <p>${Math.round(car.price * 0.2).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
