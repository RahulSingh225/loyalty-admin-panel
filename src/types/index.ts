export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'pending'
}

export interface Transaction {
  id: string
  memberId: string
  memberName: string
  type: 'credit' | 'debit' | 'refund'
  amount: number
  points: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  description: string
}

export interface Campaign {
  id: string
  name: string
  type: 'booster' | 'slab-based' | 'cross-sell' | 'promo-schemes'
  startDate: string
  endDate: string
  participants: number
  status: 'active' | 'inactive' | 'scheduled'
  pointsDistributed: number
}

export interface StakeholderType {
  id: string
  name: string
  description: string
  pointsMultiplier: number
  status: 'active' | 'inactive'
}

export interface QRBatch {
  id: string
  name: string
  category: string
  type: 'mono' | 'sub-mono'
  quantity: number
  generatedDate: string
  status: 'generated' | 'printing' | 'printed'
}

export interface FraudAlert {
  id: string
  memberId: string
  memberName: string
  type: string
  riskScore: number
  status: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
  description: string
}

export interface NavigationItem {
  text: string
  icon: React.ReactNode
  path: string
  badge?: number
}