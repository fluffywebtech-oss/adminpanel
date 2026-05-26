// PropertyInsta Admin Panel - Mock Data
export const formatPriceIndian = (price) => {
  if (price >= 10000000) return '₹' + (price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2) + ' Cr';
  if (price >= 100000) return '₹' + (price / 100000).toFixed(price % 100000 === 0 ? 0 : 2) + ' L';
  return '₹' + price.toLocaleString('en-IN');
};

export const allProperties = [
  { id:1, title:"Modern Downtown Loft", location:"Downtown District", price:2500000, beds:2, baths:2, sqft:1200, type:"apartment", status:"sale", builder:"Prestige Group", reraId:"KA/RERA/2024/1256", possessionStatus:"Ready to Move", floor:"12th of 25 floors", furnishing:"Fully Furnished", emiEstimate:19850, bankOffers:true, images:["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop","https://images.unsplash.com/photo-1554995207-c18210cc60cd?w=600&h=400&fit=crop"], amenities:["pool","gym","parking"], featured:true, hot:false, badge:"featured", openHouse:false, facing:"North-East", parking:"2 Covered", pricePerSqft:2083, verified:true, views:4500, description:"Stunning modern loft in the heart of downtown featuring floor-to-ceiling windows, hardwood floors, and premium finishes.", agent:{ id:"agent1", name:"Sarah Kim", avatar:"https://i.pravatar.cc/150?img=1", rating:4.9, sales:47, phone:"+1-555-0101", email:"sarah@propertyinsta.com" }, postDate:"2 hours ago", comments:12, shares:5, lat:40.7128, lng:-74.006, neighborhood:{schools:"A+", transit:"Excellent", walkScore:95, crimeRate:"Low" }, floorPlan:"https://images.unsplash.com/photo-1628744448840-3b3b6b6b6b6b?w=600&h=400&fit=crop" },
  { id:2, title:"Luxury Beach Villa", location:"Coastal Area", price:5200000, beds:4, baths:3, sqft:2800, type:"villa", status:"sale", builder:"Lodha Group", reraId:"MH/RERA/2023/8921", possessionStatus:"Ready to Move", floor:"Ground + 2 floors", furnishing:"Semi-Furnished", emiEstimate:39850, bankOffers:true, images:["https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=600&h=400&fit=crop"], amenities:["pool","garden","parking"], featured:true, hot:true, badge:"hot", openHouse:true, facing:"West", parking:"4 Covered", pricePerSqft:1857, verified:true, views:8200, description:"Breathtaking beachfront villa with private infinity pool.", agent:{ id:"agent2", name:"Mike Rodriguez", avatar:"https://i.pravatar.cc/150?img=3", rating:4.8, sales:89, phone:"+1-555-0102", email:"mike@propertyinsta.com" }, postDate:"5 hours ago", comments:24, shares:15, lat:25.7617, lng:-80.1918, neighborhood:{schools:"B+", transit:"Good", walkScore:72, crimeRate:"Very Low" }, floorPlan:null },
  { id:3, title:"Cozy Garden Cottage", location:"Suburban Haven", price:1800000, beds:2, baths:1, sqft:900, type:"cottage", status:"sale", builder:"Godrej Properties", reraId:"KA/RERA/2025/3412", possessionStatus:"Ready to Move", floor:"Ground floor", furnishing:"Fully Furnished", emiEstimate:13850, bankOffers:true, images:["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop"], amenities:["garden","parking"], featured:false, hot:false, badge:null, openHouse:false, facing:"South", parking:"1 Open", pricePerSqft:2000, verified:true, views:2100, description:"Charming garden cottage with blooming flowers.", agent:{ id:"agent3", name:"Emma Liu", avatar:"https://i.pravatar.cc/150?img=5", rating:4.7, sales:32, phone:"+1-555-0103", email:"emma@propertyinsta.com" }, postDate:"1 day ago", comments:8, shares:3, lat:37.7749, lng:-122.4194, neighborhood:{schools:"A", transit:"Good", walkScore:68, crimeRate:"Low" }, floorPlan:null },
  { id:4, title:"Minimalist Studio", location:"Metro Center", price:1200000, beds:1, baths:1, sqft:450, type:"studio", status:"rent", builder:"DLF Limited", reraId:"DL/RERA/2024/5678", possessionStatus:"Ready to Move", floor:"8th of 20 floors", furnishing:"Unfurnished", emiEstimate:9850, bankOffers:false, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"], amenities:["gym","parking"], featured:false, hot:true, badge:"hot", openHouse:false, facing:"East", parking:"None", pricePerSqft:2667, verified:true, views:3600, description:"Sleek minimalist studio steps from metro.", agent:{ id:"agent4", name:"Alex Park", avatar:"https://i.pravatar.cc/150?img=7", rating:4.6, sales:21, phone:"+1-555-0104", email:"alex@propertyinsta.com" }, postDate:"3 hours ago", comments:6, shares:2, lat:40.758, lng:-73.9855, neighborhood:{schools:"B", transit:"Excellent", walkScore:98, crimeRate:"Medium" }, floorPlan:null },
  { id:5, title:"Spacious Family Home", location:"Green Valley", price:3800000, beds:4, baths:3, sqft:2200, type:"apartment", status:"sale", builder:"Brigade Group", reraId:"KA/RERA/2024/7890", possessionStatus:"Under Construction", floor:"5th of 15 floors", furnishing:"Semi-Furnished", emiEstimate:29850, bankOffers:true, images:["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"], amenities:["pool","gym","garden","parking"], featured:true, hot:false, badge:"featured", openHouse:false, facing:"North", parking:"2 Covered", pricePerSqft:1727, verified:true, views:5200, description:"Spacious family home with excellent schools nearby.", agent:{ id:"agent5", name:"Lisa Martinez", avatar:"https://i.pravatar.cc/150?img=9", rating:4.9, sales:63, phone:"+1-555-0105", email:"lisa@propertyinsta.com" }, postDate:"7 hours ago", comments:18, shares:9, lat:34.0522, lng:-118.2437, neighborhood:{schools:"A+", transit:"Good", walkScore:65, crimeRate:"Very Low" }, floorPlan:null },
  { id:6, title:"Penthouse Executive", location:"Business District", price:6500000, beds:3, baths:3, sqft:1800, type:"penthouse", status:"sale", builder:"Tata Housing", reraId:"MH/RERA/2025/1123", possessionStatus:"Ready to Move", floor:"30th floor", furnishing:"Fully Furnished", emiEstimate:49850, bankOffers:true, images:["https://images.unsplash.com/photo-1631679706909-1844bbd54340?w=600&h=400&fit=crop"], amenities:["pool","gym","parking","security","smartHome"], featured:true, hot:true, badge:"hot", openHouse:true, facing:"South-West", parking:"3 Covered", pricePerSqft:3611, verified:true, views:9800, description:"Executive penthouse with 360° skyline views.", agent:{ id:"agent6", name:"David Chen", avatar:"https://i.pravatar.cc/150?img=11", rating:5.0, sales:102, phone:"+1-555-0106", email:"david@propertyinsta.com" }, postDate:"12 hours ago", comments:35, shares:21, lat:40.758, lng:-73.9855, neighborhood:{schools:"A", transit:"Excellent", walkScore:99, crimeRate:"Low" }, floorPlan:null },
  { id:7, title:"Rustic Mountain Cottage", location:"Hill Station", price:2200000, beds:3, baths:2, sqft:1400, type:"cottage", status:"sale", builder:"Sobha Limited", reraId:"KA/RERA/2023/4532", possessionStatus:"Ready to Move", floor:"Ground floor", furnishing:"Fully Furnished", emiEstimate:17850, bankOffers:false, images:["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"], amenities:["garden","parking"], featured:false, hot:false, badge:null, openHouse:false, facing:"East", parking:"2 Open", pricePerSqft:1571, verified:true, views:1800, description:"Rustic mountain retreat with stunning valley views.", agent:{ id:"agent7", name:"Nina Williams", avatar:"https://i.pravatar.cc/150?img=13", rating:4.5, sales:18, phone:"+1-555-0107", email:"nina@propertyinsta.com" }, postDate:"2 days ago", comments:4, shares:1, lat:39.5501, lng:-105.7821, neighborhood:{schools:"B", transit:"Limited", walkScore:35, crimeRate:"Very Low" }, floorPlan:null },
  { id:8, title:"Contemporary Villa", location:"Modern District", price:4900000, beds:4, baths:4, sqft:2600, type:"villa", status:"sale", builder:"Oberoi Realty", reraId:"MH/RERA/2024/6789", possessionStatus:"Under Construction", floor:"Ground + 1 floor", furnishing:"Semi-Furnished", emiEstimate:37850, bankOffers:true, images:["https://images.unsplash.com/photo-1600607687939-ce8a6c432b0d?w=600&h=400&fit=crop"], amenities:["pool","gym","garden","parking","smartHome"], featured:false, hot:true, badge:"hot", openHouse:false, facing:"North-East", parking:"3 Covered", pricePerSqft:1885, verified:false, views:6700, description:"Ultra-modern villa with floor-to-ceiling glass.", agent:{ id:"agent8", name:"Tom Harris", avatar:"https://i.pravatar.cc/150?img=15", rating:4.8, sales:56, phone:"+1-555-0108", email:"tom@propertyinsta.com" }, postDate:"1 day ago", comments:15, shares:7, lat:33.6846, lng:-117.8265, neighborhood:{schools:"A", transit:"Good", walkScore:55, crimeRate:"Low" }, floorPlan:null },
  { id:9, title:"Urban Studio Plus", location:"Downtown Core", price:1550000, beds:1, baths:1, sqft:550, type:"studio", status:"rent", builder:"Prestige Group", reraId:"KA/RERA/2024/1257", possessionStatus:"Ready to Move", floor:"15th of 22 floors", furnishing:"Fully Furnished", emiEstimate:12850, bankOffers:false, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"], amenities:["gym","parking","security"], featured:false, hot:false, badge:null, openHouse:false, facing:"West", parking:"1 Covered", pricePerSqft:2818, verified:true, views:2400, description:"Compact yet stylish urban studio.", agent:{ id:"agent1", name:"Sarah Kim", avatar:"https://i.pravatar.cc/150?img=1", rating:4.9, sales:47, phone:"+1-555-0101", email:"sarah@propertyinsta.com" }, postDate:"4 hours ago", comments:3, shares:1, lat:40.7128, lng:-74.006, neighborhood:{schools:"B+", transit:"Excellent", walkScore:96, crimeRate:"Medium" }, floorPlan:null },
  { id:10, title:"Serene Lakeside Retreat", location:"Lake District", price:3100000, beds:3, baths:2, sqft:1800, type:"cottage", status:"sale", builder:"Godrej Properties", reraId:"KA/RERA/2025/3413", possessionStatus:"Ready to Move", floor:"Ground floor", furnishing:"Fully Furnished", emiEstimate:24850, bankOffers:true, images:["https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop"], amenities:["garden","parking","pool"], featured:true, hot:false, badge:"featured", openHouse:false, facing:"South", parking:"2 Open", pricePerSqft:1722, verified:true, views:3400, description:"Peaceful lakeside property with private dock.", agent:{ id:"agent9", name:"James Wilson", avatar:"https://i.pravatar.cc/150?img=17", rating:4.7, sales:41, phone:"+1-555-0109", email:"james@propertyinsta.com" }, postDate:"6 hours ago", comments:11, shares:6, lat:47.6062, lng:-122.3321, neighborhood:{schools:"A", transit:"Moderate", walkScore:42, crimeRate:"Very Low" }, floorPlan:null },
  { id:11, title:"Luxury Farmhouse Estate", location:"Countryside", price:4200000, beds:5, baths:4, sqft:3500, type:"farmhouse", status:"sale", builder:"Lodha Group", reraId:"MH/RERA/2023/8922", possessionStatus:"Ready to Move", floor:"Ground + 1 floor", furnishing:"Semi-Furnished", emiEstimate:32850, bankOffers:true, images:["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop"], amenities:["pool","garden","parking","security"], featured:true, hot:true, badge:"hot", openHouse:true, facing:"North", parking:"6 Covered", pricePerSqft:1200, verified:true, views:5600, description:"Grand farmhouse estate with organic gardens.", agent:{ id:"agent10", name:"Olivia Brown", avatar:"https://i.pravatar.cc/150?img=19", rating:4.9, sales:78, phone:"+1-555-0110", email:"olivia@propertyinsta.com" }, postDate:"8 hours ago", comments:22, shares:14, lat:38.9072, lng:-77.0369, neighborhood:{schools:"A", transit:"Limited", walkScore:25, crimeRate:"Very Low" }, floorPlan:null },
  { id:12, title:"Tech Hub Smart Apartment", location:"Innovation Park", price:2800000, beds:2, baths:2, sqft:1100, type:"apartment", status:"rent", builder:"DLF Limited", reraId:"DL/RERA/2024/5679", possessionStatus:"Ready to Move", floor:"20th of 30 floors", furnishing:"Fully Furnished", emiEstimate:22850, bankOffers:true, images:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"], amenities:["gym","parking","smartHome","security"], featured:false, hot:true, badge:"hot", openHouse:false, facing:"East", parking:"1 Covered", pricePerSqft:2545, verified:true, views:4200, description:"Fully automated smart apartment.", agent:{ id:"agent11", name:"Ryan Patel", avatar:"https://i.pravatar.cc/150?img=21", rating:4.6, sales:35, phone:"+1-555-0111", email:"ryan@propertyinsta.com" }, postDate:"9 hours ago", comments:9, shares:5, lat:37.4419, lng:-122.143, neighborhood:{schools:"A+", transit:"Good", walkScore:78, crimeRate:"Low" }, floorPlan:null },
  { id:13, title:"Heritage Mansion", location:"Old Town", price:8500000, beds:6, baths:5, sqft:5000, type:"villa", status:"sale", builder:"Tata Housing", reraId:"MH/RERA/2025/1124", possessionStatus:"Ready to Move", floor:"Ground + 2 floors", furnishing:"Semi-Furnished", emiEstimate:64850, bankOffers:true, images:["https://images.unsplash.com/photo-1600566753086-00f18f6b0050?w=600&h=400&fit=crop"], amenities:["pool","garden","parking","security"], featured:true, hot:true, badge:"hot", openHouse:true, facing:"North-East", parking:"8 Covered", pricePerSqft:1700, verified:true, views:12000, description:"Restored heritage mansion with original architecture.", agent:{ id:"agent6", name:"David Chen", avatar:"https://i.pravatar.cc/150?img=11", rating:5.0, sales:102, phone:"+1-555-0106", email:"david@propertyinsta.com" }, postDate:"1 day ago", comments:45, shares:28, lat:29.9511, lng:-90.0715, neighborhood:{schools:"A", transit:"Good", walkScore:60, crimeRate:"Low" }, floorPlan:null },
  { id:14, title:"Coastal Studio Escape", location:"Beach Town", price:980000, beds:1, baths:1, sqft:400, type:"studio", status:"sale", builder:"Sobha Limited", reraId:"KA/RERA/2023/4533", possessionStatus:"Ready to Move", floor:"3rd of 8 floors", furnishing:"Unfurnished", emiEstimate:7850, bankOffers:false, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"], amenities:["parking"], featured:false, hot:false, badge:null, openHouse:false, facing:"West", parking:"None", pricePerSqft:2450, verified:false, views:1500, description:"Budget-friendly beach studio.", agent:{ id:"agent12", name:"Mia Torres", avatar:"https://i.pravatar.cc/150?img=23", rating:4.4, sales:15, phone:"+1-555-0112", email:"mia@propertyinsta.com" }, postDate:"3 days ago", comments:2, shares:0, lat:32.7157, lng:-117.1611, neighborhood:{schools:"C+", transit:"Limited", walkScore:80, crimeRate:"Low" }, floorPlan:null },
  { id:15, title:"Skyline Tower Apartment", location:"Skyline District", price:7200000, beds:3, baths:3, sqft:2000, type:"penthouse", status:"sale", builder:"Brigade Group", reraId:"KA/RERA/2024/7891", possessionStatus:"Under Construction", floor:"40th of 45 floors", furnishing:"Fully Furnished", emiEstimate:56850, bankOffers:true, images:["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop"], amenities:["pool","gym","parking","security","smartHome"], featured:true, hot:true, badge:"hot", openHouse:false, facing:"South-West", parking:"2 Covered", pricePerSqft:3600, verified:false, views:10500, description:"Premium high-rise living with 270° skyline views.", agent:{ id:"agent13", name:"Priya Mehta", avatar:"https://i.pravatar.cc/150?img=25", rating:4.9, sales:88, phone:"+1-555-0113", email:"priya@propertyinsta.com" }, postDate:"10 hours ago", comments:38, shares:24, lat:41.8781, lng:-87.6298, neighborhood:{schools:"A", transit:"Excellent", walkScore:94, crimeRate:"Medium" }, floorPlan:null },
  { id:16, title:"Garden View Apartment", location:"Suburb East", price:1950000, beds:2, baths:2, sqft:950, type:"apartment", status:"rent", builder:"Oberoi Realty", reraId:"MH/RERA/2024/6790", possessionStatus:"Ready to Move", floor:"2nd of 10 floors", furnishing:"Semi-Furnished", emiEstimate:15850, bankOffers:true, images:["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"], amenities:["garden","parking","gym"], featured:false, hot:false, badge:null, openHouse:false, facing:"North", parking:"1 Covered", pricePerSqft:2053, verified:true, views:1900, description:"Bright and airy apartment overlooking community gardens.", agent:{ id:"agent14", name:"Carlos Mendez", avatar:"https://i.pravatar.cc/150?img=27", rating:4.5, sales:29, phone:"+1-555-0114", email:"carlos@propertyinsta.com" }, postDate:"2 days ago", comments:5, shares:2, lat:42.3601, lng:-71.0589, neighborhood:{schools:"A+", transit:"Good", walkScore:70, crimeRate:"Low" }, floorPlan:null },
  { id:17, title:"Mountain View Cabin", location:"Alpine Heights", price:1750000, beds:2, baths:1, sqft:800, type:"cottage", status:"sale", builder:"Sobha Limited", reraId:"KA/RERA/2023/4534", possessionStatus:"Ready to Move", floor:"Ground floor", furnishing:"Fully Furnished", emiEstimate:13850, bankOffers:false, images:["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"], amenities:["garden","parking"], featured:false, hot:false, badge:null, openHouse:false, facing:"South", parking:"1 Open", pricePerSqft:2188, verified:true, views:1600, description:"Cozy log cabin with stunning mountain views.", agent:{ id:"agent7", name:"Nina Williams", avatar:"https://i.pravatar.cc/150?img=13", rating:4.5, sales:18, phone:"+1-555-0107", email:"nina@propertyinsta.com" }, postDate:"4 days ago", comments:3, shares:1, lat:39.7392, lng:-104.9903, neighborhood:{schools:"B-", transit:"Limited", walkScore:20, crimeRate:"Very Low" }, floorPlan:null },
  { id:18, title:"Heritage Bungalow", location:"Colonial Town", price:3400000, beds:4, baths:3, sqft:2400, type:"villa", status:"sale", builder:"Godrej Properties", reraId:"KA/RERA/2025/3414", possessionStatus:"Ready to Move", floor:"Ground + 1 floor", furnishing:"Semi-Furnished", emiEstimate:26850, bankOffers:true, images:["https://images.unsplash.com/photo-1600566753086-00f18f6b0050?w=600&h=400&fit=crop"], amenities:["garden","parking","pool"], featured:true, hot:false, badge:"featured", openHouse:false, facing:"East", parking:"3 Covered", pricePerSqft:1417, verified:true, views:4800, description:"Beautifully preserved colonial bungalow.", agent:{ id:"agent15", name:"Raj Sharma", avatar:"https://i.pravatar.cc/150?img=29", rating:4.8, sales:54, phone:"+1-555-0115", email:"raj@propertyinsta.com" }, postDate:"1 day ago", comments:16, shares:10, lat:30.2672, lng:-97.7431, neighborhood:{schools:"A", transit:"Moderate", walkScore:55, crimeRate:"Low" }, floorPlan:null },
  { id:19, title:"Downtown Micro Loft", location:"Arts District", price:850000, beds:1, baths:1, sqft:350, type:"studio", status:"rent", builder:"DLF Limited", reraId:"DL/RERA/2024/5680", possessionStatus:"Ready to Move", floor:"5th of 12 floors", furnishing:"Semi-Furnished", emiEstimate:6850, bankOffers:false, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"], amenities:["gym","parking"], featured:false, hot:false, badge:null, openHouse:false, facing:"North", parking:"None", pricePerSqft:2429, verified:true, views:2200, description:"Tiny but mighty micro loft in the vibrant arts district.", agent:{ id:"agent4", name:"Alex Park", avatar:"https://i.pravatar.cc/150?img=7", rating:4.6, sales:21, phone:"+1-555-0104", email:"alex@propertyinsta.com" }, postDate:"5 hours ago", comments:7, shares:3, lat:34.0407, lng:-118.2468, neighborhood:{schools:"B", transit:"Excellent", walkScore:92, crimeRate:"Medium" }, floorPlan:null },
  { id:20, title:"Commercial Plaza Office", location:"Business Hub", price:9800000, beds:0, baths:4, sqft:6000, type:"commercial", status:"sale", builder:"Tata Housing", reraId:"MH/RERA/2025/1125", possessionStatus:"Ready to Move", floor:"3rd of 15 floors", furnishing:"Unfurnished", emiEstimate:74850, bankOffers:true, images:["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"], amenities:["parking","security","smartHome"], featured:true, hot:true, badge:"hot", openHouse:false, facing:"North-East", parking:"10 Covered", pricePerSqft:1633, verified:true, views:7800, description:"Prime commercial space with open floor plan.", agent:{ id:"agent2", name:"Mike Rodriguez", avatar:"https://i.pravatar.cc/150?img=3", rating:4.8, sales:89, phone:"+1-555-0102", email:"mike@propertyinsta.com" }, postDate:"6 hours ago", comments:28, shares:18, lat:40.7128, lng:-74.006, neighborhood:{schools:"N/A", transit:"Excellent", walkScore:97, crimeRate:"Medium" }, floorPlan:null },
  { id:21, title:"Eco-Friendly Smart Home", location:"Green Zone", price:4600000, beds:4, baths:3, sqft:2800, type:"farmhouse", status:"sale", builder:"Brigade Group", reraId:"KA/RERA/2024/7892", possessionStatus:"Under Construction", floor:"Ground + 1 floor", furnishing:"Semi-Furnished", emiEstimate:35850, bankOffers:true, images:["https://images.unsplash.com/photo-1558036117-15d93e5c8e8e?w=600&h=400&fit=crop"], amenities:["garden","parking","pool","smartHome","security"], featured:true, hot:true, badge:"hot", openHouse:false, facing:"North", parking:"4 Covered", pricePerSqft:1643, verified:false, views:7200, description:"Net-zero energy home with solar panels.", agent:{ id:"agent16", name:"Luna Garcia", avatar:"https://i.pravatar.cc/150?img=31", rating:4.9, sales:67, phone:"+1-555-0116", email:"luna@propertyinsta.com" }, postDate:"7 hours ago", comments:31, shares:20, lat:37.8044, lng:-122.2712, neighborhood:{schools:"A+", transit:"Good", walkScore:62, crimeRate:"Low" }, floorPlan:null },
  { id:22, title:"Sunset Boulevard Villa", location:"Hollywood Hills", price:8900000, beds:5, baths:5, sqft:4200, type:"villa", status:"sale", builder:"Oberoi Realty", reraId:"MH/RERA/2024/6791", possessionStatus:"Ready to Move", floor:"Ground + 2 floors", furnishing:"Fully Furnished", emiEstimate:68850, bankOffers:true, images:["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"], amenities:["pool","gym","garden","parking","security","smartHome"], featured:true, hot:true, badge:"hot", openHouse:true, facing:"West", parking:"5 Covered", pricePerSqft:2119, verified:true, views:13500, description:"Iconic Hollywood Hills estate with infinity pool.", agent:{ id:"agent13", name:"Priya Mehta", avatar:"https://i.pravatar.cc/150?img=25", rating:4.9, sales:88, phone:"+1-555-0113", email:"priya@propertyinsta.com" }, postDate:"4 hours ago", comments:52, shares:35, lat:34.0928, lng:-118.3287, neighborhood:{schools:"A", transit:"Moderate", walkScore:45, crimeRate:"Low" }, floorPlan:null },
  { id:23, title:"Student Studio Apartment", location:"University District", price:650000, beds:1, baths:1, sqft:300, type:"studio", status:"rent", builder:"Godrej Properties", reraId:"KA/RERA/2025/3415", possessionStatus:"Ready to Move", floor:"10th of 15 floors", furnishing:"Unfurnished", emiEstimate:5850, bankOffers:false, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"], amenities:["gym","parking"], featured:false, hot:false, badge:null, openHouse:false, facing:"South", parking:"None", pricePerSqft:2167, verified:true, views:1100, description:"Affordable student studio near campus.", agent:{ id:"agent17", name:"Amy Chen", avatar:"https://i.pravatar.cc/150?img=33", rating:4.3, sales:12, phone:"+1-555-0117", email:"amy@propertyinsta.com" }, postDate:"1 day ago", comments:2, shares:1, lat:40.4465, lng:-79.9933, neighborhood:{schools:"B", transit:"Good", walkScore:85, crimeRate:"Medium" }, floorPlan:null },
  { id:24, title:"Waterfront Penthouse", location:"Marina Bay", price:11000000, beds:4, baths:4, sqft:3200, type:"penthouse", status:"sale", builder:"Lodha Group", reraId:"MH/RERA/2023/8923", possessionStatus:"Ready to Move", floor:"50th floor", furnishing:"Fully Furnished", emiEstimate:84850, bankOffers:true, images:["https://images.unsplash.com/photo-1631679706909-1844bbd54340?w=600&h=400&fit=crop"], amenities:["pool","gym","parking","security","smartHome"], featured:true, hot:true, badge:"hot", openHouse:true, facing:"South-West", parking:"4 Covered", pricePerSqft:3438, verified:true, views:15000, description:"Ultimate waterfront penthouse with private boat slip.", agent:{ id:"agent6", name:"David Chen", avatar:"https://i.pravatar.cc/150?img=11", rating:5.0, sales:102, phone:"+1-555-0106", email:"david@propertyinsta.com" }, postDate:"3 hours ago", comments:68, shares:42, lat:37.8044, lng:-122.4062, neighborhood:{schools:"A+", transit:"Good", walkScore:72, crimeRate:"Very Low" }, floorPlan:null },
];

export const allReels = [
  { id:101, propertyId:1, title:"Modern Downtown Loft", location:"Downtown District", price:2500000, category:"luxury", video:"https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4", thumbnail:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=800&fit=crop", description:"Stunning modern loft with panoramic city views", views:1200, likes:89, status:"Published", duration:"0:32", tags:["luxury","loft","city-view","modern"], agentName:"Sarah K.", builder:"Prestige Group", reraId:"KA/RERA/2024/1256", possessionDate:"Ready to Move", sqft:1200, furnishing:"Fully Furnished", floor:"12th of 25 floors", emiEstimate:19850, bankOffers:true },
  { id:102, propertyId:2, title:"Luxury Beach Villa", location:"Coastal Area", price:5200000, category:"premium", video:"https://videos.pexels.com/video-files/2911996/2911996-hd_1920_1080_30fps.mp4", thumbnail:"https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=600&h=800&fit=crop", description:"Breathtaking beachfront villa with private infinity pool", views:2840, likes:234, status:"Published", duration:"0:45", tags:["beach","villa","infinity-pool","premium"], agentName:"Mike R.", builder:"Lodha Group", reraId:"MH/RERA/2024/0891", possessionDate:"Ready to Move", sqft:2800, furnishing:"Semi-Furnished", floor:"Ground + 1", emiEstimate:41300, bankOffers:true },
  { id:103, propertyId:3, title:"Cozy Garden Cottage", location:"Suburban Haven", price:1800000, category:"family", video:"https://videos.pexels.com/video-files/7710243/7710243-hd_1920_1080_30fps.mp4", thumbnail:"https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=800&fit=crop", description:"Perfect family home with beautiful garden", views:950, likes:76, status:"Published", duration:"0:28", tags:["garden","family","cottage","suburb"], agentName:"Emma L.", builder:"Godrej Properties", reraId:"KA/RERA/2024/3321", possessionDate:"Ready to Move", sqft:900, furnishing:"Fully Furnished", floor:"Ground Floor", emiEstimate:14300, bankOffers:false },
  { id:104, propertyId:4, title:"Minimalist Studio", location:"Metro Center", price:1200000, category:"budget", video:"https://videos.pexels.com/video-files/4248199/4248199-hd_1920_1080_25fps.mp4", thumbnail:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=800&fit=crop", description:"Affordable studio apartment with modern amenities", views:1650, likes:128, status:"Published", duration:"0:22", tags:["studio","budget","metro","minimalist"], agentName:"Alex P.", builder:"Sobha Limited", reraId:"KA/RERA/2025/4419", possessionDate:"Ready to Move", sqft:450, furnishing:"Semi-Furnished", floor:"3rd of 12 floors", emiEstimate:9500, bankOffers:true },
  { id:105, propertyId:5, title:"Spacious Family Home", location:"Green Valley", price:3800000, category:"family", video:"https://videos.pexels.com/video-files/1788310/1788310-hd_1920_1080_24fps.mp4", thumbnail:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop", description:"Spacious 4-bedroom family home with pool", views:2100, likes:189, status:"Published", duration:"0:38", tags:["family","spacious","pool","4bhk"], agentName:"John D.", builder:"Brigade Group", reraId:"KA/RERA/2024/5562", possessionDate:"Ready to Move", sqft:2200, furnishing:"Fully Furnished", floor:"2nd of 8 floors", emiEstimate:30170, bankOffers:true },
  { id:106, propertyId:6, title:"Penthouse Executive", location:"Business District", price:6500000, category:"premium", video:"https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4", thumbnail:"https://images.unsplash.com/photo-1631679706909-1844bbd54340?w=600&h=800&fit=crop", description:"Ultimate luxury penthouse", views:3200, likes:298, status:"Published", duration:"0:35", tags:["penthouse","executive","premium","skyline"], agentName:"Priya M.", builder:"DLF Limited", reraId:"HR/RERA/2024/7710", possessionDate:"Ready to Move", sqft:1800, furnishing:"Fully Furnished", floor:"25th of 25 floors", emiEstimate:51600, bankOffers:true },
  { id:107, propertyId:7, title:"Rustic Mountain Cottage", location:"Hill Station", price:2200000, category:"luxury", video:"https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4", thumbnail:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=800&fit=crop", description:"Charming mountain cottage with scenic views", views:1450, likes:112, status:"Draft", duration:"0:41", tags:["mountain","cottage","scenic","retreat"], agentName:"Sarah K.", builder:"Tata Housing", reraId:"HP/RERA/2025/1290", possessionDate:"Ready to Move", sqft:1400, furnishing:"Fully Furnished", floor:"Ground Floor", emiEstimate:17460, bankOffers:false },
  { id:108, propertyId:8, title:"Contemporary Villa", location:"Modern District", price:4900000, category:"premium", video:"https://videos.pexels.com/video-files/3127273/3127273-hd_1920_1080_30fps.mp4", thumbnail:"https://images.unsplash.com/photo-1600607687939-ce8a6c432b0d?w=600&h=800&fit=crop", description:"Ultra-modern villa with smart home systems", views:2670, likes:245, status:"Published", duration:"0:50", tags:["villa","contemporary","smart-home","modern"], agentName:"Mike R.", builder:"Mahindra Lifespaces", reraId:"MH/RERA/2025/6634", possessionDate:"Dec 2026", sqft:2600, furnishing:"Unfurnished", floor:"Ground + 2", emiEstimate:38890, bankOffers:true },
  { id:109, propertyId:9, title:"Urban Studio Plus", location:"Downtown Core", price:1550000, category:"budget", video:"https://videos.pexels.com/video-files/4248199/4248199-hd_1920_1080_25fps.mp4", thumbnail:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=800&fit=crop", description:"Stylish studio with premium finishes", views:890, likes:64, status:"Published", duration:"0:20", tags:["studio","urban","budget","downtown"], agentName:"Alex P.", builder:"Shapoorji Pallonji", reraId:"MH/RERA/2024/4458", possessionDate:"Ready to Move", sqft:550, furnishing:"Semi-Furnished", floor:"8th of 15 floors", emiEstimate:12300, bankOffers:true },
  { id:110, propertyId:10, title:"Serene Lakeside Retreat", location:"Lake District", price:3100000, category:"family", video:"https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4", thumbnail:"https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=800&fit=crop", description:"Peaceful lakeside property with private dock", views:1780, likes:156, status:"Published", duration:"0:30", tags:["lakeside","retreat","family","nature"], agentName:"Emma L.", builder:"Prestige Group", reraId:"KA/RERA/2024/8832", possessionDate:"Ready to Move", sqft:1800, furnishing:"Fully Furnished", floor:"Ground Floor", emiEstimate:24610, bankOffers:true },
  { id:111, propertyId:15, title:"Skyline Tower Apartment", location:"Skyline District", price:7200000, category:"premium", video:"https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4", thumbnail:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=800&fit=crop", description:"Luxurious high-rise with breathtaking skyline views", views:4100, likes:345, status:"Draft", duration:"0:55", tags:["skyline","tower","high-rise","premium"], agentName:"Priya M.", builder:"DLF Limited", reraId:"HR/RERA/2025/9920", possessionDate:"Mar 2027", sqft:2000, furnishing:"Semi-Furnished", floor:"32nd of 45 floors", emiEstimate:57150, bankOffers:true },
  { id:112, propertyId:20, title:"Commercial Plaza Office", location:"Business Hub", price:9800000, category:"commercial", video:"https://videos.pexels.com/video-files/3127273/3127273-hd_1920_1080_30fps.mp4", thumbnail:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=800&fit=crop", description:"Premium commercial space in the business district", views:560, likes:42, status:"Published", duration:"0:42", tags:["commercial","office","plaza","business"], agentName:"John D.", builder:"Brigade Group", reraId:"KA/RERA/2024/7785", possessionDate:"Ready to Move", sqft:6000, furnishing:"Semi-Furnished", floor:"5th of 12 floors", emiEstimate:77790, bankOffers:true },
];

export const propertyStories = [
  { id:'s1', propertyId:1, image:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=600&fit=crop', label:'Downtown', agent:'Sarah K.' },
  { id:'s2', propertyId:2, image:'https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=400&h=600&fit=crop', label:'Beach Villa', agent:'Mike R.' },
  { id:'s3', propertyId:3, image:'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=600&fit=crop', label:'Garden', agent:'Emma L.' },
  { id:'s4', propertyId:4, image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=600&fit=crop', label:'Studio', agent:'Alex P.' },
  { id:'s5', propertyId:5, image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=600&fit=crop', label:'Family', agent:'Lisa M.' },
  { id:'s6', propertyId:6, image:'https://images.unsplash.com/photo-1631679706909-1844bbd54340?w=400&h=600&fit=crop', label:'Penthouse', agent:'David C.' },
  { id:'s7', propertyId:7, image:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=600&fit=crop', label:'Mountain', agent:'Nina W.' },
  { id:'s8', propertyId:8, image:'https://images.unsplash.com/photo-1600607687939-ce8a6c432b0d?w=400&h=600&fit=crop', label:'Modern', agent:'Tom H.' },
  { id:'s9', propertyId:10, image:'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=600&fit=crop', label:'Lakeside', agent:'James W.' },
  { id:'s10', propertyId:15, image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=600&fit=crop', label:'Skyline', agent:'Priya M.' },
  { id:'s11', propertyId:18, image:'https://images.unsplash.com/photo-1600566753086-00f18f6b0050?w=400&h=600&fit=crop', label:'Heritage', agent:'Raj S.' },
  { id:'s12', propertyId:21, image:'https://images.unsplash.com/photo-1558036117-15d93e5c8e8e?w=400&h=600&fit=crop', label:'Eco', agent:'Luna G.' },
];

export const blogPosts = [
  { id:1, title:"2026 Real Estate Market Outlook", excerpt:"Expert analysis of the 2026 property market trends.", author:"Sarah Kim", date:"May 15, 2026", category:"Market Trends", image:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", readTime:"8 min read", tags:["market","investment","2026"] },
  { id:2, title:"Smart Home Technology: Future of Living", excerpt:"How AI and IoT are revolutionizing luxury properties.", author:"David Chen", date:"May 12, 2026", category:"Technology", image:"https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop", readTime:"6 min read", tags:["smart home","tech"] },
  { id:3, title:"First-Time Buyer's Guide 2026", excerpt:"Everything about mortgages, inspections, and closing costs.", author:"Lisa Martinez", date:"May 10, 2026", category:"Guides", image:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop", readTime:"12 min read", tags:["first-time","mortgage"] },
  { id:4, title:"Top 10 Investment Neighborhoods", excerpt:"Most promising neighborhoods for real estate ROI.", author:"Mike Rodriguez", date:"May 8, 2026", category:"Investment", image:"https://images.unsplash.com/photo-1512917774080-9264f475eabf?w=600&h=400&fit=crop", readTime:"7 min read", tags:["investment","ROI"] },
  { id:5, title:"Sustainable Architecture Rising", excerpt:"Green building practices reshaping luxury real estate.", author:"Luna Garcia", date:"May 5, 2026", category:"Sustainability", image:"https://images.unsplash.com/photo-1558036117-15d93e5c8e8e?w=600&h=400&fit=crop", readTime:"9 min read", tags:["green","sustainable"] },
  { id:6, title:"Luxury Tax Strategies & Benefits", excerpt:"Tax planning for high-net-worth property investors.", author:"Priya Mehta", date:"May 2, 2026", category:"Finance", image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop", readTime:"10 min read", tags:["luxury","tax"] },
];

export const agentsData = [
  { id:"agent1", name:"Sarah Kim", avatar:"https://i.pravatar.cc/150?img=1", rating:4.9, sales:47, phone:"+1-555-0101", email:"sarah@propertyinsta.com", company:"PropertyInsta Realty", experience:"8+ years", specialization:["Residential","Luxury","Investment"] },
  { id:"agent2", name:"Mike Rodriguez", avatar:"https://i.pravatar.cc/150?img=3", rating:4.8, sales:89, phone:"+1-555-0102", email:"mike@propertyinsta.com", company:"PropertyInsta Realty", experience:"12+ years", specialization:["Commercial","Residential","Luxury"] },
  { id:"agent3", name:"Emma Liu", avatar:"https://i.pravatar.cc/150?img=5", rating:4.7, sales:32, phone:"+1-555-0103", email:"emma@propertyinsta.com", company:"PropertyInsta Realty", experience:"5+ years", specialization:["Residential","Family Homes"] },
  { id:"agent4", name:"Alex Park", avatar:"https://i.pravatar.cc/150?img=7", rating:4.6, sales:21, phone:"+1-555-0104", email:"alex@propertyinsta.com", company:"PropertyInsta Realty", experience:"3+ years", specialization:["Studios","Rentals","Urban"] },
  { id:"agent5", name:"Lisa Martinez", avatar:"https://i.pravatar.cc/150?img=9", rating:4.9, sales:63, phone:"+1-555-0105", email:"lisa@propertyinsta.com", company:"PropertyInsta Realty", experience:"10+ years", specialization:["Family Homes","Residential"] },
  { id:"agent6", name:"David Chen", avatar:"https://i.pravatar.cc/150?img=11", rating:5.0, sales:102, phone:"+1-555-0106", email:"david@propertyinsta.com", company:"PropertyInsta Realty", experience:"15+ years", specialization:["Luxury","Penthouse","Investment"] },
  { id:"agent7", name:"Nina Williams", avatar:"https://i.pravatar.cc/150?img=13", rating:4.5, sales:18, phone:"+1-555-0107", email:"nina@propertyinsta.com", company:"PropertyInsta Realty", experience:"2+ years", specialization:["Cottages","Mountain Homes"] },
  { id:"agent8", name:"Tom Harris", avatar:"https://i.pravatar.cc/150?img=15", rating:4.8, sales:56, phone:"+1-555-0108", email:"tom@propertyinsta.com", company:"PropertyInsta Realty", experience:"9+ years", specialization:["Villas","Modern","Luxury"] },
  { id:"agent9", name:"James Wilson", avatar:"https://i.pravatar.cc/150?img=17", rating:4.7, sales:41, phone:"+1-555-0109", email:"james@propertyinsta.com", company:"PropertyInsta Realty", experience:"7+ years", specialization:["Lakeside","Cottages"] },
  { id:"agent10", name:"Olivia Brown", avatar:"https://i.pravatar.cc/150?img=19", rating:4.9, sales:78, phone:"+1-555-0110", email:"olivia@propertyinsta.com", company:"PropertyInsta Realty", experience:"11+ years", specialization:["Farmhouse","Luxury","Residential"] },
  { id:"agent11", name:"Ryan Patel", avatar:"https://i.pravatar.cc/150?img=21", rating:4.6, sales:35, phone:"+1-555-0111", email:"ryan@propertyinsta.com", company:"PropertyInsta Realty", experience:"4+ years", specialization:["Smart Homes","Tech Hubs"] },
  { id:"agent12", name:"Mia Torres", avatar:"https://i.pravatar.cc/150?img=23", rating:4.4, sales:15, phone:"+1-555-0112", email:"mia@propertyinsta.com", company:"PropertyInsta Realty", experience:"2+ years", specialization:["Budget","Studios","Coastal"] },
  { id:"agent13", name:"Priya Mehta", avatar:"https://i.pravatar.cc/150?img=25", rating:4.9, sales:88, phone:"+1-555-0113", email:"priya@propertyinsta.com", company:"PropertyInsta Realty", experience:"13+ years", specialization:["Penthouse","Luxury","Skyline"] },
  { id:"agent14", name:"Carlos Mendez", avatar:"https://i.pravatar.cc/150?img=27", rating:4.5, sales:29, phone:"+1-555-0114", email:"carlos@propertyinsta.com", company:"PropertyInsta Realty", experience:"6+ years", specialization:["Suburban","Residential"] },
  { id:"agent15", name:"Raj Sharma", avatar:"https://i.pravatar.cc/150?img=29", rating:4.8, sales:54, phone:"+1-555-0115", email:"raj@propertyinsta.com", company:"PropertyInsta Realty", experience:"10+ years", specialization:["Heritage","Villas","Colonial"] },
  { id:"agent16", name:"Luna Garcia", avatar:"https://i.pravatar.cc/150?img=31", rating:4.9, sales:67, phone:"+1-555-0116", email:"luna@propertyinsta.com", company:"PropertyInsta Realty", experience:"9+ years", specialization:["Eco-Friendly","Smart Homes","Sustainable"] },
  { id:"agent17", name:"Amy Chen", avatar:"https://i.pravatar.cc/150?img=33", rating:4.3, sales:12, phone:"+1-555-0117", email:"amy@propertyinsta.com", company:"PropertyInsta Realty", experience:"1+ years", specialization:["Student Housing","Budget"] },
];

export const dashboardStats = {
  totalProperties: 24,
  totalReels: 12,
  totalStories: 12,
  totalBlogs: 6,
  totalAgents: 17,
  totalViews: 141700,
  totalLikes: 0,
  activeListings: 19,
  underConstruction: 5,
};

// Calculate total likes from reels
dashboardStats.totalLikes = allReels.reduce((sum, r) => sum + r.likes, 0);

export const revenueData = [
  { name: 'Jan', sales: 4.2, rentals: 1.1 },
  { name: 'Feb', sales: 3.8, rentals: 1.4 },
  { name: 'Mar', sales: 5.1, rentals: 1.8 },
  { name: 'Apr', sales: 6.3, rentals: 2.1 },
  { name: 'May', sales: 7.8, rentals: 2.5 },
  { name: 'Jun', sales: 5.9, rentals: 1.9 },
  { name: 'Jul', sales: 8.2, rentals: 3.1 },
  { name: 'Aug', sales: 9.1, rentals: 3.5 },
  { name: 'Sep', sales: 7.5, rentals: 2.8 },
  { name: 'Oct', sales: 10.2, rentals: 4.1 },
  { name: 'Nov', sales: 11.5, rentals: 4.5 },
  { name: 'Dec', sales: 12.8, rentals: 5.2 },
];

export const propertyTypeData = [
  { name: 'Apartments', value: 6 },
  { name: 'Villas', value: 5 },
  { name: 'Studios', value: 5 },
  { name: 'Cottages', value: 4 },
  { name: 'Penthouses', value: 3 },
  { name: 'Farmhouses', value: 2 },
  { name: 'Commercial', value: 1 },
];

export const propertyStatusData = [
  { name: 'For Sale', value: 18 },
  { name: 'For Rent', value: 6 },
];

export const recentProperties = allProperties.slice(0, 5);

export const notifications = [
  { id: 1, title: 'New Property Listed', message: 'Waterfront Penthouse added to listings', time: '5 min ago', type: 'info' },
  { id: 2, title: 'High Engagement', message: 'Sunset Boulevard Villa reached 13.5K views', time: '1 hour ago', type: 'success' },
  { id: 3, title: 'RERA Alert', message: 'Eco-Friendly Smart Home RERA verification pending', time: '3 hours ago', type: 'warning' },
  { id: 4, title: 'Agent Milestone', message: 'David Chen reached 102 sales!', time: '5 hours ago', type: 'success' },
  { id: 5, title: 'New Blog Post', message: '2026 Market Outlook published by Sarah Kim', time: '1 day ago', type: 'info' },
];

// ==================== Site Configuration ====================
export const siteConfig = {
  heroVideo: '/33.mp4',
  heroTitle: 'Discover Your Dream Property',
  heroSubtitle: 'Browse 10,000+ verified properties across 50+ Indian cities',
  searchTabs: [
    { id: 'buy', label: 'Buy', active: true },
    { id: 'rent', label: 'Rent', active: false },
    { id: 'pg', label: 'PG', active: false },
  ],
  searchTags: [
    { id: 1, label: '2 BHK', active: true },
    { id: 2, label: '3 BHK', active: true },
    { id: 3, label: 'Furnished', active: true },
    { id: 4, label: 'Pool', active: true },
    { id: 5, label: 'Gym', active: true },
    { id: 6, label: 'Parking', active: true },
    { id: 7, label: 'Sea View', active: true },
    { id: 8, label: 'Gated', active: true },
  ],
  heroStats: [
    { id: 1, icon: 'building', label: 'Properties', value: '10,000+' },
    { id: 2, icon: 'users', label: 'Happy Families', value: '5,000+' },
    { id: 3, icon: 'mapPin', label: 'Cities', value: '50+' },
    { id: 4, icon: 'star', label: 'Rating', value: '4.8' },
  ],
};

// ==================== Frontend Notifications ====================
export const frontendNotifications = [
  { id: 1, title: '🏠 New Property Listed', message: 'A stunning 3 BHK apartment just listed in Mumbai, Andheri West.', timestamp: Date.now() - 300000, read: false, type: 'property' },
  { id: 2, title: '💰 Price Drop Alert', message: 'Your saved property "Marine Drive Apartment" dropped by ₹5 Lakhs.', timestamp: Date.now() - 1800000, read: false, type: 'price' },
  { id: 3, title: '🎉 Exclusive Offer', message: 'First-time buyer? Get special EMI rates starting at 8.25% p.a.', timestamp: Date.now() - 7200000, read: true, type: 'offer' },
  { id: 4, title: '📋 RERA Update', message: 'RERA status updated for 3 properties in your wishlist.', timestamp: Date.now() - 14400000, read: true, type: 'rera' },
  { id: 5, title: '📚 New Guide Published', message: '"Property Buying Guide 2026" – everything you need to know before buying.', timestamp: Date.now() - 86400000, read: false, type: 'guide' },
];

// ==================== Property Reviews ====================
export const propertyReviews = {
  1: [
    { id: 101, userName: 'Rahul M.', rating: 5, comment: 'Absolutely stunning loft! The natural light is incredible.', date: '2026-05-10', verified: true, propertyId: 1 },
    { id: 102, userName: 'Anita S.', rating: 4, comment: 'Great location, but parking can be tight.', date: '2026-05-08', verified: true, propertyId: 1 },
  ],
  2: [
    { id: 103, userName: 'Vikram P.', rating: 5, comment: 'Dream beach house! The infinity pool is breathtaking.', date: '2026-05-12', verified: true, propertyId: 2 },
    { id: 104, userName: 'Neha K.', rating: 5, comment: 'Perfect vacation home. Worth every rupee.', date: '2026-05-09', verified: true, propertyId: 2 },
    { id: 105, userName: 'Arjun R.', rating: 4, comment: 'Beautiful property, slight maintenance needed on deck.', date: '2026-05-06', verified: false, propertyId: 2 },
  ],
  6: [
    { id: 106, userName: 'Sanjay G.', rating: 5, comment: 'The best penthouse in the city! 360° views are unmatched.', date: '2026-05-14', verified: true, propertyId: 6 },
    { id: 107, userName: 'Meera D.', rating: 5, comment: 'Executive living at its finest. Smart home features are top-notch.', date: '2026-05-11', verified: true, propertyId: 6 },
  ],
  13: [
    { id: 108, userName: 'Karan J.', rating: 5, comment: 'Heritage charm with modern amenities. Truly one of a kind.', date: '2026-05-07', verified: true, propertyId: 13 },
  ],
  15: [
    { id: 109, userName: 'Priyanka L.', rating: 4, comment: 'Amazing views, great amenities. Waiting for possession.', date: '2026-05-05', verified: false, propertyId: 15 },
  ],
  22: [
    { id: 110, userName: 'Amit W.', rating: 5, comment: 'Hollywood-level luxury! The infinity pool is show-stopping.', date: '2026-05-13', verified: true, propertyId: 22 },
    { id: 111, userName: 'Riya T.', rating: 5, comment: 'Best investment decision ever made.', date: '2026-05-10', verified: true, propertyId: 22 },
  ],
  24: [
    { id: 112, userName: 'Deepak S.', rating: 5, comment: 'Penthouse with private boat slip – absolute waterfront dream.', date: '2026-05-15', verified: true, propertyId: 24 },
    { id: 113, userName: 'Pooja N.', rating: 4, comment: 'Stunning property. Slightly overpriced but worth the luxury.', date: '2026-05-12', verified: true, propertyId: 24 },
    { id: 114, userName: 'Rohit B.', rating: 5, comment: 'Best penthouse in Marina Bay, period.', date: '2026-05-08', verified: true, propertyId: 24 },
  ],
};

// ==================== Quiz Questions ====================
export const quizQuestions = [
  {
    id: 1,
    question: "What's your ideal property type?",
    icon: '🏠',
    options: [
      { id: 'q1a', label: 'Apartment / Flat', icon: '🏢' },
      { id: 'q1b', label: 'Villa / Bungalow', icon: '🏡' },
      { id: 'q1c', label: 'Penthouse', icon: '🌆' },
      { id: 'q1d', label: 'Farmhouse / Cottage', icon: '🌿' },
    ],
  },
  {
    id: 2,
    question: "What's your budget range?",
    icon: '💰',
    options: [
      { id: 'q2a', label: 'Under ₹50 Lakhs', icon: '💵' },
      { id: 'q2b', label: '₹50L - ₹1 Crore', icon: '💶' },
      { id: 'q2c', label: '₹1Cr - ₹3 Crore', icon: '💷' },
      { id: 'q2d', label: '₹3 Crore+', icon: '💎' },
    ],
  },
  {
    id: 3,
    question: 'How many bedrooms do you need?',
    icon: '🛏️',
    options: [
      { id: 'q3a', label: '1 BHK (Compact)', icon: '1️⃣' },
      { id: 'q3b', label: '2 BHK (Cozy)', icon: '2️⃣' },
      { id: 'q3c', label: '3 BHK (Spacious)', icon: '3️⃣' },
      { id: 'q3d', label: '4+ BHK (Grand)', icon: '4️⃣' },
    ],
  },
  {
    id: 4,
    question: 'What amenities matter most?',
    icon: '✨',
    options: [
      { id: 'q4a', label: 'Swimming Pool & Gym', icon: '🏊' },
      { id: 'q4b', label: 'Garden & Open Spaces', icon: '🌳' },
      { id: 'q4c', label: 'Smart Home & Security', icon: '🔐' },
      { id: 'q4d', label: 'Parking & Convenience', icon: '🚗' },
    ],
  },
  {
    id: 5,
    question: "What's your primary goal?",
    icon: '🎯',
    options: [
      { id: 'q5a', label: 'Personal Living', icon: '🏠' },
      { id: 'q5b', label: 'Investment / ROI', icon: '📈' },
      { id: 'q5c', label: 'Vacation Home', icon: '🏖️' },
      { id: 'q5d', label: 'Rental Income', icon: '💸' },
    ],
  },
];

// ==================== Chat Auto-Replies ====================
export const chatReplies = {
  property: "We have 10,000+ properties across 50+ cities! You can browse listings in the Feed view or search by city, budget, or type.",
  price: "Our properties range from affordable flats starting at ₹20 Lakhs to luxury penthouses at ₹10 Crore+. What's your budget range?",
  mortgage: "You can use our Mortgage Calculator (available in the sidebar) to estimate your monthly EMI. Most banks offer home loans starting at 8.5% interest.",
  tour: 'I can help you schedule a property tour! Click "Schedule Tour" from the sidebar or any property detail page.',
  default: "That's a great question! You can browse properties in the Feed, check out Reels for video tours, or use our Quick Tools in the left sidebar.",
};