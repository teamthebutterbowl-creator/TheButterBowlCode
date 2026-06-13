export const dashboardStats = [
  { label: "Today's Orders", value: "148", change: "+12%", trend: "up", color: "#FF6A3D" },
  { label: "Today's Sales", value: "₹9.2k", change: "+8%", trend: "up", color: "#5B2EFF" },
  { label: "Today's Customers", value: "342", change: "+5%", trend: "up", color: "#22C55E" },
  { label: "Pending Orders", value: "18", change: "-4%", trend: "down", color: "#F59E0B" },
  { label: "Cancelled Orders", value: "4", change: "-2%", trend: "down", color: "#EF4444" }
];

export const recentOrders = [
  { id: "RD-1023", customer: "Amelia R.", date: "Jun 8, 2026", amount: "₹128.00", payment: "Card", status: "Preparing" },
  { id: "RD-1024", customer: "Noah S.", date: "Jun 8, 2026", amount: "₹89.50", payment: "Cash", status: "Delivered" },
  { id: "RD-1025", customer: "Sofia L.", date: "Jun 7, 2026", amount: "₹212.00", payment: "Card", status: "Pending" },
  { id: "RD-1026", customer: "Lucas W.", date: "Jun 7, 2026", amount: "₹56.20", payment: "Wallet", status: "Cancelled" },
  { id: "RD-1027", customer: "Mia A.", date: "Jun 6, 2026", amount: "₹141.30", payment: "Card", status: "Completed" }
];

export const menuCategories = [
  { key: "all", label: "All" },
  { key: "burgers", label: "Burgers" },
  { key: "pizza", label: "Pizza" },
  { key: "salads", label: "Salads" },
  { key: "desserts", label: "Desserts" }
];

export const menuItems = [
  { id: "MI-001", name: "Truffle Burger", category: "Burgers", price: "₹14.50", status: "Active", available: "Yes" },
  { id: "MI-002", name: "Margherita Pizza", category: "Pizza", price: "₹12.00", status: "Active", available: "Yes" },
  { id: "MI-003", name: "Caesar Salad", category: "Salads", price: "₹9.50", status: "Inactive", available: "No" },
  { id: "MI-004", name: "Cotton Candy Shake", category: "Desserts", price: "₹7.20", status: "Active", available: "Yes" },
  { id: "MI-005", name: "Spicy Chicken Pizza", category: "Pizza", price: "₹15.00", status: "Active", available: "Yes" }
];

export const orderStats = [
  { label: "Total Orders", value: "7,520", color: "#FF4B3E" },
  { label: "Revenue", value: "₹124.8k", color: "#5B2EFF" },
  { label: "Pending", value: "74", color: "#F59E0B" },
  { label: "Completed", value: "7,188", color: "#22C55E" }
];

export const orders = [
  {
    id: "OR-2101", customer: "Olivia M.", date: "06 Jun", amount: "₹1,125", payment: "Card", status: "Pending",
    email: "olivia.m@example.com", phone: "+91 98765 43210",
    address: { line1: "742 Maple Street", line2: "San Francisco, CA 94107" },
    items: [
      { name: "Truffle Burger", qty: 1, amount: 695 },
      { name: "Garlic Bread", qty: 1, amount: 180 },
      { name: "Masala Chai", qty: 1, amount: 130 }
    ],
    subtotal: 1005, delivery: 120, total: 1125,
    transactionId: "TXN-8821"
  },
  {
    id: "OR-2102", customer: "Ethan H.", date: "06 Jun", amount: "₹2,032", payment: "Card", status: "Completed",
    email: "ethan.h@example.com", phone: "+91 91234 56789",
    address: { line1: "18 Oak Avenue", line2: "Mumbai, MH 400001" },
    items: [
      { name: "Margherita Pizza", qty: 2, amount: 1040 },
      { name: "Caesar Salad", qty: 1, amount: 475 },
      { name: "Cotton Candy Shake", qty: 1, amount: 397 }
    ],
    subtotal: 1912, delivery: 120, total: 2032,
    transactionId: "TXN-8822"
  },
  {
    id: "OR-2103", customer: "Zoe K.", date: "05 Jun", amount: "₹589", payment: "Cash", status: "Preparing",
    email: "zoe.k@example.com", phone: "+91 87654 32100",
    address: { line1: "55 Ring Road", line2: "Delhi, DL 110001" },
    items: [
      { name: "Spicy Chicken Pizza", qty: 1, amount: 520 }
    ],
    subtotal: 520, delivery: 69, total: 589,
    transactionId: "TXN-8823"
  },
  {
    id: "OR-2104", customer: "Leo C.", date: "05 Jun", amount: "₹698", payment: "Wallet", status: "Cancelled",
    email: "leo.c@example.com", phone: "+91 76543 21098",
    address: { line1: "12 MG Road", line2: "Bangalore, KA 560001" },
    items: [
      { name: "Truffle Burger", qty: 1, amount: 695 }
    ],
    subtotal: 695, delivery: 0, total: 698,
    transactionId: "TXN-8824"
  },
  {
    id: "OR-2105", customer: "Emma B.", date: "04 Jun", amount: "₹964", payment: "Card", status: "Completed",
    email: "emma.b@example.com", phone: "+91 65432 10987",
    address: { line1: "8 Lakeview Terrace", line2: "Pune, MH 411001" },
    items: [
      { name: "Caesar Salad", qty: 1, amount: 475 },
      { name: "Cotton Candy Shake", qty: 2, amount: 394 }
    ],
    subtotal: 869, delivery: 95, total: 964,
    transactionId: "TXN-8825"
  }
];

export const offers = [
  { id: "OF-001", title: "Weekend Feast", status: "Active", discount: "25%", valid: "Jun 30" },
  { id: "OF-002", title: "Lunch Combo", status: "Paused", discount: "15%", valid: "Jul 12" },
  { id: "OF-003", title: "New Customer", status: "Active", discount: "30%", valid: "Aug 1" }
];

export const coupons = [
  { id: "CP-100", code: "NEW20", type: "Percentage", value: "20%", minOrder: "₹30", valid: "Jul 15" },
  { id: "CP-101", code: "SAVE10", type: "Fixed", value: "₹10", minOrder: "₹50", valid: "Aug 10" }
];

export const cmsSections = [
  { id: "hero", title: "Hero", icon: "H", status: "Live" },
  { id: "about", title: "About", icon: "A", status: "Live" },
  { id: "categories", title: "Categories", icon: "C", status: "Draft" },
  { id: "featured", title: "Featured Products", icon: "F", status: "Live" },
  { id: "choose", title: "Why Choose Us", icon: "W", status: "Live" },
  { id: "testimonials", title: "Testimonials", icon: "T", status: "Draft" },
  { id: "gallery", title: "Gallery", icon: "G", status: "Live" },
  { id: "cta", title: "Call To Action", icon: "CTA", status: "Live" }
];

export const profile = {
  name: "Skylar James",
  role: "Super Admin",
  email: "skylar@restaurantpro.com"
};
