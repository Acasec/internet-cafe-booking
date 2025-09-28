import { useEffect, useMemo, useState } from "react";

type Customer = { _id: string; name: string; email: string; phone: string };
type Booking = { 
  _id: string; 
  customer: Customer; 
  pcNumber: number; 
  startTime: string; 
  endTime?: string | null 
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "bookings">("customers");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [occupied, setOccupied] = useState<number[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedPc, setSelectedPc] = useState<number | null>(null);

  const pcs = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), []);

  async function loadAll() {
    const [cRes, bRes] = await Promise.all([fetch("/api/customers"), fetch("/api/bookings")]);
    setCustomers(await cRes.json());
    const bookingsPayload = await bRes.json();
    setBookings(bookingsPayload.bookings || []);
    setOccupied(bookingsPayload.occupied || []);
  }

  useEffect(() => { loadAll(); }, []);

  async function addCustomer() {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      alert("Fill in all fields");
      return;
    }
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });
    if (res.ok) {
      setNewCustomer({ name: "", email: "", phone: "" });
      await loadAll();
    }
  }

  async function createBooking() {
    if (!selectedCustomerId || !selectedPc) {
      alert("Select a customer and an available PC");
      return;
    }
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: selectedCustomerId, pcNumber: selectedPc }),
    });
    if (res.ok) {
      setSelectedPc(null);
      await loadAll();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create booking");
    }
  }

  async function endBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) await loadAll();
  }

  return (
    <main style={{ maxWidth: 960, margin: "2rem auto", padding: "1rem", backgroundColor: "#e6f2ff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Internet Cafe Management</h1>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem" }}>
        <h2 
          onClick={() => setActiveTab("customers")} 
          style={{ cursor: "pointer", borderBottom: activeTab === "customers" ? "3px solid #0070f3" : "none" }}
        >
          Customers
        </h2>
        <h2 
          onClick={() => setActiveTab("bookings")} 
          style={{ cursor: "pointer", borderBottom: activeTab === "bookings" ? "3px solid #0070f3" : "none" }}
        >
          Bookings
        </h2>
      </div>

      {/* Customers Section */}
      {activeTab === "customers" && (
        <section style={{ background: "#fff", padding: "1rem", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
          <h3>Add Customer</h3>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 12 }}>
            <input placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
            <input placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
            <input placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
          </div>
          <button onClick={addCustomer}>Add Customer</button>

          <ul style={{ marginTop: 12 }}>
            {customers.map(c => (
              <li key={c._id}>{c.name} — {c.email} — {c.phone}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Bookings Section */}
      {activeTab === "bookings" && (
        <section style={{ background: "#fff", padding: "1rem", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
          <h3>Create Booking</h3>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr auto" }}>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <button onClick={createBooking} disabled={!selectedCustomerId || !selectedPc}>
              Create Booking
            </button>
          </div>

          <h4 style={{ marginTop: "1rem" }}>Pick a PC</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 12 }}>
            {pcs.map(n => {
              const isOccupied = occupied.includes(n);
              const isSelected = selectedPc === n;
              return (
                <div
                  key={n}
                  onClick={() => !isOccupied && setSelectedPc(n)}
                  style={{
                    padding: "16px",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    textAlign: "center",
                    cursor: isOccupied ? "not-allowed" : "pointer",
                    background: isOccupied ? "#f8caca" : isSelected ? "#b6e3ff" : "#c8f7c5",
                  }}
                >
                  PC-{n}
                </div>
              );
            })}
          </div>

          <h4 style={{ marginTop: "2rem" }}>Recent Bookings</h4>
          <ul style={{ display: "grid", gap: 8 }}>
            {bookings.map(b => (
              <li key={b._id} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6, background: "#fafafa" }}>
                <strong>PC-{b.pcNumber}</strong> — {b.customer?.name ?? "Unknown"} — {new Date(b.startTime).toLocaleString()}
                {b.endTime ? ` (ended ${new Date(b.endTime).toLocaleString()})` : " (ongoing)"}
                {!b.endTime && (
                  <button 
                    style={{ marginLeft: 12, padding: "2px 6px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4 }}
                    onClick={() => endBooking(b._id)}
                  >
                    End
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
