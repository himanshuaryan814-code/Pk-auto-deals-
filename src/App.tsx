import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Award, CarFront, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, Fuel, Gauge, Instagram, MapPin, Menu, Phone, Search, ShieldCheck, SlidersHorizontal, Sparkles, Users, X, CalendarDays, Settings2, Send, Calculator, LogIn, LogOut, Plus, Pencil, Trash2, Upload, LayoutDashboard, MessageCircle, ExternalLink } from "lucide-react";
import { supabase, isSupabaseReady, demoVehicles, formatPrice, whatsappUrl, phoneDisplay, getVehicleFallbackImage, type Vehicle, type Lead } from "./lib";

const categories = ["All Cars","Hatchbacks","MUV","Sedans","SUVs","Luxury"];
const money = (n:number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`;
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=9XW4%2BJG%20Panipat%2C%20Haryana%2C%20India";
const initialForm = {name:"",phone:"",email:"",interested_vehicle:"",preferred_date:"",preferred_time:"",message:""};

function HeroVideo() {
  const reduceMotion = useReducedMotion();
  const videoId = "g-MX2u-DiMo";

  return <div className="hero-video" aria-hidden="true">
    {!reduceMotion && <iframe
      title="Cinematic automotive footage"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&modestbranding=1`}
      allow="autoplay; encrypted-media; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
      tabIndex={-1}
    />}
  </div>;
}

function Header() {
  const [menu,setMenu] = useState(false);
  const [scrolled,setScrolled] = useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>24);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn)},[]);
  const links=[["Home","#home"],["Inventory","#inventory"],["Categories","#categories"],["Our Promise","#promise"],["About Us","#about"],["Contact","#contact"]];
  return <header className={`header ${scrolled?"header-scrolled":""}`}>
    <a className="brand" href="#home"><span className="brand-mark">PK</span><span><b>P.K. AUTO DEALS</b><small>PREMIUM AUTOMOBILES</small></span></a>
    <nav className={menu?"nav nav-open":"nav"}>{links.map(([label,href])=><a key={label} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
    <div className="header-actions"><a className="header-phone" href="tel:+919812038600"><Phone size={15}/>{phoneDisplay}</a><a className="button button-green button-small" href="#contact">Get in touch <ArrowUpRight size={15}/></a></div>
    <button className="mobile-menu" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>;
}

function VehicleImage({vehicle, className="", imageUrl}:{vehicle:Pick<Vehicle,"brand"|"model"|"image_url">&Partial<Pick<Vehicle,"demo">>,className?:string,imageUrl?:string}) {
  const [failedUrl,setFailedUrl]=useState("");
  const fallbackUrl=getVehicleFallbackImage(vehicle.brand,vehicle.model);
  const requestedUrl=imageUrl??vehicle.image_url;
  const primaryUrl=requestedUrl?.startsWith("/vehicles/")&&requestedUrl.endsWith(".svg")?fallbackUrl:requestedUrl;
  const source=failedUrl===primaryUrl&&fallbackUrl&&fallbackUrl!==primaryUrl?fallbackUrl:primaryUrl||fallbackUrl;
  const failed=failedUrl===source;
  useEffect(()=>setFailedUrl(""),[primaryUrl,fallbackUrl]);
  return <div className={`vehicle-image ${className}`}>
    {!failed && source ? <img src={source} alt={`${vehicle.brand} ${vehicle.model}`} loading="lazy" decoding="async" onError={()=>setFailedUrl(source)}/> : null}
    {(failed || !source) && <div className="image-placeholder"><CarFront size={34}/><strong>{vehicle.brand} {vehicle.model}</strong><small>VERIFIED VEHICLE PHOTO REQUIRED</small></div>}
    {vehicle.demo && <span className="demo-image-tag">MODEL REFERENCE PHOTO</span>}
  </div>;
}

function VehicleCard({vehicle}:{vehicle:Vehicle}) {
  const message=`Hello P.K. Auto Deals, I am interested in the ${vehicle.brand} ${vehicle.model}. Please share availability and details.`;
  return <motion.article className="vehicle-card" layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} transition={{duration:.28}}>
    <VehicleImage vehicle={vehicle}/>
    <div className="vehicle-card-body">
      <div className="card-topline"><span>{vehicle.category}</span><span className={vehicle.status==="Sold"?"status sold":"status"}>{vehicle.status}</span></div>
      <h3>{vehicle.brand} <b>{vehicle.model}</b></h3>
      <div className="vehicle-price">{formatPrice(vehicle.price)}</div>
      <div className="vehicle-meta"><span><CalendarDays size={14}/>{vehicle.year??"Year —"}</span><span><Gauge size={14}/>{vehicle.km!=null?`${new Intl.NumberFormat("en-IN").format(vehicle.km)} km`:"KM —"}</span></div>
      <div className="spec-grid"><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span><span>{vehicle.ownership} owner</span><span>{vehicle.registration} registration</span></div>
      <a className="card-enquire" href={whatsappUrl(message)} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowUpRight size={15}/></a>
    </div>
  </motion.article>;
}

