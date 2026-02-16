
export interface Application {
  id: string;
  registration_number: string;
  student_name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  aadhaar: string;
  mobile_number: string;
  alternate_mobile_number: string;
  apaar: string;
  ration_card: string;
  category: string;
  sub_caste: string;
  income_certificate: string;
  caste_ews_certificate: string;
  tenth_hall_ticket: string;
  practical_hall_ticket: string;
  jee_mains_no: string; // New field
  street: string;       // New field
  village_city: string; // New field
  district: string;     // New field
  state: string;        // New field
  pincode: string;      // New field
  nation: string;       // New field
  school_6_name: string;
  school_6_place: string;
  school_7_name: string;
  school_7_place: string;
  school_8_name: string;
  school_8_place: string;
  school_9_name: string;
  school_9_place: string;
  school_10_name: string;
  school_10_place: string;
  photo_url: string;
  signature_url: string;
  application_status: string;
  admin_message: string;
  created_at: string;
}

export type ApplicationFormData = Omit<Application, 'id' | 'registration_number' | 'application_status' | 'created_at' | 'admin_message'>;

export interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
