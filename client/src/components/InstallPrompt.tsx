import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isInStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    const hasSeenPrompt = localStorage.getItem("hasSeenInstallPrompt");
    if (hasSeenPrompt === "true") {
      return;
    }

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowAndroidPrompt(true), 2000);
    };

    if (isIOS && !isInStandaloneMode) {
      setTimeout(() => setShowIOSPrompt(true), 2000);
    } else if (isAndroid) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowAndroidPrompt(false);
      setShowIOSPrompt(false);
      localStorage.setItem("hasSeenInstallPrompt", "true");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  const handleDismiss = () => {
    setShowAndroidPrompt(false);
    setShowIOSPrompt(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  if (isInstalled) return null;

  if (showAndroidPrompt && deferredPrompt) {
    return (
      <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md p-4 bg-primary text-primary-foreground shadow-2xl z-50 animate-in slide-in-from-bottom-5">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded"
          data-testid="button-dismiss-install"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Install Family Chores</h3>
            <p className="text-sm opacity-90 mb-3">
              Get the full app experience! Install on your home screen for quick
              access and notifications.
            </p>
            <Button
              onClick={handleInstallClick}
              variant="secondary"
              className="w-full"
              data-testid="button-install-app"
            >
              <Download className="w-4 h-4 mr-2" />
              Add to Home Screen
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (showIOSPrompt) {
    return (
      <Dialog open={showIOSPrompt} onOpenChange={setShowIOSPrompt}>
        <DialogContent className="max-w-sm" data-testid="dialog-ios-install">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-3xl">📱</span>
              Install Family Chores
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>
                Install this app on your iPhone for the best experience:
              </p>
              <ol className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">1️⃣</span>
                  <div>
                    Tap the <Share className="inline w-4 h-4 mx-1" /> Share
                    button at the bottom of your browser
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">2️⃣</span>
                  <div>Scroll down and tap "Add to Home Screen"</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">3️⃣</span>
                  <div>Tap "Add" in the top right corner</div>
                </li>
              </ol>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="w-full"
                data-testid="button-dismiss-ios-install"
              >
                Got it!
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
