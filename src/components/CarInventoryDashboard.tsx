import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Car,
  Calendar,
  DollarSign,
  Gauge,
} from "lucide-react";
import { CarForm } from "./CarForm";
import { AdminLogin } from "./AdminLogin";
import { CarDetailsPage } from "./CarDetailsPage";
import { AdminAnalytics } from "./Adminanalytics";
import { getCarsApi, createCarApi, updateCarApi, deleteCarApi } from "../lib/api";

/* ----------------------------- Types ----------------------------- */

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  status: "available" | "sold" | "pending";
  vin: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  soldAt?: string | null;
}

/* ------------------------------ Helpers --------------------------- */

function statusToBadgeVariant(status: Car["status"]) {
  switch (status) {
    case "available":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "sold":
      return "danger" as const;
    default:
      return "default" as const;
  }
}

/* ------------------------------ Main ------------------------------ */

export function CarInventoryDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [makeFilter, setMakeFilter] = useState<string>("all");

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Initial load from API
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getCarsApi(controller.signal);
        setCars(data as Car[]);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setErr(e.message || "Failed to fetch");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const filteredCars = cars.filter((car) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      car.make.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.year.toString().includes(searchTerm) ||
      car.vin.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || car.status === statusFilter;
    const matchesMake = makeFilter === "all" || car.make === makeFilter;
    return matchesSearch && matchesStatus && matchesMake;
  });

  const uniqueMakes = Array.from(new Set(cars.map((c) => c.make))).sort();

  const handleAddCar = async (carData: Omit<Car, "id">) => {
    try {
      const created = await createCarApi(carData);
      setCars((prev) => [created as Car, ...prev]);
      setShowCarForm(false);
    } catch (e: any) {
      alert(e.message || "Failed to create car");
    }
  };

  const handleEditCar = async (carData: Omit<Car, "id">) => {
    if (!editingCar) return;
    try {
      const updated = await updateCarApi(editingCar.id, carData);
      setCars((prev) =>
        prev.map((c) => (c.id === editingCar.id ? (updated as Car) : c)),
      );
      setEditingCar(null);
      setShowCarForm(false);
    } catch (e: any) {
      alert(e.message || "Failed to update car");
    }
  };

  const handleDeleteCar = async (carId: string) => {
    try {
      await deleteCarApi(carId);
      setCars((prev) => prev.filter((c) => c.id !== carId));
    } catch (e: any) {
      alert(e.message || "Failed to delete car");
    }
  };

  /* ----------------------- Early returns for views ----------------------- */

  if (showLogin) {
    return (
      <div className="container mx-auto p-6">
        <AdminLogin
          onLogin={() => {
            setIsAdmin(true);
            setShowLogin(false);
          }}
          onCancel={() => setShowLogin(false)}
        />
      </div>
    );
  }

  if (showCarForm) {
    return (
      <div className="container mx-auto p-6">
        <CarForm
          car={editingCar}
          onSubmit={editingCar ? handleEditCar : handleAddCar}
          onCancel={() => {
            setShowCarForm(false);
            setEditingCar(null);
          }}
        />
      </div>
    );
  }

  if (showAnalytics) {
    return <AdminAnalytics cars={cars} onBack={() => setShowAnalytics(false)} />;
  }

  if (selectedCar) {
    return (
      <CarDetailsPage
        car={selectedCar}
        onBack={() => setSelectedCar(null)}
        isAdmin={isAdmin}
        onEdit={() => {
          setEditingCar(selectedCar);
          setShowCarForm(true);
          setSelectedCar(null);
        }}
        onDelete={() => {
          handleDeleteCar(selectedCar.id);
          setSelectedCar(null);
        }}
      />
    );
  }

  /* ------------------------------ UI helpers ------------------------------ */

  // Consistent hover/lift/shadow for header action buttons
  const actionBtn =
    "transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-white/5";

  // Consistent hover/focus styling for inputs & selects (trigger)
  const fieldHover =
    "transition-all duration-200 border border-border hover:border-primary/40 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30";

  // Menu (dropdown) container styling for Select
  const menuContent =
    "rounded-xl border border-border/60 shadow-lg bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/75";

  // Individual option styling for SelectItem
  const itemClass =
    "rounded-md px-2 py-1.5 cursor-pointer outline-none transition-colors " +
    "data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary " +
    "data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary " +
    "focus:bg-primary/10 focus:text-primary";

  /* ------------------------------ Main Grid ------------------------------ */

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">AutoTrackr</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your vehicle inventory efficiently
            </p>
          </div>

          <div className="flex gap-3">
            {!isAdmin ? (
              <Button variant="outline" onClick={() => setShowLogin(true)}>
                Admin Login
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCarForm(true)}
                  className={`flex items-center gap-2 ${actionBtn}`}
                >
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAnalytics(true)}
                  className={actionBtn}
                >
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdmin(false)}
                  className={actionBtn}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Errors / Loading */}
        {err && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4 text-destructive">{err}</CardContent>
          </Card>
        )}
        {loading && (
          <Card className="mb-6">
            <CardContent className="p-4 text-muted-foreground">
              Loading cars…
            </CardContent>
          </Card>
        )}

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search &amp; Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search make/model/year/VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${fieldHover}`}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={fieldHover}>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className={menuContent}>
                  <SelectItem className={itemClass} value="all">
                    All Status
                  </SelectItem>
                  <SelectItem className={itemClass} value="available">
                    Available
                  </SelectItem>
                  <SelectItem className={itemClass} value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem className={itemClass} value="sold">
                    Sold
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={makeFilter} onValueChange={setMakeFilter}>
                <SelectTrigger className={fieldHover}>
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent className={menuContent}>
                  <SelectItem className={itemClass} value="all">
                    All Makes
                  </SelectItem>
                  {uniqueMakes.map((m) => (
                    <SelectItem className={itemClass} key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-muted-foreground">
                <Car className="mr-2 h-4 w-4" />
                {filteredCars.length} vehicles found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              onClick={() => setSelectedCar(car)}
              className="overflow-hidden transition-all duration-200 ease-out will-change-transform hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.35),0_8px_24px_-6px_rgba(255,255,255,0.25)] cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="h-full w-full object-cover"
                />
                <Badge
                  variant={statusToBadgeVariant(car.status)}
                  className="absolute right-3 top-3 capitalize"
                >
                  {car.status}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-medium">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">{car.color}</p>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                    ${car.price.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Gauge className="mr-2 h-4 w-4 text-blue-600" />
                    {car.mileage.toLocaleString()} miles
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                    {car.year}
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {car.description}
                </p>

                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCar(car);
                        setShowCarForm(true);
                      }}
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCar(car.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && !loading && (
          <div className="py-12 text-center">
            <Car className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-medium">No vehicles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
