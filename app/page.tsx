export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '6rem' 
    }}>
      <div style={{ 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '80rem', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          International Shoppers Club
        </h1>
        <p style={{ fontSize: '1.25rem' }}>
          Price comparison shopping site
        </p>
      </div>
    </main>
  );
}
