import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  

  useEffect(() => {
    getDocs(collection(db, "orders")).then(snap => {
      let sum = 0;
      snap.forEach(d => sum += d.data().totalAmount);
      setOrders(snap.size);
      setRevenue(sum);
    });
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Orders: {orders}</p>
      <p>Total Revenue: R {revenue}</p>
    </div>
  );
}
