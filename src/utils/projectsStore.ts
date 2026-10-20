import { Project } from '../types';
import { supabase } from '../lib/supabase';

export const getStoredProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return (data as Project[]) || [];
};

export const saveStoredProjects = async (projects: Project[]): Promise<void> => {
  // We don't save everything at once anymore, we save individual projects
};

export const addOrUpdateProject = async (project: Project): Promise<Project[]> => {
  const { error } = await supabase
    .from('properties')
    .upsert(project);
    
  if (error) {
    console.error('Error saving project:', error);
    throw error;
  }
  
  return await getStoredProjects();
};

export const deleteStoredProject = async (id: string): Promise<Project[]> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
  
  return await getStoredProjects();
};
