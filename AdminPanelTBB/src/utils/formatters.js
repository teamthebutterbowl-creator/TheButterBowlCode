// export const formatCurrency = (value) => {
//   if (typeof value === 'number') {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//   }
//   return value;
// };

// export const statusClass = (status) => {
//   switch (status.toLowerCase()) {
//     case 'active':
//     case 'completed':
//     case 'delivered':
//       return 'status-green';
//     case 'pending':
//     case 'draft':
//       return 'status-amber';
//     case 'cancelled':
//     case 'paused':
//       return 'status-red';
//     default:
//       return 'status-gray';
//   }
// };

export const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  }
  return value;
};

export const statusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'delivered':
      return 'status-green';
    case 'pending':
    case 'draft':
      return 'status-amber';
    case 'cancelled':
    case 'paused':
      return 'status-red';
    default:
      return 'status-gray';
  }
};