import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Child = Database['public']['Tables']['children']['Row'];
type PracticeSession = Database['public']['Tables']['practice_sessions']['Row'];

/**
 * Service Layer for Supabase interactions.
 * This abstracts database calls from the React components.
 */

export const AuthService = {
  async getProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }
};

export const ChildrenService = {
  async getChildren(): Promise<Child[]> {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching children:', error);
      return [];
    }
    return data || [];
  },

  async getChild(id: string): Promise<Child | null> {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching child:', error);
      return null;
    }
    return data;
  },

  async createChild(child: Omit<Database['public']['Tables']['children']['Insert'], 'parent_id'>): Promise<Child | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('children')
      .insert({ ...child, parent_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating child:', error);
      return null;
    }
    return data;
  }
};

export const PracticeService = {
  async saveSessionSecure(params: {
    childId: string;
    operation: string;
    difficulty: string;
    totalQuestions: number;
    correctAnswers: number;
    averageResponseTime: number;
  }) {
    const { data, error } = await supabase.rpc('submit_practice_session', {
      p_child_id: params.childId,
      p_operation: params.operation,
      p_difficulty: params.difficulty,
      p_total_questions: params.totalQuestions,
      p_correct_answers: params.correctAnswers,
      p_average_response_time: params.averageResponseTime
    });

    if (error) {
      console.error('Error securely saving practice session:', error);
      throw error;
    }
    return data;
  },

  async saveAnswers(answers: Database['public']['Tables']['answers']['Insert'][]) {
    const { data, error } = await supabase
      .from('answers')
      .insert(answers)
      .select();

    if (error) {
      console.error('Error saving answers:', error);
      throw error;
    }
    return data;
  },

  async getSessionsByChild(childId: string): Promise<PracticeSession[]> {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('child_id', childId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
    return data || [];
  }
};
