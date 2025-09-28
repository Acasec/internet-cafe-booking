export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h1>Internet Cafe Booking System</h1>
      <p>Welcome! Use the navigation below:</p>
      <ul>
        <li><a href="/customers">Manage Customers</a></li>
        <li><a href="/bookings">Manage Bookings</a></li>
      </ul>
    </main>
  );
}
