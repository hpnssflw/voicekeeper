/**
 * Auth hooks
 */

"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "./context";
import type { AuthContextType } from "../model/types";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth(): AuthContextType {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Could redirect to login here
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  
  return auth;
}

