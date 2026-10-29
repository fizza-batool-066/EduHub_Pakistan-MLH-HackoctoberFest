"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, Shield, Trash2, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { clearAll } from "@/lib/storage";

export function SettingsPage() {
  const { theme, toggleTheme, logout } = useApp();
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    weeklyDigest: false,
    marketingEmails: false,
    language: "English",
    autoSave: true,
  });
  const [clearOpen, setClearOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleClearData = () => {
    clearAll();
    toast.success("All local data cleared. Reloading...");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your preferences and account settings"
        icon={SettingsIcon}
      />

      <div className="space-y-6 max-w-3xl">
        {/* Appearance */}
        <Card className="p-6 border-border/60 shadow-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" /> Appearance
          </h3>
          <p className="text-sm text-muted-foreground mb-5">Customize how EduHub looks on your device</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {mounted && (theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />)}
                </div>
                <div>
                  <Label className="cursor-pointer">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                </div>
              </div>
              <Switch checked={mounted && theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <Label>Language</Label>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Urdu">اردو</SelectItem>
                  <SelectItem value="Punjabi">پنجابی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 border-border/60 shadow-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" /> Notifications
          </h3>
          <p className="text-sm text-muted-foreground mb-5">Choose what updates you want to receive</p>
          <div className="space-y-3">
            {[
              { key: "emailNotif", label: "Email Notifications", desc: "Receive emails about your account activity" },
              { key: "pushNotif", label: "Push Notifications", desc: "Get real-time notifications in browser" },
              { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of new academies and courses every week" },
              { key: "marketingEmails", label: "Marketing Emails", desc: "Promotional offers and updates" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between p-3 rounded-xl border border-border/60">
                <div>
                  <Label className="cursor-pointer">{s.label}</Label>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch
                  checked={(settings as any)[s.key]}
                  onCheckedChange={(v) => setSettings({ ...settings, [s.key]: v })}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6 border-border/60 shadow-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> Privacy & Data
          </h3>
          <p className="text-sm text-muted-foreground mb-5">Manage your data and privacy settings</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60">
              <div>
                <Label>Auto-save Searches</Label>
                <p className="text-xs text-muted-foreground">Save your searches for quick access</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(v) => setSettings({ ...settings, autoSave: v })}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-destructive/30 bg-destructive/5">
              <div>
                <Label className="text-destructive">Clear All Data</Label>
                <p className="text-xs text-muted-foreground">Remove all your local data including saved academies and reviews</p>
              </div>
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setClearOpen(true)}>
                <Trash2 className="h-4 w-4 mr-1.5" /> Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Account */}
        <Card className="p-6 border-border/60 shadow-card">
          <h3 className="font-semibold mb-1">Account</h3>
          <p className="text-sm text-muted-foreground mb-5">Manage your account session</p>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        trigger={null}
        title="Clear All Data?"
        description="This will permanently delete all your saved academies, reviews, searches, and preferences. This action cannot be undone."
        confirmText="Yes, Clear Everything"
        variant="destructive"
        onConfirm={handleClearData}
      />
    </div>
  );
}
