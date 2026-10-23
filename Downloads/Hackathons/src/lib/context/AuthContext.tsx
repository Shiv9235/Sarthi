"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, DoctorProfile, UserRole } from "../types";
import { StorageService } from "../data/storage";

interface AuthContextType {
  user: UserProfile | null;
  doctorProfile: DoctorProfile | null;
  role: UserRole;
  isDoctor: boolean;
  isDoctorVerified: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  signup: (email: string, fullName: string, password?: string) => Promise<boolean>;
  loginAsPatient: () => Promise<boolean>;
  loginAsDoctor: (doctorId?: string) => Promise<boolean>;
  signupDoctor: (doctorData: Partial<DoctorProfile>) => Promise<boolean>;
  updateDoctorProfile: (updated: Partial<DoctorProfile>) => void;
  switchRole: (role: UserRole, doctorId?: string) => void;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = () => {
    const currentUser = StorageService.getUser();
    setUser(currentUser);
    if (currentUser?.role === "doctor") {
      const doc = StorageService.getDoctorProfileById(currentUser.id) || StorageService.getDoctorProfiles()[0];
      setDoctorProfile(doc || null);
    } else {
      setDoctorProfile(null);
    }
  };

  useEffect(() => {
    initAuth();
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    _password?: string,
    requestedRole: UserRole = "patient"
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    if (requestedRole === "doctor") {
      const docList = StorageService.getDoctorProfiles();
      const match = docList.find((d) => d.email.toLowerCase() === email.toLowerCase()) || docList[0];
      const docUser: UserProfile = {
        id: match.id,
        email: match.email,
        role: "doctor",
        fullName: match.name,
        phone: match.phone,
        onboardingCompleted: true,
        createdAt: match.submittedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StorageService.setUser(docUser);
      setUser(docUser);
      setDoctorProfile(match);
    } else {
      const patient = StorageService.getUser();
      const updated: UserProfile = {
        ...patient,
        role: "patient",
        email: email || patient.email,
      };
      StorageService.setUser(updated);
      setUser(updated);
      setDoctorProfile(null);
    }

    setIsLoading(false);
    return true;
  };

  const loginAsPatient = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const patient = StorageService.getUser();
    const updated: UserProfile = {
      ...patient,
      role: "patient",
      email: "sunita.sharma@example.in",
      fullName: "Sunita Sharma",
    };
    StorageService.setUser(updated);
    setUser(updated);
    setDoctorProfile(null);
    setIsLoading(false);
    return true;
  };

  const loginAsDoctor = async (doctorId: string = "doc_1"): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const doc = StorageService.getDoctorProfileById(doctorId) || StorageService.getDoctorProfiles()[0];
    const docUser: UserProfile = {
      id: doc.id,
      email: doc.email,
      role: "doctor",
      fullName: doc.name,
      phone: doc.phone,
      onboardingCompleted: true,
      createdAt: doc.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.setUser(docUser);
    setUser(docUser);
    setDoctorProfile(doc);
    setIsLoading(false);
    return true;
  };

  const signupDoctor = async (doctorData: Partial<DoctorProfile>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const docId = `doc_${Date.now()}`;
    const newProfile: DoctorProfile = {
      id: docId,
      name: doctorData.name || "Dr. Practicing Physician",
      email: doctorData.email || "",
      phone: doctorData.phone || "+91 98000 00000",
      specialty: doctorData.specialty || "Internal Medicine",
      subspecialties: doctorData.subspecialties || [],
      regNumber: doctorData.regNumber || "DMC/R/PENDING",
      councilName: doctorData.councilName || "Delhi Medical Council",
      regYear: doctorData.regYear || new Date().getFullYear(),
      education: doctorData.education || ["MBBS"],
      experienceYears: doctorData.experienceYears || 5,
      hospitalName: doctorData.hospitalName || "Max Super Speciality Hospital",
      clinicAddress: doctorData.clinicAddress || "New Delhi",
      consultationFee: doctorData.consultationFee || 800,
      teleconsultationFee: doctorData.teleconsultationFee || 600,
      bio: doctorData.bio || "Practicing consultant physician.",
      languages: doctorData.languages || ["Hindi", "English"],
      verificationStatus: "under_review",
      supportingDocs: doctorData.supportingDocs || [],
      submittedAt: new Date().toISOString(),
      availableDays: doctorData.availableDays || ["Monday", "Wednesday", "Friday"],
      consultationHours: doctorData.consultationHours || "10:00 AM - 04:00 PM",
    };
    StorageService.saveDoctorProfile(newProfile);

    const docUser: UserProfile = {
      id: docId,
      email: newProfile.email,
      fullName: newProfile.name,
      role: "doctor",
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.setUser(docUser);
    setUser(docUser);
    setDoctorProfile(newProfile);
    setIsLoading(false);
    return true;
  };

  const signup = async (email: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUser: UserProfile = {
      id: `patient_${Date.now()}`,
      email,
      fullName,
      role: "patient",
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.setUser(newUser);
    setUser(newUser);
    setDoctorProfile(null);
    setIsLoading(false);
    return true;
  };

  const switchRole = (newRole: UserRole, specificDoctorId?: string) => {
    if (newRole === "doctor") {
      loginAsDoctor(specificDoctorId || "doc_1");
    } else {
      loginAsPatient();
    }
  };

  const logout = () => {
    setUser(null);
    setDoctorProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("care_platform_user");
    }
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...updated, updatedAt: new Date().toISOString() };
    StorageService.setUser(merged);
    setUser(merged);
  };

  const updateDoctorProfile = (updated: Partial<DoctorProfile>) => {
    if (!doctorProfile) return;
    const merged = { ...doctorProfile, ...updated };
    StorageService.saveDoctorProfile(merged);
    setDoctorProfile(merged);
  };

  const currentRole: UserRole = user?.role || "patient";
  const isDoctor = currentRole === "doctor";
  const isDoctorVerified = isDoctor && doctorProfile?.verificationStatus === "verified";

  return (
    <AuthContext.Provider
      value={{
        user,
        doctorProfile,
        role: currentRole,
        isDoctor,
        isDoctorVerified,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginAsPatient,
        loginAsDoctor,
        signupDoctor,
        updateDoctorProfile,
        switchRole,
        logout,
        updateUser,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
