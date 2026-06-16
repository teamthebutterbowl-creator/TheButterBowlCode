
import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, TrendingUp, Users, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader/PageHeader';
import StatCard from '../../components/shared/StatCard/StatCard';
import ChartCard from '../../components/shared/ChartCard/ChartCard';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/shared/StatusBadge/StatusBadge';
import './DashboardPage.css';
const API_BASE=import.meta.env.VITE_API_BASE_URL
console.log("TOKEN:", localStorage.getItem("token"));
const gettoken=()=>localStorage.getItem('token');
const authHeaders=()=>({Authorization:`Bearer ${gettoken()}`})

const DashboardPage = () => {
  const [dashboardData,setDashboardData]=useState(null);
  const [Orders,setRecentOrders]=useState(null);
  const[isLoading,setIsLoading]=useState(true);
  const[error,setError]=useState(" ");
  const fetchDashboard=async()=>{
    try{
    const res= await fetch(`${API_BASE}/api/admin/dashboard`,
      {
        method:"GET",
        headers:authHeaders()
      }
    );
    if(!res.ok){
      throw new Error("failed to fetch data from backend ");
    }
    const data=await res.json();
    console.log(data);
    console.log(res);
    
    setDashboardData(data.data);
    }catch(error){
      console.error(error);
      setError(error.message);
    }finally{
      setIsLoading(false);
    }
  }
const recentOrder=async()=>{
  try{
    const res=await fetch(`${API_BASE}/api/admin/orders/recent`,
      {
      headers:authHeaders()
      }
    );
    if(!res.ok){
      throw new Error("data is not fetched from backend ");
    }
    const data=await res.json();
    console.log("data",data);
    const format=data.data.map((order)=>(
      {
        id: order.orderNumber,
        customer: order.customerDetails?.name,
        date: new Date(order.createdAt).toLocaleDateString('en-US',{
          year:"numeric",
          month:"long",
          day:"numeric"
        }),
        amount: `₹${order.totalAmount}`,
        payment: order.paymentMethod,
        status: order.orderStatus
      }
    ))
    console.log(data);
    console.log(res);
    console.log("format",format);
    setRecentOrders(format);
  }catch(error){
    console.error(error);
    setError(error.message);
  }finally{
    setIsLoading(false);
  }
}

useEffect(()=>{fetchDashboard();},[]);
useEffect(()=>{recentOrder();},[])

  const statIcons = {
    'Total Orders': ShoppingCart,
    'Revenue': TrendingUp,
    'Customers': Users,
    'Conversion': BarChart3
  };

  const dashboardStats = [
    { label: "Today's Orders", value: dashboardData?.todayOrders||0 , color: "#FF6A3D" },
    { label: "Today's Sales", value: dashboardData?.todayRevenue||0, color: "#5B2EFF" },
    { label: "Today's Customers", value: dashboardData?.todayCustomers||0,  color: "#22C55E" },
    { label: "Pending Orders", value: dashboardData?.pendingOrders||0, color: "#F59E0B" },
    { label: "Cancelled Orders", value: dashboardData?.cancelledOrders||0, color: "#EF4444" }
  ];


  
  const orderColumns = [
    { key: 'id', title: 'Order ID', dataIndex: 'id' },
    { key: 'customer', title: 'Customer', dataIndex: 'customer' },
    { key: 'date', title: 'Date', dataIndex: 'date' },
    { key: 'amount', title: 'Amount', dataIndex: 'amount', align: 'right' },
    { key: 'payment', title: 'Payment', dataIndex: 'payment' },
    {
      key: 'status',
      title: 'Status',
      render: (row) => <StatusBadge label={row.status} variant={row.status === 'Delivered' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Cancelled' ? 'danger' : 'default'} />
    }
  ];
  const totalOrders = dashboardData?.todayOrders || 0;
  const completedOrders = (dashboardData?.todayOrders || 0) -
   (dashboardData?.pendingOrders || 0) - (dashboardData?.cancelledOrders || 0);
  
  // 1. Isko aisa hi rehne do
  const orderCompletionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  
  // 2. YEH NEW LINE ADD KARO
  const cancelledOrders = dashboardData?.cancelledOrders || 0;
  const operationsEfficiency = totalOrders > 0 ? Math.round(((totalOrders - cancelledOrders) / totalOrders) * 100) : 0;

  return (
    <div className="dashboard-page">
      <PageHeader title="Dashboard" subtitle="Monitor core operations, orders and campaign health from one premium admin console." />
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="stats-row">
            {dashboardStats.map((stat) => (
              <StatCard 
                key={stat.label} 
                title={stat.label} 
                value={stat.value } 
                badge={stat.change} 
                color={stat.color} 
                trend={stat.trend}
                icon={statIcons[stat.label] || ShoppingCart}
              />
            ))}
          </div>
          <div className="dashboard-cards">
            <div className="sales-card">
              <div className="card-title-row">
                <div>
                  { <span>Recent 5 Orders</span> }
                  <h2> Orders</h2>
                </div>
              
              </div>
              <Table columns={orderColumns} data={Orders} />
            </div>
            <div className="insights-row">
  {/* ChartCard mein hardcoded 82% ki jagah variable daal diya */}
  <ChartCard 
    title="Order Status" 
    value={`${orderCompletionRate}%`} 
    chartLabel="Doughnut" 
    percent={orderCompletionRate} 
    progress={orderCompletionRate} 
  />
  
  <div className="completion-card">
    <div className="completion-top">
      <span>Completion Rate</span>
      {/* 94% hata kar dynamic variable lagaya */}
      <strong>{operationsEfficiency}%</strong> 
    </div>
    <p>Operations efficiency from accepted orders and fulfilled deliveries.</p>
    <div className="progress-bar">
      {/* width: '94%' hata kar dynamic template literal lagaya */}
      <div className="progress-fill" style={{ width: `${operationsEfficiency}%` }} />
    </div>
  </div>
</div>
          </div>
        </div>
        <aside className="dashboard-right-panel">
          <div className="right-panel-card">
            <div className="panel-heading">
              <span>Performance</span>
              <strong>Daily snapshot</strong>
            </div>
            <div className="stat-block">
              <span>Today's Orders</span>
              <strong>{dashboardData?.todayOrders}</strong>
            </div>
            <div className="stat-block">
              <span>Average Order Value</span>
              <strong>
  ₹{dashboardData?.todayOrders > 0
    ? (dashboardData?.todayRevenue / dashboardData?.todayOrders).toFixed(2)
    : 0}
</strong>
            </div>
            <div className="stat-block">
             <span>Today's Sales</span>
              <strong>{dashboardData?.todayRevenue||0}</strong>
            </div>
            <div className="stat-block">
             <span>Average Spend Per Customer</span>
             <strong>
  ₹{dashboardData?.todayCustomers > 0
    ? (dashboardData?.todayRevenue / dashboardData?.todayCustomers).toFixed(2)
    : 0}
</strong>
            </div>
            <div className="stat-block">
              <span>Completed Orders</span>
              <strong>{dashboardData?.completedOrders||0}</strong>
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
