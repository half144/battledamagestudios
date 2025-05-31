"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { updateUserProfileApi } from "@/lib/authApi";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Loader2, RefreshCw } from "lucide-react";
import { useProfileStore } from "@/store/profile";

const settingsFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { profile, isLoading, isAuthenticated, checkAuth } = useAuthStatus();
  const { setProfile } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      full_name: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || profile.username || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile, form]);

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return (
        names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
      );
    }
    return name.substring(0, 2).toUpperCase();
  };

  async function onSubmit(data: SettingsFormValues) {
    if (!profile) return;

    setIsSubmitting(true);

    try {
      const updateData: { full_name?: string; avatar_url?: string } = {};

      if (data.full_name) updateData.full_name = data.full_name;
      if (data.avatar_url) updateData.avatar_url = data.avatar_url;

      const result = await updateUserProfileApi(updateData);

      if (result.success) {
        toast.success("Profile updated successfully!");

        setProfile({
          ...profile,
          full_name: data.full_name,
          avatar_url: data.avatar_url || profile.avatar_url,
        });

        await checkAuth();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-2">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="p-6 border rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 text-2xl">
                <AvatarImage
                  src={
                    form.watch("avatar_url") || profile.avatar_url || undefined
                  }
                  alt={profile.username || "User Avatar"}
                />
                <AvatarFallback>
                  {getInitials(
                    form.watch("full_name") ||
                      profile.full_name ||
                      profile.username
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-medium">Profile Picture</h4>
                <p className="text-xs text-muted-foreground">
                  Add a URL to your profile picture
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/your-photo.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a URL to your profile picture. Leave empty to use
                    initials.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground">
                Account Information (Read-only)
              </h4>

              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input
                  value={profile.email || ""}
                  disabled
                  className="bg-muted"
                />
                <FormDescription>
                  Your email address cannot be changed from here.
                </FormDescription>
              </div>

              <div className="space-y-2">
                <FormLabel>Username</FormLabel>
                <Input
                  value={profile.username || ""}
                  disabled
                  className="bg-muted"
                />
                <FormDescription>
                  Your username is automatically generated from your email.
                </FormDescription>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
