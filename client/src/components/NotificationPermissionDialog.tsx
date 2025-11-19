import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import {
  checkNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notifications";

interface NotificationPermissionDialogProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default function NotificationPermissionDialog({
  onPermissionGranted,
  onPermissionDenied,
}: NotificationPermissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    // Check if we should show the permission dialog
    const permission = checkNotificationPermission();
    const hasAskedBefore = localStorage.getItem('notification-permission-asked');
    
    if (permission === 'default' && !hasAskedBefore) {
      // Show dialog after a short delay for better UX
      setTimeout(() => {
        setOpen(true);
      }, 2000);
    }
  }, []);

  const handleEnable = async () => {
    setIsAsking(true);
    const granted = await requestNotificationPermission();
    setIsAsking(false);
    
    localStorage.setItem('notification-permission-asked', 'true');
    
    if (granted) {
      onPermissionGranted?.();
      setOpen(false);
    } else {
      onPermissionDenied?.();
      setOpen(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('notification-permission-asked', 'true');
    onPermissionDenied?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" aria-describedby="notification-dialog-description">
        <DialogHeader>
          <div className="mx-auto mb-4 text-6xl">🔔</div>
          <DialogTitle className="text-2xl font-black text-center">
            Stay in the Loop!
          </DialogTitle>
          <DialogDescription id="notification-dialog-description" className="text-center text-base">
            Get notified instantly when:
            <ul className="mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-2xl">📢</span>
                <span>Someone assigns you a chore</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>You claim a chore</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span>Family members complete chores</span>
              </li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleEnable}
            disabled={isAsking}
            className="w-full gap-2 text-lg h-12"
            data-testid="button-enable-notifications"
          >
            <Bell className="w-5 h-5" />
            {isAsking ? "Enabling..." : "Enable Notifications"}
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full"
            data-testid="button-skip-notifications"
          >
            <BellOff className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
