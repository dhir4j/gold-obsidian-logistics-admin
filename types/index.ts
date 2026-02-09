export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  is_employee: boolean;
  created_at: string;
  balance?: number;
  shipment_count?: number;
}

export interface Shipment {
  id: number;
  shipment_id_str: string;
  sender_name: string;
  sender_address_street: string;
  sender_address_city: string;
  sender_address_state: string;
  sender_address_pincode: string;
  sender_address_country: string;
  sender_phone: string;
  receiver_name: string;
  receiver_address_street: string;
  receiver_address_city: string;
  receiver_address_state: string;
  receiver_address_pincode: string;
  receiver_address_country: string;
  receiver_phone: string;
  package_weight_kg: number;
  package_length_cm: number;
  package_width_cm: number;
  package_height_cm: number;
  booking_date: string;
  service_type: string;
  status: 'Pending Payment' | 'Booked' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  price_without_tax: number;
  tax_amount_18_percent: number;
  total_with_tax_18_percent: number;
  tracking_history: TrackingEntry[];
  goods_details: GoodItem[];
  user_type?: 'Employee' | 'Customer';
  payment_status?: 'Pending' | 'Approved' | 'Rejected' | null;
}

export interface TrackingEntry {
  stage: string;
  date: string;
  location: string;
  activity: string;
}

export interface GoodItem {
  description: string;
  quantity: number;
  value: number;
  hsn_code: string;
}

export interface PaymentRequest {
  id: number;
  order_id: string; // shipment_id_str
  first_name: string;
  last_name: string;
  amount: number;
  utr: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface BalanceCode {
  id: number;
  code: string;
  amount: number;
  is_redeemed: boolean;
  created_at: string;
  redeemed_at: string | null;
  redeemed_by: string | null;
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  avg_revenue: number;
  total_users: number;
  total_employees: number;
  pending_payments: number;
  shipments_by_status: { status: string; count: number }[];
  shipments_by_service: { service: string; count: number }[];
  revenue_over_time: { month: string; orders: number; revenue: number }[];
  top_destinations: { city: string; count: number }[];
  recent_shipments: {
    shipment_id_str: string;
    receiver_name: string;
    receiver_city: string;
    status: string;
    total: number;
    booking_date: string;
  }[];
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | number;
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface ShipmentsResponse {
  shipments: Shipment[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface Session {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface UserDetailResponse {
  user: User;
  shipments: Shipment[];
  payments: PaymentRequest[];
}
