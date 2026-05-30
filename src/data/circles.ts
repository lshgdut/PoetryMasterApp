import {PoetryCircle, LeaderboardEntry} from './types';

export const initialCircles: PoetryCircle[] = [
  {
    id: '1',
    name: '诗词入门',
    description: '适合初学者，从简单的五言绝句开始',
    memberCount: 128,
    reciteRecords: [],
  },
  {
    id: '2',
    name: '唐诗爱好者',
    description: '热爱唐诗的朋友，一起背诵经典',
    memberCount: 256,
    reciteRecords: [],
  },
  {
    id: '3',
    name: '宋词天地',
    description: '探索宋词的韵味与美感',
    memberCount: 89,
    reciteRecords: [],
  },
  {
    id: '4',
    name: '诗词挑战赛',
    description: '高难度诗词挑战，测试你的诗词功底',
    memberCount: 67,
    reciteRecords: [],
  },
];

export const generateLeaderboard = (userPoints: number, circleId?: string): LeaderboardEntry[] => {
  const mockUsers = [
    {userId: '1', userName: '诗词达人A', points: 1250},
    {userId: '2', userName: '李白', points: 980},
    {userId: '3', userName: '杜甫', points: 860},
    {userId: '4', userName: '王维', points: 720},
    {userId: '5', userName: '白居易', points: 650},
    {userId: '6', userName: '苏轼', points: 580},
    {userId: '7', userName: '李清照', points: 420},
    {userId: '8', userName: '天才', points: userPoints},
  ];

  return mockUsers
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      userName: user.userName,
      points: user.points,
    }));
};

export const levels = [
  {level: 1, name: '诗词小白', minPoints: 0, emoji: '🌱'},
  {level: 2, name: '诗词学徒', minPoints: 50, emoji: '📚'},
  {level: 3, name: '诗词少年', minPoints: 150, emoji: '🎓'},
  {level: 4, name: '诗词书生', minPoints: 300, emoji: '✍️'},
  {level: 5, name: '诗词才子', minPoints: 500, emoji: '🌟'},
  {level: 6, name: '诗词达人', minPoints: 800, emoji: '🏆'},
  {level: 7, name: '诗词高手', minPoints: 1200, emoji: '💫'},
  {level: 8, name: '诗词大师', minPoints: 1800, emoji: '🎭'},
  {level: 9, name: '诗词宗师', minPoints: 2500, emoji: '👑'},
  {level: 10, name: '诗仙', minPoints: 3500, emoji: '✨'},
];