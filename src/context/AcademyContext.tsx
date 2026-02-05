"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AcademyContextType = {
  academyName: string;
  setAcademyName: (name: string) => void;
  businessFiles: File[];
  setBusinessFiles: (files: File[]) => void;
  academyImageFiles: File[];
  setAcademyImageFiles: (files: File[]) => void;
};

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [academyName, setAcademyName] = useState("");
  const [businessFiles, setBusinessFiles] = useState<File[]>([]);
  const [academyImageFiles, setAcademyImageFiles] = useState<File[]>([]);

  return (
    <AcademyContext.Provider
      value={{
        academyName,
        setAcademyName,
        businessFiles,
        setBusinessFiles,
        academyImageFiles,
        setAcademyImageFiles
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
}

export function useAcademy() {
  const context = useContext(AcademyContext);
  if (!context) throw new Error("useAcademy must be used within AcademyProvider");
  return context;
}