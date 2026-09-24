function Contact({ github, githubUrl, instagram, instagramUrl, address, addressUrl }) {
  return (
    <section className="card">
      <h2>Contact</h2>
      <ul>
        <li>GitHub: <a href={githubUrl} target="_blank" rel="noreferrer">{github}</a></li>
        <li>Instagram: <a href={instagramUrl} target="_blank" rel="noreferrer">{instagram}</a></li>
        <li>Address: <a href={addressUrl} target="_blank" rel="noreferrer">{address}</a></li>
      </ul>
    </section>
  );
}

export default Contact;