import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const isSupabaseReady = Boolean(supabase);

const vehiclePhotos: Record<string, string> = {
  marutisuzukiswift: "/vehicles/maruti-swift.jpg",
  renaultkwid: "/vehicles/renault-kwid.jpg",
  marutisuzukiertiga: "/vehicles/maruti-ertiga.jpg",
  mahindrathar: "/vehicles/mahindra-thar.jpg",
  hyundaicreta: "/vehicles/hyundai-creta.jpg",
  hondacity: "/vehicles/honda-city.jpg",
  toyotafortuner: "/vehicles/toyota-fortuner.jpg",
  bmw5series: "/vehicles/bmw-5-series.jpg",
  marutisuzukibaleno: "/vehicles/maruti-baleno.jpg",
  toyotainnovacrysta: "/vehicles/toyota-innova-crysta.jpg",
  hyundaiverna: "/vehicles/hyundai-verna.jpg",
  kiaseltos: "/vehicles/kia-seltos.jpg",
  audiq7: "/vehicles/audi-q7.jpg",
  mercedesbenzeclass: "/vehicles/mercedes-e-class.jpg",
  bmwx5: "/vehicles/bmw-x5.jpg",
  mahindrascorpionn: "/vehicles/mahindra-scorpio-n.jpg",
};

export const getVehicleFallbackImage = (brand: string, model: string) =>
  vehiclePhotos[`${brand}${model}`.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? "";

export const PHONE = "919812038600";
export const phoneDisplay = "+91 98120 38600";
export const whatsappUrl = (message: string) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  category: string;
  year: number | null;
  registration_year: number | null;
  price: number | null;
  km: number | null;
  fuel: string;
  transmission: string;
  ownership: string;
  registration: string;
  insurance: string;
  service_history: string;
  condition: string;
  warranty: string;
  status: string;
  featured: boolean;
  image_url: string;
  demo: boolean;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interested_vehicle?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  type: string;
  status: string;
  created_at: string;
};

export const demoVehicles: Vehicle[] = [
  {id:"demo-1",brand:"Maruti Suzuki",model:"Swift",category:"Hatchbacks",year:2021,registration_year:2021,price:525000,km:32000,fuel:"Petrol",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/maruti-swift.jpg",demo:true},
  {id:"demo-2",brand:"Renault",model:"Kwid",category:"Hatchbacks",year:2020,registration_year:2020,price:275000,km:41000,fuel:"Petrol",transmission:"Manual",ownership:"Second",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/renault-kwid.jpg",demo:true},
  {id:"demo-3",brand:"Maruti Suzuki",model:"Ertiga",category:"MUV",year:2022,registration_year:2022,price:875000,km:28000,fuel:"Petrol",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/maruti-ertiga.jpg",demo:true},
  {id:"demo-4",brand:"Mahindra",model:"Thar",category:"SUVs",year:2022,registration_year:2022,price:1250000,km:24000,fuel:"Diesel",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/mahindra-thar.jpg",demo:true},
  {id:"demo-5",brand:"Hyundai",model:"Creta",category:"SUVs",year:2021,registration_year:2021,price:1150000,km:35000,fuel:"Diesel",transmission:"Automatic",ownership:"Second",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/hyundai-creta.jpg",demo:true},
  {id:"demo-6",brand:"Honda",model:"City",category:"Sedans",year:2020,registration_year:2020,price:850000,km:30000,fuel:"Petrol",transmission:"CVT",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/honda-city.jpg",demo:true},
  {id:"demo-7",brand:"Toyota",model:"Fortuner",category:"SUVs",year:2022,registration_year:2022,price:3250000,km:18500,fuel:"Diesel",transmission:"Automatic",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/toyota-fortuner.jpg",demo:true},
  {id:"demo-8",brand:"BMW",model:"5 Series",category:"Luxury Sedans",year:2021,registration_year:2021,price:3800000,km:25000,fuel:"Diesel",transmission:"Automatic",ownership:"Second",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/bmw-5-series.jpg",demo:true},
  {id:"demo-9",brand:"Maruti Suzuki",model:"Baleno",category:"Hatchbacks",year:2022,registration_year:2022,price:650000,km:22000,fuel:"Petrol",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/maruti-baleno.jpg",demo:true},
  {id:"demo-10",brand:"Toyota",model:"Innova Crysta",category:"MUV",year:2021,registration_year:2021,price:1850000,km:44000,fuel:"Diesel",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/toyota-innova-crysta.jpg",demo:true},
  {id:"demo-11",brand:"Hyundai",model:"Verna",category:"Sedans",year:2022,registration_year:2022,price:950000,km:26000,fuel:"Petrol",transmission:"Automatic",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/hyundai-verna.jpg",demo:true},
  {id:"demo-12",brand:"Kia",model:"Seltos",category:"SUVs",year:2021,registration_year:2021,price:1125000,km:38000,fuel:"Diesel",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/kia-seltos.jpg",demo:true},
  {id:"demo-13",brand:"Audi",model:"Q7",category:"Luxury SUVs",year:2020,registration_year:2020,price:5200000,km:42000,fuel:"Diesel",transmission:"Automatic",ownership:"Second",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:true,image_url:"/vehicles/audi-q7.jpg",demo:true},
  {id:"demo-14",brand:"Mercedes-Benz",model:"E-Class",category:"Luxury Sedans",year:2021,registration_year:2021,price:4100000,km:29000,fuel:"Diesel",transmission:"Automatic",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/mercedes-e-class.jpg",demo:true},
  {id:"demo-15",brand:"BMW",model:"X5",category:"Luxury SUVs",year:2020,registration_year:2020,price:5600000,km:36000,fuel:"Diesel",transmission:"Automatic",ownership:"Second",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/bmw-x5.jpg",demo:true},
  {id:"demo-16",brand:"Mahindra",model:"Scorpio-N",category:"SUVs",year:2023,registration_year:2023,price:1650000,km:15000,fuel:"Diesel",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"/vehicles/mahindra-scorpio-n.jpg",demo:true}
];

export const formatPrice = (value: number | null) =>
  value == null ? "Price on request" : `₹${new Intl.NumberFormat("en-IN").format(value)}`;
