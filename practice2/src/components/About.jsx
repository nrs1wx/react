function About({ text, skills }) {
  return (
    <section className="card">
      <h2>About Me</h2>
      <p>{text}</p>

      <h3>Skills</h3>
      <ul className="skills">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default About;