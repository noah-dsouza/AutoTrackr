import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Car } from "./CarInventoryDashboard";

type Props = {
  car: Car | null;
  onSubmit: (carData: Omit<Car, "id">) => void;
  onCancel: () => void;
};

export function CarForm({ car, onSubmit, onCancel }: Props) {
  const [make, setMake] = useState(car?.make ?? "");
  const [model, setModel] = useState(car?.model ?? "");

  const [year, setYear] = useState<string>(car ? String(car.year) : "");
  const [price, setPrice] = useState<string>(car ? String(car.price) : "");
  const [mileage, setMileage] = useState<string>(car ? String(car.mileage) : "");

  const [color, setColor] = useState(car?.color ?? "");
  const [status, setStatus] = useState<Car["status"]>(car?.status ?? "available");
  const [vin, setVin] = useState(car?.vin ?? "");
  const [description, setDescription] = useState(car?.description ?? "");
  const [imageUrl, setImageUrl] = useState(
    car?.imageUrl ??
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop"
  );

  // EXACT same border/hover/shadow style used on the dashboard action buttons
  const actionBtn =
    "transition-all duration-200 border border-border shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary/30";

  // Avoid duplicate brands
  const normalizeMake = (s: string) =>
    s.trim().replace(/\s+/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const stripLeadingZero = (v: string) => v.replace(/^0+(?=\d)/, "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!make || !model) return alert("Make and Model are required.");
    if (!year) return alert("Year is required.");

    const payload: Omit<Car, "id"> = {
      make: normalizeMake(make),
      model,
      year: Number(year || 0),
      price: Number(price || 0),
      mileage: Number(mileage || 0),
      color,
      status,
      vin,
      description,
      imageUrl,
    };

    onSubmit(payload);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>{car ? "Edit Vehicle" : "Add Vehicle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Make</label>
                  <Input value={make} onChange={(e) => setMake(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min={1886}
                    max={2100}
                    placeholder="e.g. 2024"
                    value={year}
                    onChange={(e) => setYear(stripLeadingZero(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (USD)</label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min={0}
                    placeholder="e.g. 35000"
                    value={price}
                    onChange={(e) => setPrice(stripLeadingZero(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mileage</label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min={0}
                    placeholder="e.g. 12500"
                    value={mileage}
                    onChange={(e) => setMileage(stripLeadingZero(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <Input value={color} onChange={(e) => setColor(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Car["status"])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">VIN</label>
                  <Input value={vin} onChange={(e) => setVin(e.target.value)} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short blurb shown on the card"
                  />
                </div>

                <div className="md:col-span-2 flex gap-2 pt-2">
                  {/* Add Vehicle — outlined with white-ish border + hover shadow */}
                  <Button type="submit" variant="outline" className={`flex-1 ${actionBtn}`}>
                    {car ? "Save Changes" : "Add Vehicle"}
                  </Button>

                  {/* Cancel — same outline + hover/shadow */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className={actionBtn}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CarForm;
