import CompletionCelebration from '../CompletionCelebration';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CompletionCelebrationExample() {
  const [show, setShow] = useState(false);
  
  return (
    <div className="p-6">
      <Button onClick={() => setShow(true)} data-testid="button-show-celebration">
        Show Celebration
      </Button>
      {show && (
        <CompletionCelebration 
          points={15} 
          onClose={() => setShow(false)} 
        />
      )}
    </div>
  );
}
