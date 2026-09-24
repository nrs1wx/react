function Header({ name, title, image }) {
  return (
    <header className="header">
      <img className="avatar" src={image} alt={"Photo of " + name} />
      <h1>{name}</h1>
      <p>{title}</p>
    </header>
  );
}

export default Header;
