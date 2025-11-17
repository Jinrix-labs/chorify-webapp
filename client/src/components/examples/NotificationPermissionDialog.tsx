import NotificationPermissionDialog from '../NotificationPermissionDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function NotificationPermissionDialogExample() {
  const [showDialog, setShowDialog] = useState(false);
  
  return (
    <div className="p-6">
      <Button onClick={() => setShowDialog(true)} data-testid="button-show-permission">
        Show Permission Dialog
      </Button>
      {showDialog && (
        <NotificationPermissionDialog
          onPermissionGranted={() => {
            console.log('Notifications enabled!');
            setShowDialog(false);
          }}
          onPermissionDenied={() => {
            console.log('Notifications denied');
            setShowDialog(false);
          }}
        />
      )}
    </div>
  );
}
