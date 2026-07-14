"use client";

import { TriangleAlert } from "lucide-react";

import { useUnsavedChangesDialogStore } from "@/store/unsavedChangesDialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from "../ui/alert-dialog";

export default function UnsavedChangesDialog() {
  const open = useUnsavedChangesDialogStore((s) => s.open);
  const onSaveAndContinue = useUnsavedChangesDialogStore((s) => s.onSaveAndContinue);
  const close = useUnsavedChangesDialogStore((s) => s.close);

  return (
    <AlertDialog open={open} onOpenChange={(next) => { if (!next) close(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            This file has unsaved changes. Save it before running?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onSaveAndContinue?.();
              close();
            }}
          >
            Save &amp; Run
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
