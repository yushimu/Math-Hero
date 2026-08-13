export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'parent' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'parent' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'parent' | 'admin'
          created_at?: string
        }
      }
      children: {
        Row: {
          id: string
          parent_id: string
          name: string
          avatar_url: string | null
          level: number
          xp: number
          current_streak: number
          best_streak: number
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          avatar_url?: string | null
          level?: number
          xp?: number
          current_streak?: number
          best_streak?: number
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string
          avatar_url?: string | null
          level?: number
          xp?: number
          current_streak?: number
          best_streak?: number
          created_at?: string
        }
      }
      question_sets: {
        Row: {
          id: string
          title: string
          operation: 'add' | 'sub' | 'mul' | 'div' | 'mix'
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          operation: 'add' | 'sub' | 'mul' | 'div' | 'mix'
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          operation?: 'add' | 'sub' | 'mul' | 'div' | 'mix'
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          set_id: string
          num1: number
          num2: number
          operation: 'add' | 'sub' | 'mul' | 'div'
          correct_answer: number
          options: number[]
        }
        Insert: {
          id?: string
          set_id: string
          num1: number
          num2: number
          operation: 'add' | 'sub' | 'mul' | 'div'
          correct_answer: number
          options: number[]
        }
        Update: {
          id?: string
          set_id?: string
          num1?: number
          num2?: number
          operation?: 'add' | 'sub' | 'mul' | 'div'
          correct_answer?: number
          options?: number[]
        }
      }
      practice_sessions: {
        Row: {
          id: string
          child_id: string
          set_id: string | null
          operation: 'add' | 'sub' | 'mul' | 'div' | 'mix'
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          total_questions: number
          correct_answers: number
          accuracy: number
          best_streak: number
          xp_earned: number
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          child_id: string
          set_id?: string | null
          operation: 'add' | 'sub' | 'mul' | 'div' | 'mix'
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          total_questions: number
          correct_answers?: number
          accuracy?: number
          best_streak?: number
          xp_earned?: number
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          child_id?: string
          set_id?: string | null
          operation?: 'add' | 'sub' | 'mul' | 'div' | 'mix'
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          total_questions?: number
          correct_answers?: number
          accuracy?: number
          best_streak?: number
          xp_earned?: number
          started_at?: string
          completed_at?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          session_id: string
          question_id: string | null
          num1: number
          num2: number
          operation: string
          selected_answer: number
          is_correct: boolean
          response_time_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id?: string | null
          num1: number
          num2: number
          operation: string
          selected_answer: number
          is_correct: boolean
          response_time_ms: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string | null
          num1?: number
          num2?: number
          operation?: string
          selected_answer?: number
          is_correct?: boolean
          response_time_ms?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          requirement_type: string
          requirement_value: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon: string
          requirement_type: string
          requirement_value: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          requirement_type?: string
          requirement_value?: number
          created_at?: string
        }
      }
      child_achievements: {
        Row: {
          id: string
          child_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          child_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          title: string
          type: 'avatar' | 'accessory' | 'theme'
          cost: number
          icon: string
          value: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'avatar' | 'accessory' | 'theme'
          cost: number
          icon: string
          value?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'avatar' | 'accessory' | 'theme'
          cost?: number
          icon?: string
          value?: string | null
          created_at?: string
        }
      }
      child_rewards: {
        Row: {
          id: string
          child_id: string
          reward_id: string
          is_equipped: boolean
          unlocked_at: string
        }
        Insert: {
          id?: string
          child_id: string
          reward_id: string
          is_equipped?: boolean
          unlocked_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          reward_id?: string
          is_equipped?: boolean
          unlocked_at?: string
        }
      }
      daily_challenges: {
        Row: {
          id: string
          date: string
          title: string
          description: string
          challenge_type: string
          target_value: number
          reward_xp: number
          reward_stars: number
          operation_hint: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          title: string
          description: string
          challenge_type: string
          target_value: number
          reward_xp: number
          reward_stars: number
          operation_hint?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          title?: string
          description?: string
          challenge_type?: string
          target_value?: number
          reward_xp?: number
          reward_stars?: number
          operation_hint?: string | null
          created_at?: string
        }
      }
      child_daily_challenges: {
        Row: {
          id: string
          child_id: string
          challenge_id: string
          progress_value: number
          is_completed: boolean
          is_claimed: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          challenge_id: string
          progress_value?: number
          is_completed?: boolean
          is_claimed?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          challenge_id?: string
          progress_value?: number
          is_completed?: boolean
          is_claimed?: boolean
          updated_at?: string
        }
      }
    }
  }
}
