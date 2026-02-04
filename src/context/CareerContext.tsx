import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Career {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string; // Full-time, Contract, etc.
    description: string;
    requirements?: string;
    linkedin_url?: string;
    is_active: boolean;
    expires_at?: string;
    created_at?: string;
}

export interface CareerApplication {
    id: number;
    job_id?: number;
    full_name: string;
    email: string;
    phone: string;
    resume_url: string;
    linkedin_profile?: string;
    position: string;
    message?: string;
    status: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
    created_at: string;
}

interface CareerContextType {
    jobs: Career[];
    applications: CareerApplication[];
    loading: boolean;
    error: string | null;
    fetchJobs: () => Promise<void>;
    fetchApplications: () => Promise<void>;
    addJob: (job: Omit<Career, 'id' | 'created_at'>) => Promise<void>;
    updateJob: (id: number, job: Partial<Career>) => Promise<void>;
    deleteJob: (id: number) => Promise<void>;
    submitApplication: (application: Omit<CareerApplication, 'id' | 'created_at' | 'status'>, file: File) => Promise<void>;
    deleteApplication: (id: number, resumeUrl: string) => Promise<void>;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [applications, setApplications] = useState<CareerApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (err: any) {
            console.error('Error fetching jobs:', err);
            // Don't set global error for fetch, just log it to avoid blocking UI during outages
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('career_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err: any) {
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const addJob = async (job: Omit<Career, 'id' | 'created_at'>) => {
        try {
            const { data, error } = await supabase
                .from('careers')
                .insert([job])
                .select();

            if (error) throw error;
            if (data) setJobs([data[0], ...jobs]);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateJob = async (id: number, job: Partial<Career>) => {
        try {
            const { error } = await supabase
                .from('careers')
                .update(job)
                .eq('id', id);

            if (error) throw error;
            setJobs(jobs.map(j => j.id === id ? { ...j, ...job } : j));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteJob = async (id: number) => {
        try {
            const { error } = await supabase
                .from('careers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setJobs(jobs.filter(j => j.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const submitApplication = async (application: Omit<CareerApplication, 'id' | 'created_at' | 'status'>, file: File) => {
        try {
            // 1. Upload Resume
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${application.full_name.replace(/\s+/g, '_')}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL (or handle private download later)
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            // 3. Save Application Record
            const { error } = await supabase
                .from('career_applications')
                .insert([{
                    ...application,
                    resume_url: publicUrl,
                    status: 'new'
                }])
                .select();

            if (error) throw error;
            // Optionally add to state if needed immediately, though usually this is public side
        } catch (err: any) {
            console.error("Application Submit Error:", err);
            throw err;
        }
    };

    const deleteApplication = async (id: number, resumeUrl: string) => {
        try {
            // 1. Delete Resume File from Storage if it exists
            if (resumeUrl) {
                // Extract file path from URL
                // URL format: .../storage/v1/object/public/resumes/filename.ext
                const path = resumeUrl.split('/resumes/').pop();
                if (path) {
                    const decodedPath = decodeURIComponent(path);
                    const { error: storageError } = await supabase.storage
                        .from('resumes')
                        .remove([decodedPath]);

                    if (storageError) {
                        console.error('Error deleting resume file:', storageError);
                        // Continue to delete record even if file deletion fails, 
                        // but maybe log it or warn (optional: could throw to abort)
                    }
                }
            }

            // 2. Delete Application Record
            const { error } = await supabase
                .from('career_applications')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // 3. Update State
            setApplications(applications.filter(app => app.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchJobs();
        // We generally only fetch applications if admin, but safe to try or lazy load
    }, []);

    return (
        <CareerContext.Provider value={{
            jobs,
            applications,
            loading,
            error,
            fetchJobs,
            fetchApplications,
            addJob,
            updateJob,
            deleteJob,
            submitApplication,
            deleteApplication
        }}>
            {children}
        </CareerContext.Provider>
    );
};

export const useCareer = () => {
    const context = useContext(CareerContext);
    if (!context) throw new Error('useCareer must be used within a CareerProvider');
    return context;
};
