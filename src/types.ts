export type UserRole = 'child' | 'parent' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ChildProfile extends User {
  role: 'child';
  level: number;
  xp: number;
  stars: number;
  parentId: string;
  dailyStreak: number;
  unlockedBadges: string[];
  unlockedRewards: string[];
  equippedAvatar: string;
  equippedAccessory?: string;
  equippedTheme?: string;
}

export interface ParentProfile extends User {
  role: 'parent';
  childrenIds: string[];
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface RewardItem {
  id: string;
  title: string;
  type: 'avatar' | 'accessory' | 'theme';
  cost: number;
  icon: string;
  value?: string; // used for bg colors or additional properties
}
