
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface CustomMeditationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customDuration: number;
  setCustomDuration: (duration: number) => void;
  customIntention: string;
  setCustomIntention: (intention: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const CustomMeditationDialog = ({
  open,
  onOpenChange,
  customDuration,
  setCustomDuration,
  customIntention,
  setCustomIntention,
  onGenerate,
  isGenerating
}: CustomMeditationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Custom Meditation</DialogTitle>
          <DialogDescription>
            Tell us your intention and we'll create a personalized meditation experience for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="intention">Meditation Intention</Label>
            <Textarea
              id="intention"
              placeholder="Examples: Reduce anxiety before a presentation, Find clarity in a difficult decision, Release tension in my body..."
              value={customIntention}
              onChange={(e) => setCustomIntention(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Duration (minutes)</Label>
              <span className="text-sm text-muted-foreground">{Math.floor(customDuration / 60)} minutes</span>
            </div>
            <Slider 
              defaultValue={[customDuration / 60]} 
              max={20} 
              min={1} 
              step={1}
              onValueChange={(values) => setCustomDuration(values[0] * 60)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onGenerate}
            disabled={isGenerating || !customIntention}
            className="bg-gradient-to-r from-reflectify-blue to-reflectify-purple text-white"
          >
            {isGenerating ? "Creating..." : "Create Meditation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomMeditationDialog;