function Inventory({vehicles}:{vehicles:Vehicle[]}) {
  const [category,setCategory]=useState("All Cars");
  const [query,setQuery]=useState("");
  const [price,setPrice]=useState("Any price");
  const [sort,setSort]=useState("Featured");
  const [filters,setFilters]=useState(false);
  const [fuel,setFuel]=useState("Any fuel");
  const [transmission,setTransmission]=useState("Any transmission");
  const filtered=useMemo(()=>{
    let list=vehicles.filter(v=>v.status!=="Sold");
    if(category!=="All Cars") list=list.filter(v=>category==="Luxury"?v.category.startsWith("Luxury"):v.category===category);
    const q=query.toLowerCase().trim();
    if(q) list=list.filter(v=>`${v.brand} ${v.model} ${v.category}`.toLowerCase().includes(q));
    if(price!=="Any price") list=list.filter(v=>{const p=v.price??0;return price==="Under ₹5 lakh"?p<500000:price==="₹5–10 lakh"?p>=500000&&p<1000000:price==="₹10–20 lakh"?p>=1000000&&p<2000000:price==="₹20–40 lakh"?p>=2000000&&p<4000000:p>=4000000});
    if(fuel!=="Any fuel") list=list.filter(v=>v.fuel===fuel);
    if(transmission!=="Any transmission") list=list.filter(v=>v.transmission===transmission);
    if(sort==="Price: low to high") list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
    if(sort==="Price: high to low") list.sort((a,b)=>(b.price??0)-(a.price??0));
    if(sort==="Lowest kilometres") list.sort((a,b)=>(a.km??Infinity)-(b.km??Infinity));
    if(sort==="Newest vehicles") list.sort((a,b)=>(b.year??0)-(a.year??0));
    if(sort==="Featured") list.sort((a,b)=>Number(b.featured)-Number(a.featured));
    return list;
  },[vehicles,category,query,price,sort,fuel,transmission]);
  const reset=()=>{setCategory("All Cars");setQuery("");setPrice("Any price");setFuel("Any fuel");setTransmission("Any transmission");setSort("Featured")};
  return <section className="section inventory-section" id="inventory">
    <div className="section-heading"><div><span className="eyebrow">02 / THE COLLECTION</span><h2>The art of<br/><em>choosing better.</em></h2></div><p>From refined everyday automobiles to exceptional luxury machines, discover a collection that brings together comfort, performance and style.</p></div>
    {vehicles.some(v=>v.demo)&&<div className="demo-notice"><span className="demo-dot"/> DEMONSTRATION INVENTORY — Listings, prices and specifications are illustrative, not confirmed showroom stock. Please contact the team for actual availability.</div>}
    <div className="inventory-tools">
      <div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search make or model"/></div>
      <button className={`filter-toggle ${filters?"active":""}`} onClick={()=>setFilters(!filters)}><SlidersHorizontal size={16}/> Filters <ChevronDown size={14}/></button>
      <label className="sort-select"><span>Sort by</span><select value={sort} onChange={e=>setSort(e.target.value)}>{["Featured","Price: low to high","Price: high to low","Newest vehicles","Lowest kilometres"].map(s=><option key={s}>{s}</option>)}</select></label>
    </div>
    <div className="category-tabs">{categories.map(c=><button key={c} className={category===c?"selected":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <AnimatePresence>{filters&&<motion.div className="filter-panel" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>
      <label>Price range<select value={price} onChange={e=>setPrice(e.target.value)}>{["Any price","Under ₹5 lakh","₹5–10 lakh","₹10–20 lakh","₹20–40 lakh","₹40 lakh+"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Fuel type<select value={fuel} onChange={e=>setFuel(e.target.value)}>{["Any fuel","Petrol","Diesel","CNG","Electric","Hybrid"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Transmission<select value={transmission} onChange={e=>setTransmission(e.target.value)}>{["Any transmission","Manual","Automatic","CVT","DCT"].map(x=><option key={x}>{x}</option>)}</select></label>
      <button className="text-button" onClick={reset}>Clear all filters</button>
    </motion.div>}</AnimatePresence>
    <div className="results-line"><span>{filtered.length} vehicles shown</span><span>Updated listings · Panipat, Haryana</span></div>
    <motion.div className="vehicle-grid" layout>{filtered.length?filtered.map(v=><VehicleCard key={v.id} vehicle={v}/>):<div className="empty-state"><CarFront/><h3>No matching vehicles</h3><p>Try changing your search or filters.</p><button className="text-button" onClick={reset}>Clear filters</button></div>}</motion.div>
  </section>;
}

function EmiCalculator() {
  const [price,setPrice]=useState(1500000),[down,setDown]=useState(300000),[rate,setRate]=useState(9.5),[years,setYears]=useState(5);
  const principal=Math.max(0,price-down),months=years*12,r=rate/1200;
  const emi=principal===0?0:r===0?principal/months:principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);
  const total=emi*months,interest=total-principal;
  const clampDown=(v:number)=>setDown(Math.min(v,price));
  return <section className="section emi-section" id="emi">
    <div className="section-heading"><div><span className="eyebrow">06 / FINANCING ESTIMATE</span><h2>Your next car.<br/><em>A smarter plan.</em></h2></div><p>Explore an indicative monthly payment before you take the next step. Adjust the values to understand how your down payment and tenure affect the estimate.</p></div>
    <div className="emi-layout">
      <div className="emi-controls">
        <div className="range-field"><div><label>Vehicle price</label><b>{money(price)}</b></div><input type="range" min="200000" max="10000000" step="50000" value={price} onChange={e=>{const v=+e.target.value;setPrice(v);setDown(Math.min(down,v))}}/><div className="range-ends"><span>₹2 lakh</span><span>₹1 crore</span></div></div>
        <div className="range-field"><div><label>Down payment</label><b>{money(down)}</b></div><input type="range" min="0" max={price} step="10000" value={down} onChange={e=>clampDown(+e.target.value)}/><div className="range-ends"><span>₹0</span><span>{money(price)}</span></div></div>
        <div className="range-field"><div><label>Interest rate</label><b>{rate.toFixed(1)}% p.a.</b></div><input type="range" min="6" max="18" step=".1" value={rate} onChange={e=>setRate(+e.target.value)}/><div className="range-ends"><span>6%</span><span>18%</span></div></div>
        <div className="range-field"><div><label>Loan duration</label><b>{years} years</b></div><input type="range" min="1" max="7" step="1" value={years} onChange={e=>setYears(+e.target.value)}/><div className="range-ends"><span>1 year</span><span>7 years</span></div></div>
        <button className="text-button" onClick={()=>{setPrice(1500000);setDown(300000);setRate(9.5);setYears(5)}}>Reset calculator ↗</button>
      </div>
      <div className="emi-result"><span className="eyebrow">ESTIMATED MONTHLY EMI</span><div className="emi-number">{money(Math.round(emi))}<small>/ month</small></div><div className="emi-breakdown"><div><span>Loan amount</span><b>{money(principal)}</b></div><div><span>Total interest</span><b>{money(Math.round(interest))}</b></div><div><span>Total repayment</span><b>{money(Math.round(total))}</b></div></div><div className="emi-bar"><span style={{width:`${principal?principal/Math.max(total,1)*100:0}%`}}/></div><div className="emi-legend"><span><i/> Principal {Math.round(principal/Math.max(total,1)*100)}%</span><span><i/> Interest {Math.round(interest/Math.max(total,1)*100)}%</span></div><a className="button button-gold full-button" href={whatsappUrl(`Hello, please help me understand financing for a car around ${money(price)}. Estimated EMI: ${money(Math.round(emi))}.`)} target="_blank" rel="noreferrer">Discuss financing <ArrowUpRight size={16}/></a></div>
    </div>
    <p className="fine-print">Illustrative calculation using a reducing-balance EMI formula. Actual rates, fees, eligibility and loan terms are determined by the lender. This is not a loan approval or financing commitment.</p>
  </section>;
}

function EnquiryForm() {
  const [form,setForm]=useState(initialForm),[kind,setKind]=useState("General enquiry"),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[website,setWebsite]=useState("");
  const update=(k:keyof typeof initialForm,v:string)=>setForm(f=>({...f,[k]:v}));
  async function submit(e:React.FormEvent) {
    e.preventDefault(); if(website) return;
    if(form.phone.replace(/\D/g,"").length<10){setMessage("Please enter a valid 10-digit phone number.");return}
    setBusy(true);setMessage("");
    const payload={...form,email:form.email||null,preferred_date:form.preferred_date||null,preferred_time:form.preferred_time||null,type:kind,status:"New"};
    if(supabase){
      const {error}=await supabase.from("leads").insert(payload);
      if(error){setMessage("We couldn't submit your enquiry. Please try WhatsApp or call us.");setBusy(false);return}
      setMessage("Thank you. Your enquiry has been received. Our team will contact you shortly.");
      setForm(initialForm);
    } else {
      const msg=`${kind}\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nVehicle: ${form.interested_vehicle}\nDate: ${form.preferred_date} ${form.preferred_time}\nMessage: ${form.message}`;
      window.open(whatsappUrl(msg),"_blank","noopener,noreferrer");
      setMessage("Supabase is not connected. Your enquiry has been prepared in WhatsApp; send it to complete submission.");
    }
    setBusy(false);
  }
  return <form className="enquiry-form" onSubmit={submit}>
    <div className="form-kind"><button type="button" className={kind==="General enquiry"?"active":""} onClick={()=>setKind("General enquiry")}>General enquiry</button><button type="button" className={kind==="Test-drive request"?"active":""} onClick={()=>setKind("Test-drive request")}>Test-drive request</button></div>
    <div className="form-grid"><label>Your name<input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Full name"/></label><label>Phone number<input required inputMode="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+91 00000 00000"/></label><label>Email <span>(optional)</span><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com"/></label><label>Interested vehicle<input value={form.interested_vehicle} onChange={e=>update("interested_vehicle",e.target.value)} placeholder="Make and model"/></label>
    {kind==="Test-drive request"&&<><label>Preferred date<input type="date" value={form.preferred_date} onChange={e=>update("preferred_date",e.target.value)}/></label><label>Preferred time<input type="time" value={form.preferred_time} onChange={e=>update("preferred_time",e.target.value)}/></label></>}
    <label className="form-wide">How can we help?<textarea rows={3} value={form.message} onChange={e=>update("message",e.target.value)} placeholder="Tell us what you are looking for..."/></label></div>
    <input className="honeypot" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} aria-hidden="true"/>
    <button className="button button-green full-button" disabled={busy}>{busy?"Submitting...":"Send enquiry"} <Send size={15}/></button>
    {message&&<p className="form-message" role="status">{message}</p>}
    <p className="fine-print">Your details will only be used to respond to this enquiry.</p>
  </form>;
}

function PublicSite() {
  const [vehicles,setVehicles]=useState<Vehicle[]>(demoVehicles);
  useEffect(()=>{if(!supabase)return;supabase.from("vehicles").select("*").order("created_at",{ascending:false}).then(({data,error})=>{if(!error&&data)setVehicles(data as Vehicle[])})},[]);
  return <><Header/>
    <main>
      <section className="hero" id="home"><HeroVideo/><div className="hero-content"><span className="eyebrow light">EST. WITH EXPERIENCE · PANIPAT</span><h1>Find your<br/><em>next drive.</em></h1><p>Where exceptional automobiles meet experience and trust. Explore a considered collection, guided by over 30 years in the automobile business.</p><div className="hero-buttons"><a className="button button-gold" href="#inventory">Explore our collection <ArrowUpRight size={16}/></a><a className="hero-link" href="#contact">Contact our team <ArrowRight size={16}/></a></div></div><a className="scroll-cue" href="#stats"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a><div className="hero-index">01 <span>/ 06</span></div></section>
      <section className="stats-strip" id="stats"><div className="stat"><b>30<span>+</span></b><strong>YEARS OF EXPERIENCE</strong><p>Over three decades in the automobile business.</p></div><div className="stat"><b>4.9<span>/5</span></b><strong>GOOGLE RATING</strong><p>Customer feedback reflecting the dealership's experience.</p></div><div className="stat"><b>All</b><strong>AUTOMOBILE SEGMENTS</strong><p>From everyday hatchbacks to premium luxury automobiles.</p></div><div className="stat"><b>Panipat</b><strong>ROOTED IN HARYANA</strong><p>A local dealership with a customer-first approach.</p></div></section>
      <Inventory vehicles={vehicles}/>
      <section className="category-section" id="categories"><div className="section-heading"><div><span className="eyebrow">03 / EXPLORE BY CATEGORY</span><h2>Made for every<br/><em>kind of journey.</em></h2></div><p>Whether it's a daily commute, a family road trip or a statement of achievement, find the segment that fits your next chapter.</p></div><div className="category-grid">{[{n:"01",t:"Hatchbacks",d:"Compact, capable and made for the everyday.",c:"category-hatch"},{n:"02",t:"MUV & Family",d:"Space and comfort for the people who matter.",c:"category-muv"},{n:"03",t:"Sedans",d:"A composed drive with timeless proportions.",c:"category-sedan"},{n:"04",t:"SUVs",d:"Versatility, presence and confidence.",c:"category-suv"},{n:"05",t:"Luxury",d:"Refinement in every detail.",c:"category-luxury"}].map(x=><a href="#inventory" key={x.n} className={`category-tile ${x.c}`}><span>{x.n} / SEGMENT</span><div><h3>{x.t}</h3><p>{x.d}</p><ArrowUpRight size={19}/></div></a>)}</div></section>
      <section className="promise-section" id="promise"><div className="promise-intro"><span className="eyebrow light">04 / THE P.K. AUTO DEALS DIFFERENCE</span><h2>Experience is<br/><em>the difference.</em></h2><p>Attention to detail, a customer-focused approach and a broad view of the automobile market — brought together around your requirements.</p></div><div className="promise-grid"><article><span>01</span><Award/><h3>30+ years of experience</h3><p>Three decades of experience in the automobile business.</p></article><article><span>02</span><Users/><h3>Customer-focused guidance</h3><p>Explore vehicles that match your needs and budget.</p></article><article><span>03</span><CarFront/><h3>Multiple segments</h3><p>From practical family cars to premium automobiles.</p></article><article><span>04</span><ShieldCheck/><h3>Personalized experience</h3><p>A more attentive and straightforward approach to choosing your next car.</p></article></div></section>
      <section className="inspection-section"><div className="section-heading"><div><span className="eyebrow">05 / VEHICLE ASSURANCE</span><h2>Beyond the surface.<br/><em>Every detail matters.</em></h2></div><p>A vehicle's value is more than its appearance. Understanding its condition, documentation and history matters. Ask our team about the records available for a specific vehicle.</p></div><div className="inspection-grid">{[{icon:<CarFront/>,t:"Exterior",d:"Body condition, paint, glass, lights, tyres and wheels."},{icon:<Sparkles/>,t:"Interior",d:"Seats, dashboard, infotainment, air conditioning and electronics."},{icon:<Settings2/>,t:"Engine & mechanical",d:"Engine, transmission, brakes, suspension, battery and fluid leaks."},{icon:<ShieldCheck/>,t:"Safety",d:"Airbags, ABS, seat belts, parking sensors and reverse camera."},{icon:<ClipboardCheck/>,t:"Documentation",d:"Registration, insurance, service history and ownership records."}].map((x,i)=><article key={x.t}><span className="inspection-number">0{i+1}</span>{x.icon}<h3>{x.t}</h3><p>{x.d}</p></article>)}</div><p className="fine-print">Inspection categories shown are a guide only. No inspection or verification is claimed for a vehicle unless supporting records are available.</p></section>
      <section className="founder-section" id="about"><div className="founder-top"><span className="eyebrow">THE PERSON BEHIND P.K. AUTO DEALS</span><span className="founder-since">A LEGACY OF EXPERIENCE</span></div><h2>VARDHAN <em>ASIJA</em></h2><div className="founder-bottom"><div><span className="eyebrow">FOUNDER & OWNER</span><h3>Over three decades<br/>in the automobile business.</h3></div><div className="founder-bio"><p>Mr. Vardhan Asija is the founder and owner of P.K. Auto Deals. With more than 30 years of experience in the automobile business, he brings a deep understanding of customer requirements and automobile selection.</p><p>His approach centres on helping customers find suitable vehicles based on their preferences, requirements and budgets. At P.K. Auto Deals, the focus is on creating a comfortable, personalized and customer-oriented automobile buying experience.</p><p>From practical everyday vehicles to premium automobiles, the objective is to help every customer make a more confident choice.</p></div></div></section>
      <section className="testimonials-section"><div className="section-heading"><div><span className="eyebrow">07 / CUSTOMER STORIES</span><h2>The experience<br/><em>speaks.</em></h2></div><p>Every customer interaction is an opportunity to build lasting trust. Here are a few words shared by customers.</p></div><div className="testimonial-grid"><article><div className="stars">★★★★★</div><blockquote>“Great experience received from them. Got answers to all my car problems.”</blockquote><div className="reviewer"><b>Sahil Negi</b><span>Customer review</span></div></article><article className="testimonial-featured"><div className="stars">★★★★★</div><blockquote>“I had a wonderful experience at PK Auto Deals. The process was stress-free and pleasant. Mr. Vardhan Asija, the owner of the showroom, was able to find the suitable vehicle according to my need and budget. Now I am happy to become the owner of an Audi Q7. Thank you to Mr. Vardhan Asija.”</blockquote><div className="reviewer"><b>Inderpreet Singh</b><span>Customer review</span></div></article><article><div className="stars">★★★★★</div><blockquote>“Excellent customer service.”</blockquote><div className="reviewer"><b>Ishant Kashyap</b><span>Customer review</span></div></article></div></section>
      <EmiCalculator/>
      <section className="contact-section" id="contact"><div className="contact-copy"><span className="eyebrow light">08 / START A CONVERSATION</span><h2>Let's find the<br/><em>right car for you.</em></h2><p>Tell us what you're looking for. Our team is ready to help you explore your options.</p><div className="contact-details"><div><MapPin/><span><b>Visit our showroom</b><small>Old Court Road, Model Town, near Mahajan,<br/>Panipat, Haryana 132103, India.</small></span></div><div><Phone/><span><b>Call our team</b><small>{phoneDisplay}</small></span></div><div><Instagram/><span><b>Follow along</b><small>@pk_super_wheels</small></span></div></div><div className="contact-links"><a href="tel:+919812038600">Call now <ArrowUpRight size={15}/></a><a href={whatsappUrl("Hello P.K. Auto Deals, I would like to enquire about your vehicles.")} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={15}/></a><a href={mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15}/></a><a href="https://www.instagram.com/pk_super_wheels/?hl=en" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={15}/></a></div></div><div className="contact-form-wrap"><div className="form-heading"><span className="eyebrow">WE'RE HERE TO HELP</span><h3>Make an enquiry</h3><p>Share a few details and we'll take it from here.</p></div><EnquiryForm/></div></section>
      <section className="map-section"><div className="map-card"><div className="map-pin"><MapPin size={26}/></div><span className="eyebrow">FIND US IN PANIPAT</span><h3>P.K. Auto Deals</h3><p>Old Court Road, Model Town, near Mahajan<br/>Panipat, Haryana 132103, India</p><a className="button button-green" href={mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink size={15}/></a><small>Plus Code: 9XW4+JG Panipat, Haryana</small></div><div className="map-visual"><div className="map-lines"/><div className="map-label">MODEL TOWN</div><div className="map-location"><MapPin size={22}/><span>P.K. AUTO DEALS</span></div><div className="map-road road-one"/><div className="map-road road-two"/></div></section>
    </main>
    <footer className="footer"><div className="footer-main"><a className="brand brand-footer" href="#home"><span className="brand-mark">PK</span><span><b>P.K. AUTO DEALS</b><small>PREMIUM AUTOMOBILES</small></span></a><p>Premium automobiles.<br/>Experience you can trust.</p><a href="tel:+919812038600">{phoneDisplay} <ArrowUpRight size={14}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} P.K. Auto Deals. All rights reserved.</span><span>Panipat, Haryana, India</span><a href="/admin">Admin login</a></div></footer>
    <a className="floating-whatsapp" href={whatsappUrl("Hello P.K. Auto Deals, I would like to know more about your collection.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={22}/></a>
  </>;
}

function Admin() {
  const [session,setSession]=useState<any>(null),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[vehicles,setVehicles]=useState<Vehicle[]>([]),[leads,setLeads]=useState<Lead[]>([]),[tab,setTab]=useState("inventory"),[editing,setEditing]=useState<Vehicle|null>(null),[saving,setSaving]=useState(false),[photo,setPhoto]=useState<File|null>(null),[photoPreview,setPhotoPreview]=useState("");
  const blank:Partial<Vehicle>={brand:"",model:"",category:"SUVs",year:new Date().getFullYear(),registration_year:new Date().getFullYear(),price:null,km:null,fuel:"Petrol",transmission:"Manual",ownership:"First",registration:"HR",insurance:"To be verified",service_history:"To be verified",condition:"To be inspected",warranty:"Not specified",status:"Available",featured:false,image_url:"",demo:false};
  const [draft,setDraft]=useState<Partial<Vehicle>>(blank);
  useEffect(()=>{if(!photo){setPhotoPreview("");return}const url=URL.createObjectURL(photo);setPhotoPreview(url);return()=>URL.revokeObjectURL(url)},[photo]);
  async function load(){if(!supabase)return;const [v,l]=await Promise.all([supabase.from("vehicles").select("*").order("created_at",{ascending:false}),supabase.from("leads").select("*").order("created_at",{ascending:false})]);if(v.data)setVehicles(v.data as Vehicle[]);if(l.data)setLeads(l.data as Lead[])}
  useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
  useEffect(()=>{if(session)load()},[session]);
  async function login(e:React.FormEvent){e.preventDefault();if(!supabase){setError("Supabase is not configured. Add the project URL and anon key to .env.local.");return}const {error}=await supabase.auth.signInWithPassword({email,password});setError(error?.message??"")}
  async function saveVehicle(e:React.FormEvent){e.preventDefault();if(!supabase)return;setSaving(true);let image=draft.image_url??"";if(photo){const path=`${crypto.randomUUID()}-${photo.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const {error:upErr}=await supabase.storage.from("vehicle-images").upload(path,photo,{upsert:false});if(upErr){setError(upErr.message);setSaving(false);return}image=supabase.storage.from("vehicle-images").getPublicUrl(path).data.publicUrl}
    const payload={...draft,image_url:image,demo:false};
    const result=editing?await supabase.from("vehicles").update(payload).eq("id",editing.id):await supabase.from("vehicles").insert(payload);
    if(result.error)setError(result.error.message);else{setEditing(null);setDraft(blank);setPhoto(null);setError("");await load()}setSaving(false)}
  async function removeVehicle(id:string){if(!supabase||!confirm("Delete this vehicle listing?"))return;const {error}=await supabase.from("vehicles").delete().eq("id",id);if(error)setError(error.message);else load()}
  async function updateLead(id:string,status:string){if(!supabase)return;const {error}=await supabase.from("leads").update({status}).eq("id",id);if(error)setError(error.message);else load()}
  if(!session)return <div className="admin-login"><a className="brand" href="/"><span className="brand-mark">PK</span><span><b>P.K. AUTO DEALS</b><small>ADMINISTRATION</small></span></a><form onSubmit={login}><div className="admin-icon"><LogIn/></div><span className="eyebrow">SECURE ACCESS</span><h1>Admin sign in</h1><p>Sign in using the admin account created in Supabase Authentication.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="form-message error">{error}</p>}<button className="button button-green full-button">Sign in <ArrowRight size={15}/></button><a href="/" className="back-link">← Back to website</a></form></div>;
  return <div className="admin-shell"><aside className="admin-sidebar"><a className="brand" href="/"><span className="brand-mark">PK</span><span><b>P.K. AUTO DEALS</b><small>ADMIN PANEL</small></span></a><div className="admin-nav"><button className={tab==="inventory"?"active":""} onClick={()=>setTab("inventory")}><CarFront/> Inventory</button><button className={tab==="leads"?"active":""} onClick={()=>setTab("leads")}><MessageCircle/> Enquiries <span>{leads.length}</span></button></div><button className="admin-logout" onClick={()=>supabase?.auth.signOut()}><LogOut/> Sign out</button></aside><main className="admin-main"><div className="admin-top"><div><span className="eyebrow">P.K. AUTO DEALS / MANAGEMENT</span><h1>{tab==="inventory"?"Vehicle inventory":"Customer enquiries"}</h1></div><a href="/" target="_blank">View website <ArrowUpRight size={15}/></a></div>
    {error&&<p className="form-message error">{error}</p>}
    {tab==="inventory"?<><div className="admin-summary"><div><span>Total listings</span><b>{vehicles.length}</b></div><div><span>Available</span><b>{vehicles.filter(v=>v.status==="Available").length}</b></div><div><span>Featured</span><b>{vehicles.filter(v=>v.featured).length}</b></div></div><section className="admin-panel"><div className="admin-panel-heading"><div><h2>{editing?"Edit vehicle":"Add a vehicle"}</h2><p>Only publish verified specifications and correctly matched vehicle photos.</p></div>{editing&&<button className="text-button" onClick={()=>{setEditing(null);setDraft(blank);setPhoto(null)}}>Cancel edit</button>}</div><VehicleImage vehicle={{brand:draft.brand??"",model:draft.model??"",image_url:draft.image_url??"",demo:false}} imageUrl={photoPreview||undefined} className="admin-vehicle-preview"/><form className="admin-vehicle-form" onSubmit={saveVehicle}><div className="form-grid"><label>Make / brand<input required value={draft.brand??""} onChange={e=>setDraft(d=>({...d,brand:e.target.value}))}/></label><label>Model<input required value={draft.model??""} onChange={e=>setDraft(d=>({...d,model:e.target.value}))}/></label><label>Category<select value={draft.category??"SUVs"} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}>{["Hatchbacks","MUV","Sedans","SUVs","Luxury Sedans","Luxury SUVs"].map(x=><option>{x}</option>)}</select></label><label>Year<input type="number" value={draft.year??""} onChange={e=>setDraft(d=>({...d,year:+e.target.value}))}/></label><label>Price (INR)<input type="number" value={draft.price??""} onChange={e=>setDraft(d=>({...d,price:e.target.value===""?null:+e.target.value}))}/></label><label>Kilometres<input type="number" value={draft.km??""} onChange={e=>setDraft(d=>({...d,km:e.target.value===""?null:+e.target.value}))}/></label><label>Fuel<select value={draft.fuel??"Petrol"} onChange={e=>setDraft(d=>({...d,fuel:e.target.value}))}>{["Petrol","Diesel","CNG","Electric","Hybrid"].map(x=><option>{x}</option>)}</select></label><label>Transmission<select value={draft.transmission??"Manual"} onChange={e=>setDraft(d=>({...d,transmission:e.target.value}))}>{["Manual","Automatic","CVT","DCT"].map(x=><option>{x}</option>)}</select></label><label>Ownership<input value={draft.ownership??""} onChange={e=>setDraft(d=>({...d,ownership:e.target.value}))}/></label><label>Registration<input value={draft.registration??""} onChange={e=>setDraft(d=>({...d,registration:e.target.value}))}/></label><label>Availability<select value={draft.status??"Available"} onChange={e=>setDraft(d=>({...d,status:e.target.value}))}><option>Available</option><option>Sold</option><option>Reserved</option></select></label><label>Insurance status<input value={draft.insurance??""} onChange={e=>setDraft(d=>({...d,insurance:e.target.value}))}/></label><label>Service history<input value={draft.service_history??""} onChange={e=>setDraft(d=>({...d,service_history:e.target.value}))}/></label><label>Condition<input value={draft.condition??""} onChange={e=>setDraft(d=>({...d,condition:e.target.value}))}/></label><label>Warranty<input value={draft.warranty??""} onChange={e=>setDraft(d=>({...d,warranty:e.target.value}))}/></label><label className="form-wide">Vehicle photo<input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]??null)}/><small>Upload a photograph of this exact make and model. Verify before publishing.</small></label></div>{photo&&<p className="photo-selected"><Check size={14}/> {photo.name}</p>}<label className="admin-check"><input type="checkbox" checked={Boolean(draft.featured)} onChange={e=>setDraft(d=>({...d,featured:e.target.checked}))}/> Feature this vehicle</label><button className="button button-green" disabled={saving}>{saving?"Saving...":editing?"Save changes":"Add vehicle"} <Plus size={15}/></button></form></section><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Published inventory</h2><p>Manage active vehicle listings and their details.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Vehicle</th><th>Price</th><th>KM</th><th>Status</th><th>Actions</th></tr></thead><tbody>{vehicles.map(v=><tr key={v.id}><td><b>{v.brand} {v.model}</b><small>{v.year} · {v.category}</small></td><td>{formatPrice(v.price)}</td><td>{v.km?.toLocaleString("en-IN")??"—"}</td><td><span className="status">{v.status}</span></td><td><button title="Edit" onClick={()=>{setEditing(v);setDraft(v);window.scrollTo({top:0,behavior:"smooth"})}}><Pencil size={15}/></button><button title="Delete" onClick={()=>removeVehicle(v.id)}><Trash2 size={15}/></button></td></tr>)}</tbody></table>{!vehicles.length&&<p className="empty-admin">No live listings yet. Add your first vehicle above.</p>}</div></section></>:<section className="admin-panel"><div className="admin-panel-heading"><div><h2>Incoming enquiries</h2><p>Customer requests submitted from the public website.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Interest</th><th>Received</th><th>Status</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td><b>{l.name}</b><small>{l.phone}{l.email?` · ${l.email}`:""}</small></td><td>{l.interested_vehicle||l.type}<small>{l.message}</small></td><td>{new Date(l.created_at).toLocaleDateString("en-IN")}</td><td><select value={l.status} onChange={e=>updateLead(l.id,e.target.value)}><option>New</option><option>Contacted</option><option>Qualified</option><option>Closed</option></select></td></tr>)}</tbody></table>{!leads.length&&<p className="empty-admin">No enquiries have been received yet.</p>}</div></section>}</main></div>;
}

export default function App(){const isAdmin=window.location.pathname.startsWith("/admin");return isAdmin?<Admin/>:<PublicSite/>;}
