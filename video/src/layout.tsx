import { createContext, useContext } from 'react';

// Frame geometry for the current render: landscape 1920×1080 or vertical 1080×1920.
export type Layout = { W: number; H: number; V: boolean };
export const LANDSCAPE: Layout = { W: 1920, H: 1080, V: false };
export const VERTICAL: Layout = { W: 1080, H: 1920, V: true };
const LayoutCtx = createContext<Layout>(LANDSCAPE);
export const LayoutProvider = LayoutCtx.Provider;
export const useL = () => useContext(LayoutCtx);
