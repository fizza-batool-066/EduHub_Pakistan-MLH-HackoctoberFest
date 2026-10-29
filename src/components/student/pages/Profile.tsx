"use client";

import { useState } from "react";
import { User as UserIcon, Mail, Phone, Calendar, MapPin, Save, Camera, Award, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useApp } from "@/context/AppContext";
import { getItem, setItem } from "@/lib/storage";
import { User } from "@/lib/types";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, login } = useApp();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    bio: "",
  });

  const handleSave = () => {
    if (!user) return;
    const users = getItem<User[]>("users") || [];
    const updatedUser = { ...user, name: form.name, email: form.email, phone: form.phone };
    const updated = users.map((u) => u.id === user.id ? updatedUser : u);
    setItem("users", updated);
    setItem("session", updatedUser);
    // Update the user in context via login simulation (refresh)
    toast.success("Profile updated successfully");
  };

  if (!user) return null;

  const initials = user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal information"
        icon={UserIcon}
        actions={
          <Button className="gradient-royal" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1.5" /> Save Changes
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="p-6 border-border/60 shadow-card text-center h-fit">
          <div className="relative inline-block mb-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback className="gradient-royal text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="font-bold text-lg">{user.name}</h2>
          <Badge className="mt-1 mb-3 capitalize">{user.role}</Badge>
          <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/60">
            <div>
              <div className="text-lg font-bold">12</div>
              <div className="text-[10px] text-muted-foreground uppercase">Saved</div>
            </div>
            <div>
              <div className="text-lg font-bold">5</div>
              <div className="text-[10px] text-muted-foreground uppercase">Reviews</div>
            </div>
            <div>
              <div className="text-lg font-bold">3</div>
              <div className="text-[10px] text-muted-foreground uppercase">Compares</div>
            </div>
          </div>
        </Card>

        {/* Edit form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-border/60 shadow-card">
            <h3 className="font-semibold mb-5">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Member Since</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={new Date(user.createdAt).toLocaleDateString()} disabled className="pl-9" />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Your address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs">Bio</Label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
                  placeholder="Tell us about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 border-border/60 shadow-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: BookOpen, label: "First Review", earned: true },
                { icon: Award, label: "Top Reviewer", earned: true },
                { icon: MapPin, label: "Explorer", earned: true },
                { icon: UserIcon, label: "Verified", earned: true },
              ].map((ach) => (
                <div key={ach.label} className={`p-3 rounded-xl border text-center ${ach.earned ? "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20" : "border-border opacity-50"}`}>
                  <ach.icon className={`h-6 w-6 mx-auto mb-1.5 ${ach.earned ? "text-amber-500" : "text-muted-foreground"}`} />
                  <div className="text-xs font-medium">{ach.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
