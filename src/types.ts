export type FeatureId =
  | 'home'
  | 'faq'
  | 'download-app'
  | 'game'
  | 'deposit-calc'
  | 'loan-calc'
  | 'prominent-products'
  | 'branches';

export interface FaqStep {
  step: number;
  title: string;
  desc: string;
  image: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  steps: FaqStep[];
}

export interface DepositTerm {
  months: number;
  label: string;
  rate: number;
}

export interface LoanRepaymentRow {
  period: number;
  dueDate: string;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}

export interface ProductItem {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  desc: string;
  imageUrl: string;
  isHot?: boolean;
}

export interface BranchLocation {
  stt: number;
  name: string;
  address: string;
  imageUrl: string;
  mapUrl: string;
  phone?: string;
  isHeadquarters?: boolean;
}

export interface VoucherWinData {
  score: number;
  voucherCode: string;
  reward: string;
  timestamp: string;
}
