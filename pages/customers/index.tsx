import { useEffect, useState } from "react";

type Customer = { _id: string; name: string; email?: string; phone?: string };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function load() {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    if (res.ok) {
      setName(""); setEmail(""); setPhone("");
      load();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to add customer");
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h1>Customers</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, margin: "1rem 0" }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
        <button>Add Customer</button>
      </form>

      <ul style={{ display: "grid", gap: 8 }}>
        {customers.map(c => (
          <li key={c._id} style={{ border: "1px solid #ddd", padding: 8 }}>
            <strong>{c.name}</strong>{c.email ? ` — ${c.email}` : ""}{c.phone ? ` (${c.phone})` : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}

