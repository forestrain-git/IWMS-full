"use client";

// Simple drawer wrapper using Sheet component from ui/sheet

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./sheet";

export const Drawer = Sheet;
export const DrawerContent = SheetContent;
export const DrawerHeader = SheetHeader;
export const DrawerTitle = SheetTitle;

// Body can simply be a div with default padding
export const DrawerBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => <div className="p-4" {...props} />;

Drawer.displayName = "Drawer";
DrawerContent.displayName = "DrawerContent";
DrawerHeader.displayName = "DrawerHeader";
DrawerTitle.displayName = "DrawerTitle";
DrawerBody.displayName = "DrawerBody";
