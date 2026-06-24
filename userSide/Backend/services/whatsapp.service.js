// this is a service file for order conformation 
export const sendOrderConfimation = async(order)=>{
    console.log("Whatsapp service called")
    console.log(order.customerDetails.phone)
}