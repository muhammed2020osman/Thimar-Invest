
// Laravel API Response Types
export interface Developer {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AssetType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentOpportunity {
  id: number;
  name: string;
  expected_return: number;
  duration: number;
  funded: number;
  status: string;
  image_ids: string[];
  description: string;
  developer_id: number;
  city_id: number;
  asset_type_id: number;
  developer?: Developer;
  city?: City;
  asset_type?: AssetType;
  created_at: string;
  updated_at: string;
}

export interface UserInvestment {
  id: number;
  amount: number;
  status: string;
  profit: number;
  user_id: number;
  opportunity_id: number;
  user?: User;
  investment_opportunity?: InvestmentOpportunity;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: string;
  status: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface FormState {
  recommendations: Array<{
    opportunityName: string;
    assetType: string;
    city: string;
    expectedReturn: number;
    riskLevel: string;
    justification: string;
  }>;
  error: string | null;
}
